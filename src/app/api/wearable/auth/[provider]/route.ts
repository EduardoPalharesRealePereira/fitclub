import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface ProviderConfig {
  authUrl: string;
  clientId: string | undefined;
  scope: string;
  extraParams?: Record<string, string>;
}

const PROVIDERS: Record<string, ProviderConfig> = {
  fitbit: {
    authUrl: "https://www.fitbit.com/oauth2/authorize",
    clientId: process.env.FITBIT_CLIENT_ID,
    scope: "activity heartrate sleep profile",
    extraParams: { expires_in: "604800" },
  },
  strava: {
    authUrl: "https://www.strava.com/oauth/authorize",
    clientId: process.env.STRAVA_CLIENT_ID,
    scope: "read,activity:read",
    extraParams: { approval_prompt: "auto" },
  },
  oura: {
    authUrl: "https://cloud.ouraring.com/oauth/authorize",
    clientId: process.env.OURA_CLIENT_ID,
    scope: "daily activity sleep heartrate",
  },
  whoop: {
    authUrl: "https://api.prod.whoop.com/oauth/oauth2/auth",
    clientId: process.env.WHOOP_CLIENT_ID,
    scope: "read:recovery read:sleep read:workout read:body_measurement",
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${BASE_URL}/login`);
  }

  const config = PROVIDERS[provider];
  if (!config) {
    return NextResponse.json({ error: "Provedor inválido" }, { status: 400 });
  }

  if (!config.clientId) {
    return NextResponse.redirect(
      `${BASE_URL}/dashboard?wearable_error=${provider}_not_configured`
    );
  }

  // Encode user ID in state to retrieve it on callback
  const state = Buffer.from(
    JSON.stringify({ userId: user.id, provider, ts: Date.now() })
  ).toString("base64url");

  const redirectUri = `${BASE_URL}/api/wearable/callback/${provider}`;

  const urlParams = new URLSearchParams({
    client_id: config.clientId,
    response_type: "code",
    scope: config.scope,
    redirect_uri: redirectUri,
    state,
    ...config.extraParams,
  });

  return NextResponse.redirect(`${config.authUrl}?${urlParams}`);
}
