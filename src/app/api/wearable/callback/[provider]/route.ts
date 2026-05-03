import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface TokenConfig {
  tokenUrl: string;
  clientId: string | undefined;
  clientSecret: string | undefined;
  authMethod: "basic" | "body";
}

const TOKEN_CONFIGS: Record<string, TokenConfig> = {
  fitbit: {
    tokenUrl: "https://api.fitbit.com/oauth2/token",
    clientId: process.env.FITBIT_CLIENT_ID,
    clientSecret: process.env.FITBIT_CLIENT_SECRET,
    authMethod: "basic", // Fitbit requires Basic auth for token exchange
  },
  strava: {
    tokenUrl: "https://www.strava.com/oauth/token",
    clientId: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    authMethod: "body",
  },
  oura: {
    tokenUrl: "https://api.ouraring.com/oauth/token",
    clientId: process.env.OURA_CLIENT_ID,
    clientSecret: process.env.OURA_CLIENT_SECRET,
    authMethod: "body",
  },
  whoop: {
    tokenUrl: "https://api.prod.whoop.com/oauth/oauth2/token",
    clientId: process.env.WHOOP_CLIENT_ID,
    clientSecret: process.env.WHOOP_CLIENT_SECRET,
    authMethod: "body",
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(req.url);

  const code  = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${BASE_URL}/dashboard?wearable_error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${BASE_URL}/dashboard?wearable_error=missing_params`);
  }

  // Decode state to get userId
  let userId: string;
  try {
    const decoded = JSON.parse(Buffer.from(state, "base64url").toString());
    userId = decoded.userId;
    if (!userId) throw new Error("no userId");
  } catch {
    return NextResponse.redirect(`${BASE_URL}/dashboard?wearable_error=invalid_state`);
  }

  const config = TOKEN_CONFIGS[provider];
  if (!config?.clientId || !config?.clientSecret) {
    return NextResponse.redirect(`${BASE_URL}/dashboard?wearable_error=${provider}_not_configured`);
  }

  const redirectUri = `${BASE_URL}/api/wearable/callback/${provider}`;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const body: Record<string, string> = {
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    };

    if (config.authMethod === "basic") {
      headers["Authorization"] =
        "Basic " + Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
    } else {
      body.client_id = config.clientId;
      body.client_secret = config.clientSecret;
    }

    const tokenRes = await fetch(config.tokenUrl, {
      method: "POST",
      headers,
      body: new URLSearchParams(body),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error(`[wearable/${provider}] token exchange failed:`, tokenData);
      return NextResponse.redirect(
        `${BASE_URL}/dashboard?wearable_error=${encodeURIComponent(tokenData.error_description || "token_failed")}`
      );
    }

    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      : null;

    // Use service role via server client (user is identified by userId from state)
    const supabase = await createClient();

    await supabase.from("wearable_connections").upsert(
      {
        user_id:       userId,
        provider,
        access_token:  tokenData.access_token,
        refresh_token: tokenData.refresh_token ?? null,
        expires_at:    expiresAt,
        token_type:    tokenData.token_type ?? "Bearer",
        connected_at:  new Date().toISOString(),
      },
      { onConflict: "user_id,provider" }
    );

    return NextResponse.redirect(
      `${BASE_URL}/dashboard?wearable_connected=${provider}`
    );
  } catch (e) {
    console.error(`[wearable/${provider}] callback error:`, e);
    return NextResponse.redirect(`${BASE_URL}/dashboard?wearable_error=server_error`);
  }
}
