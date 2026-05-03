"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface DailyStats {
  steps: number;
  calories_active: number;
  sleep_minutes: number;
  active_minutes: number;
  heart_rate_avg: number | null;
  source: string;
}

interface Connection { provider: string; connected_at: string; }

type ProviderKind = "oauth2" | "native_ios" | "native_android" | "approval_needed";

interface Device {
  id: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
  kind: ProviderKind;
  setupUrl?: string;
}

const DEVICES: Device[] = [
  {
    id: "fitbit", name: "Fitbit", icon: "💚", color: "#00e5a0",
    desc: "Charge, Sense, Versa, Inspire...",
    kind: "oauth2", setupUrl: "https://dev.fitbit.com/apps/new",
  },
  {
    id: "strava", name: "Strava", icon: "🏃", color: "#FC4C02",
    desc: "Corrida, ciclismo, natação e mais",
    kind: "oauth2", setupUrl: "https://www.strava.com/settings/api",
  },
  {
    id: "oura", name: "Oura Ring", icon: "💍", color: "#f39c12",
    desc: "Ring 3, Ring 4 — sono e recuperação",
    kind: "oauth2", setupUrl: "https://cloud.ouraring.com/oauth/applications",
  },
  {
    id: "whoop", name: "Whoop", icon: "💪", color: "#ff6b6b",
    desc: "Whoop 4.0, Whoop MG — strain e recovery",
    kind: "oauth2", setupUrl: "https://developer.whoop.com",
  },
  {
    id: "garmin", name: "Garmin", icon: "⌚", color: "#00b4d8",
    desc: "Forerunner, Fenix, Venu — requer aprovação de API",
    kind: "approval_needed", setupUrl: "https://developer.garmin.com/health-api/request-access/",
  },
  {
    id: "apple", name: "Apple Watch", icon: "🍎", color: "#a0a0a0",
    desc: "HealthKit só funciona em app nativo iOS/Swift",
    kind: "native_ios",
  },
  {
    id: "samsung", name: "Samsung Health", icon: "🌀", color: "#1428A0",
    desc: "Galaxy Watch — requer app Android nativo",
    kind: "native_android",
  },
];

