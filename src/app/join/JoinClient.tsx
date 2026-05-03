"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Competition {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  photo_url: string | null;
  invite_code: string;
}

function fmt(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function durationDays(start: string, end: string) {
  return Math.ceil(
    (new Date(end + "T00:00:00").getTime() - new Date(start + "T00:00:00").getTime()) / 86400000
  );
}

export default function JoinClient({
  competition,
  memberCount,
  userId,
  userEmail,
  alreadyMember,
}: {
  competition: Competition;
  memberCount: number;
  userId: string | null;
  userEmail: string | null;
  alreadyMember: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [joining, setJoining] = useState(false);
  const [joined,  setJoined]  = useState(alreadyMember);
  const [error,   setError]   = useState("");

  // Auth state for unauthenticated users
  const [authMode,   setAuthMode]   = useState<"login"|"signup">("login");
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [authBusy,   setAuthBusy]   = useState(false);
  const [authError,  setAuthError]  = useState("");

  const duration = durationDays(competition.start_date, competition.end_date);
  const isActive = new Date() <= new Date(competition.end_date + "T23:59:59");

  async function handleJoin() {
    if (!userId) return;
    setJoining(true); setError("");
    const displayName = userEmail?.split("@")[0] || "Participante";
    const { error: err } = await supabase.from("competition_members").insert({
      competition_id: competition.id,
      user_id: userId,
      display_name: displayName,
    });
    if (err && err.code !== "23505") {
      setError("Erro ao entrar. Tente novamente.");
      setJoining(false);
      return;
    }
    setJoined(true);
    setJoining(false);
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthBusy(true); setAuthError("");
    if (authMode === "login") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setAuthError(err.message); setAuthBusy(false); return; }
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) { setAuthError(err.message); setAuthBusy(false); return; }
    }
    // After auth, reload so server component picks up the session
    router.refresh();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", borderRadius: 12,
    background: "#0d1520", border: "1px solid #1a2332", color: "#f0f4f8",
    fontSize: "0.9375rem", outline: "none", boxSizing: "border-box",
  };

  return (
    <main style={{
      minHeight: "100vh", background: "#060810",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "2rem", justifyContent: "center" }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg,#00e5a0,#00b4d8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#080b10", fontWeight: 900, fontSize: "1.125rem",
          }}>F</div>
          <span style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>FitClub</span>
        </div>

        {/* Competition card */}
        <div style={{
          background: "#0d1520", border: "1px solid #1a2332", borderRadius: 24,
          overflow: "hidden", marginBottom: "1.25rem",
        }}>
          {competition.photo_url && (
            <img
              src={competition.photo_url}
              alt="competition"
              style={{ width: "100%", height: 160, objectFit: "cover" }}
            />
          )}
          <div style={{ padding: "1.25rem" }}>
            <p style={{ fontSize: "0.625rem", fontWeight: 700, color: "#00e5a0", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.375rem" }}>
              {isActive ? "Competição ativa 🟢" : "Competição encerrada"}
            </p>
            <h1 style={{ fontSize: "1.375rem", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: competition.description ? "0.375rem" : "1rem" }}>
              {competition.name}
            </h1>
            {competition.description && (
              <p style={{ fontSize: "0.875rem", color: "#8b9bb4", marginBottom: "1rem", lineHeight: 1.6 }}>{competition.description}</p>
            )}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
                { v: memberCount, l: "participantes" },
                { v: `${fmt(competition.start_date)} → ${fmt(competition.end_date)}`, l: "período" },
                { v: `${duration} dias`, l: "duração" },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, background: "#141e2e", borderRadius: 12, padding: "0.625rem 0.5rem", textAlign: "center" }}>
                  <div style={{ fontWeight: 800, fontSize: i === 1 ? "0.6rem" : "1rem", color: "#00e5a0" }}>{s.v}</div>
                  <div style={{ fontSize: "0.5rem", color: "#8b9bb4", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: "0.2rem" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Logged in ── */}
        {userId && (
          <div>
            {joined ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🎉</div>
                <p style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.375rem" }}>
                  {alreadyMember ? "Você já está nessa competição!" : "Você entrou!"}
                </p>
                <p style={{ fontSize: "0.875rem", color: "#8b9bb4", marginBottom: "1.5rem" }}>
                  {alreadyMember ? "Abra o app para ver o ranking." : "Boa sorte! Agora vá treinar 💪"}
                </p>
                <button onClick={() => router.push("/dashboard")} className="btn-primary" style={{ width: "100%" }}>
                  Ir para o app →
                </button>
              </div>
            ) : (
              <div>
                <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#8b9bb4", marginBottom: "1rem" }}>
                  Logado como <strong style={{ color: "#f0f4f8" }}>{userEmail}</strong>
                </p>
                {error && (
                  <div style={{ color: "#ff6b6b", background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.25)", borderRadius: 10, padding: "0.625rem 1rem", fontSize: "0.875rem", marginBottom: "1rem" }}>
                    ⚠️ {error}
                  </div>
                )}
                <button onClick={handleJoin} disabled={joining} className="btn-primary" style={{ width: "100%", opacity: joining ? 0.7 : 1 }}>
                  {joining ? "Entrando..." : "🏆 Entrar na competição"}
                </button>
                <button onClick={() => router.push("/dashboard")} style={{
                  width: "100%", marginTop: "0.75rem", padding: "0.75rem",
                  background: "none", border: "none", color: "#8b9bb4",
                  fontSize: "0.875rem", cursor: "pointer",
                }}>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Not logged in ── */}
        {!userId && (
          <div style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 20, padding: "1.5rem" }}>
            <p style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "0.375rem", textAlign: "center" }}>
              Faça {authMode === "login" ? "login" : "cadastro"} para participar
            </p>
            <p style={{ fontSize: "0.8125rem", color: "#8b9bb4", marginBottom: "1.25rem", textAlign: "center" }}>
              Sua conta FitClub será usada para rastrear seus treinos na competição.
            </p>

            {/* Auth tabs */}
            <div style={{ display: "flex", background: "#0a0f1a", borderRadius: 12, padding: "0.25rem", marginBottom: "1.25rem" }}>
              {(["login","signup"] as const).map(m => (
                <button key={m} onClick={() => { setAuthMode(m); setAuthError(""); }} style={{
                  flex: 1, padding: "0.5rem", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", transition: "all 0.2s",
                  background: authMode === m ? "#1a2332" : "transparent",
                  color: authMode === m ? "#f0f4f8" : "#4a5568",
                }}>{m === "login" ? "Entrar" : "Criar conta"}</button>
              ))}
            </div>

            <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <input type="email" style={inputStyle} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" style={inputStyle} placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
              {authError && (
                <div style={{ color: "#ff6b6b", fontSize: "0.8125rem" }}>⚠️ {authError}</div>
              )}
              <button type="submit" disabled={authBusy} className="btn-primary" style={{ width: "100%", opacity: authBusy ? 0.7 : 1 }}>
                {authBusy ? "Aguarde..." : authMode === "login" ? "Entrar e participar →" : "Criar conta e participar →"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
