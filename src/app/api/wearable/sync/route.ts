import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── Token Refresh ────────────────────────────────────────────────────────────

interface RefreshConfig {
  url: string;
  clientId: string | undefined;
  clientSecret: string | undefined;
  method: "basic" | "body";
}

const REFRESH_CONFIGS: Record<string, RefreshConfig> = {
  fitbit: {
    url: "https://api.fitbit.com/oauth2/token",
    clientId: process.env.FITBIT_CLIENT_ID,
    clientSecret: process.env.FITBIT_CLIENT_SECRET,
    method: "basic",
  },
  strava: {
    url: "https://www.strava.com/oauth/token",
    clientId: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    method: "body",
  },
  oura: {
    url: "https://api.ouraring.com/oauth/token",
    clientId: process.env.OURA_CLIENT_ID,
    clientSecret: process.env.OURA_CLIENT_SECRET,
    method: "body",
  },
  whoop: {
    url: "https://api.prod.whoop.com/oauth/oauth2/token",
    clientId: process.env.WHOOP_CLIENT_ID,
    clientSecret: process.env.WHOOP_CLIENT_SECRET,
    method: "body",
  },
};

async function doRefresh(provider: string, refreshToken: string): Promise<string | null> {
  const cfg = REFRESH_CONFIGS[provider];
  if (!cfg?.clientId || !cfg?.clientSecret) return null;

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const body: Record<string, string> = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };

  if (cfg.method === "basic") {
    headers["Authorization"] =
      "Basic " + Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString("base64");
  } else {
    body.client_id = cfg.clientId;
    body.client_secret = cfg.clientSecret;
  }

  const res = await fetch(cfg.url, {
    method: "POST",
    headers,
    body: new URLSearchParams(body),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

// ─── Provider Data Fetchers ───────────────────────────────────────────────────

async function fetchFitbit(token: string, date: string) {
  const [actRes, sleepRes, hrRes] = await Promise.all([
    fetch(`https://api.fitbit.com/1/user/-/activities/date/${date}.json`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`https://api.fitbit.com/1.2/user/-/sleep/date/${date}.json`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`https://api.fitbit.com/1/user/-/activities/heart/date/${date}/1d.json`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  const [act, sleep, hr] = await Promise.all([
    actRes.json(),
    sleepRes.json(),
    hrRes.json(),
  ]);

  const s   = act?.summary ?? {};
  const sl  = sleep?.summary ?? {};
  const hrV = hr?.["activities-heart"]?.[0]?.value;

  return {
    steps:           s.steps ?? 0,
    calories_active: s.activityCalories ?? 0,
    sleep_minutes:   sl.totalMinutesAsleep ?? 0,
    active_minutes:  (s.veryActiveMinutes ?? 0) + (s.fairlyActiveMinutes ?? 0),
    heart_rate_avg:  hrV?.restingHeartRate ?? null,
    source:          "Fitbit",
  };
}

async function fetchStrava(token: string) {
  const now      = Math.floor(Date.now() / 1000);
  const dayStart = now - (now % 86400); // midnight UTC

  const res = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?after=${dayStart}&per_page=20`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return null;

  const acts: Record<string, number>[] = await res.json();

  const calories    = acts.reduce((s, a) => s + (a.calories ?? 0), 0);
  const movingTime  = acts.reduce((s, a) => s + (a.moving_time ?? 0), 0);
  const withHr      = acts.filter(a => a.average_heartrate > 0);
  const avgHr       = withHr.length
    ? Math.round(withHr.reduce((s, a) => s + a.average_heartrate, 0) / withHr.length)
    : null;

  return {
    steps:           0,
    calories_active: calories,
    sleep_minutes:   0,
    active_minutes:  Math.round(movingTime / 60),
    heart_rate_avg:  avgHr,
    source:          `Strava (${acts.length} atividade${acts.length !== 1 ? "s" : ""} hoje)`,
  };
}

async function fetchOura(token: string, date: string) {
  const [actRes, sleepRes] = await Promise.all([
    fetch(
      `https://api.ouraring.com/v2/usercollection/daily_activity?start_date=${date}&end_date=${date}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ),
    fetch(
      `https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${date}&end_date=${date}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ),
  ]);

  const [act, sleep] = await Promise.all([actRes.json(), sleepRes.json()]);

  const a = act?.data?.[0]   ?? {};
  const sl = sleep?.data?.[0] ?? {};

  return {
    steps:           a.steps           ?? 0,
    calories_active: a.active_calories ?? 0,
    sleep_minutes:   sl.total_sleep_duration
      ? Math.round(sl.total_sleep_duration / 60)
      : 0,
    active_minutes: a.high_activity_time
      ? Math.round(a.high_activity_time / 60)
      : 0,
    heart_rate_avg:  sl.average_heart_rate ?? null,
    source:          "Oura Ring",
  };
}

async function fetchWhoop(token: string) {
  const today = new Date().toISOString().split("T")[0];
  const start = `${today}T00:00:00.000Z`;
  const end   = `${today}T23:59:59.000Z`;

  const [recRes, sleepRes, workRes] = await Promise.all([
    fetch(`https://api.prod.whoop.com/developer/v1/recovery?start=${start}&end=${end}`,
      { headers: { Authorization: `Bearer ${token}` } }),
    fetch(`https://api.prod.whoop.com/developer/v1/sleep?start=${start}&end=${end}`,
      { headers: { Authorization: `Bearer ${token}` } }),
    fetch(`https://api.prod.whoop.com/developer/v1/workout?start=${start}&end=${end}`,
      { headers: { Authorization: `Bearer ${token}` } }),
  ]);

  const [rec, sleep, work] = await Promise.all([
    recRes.json(), sleepRes.json(), workRes.json(),
  ]);

  const r  = rec?.records?.[0]?.score   ?? {};
  const sl = sleep?.records?.[0]?.score ?? {};
  const w  = work?.records?.[0]?.score  ?? {};

  return {
    steps:           0,
    calories_active: w.kilojoule ? Math.round(w.kilojoule / 4.184) : 0,
    sleep_minutes:   sl.stage_summary?.total_in_bed_time_milli
      ? Math.round(sl.stage_summary.total_in_bed_time_milli / 60000)
      : 0,
    active_minutes:  w.strain ? Math.round(w.strain * 10) : 0,
    heart_rate_avg:  r.resting_heart_rate ?? null,
    source:          "Whoop",
  };
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { provider } = await req.json();

  const { data: conn } = await supabase
    .from("wearable_connections")
    .select("*")
    .eq("user_id", user.id)
    .eq("provider", provider)
    .single();

  if (!conn) return NextResponse.json({ error: "Dispositivo não conectado" }, { status: 404 });

  let token = conn.access_token as string;

  // Refresh if expired (with 60s buffer)
  if (conn.expires_at && new Date(conn.expires_at).getTime() < Date.now() + 60_000) {
    if (conn.refresh_token) {
      const newToken = await doRefresh(provider, conn.refresh_token as string);
      if (newToken) {
        token = newToken;
        await supabase.from("wearable_connections").update({
          access_token: newToken,
          expires_at:   new Date(Date.now() + 3600 * 1000).toISOString(),
        }).eq("user_id", user.id).eq("provider", provider);
      } else {
        return NextResponse.json(
          { error: "Token expirado. Desconecte e reconecte o dispositivo." },
          { status: 401 }
        );
      }
    }
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    let stats: Record<string, unknown> | null = null;

    if      (provider === "fitbit") stats = await fetchFitbit(token, today);
    else if (provider === "strava") stats = await fetchStrava(token);
    else if (provider === "oura")   stats = await fetchOura(token, today);
    else if (provider === "whoop")  stats = await fetchWhoop(token);
    else return NextResponse.json({ error: "Provedor não suportado" }, { status: 400 });

    if (stats) {
      await supabase.from("wearable_daily_stats").upsert(
        { user_id: user.id, date: today, ...stats },
        { onConflict: "user_id,date" }
      );
    }

    return NextResponse.json({ success: true, stats });
  } catch (e) {
    console.error(`[wearable/sync/${provider}] error:`, e);
    return NextResponse.json({ error: "Erro ao sincronizar dados" }, { status: 500 });
  }
}