function fmtSleep(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h${m > 0 ? m + "m" : ""}`;
}

export default function WearableSection({ userId }: { userId: string }) {
  const supabase = createClient();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [stats,       setStats]       = useState<DailyStats | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [syncing,     setSyncing]     = useState<string | null>(null);
  const [toast,       setToast]       = useState<string | null>(null);
  const [toastOk,     setToastOk]     = useState(true);

  useEffect(() => {
    // Handle OAuth redirect back from provider
    const params    = new URLSearchParams(window.location.search);
    const connected = params.get("wearable_connected");
    const error     = params.get("wearable_error");

    if (connected) {
      showToast(`✅ ${connected.charAt(0).toUpperCase() + connected.slice(1)} conectado!`, true);
      window.history.replaceState({}, "", "/dashboard");
      setTimeout(() => syncProvider(connected), 800);
    } else if (error) {
      const msg = error.includes("not_configured")
        ? `Configure ${error.replace("_not_configured", "").toUpperCase()} no .env.local`
        : error.replace(/_/g, " ");
      showToast(`❌ ${msg}`, false);
      window.history.replaceState({}, "", "/dashboard");
    }

    loadData();
  }, []);

  function showToast(msg: string, ok = true) {
    setToast(msg);
    setToastOk(ok);
    setTimeout(() => setToast(null), 4500);
  }

  async function loadData() {
    const today = new Date().toISOString().split("T")[0];
    const [{ data: conns }, { data: todayStats }] = await Promise.all([
      supabase.from("wearable_connections").select("provider, connected_at").eq("user_id", userId),
      supabase.from("wearable_daily_stats").select("*").eq("user_id", userId).eq("date", today).maybeSingle(),
    ]);
    setConnections(conns || []);
    setStats(todayStats as DailyStats | null);
    setLoading(false);
  }

  function connectDevice(provider: string) {
    // Full-page redirect → OAuth provider → callback → /dashboard?wearable_connected=X
    window.location.href = `/api/wearable/auth/${provider}`;
  }

  async function syncProvider(provider: string) {
    setSyncing(provider);
    try {
      const res  = await fetch("/api/wearable/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats as DailyStats);
        showToast("✅ Dados atualizados!", true);
      } else if (data.error) {
        showToast(`⚠️ ${data.error}`, false);
      }
    } catch {
      showToast("Erro ao sincronizar. Tente novamente.", false);
    }
    setSyncing(null);
  }

  async function disconnectDevice(provider: string) {
    await fetch("/api/wearable/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider }),
    });
    setConnections(c => c.filter(x => x.provider !== provider));
    showToast(`${provider} desconectado.`, true);
  }

  const connectedMap  = new Map(connections.map(c => [c.provider, c]));
  const firstConn     = connections[0];

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: 28, height: 28, border: "3px solid #1a2332", borderTopColor: "#00e5a0", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ position: "relative" }}>

      {/* ── Toast ────────────────────────────────────────────────────────────── */}
      {toast && (
        <div style={{
          position: "fixed", top: 72, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
          background: "#141e2e",
          border: `1px solid ${toastOk ? "#00e5a0" : "#ff6b6b"}`,
          borderRadius: 99, padding: "0.5rem 1.25rem",
          fontSize: "0.8125rem", fontWeight: 600,
          color: toastOk ? "#00e5a0" : "#ff6b6b",
          animation: "slideUp 0.3s ease",
          whiteSpace: "nowrap", maxWidth: "88vw", overflow: "hidden", textOverflow: "ellipsis",
        }}>{toast}</div>
      )}

      {/* ── Today's stats ────────────────────────────────────────────────────── */}
      {stats && (
        <div style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 20, padding: "1.125rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#8b9bb4", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Hoje · {stats.source}
            </p>
            <button
              onClick={() => firstConn && syncProvider(firstConn.provider)}
              disabled={!!syncing}
              style={{ background: "none", border: "none", color: "#4a5568", fontSize: "0.75rem", cursor: "pointer" }}
            >
              {syncing ? "⏳" : "↻ sync"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
            {[
              { icon: "👟", v: stats.steps.toLocaleString("pt-BR"), l: "passos",          color: "#00e5a0" },
              { icon: "🔥", v: `${stats.calories_active} kcal`,     l: "calorias ativas", color: "#f39c12" },
              { icon: "😴", v: stats.sleep_minutes > 0 ? fmtSleep(stats.sleep_minutes) : "—", l: "sono", color: "#8e44ad" },
              { icon: "⚡", v: `${stats.active_minutes} min`,        l: "tempo ativo",     color: "#00b4d8" },
            ].map(s => (
              <div key={s.l} style={{ background: "#141e2e", borderRadius: 14, padding: "0.875rem" }}>
                <div style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{s.icon}</div>
                <div style={{ fontWeight: 900, fontSize: "1.125rem", color: s.color, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: "0.625rem", color: "#8b9bb4", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.25rem" }}>{s.l}</div>
              </div>
            ))}
          </div>

          {stats.heart_rate_avg && (
            <div style={{ marginTop: "0.625rem", background: "#141e2e", borderRadius: 12, padding: "0.625rem 0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1rem" }}>❤️</span>
              <span style={{ fontWeight: 700, color: "#ff6b6b" }}>{stats.heart_rate_avg} bpm</span>
              <span style={{ fontSize: "0.75rem", color: "#8b9bb4" }}>frequência cardíaca média</span>
            </div>
          )}
        </div>
      )}

      {/* Pending sync notice */}
      {!stats && connections.length > 0 && (
        <div style={{
          background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.15)",
          borderRadius: 14, padding: "0.875rem 1rem", marginBottom: "1rem",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem",
        }}>
          <span style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>⏳ Aguardando dados do {connections[0].provider}...</span>
          <button
            onClick={() => syncProvider(connections[0].provider)}
            disabled={!!syncing}
            style={{ background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.3)", color: "#00e5a0", borderRadius: 8, padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", flexShrink: 0 }}
          >{syncing ? "..." : "Sincronizar"}</button>
        </div>
      )}

      {/* ── Device list ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {DEVICES.map(device => {
          const conn      = connectedMap.get(device.id);
          const connected = !!conn;
          const isNative  = device.kind === "native_ios" || device.kind === "native_android";
          const needsOk   = device.kind === "approval_needed";

          return (
            <div key={device.id} style={{
              display: "flex", alignItems: "center", gap: "0.875rem",
              padding: "0.875rem 1rem", borderRadius: 16,
              background: connected ? "rgba(0,229,160,0.05)" : "#0d1520",
              border: `1px solid ${connected ? "rgba(0,229,160,0.2)" : "#1a2332"}`,
              opacity: isNative ? 0.45 : 1,
            }}>
              <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{device.icon}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.125rem", display: "flex", alignItems: "center", gap: "0.375rem", flexWrap: "wrap" }}>
                  {device.name}
                  {connected && (
                    <span style={{ fontSize: "0.5rem", color: "#00e5a0", background: "rgba(0,229,160,0.12)", padding: "0.1rem 0.4rem", borderRadius: 4, fontWeight: 800 }}>● CONECTADO</span>
                  )}
                  {needsOk && !connected && (
                    <span style={{ fontSize: "0.5rem", color: "#f39c12", background: "rgba(243,156,18,0.12)", padding: "0.1rem 0.4rem", borderRadius: 4, fontWeight: 700 }}>APROVAÇÃO</span>
                  )}
                  {isNative && (
                    <span style={{ fontSize: "0.5rem", color: "#4a5568", background: "rgba(74,85,104,0.15)", padding: "0.1rem 0.4rem", borderRadius: 4, fontWeight: 700 }}>
                      {device.kind === "native_ios" ? "iOS" : "ANDROID"}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#8b9bb4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {device.desc}
                </div>
              </div>

              {/* Action */}
              {connected ? (
                <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
                  <button
                    onClick={() => syncProvider(device.id)}
                    disabled={syncing === device.id}
                    title="Sincronizar"
                    style={{
                      padding: "0.375rem 0.625rem", borderRadius: 10,
                      background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)",
                      color: "#00e5a0", fontSize: "0.875rem", cursor: "pointer",
                      opacity: syncing === device.id ? 0.5 : 1,
                    }}
                  >{syncing === device.id ? "⏳" : "↻"}</button>
                  <button
                    onClick={() => disconnectDevice(device.id)}
                    style={{
                      padding: "0.375rem 0.75rem", borderRadius: 10,
                      background: "transparent", border: "1px solid #1a2332",
                      color: "#4a5568", fontSize: "0.75rem", cursor: "pointer",
                    }}
                  >Sair</button>
                </div>
              ) : isNative ? (
                <span style={{ fontSize: "0.6875rem", color: "#2d3748", flexShrink: 0 }}>
                  {device.kind === "native_ios" ? "iOS" : "Android"}
                </span>
              ) : needsOk ? (
                <a
                  href={device.setupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flexShrink: 0, padding: "0.375rem 0.75rem", borderRadius: 10,
                    background: "rgba(243,156,18,0.08)", border: "1px solid rgba(243,156,18,0.3)",
                    color: "#f39c12", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer",
                    textDecoration: "none",
                  }}
                >Solicitar →</a>
              ) : (
                <button
                  onClick={() => connectDevice(device.id)}
                  style={{
                    flexShrink: 0, padding: "0.375rem 0.875rem", borderRadius: 10,
                    background: `${device.color}14`, border: `1px solid ${device.color}40`,
                    color: device.color, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
                  }}
                >Conectar</button>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Setup guide ──────────────────────────────────────────────────────── */}
      <div style={{ marginTop: "1rem", padding: "0.875rem 1rem", background: "#0d1520", border: "1px solid #1a2332", borderRadius: 14 }}>
        <p style={{ fontSize: "0.6875rem", color: "#4a5568", lineHeight: 1.9, margin: 0 }}>
          🔑 Registre seu app em cada plataforma e adicione as credenciais no <code style={{ background: "#141e2e", padding: "0.1rem 0.3rem", borderRadius: 4, color: "#8b9bb4" }}>.env.local</code>.
          {" "}Redirect URI padrão:{" "}
          <code style={{ background: "#141e2e", padding: "0.1rem 0.3rem", borderRadius: 4, color: "#8b9bb4", wordBreak: "break-all" }}>
            http://localhost:3000/api/wearable/callback/[provider]
          </code>
          <br />
          🍎 <strong style={{ color: "#555" }}>Apple Watch</strong> e <strong style={{ color: "#555" }}>Samsung Health</strong> não têm API web — requerem app nativo (Swift / Android SDK).
        </p>
      </div>
    </div>
  );
}
