"use client";

import { useState } from "react";
import ProfileSetup from "./ProfileSetup";
import ChatSection from "./ChatSection";
import WorkoutSection from "./WorkoutSection";
import DietSection from "./DietSection";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Tab = "home" | "chat" | "workout" | "diet" | "profile";

interface Props {
  user: { id: string; email: string };
  initialProfile: Record<string, unknown> | null;
}

/* ── SVG Icons ─────────────────────────────────────────── */
function IconHome({ active }: { active: boolean }) {
  const c = active ? "#00e5a0" : "#4a5568";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "rgba(0,229,160,0.2)" : "none"} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconChat({ active }: { active: boolean }) {
  const c = active ? "#00e5a0" : "#4a5568";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "rgba(0,229,160,0.2)" : "none"} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}
function IconDumbbell({ active }: { active: boolean }) {
  const c = active ? "#00e5a0" : "#4a5568";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6.5 17.5h11M3 12h18" />
      <rect x="1" y="9" width="4" height="6" rx="1" />
      <rect x="19" y="9" width="4" height="6" rx="1" />
    </svg>
  );
}
function IconLeaf({ active }: { active: boolean }) {
  const c = active ? "#00e5a0" : "#4a5568";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22C2 22 7 17 12 12C17 7 22 2 22 2C22 2 17 7 12 12C7 17 2 22 2 22Z" />
      <path d="M12 12C12 12 8 8 6 6" />
      <path d="M22 2L16 8" />
    </svg>
  );
}
function IconUser({ active }: { active: boolean }) {
  const c = active ? "#00e5a0" : "#4a5568";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/* ── Circular Progress Ring ─────────────────────────────── */
function Ring({ value, max, color, size = 56, stroke = 5 }: { value: number; max: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.7s ease" }} />
    </svg>
  );
}

/* ── Greeting ───────────────────────────────────────────── */
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const NAV_ITEMS: { id: Tab; label: string; Icon: React.FC<{ active: boolean }> }[] = [
  { id: "home", label: "Início", Icon: IconHome },
  { id: "chat", label: "Chat", Icon: IconChat },
  { id: "workout", label: "Treino", Icon: IconDumbbell },
  { id: "diet", label: "Dieta", Icon: IconLeaf },
  { id: "profile", label: "Perfil", Icon: IconUser },
];

/* ── Shell ──────────────────────────────────────────────── */
export default function DashboardShell({ user, initialProfile }: Props) {
  const [tab, setTab] = useState<Tab>("home");
  const [profile, setProfile] = useState<Record<string, unknown> | null>(initialProfile);
  const router = useRouter();
  const supabase = createClient();

  const fp = profile?.fitness_profile as Record<string, string> | null;
  const wp = profile?.workout_plan as Record<string, unknown> | null;
  const dp = profile?.diet_plan as Record<string, unknown> | null;
  const userName = fp?.name || user.email.split("@")[0];

  function handleProfileSaved(u: Record<string, unknown>) {
    setProfile((p) => ({ ...p, ...u }));
    setTab("home");
  }
  function handlePlanUpdated(type: "workout" | "diet", data: Record<string, unknown>) {
    setProfile((p) => ({ ...p, [`${type}_plan`]: data }));
  }
  async function signOut() { await supabase.auth.signOut(); router.push("/"); }

  // Show onboarding if no profile yet
  if (!fp) {
    return (
      <div style={{ minHeight: "100vh", background: "#060810" }}>
      <div style={{
        minHeight: "100vh", background: "#080b10", color: "#f0f4f8",
        display: "flex", flexDirection: "column",
        maxWidth: 480, margin: "0 auto",
        boxShadow: "0 0 80px rgba(0,0,0,0.8)",
      }}>
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.875rem 1.25rem",
          borderBottom: "1px solid #0f1922",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg,#00e5a0,#00b4d8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#080b10", fontWeight: 900, fontSize: "0.875rem",
            }}>F</div>
            <span style={{ fontWeight: 800, fontSize: "1rem" }}>FitClub</span>
          </div>
          <button onClick={signOut} style={{ background: "none", border: "none", color: "#4a5568", fontSize: "0.8125rem", cursor: "pointer" }}>Sair</button>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div style={{ marginBottom: "1.75rem" }}>
            <p style={{ fontSize: "0.8125rem", color: "#8b9bb4", marginBottom: "0.25rem" }}>Bem-vindo ao FitClub 👋</p>
            <h1 style={{ fontSize: "1.625rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
              Configure seu perfil
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#8b9bb4", lineHeight: 1.6 }}>
              A IA precisa dessas informações para criar seu treino e dieta personalizados.
            </p>
          </div>
          <ProfileSetup userId={user.id} fitnessProfile={null} defaultName={profile?.full_name as string || ""} onSaved={handleProfileSaved} />
        </div>
      </div>
      </div>
    );
  }

  // typed aliases for home
  const diet = dp as Record<string, number> & { meals?: unknown[] } | null;
  const workout = wp as { days?: { day: string; focus: string; exercises?: unknown[] }[]; name?: string } | null;

  return (
    <div style={{ minHeight: "100vh", background: "#060810" }}>
    <div style={{
      minHeight: "100vh", background: "#080b10", color: "#f0f4f8",
      display: "flex", flexDirection: "column",
      maxWidth: 480, margin: "0 auto",
      boxShadow: "0 0 80px rgba(0,0,0,0.8)",
    }}>

      {/* ── TOP HEADER ── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.875rem 1.25rem",
        background: "rgba(8,11,16,0.96)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #0f1922",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg,#00e5a0,#00b4d8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#080b10", fontWeight: 900, fontSize: "0.875rem",
          }}>F</div>
          <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em" }}>FitClub</span>
        </div>
        <button onClick={signOut} style={{
          background: "none", border: "none", color: "#4a5568",
          fontSize: "0.8125rem", cursor: "pointer", padding: "0.25rem 0.5rem",
        }}>Sair</button>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, overflowY: "auto", paddingBottom: 72 }}>

        {/* HOME */}
        {tab === "home" && (
          <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Greeting */}
            <div>
              <p style={{ fontSize: "0.875rem", color: "#4a5568", marginBottom: "0.125rem" }}>{greeting()},</p>
              <h1 style={{ fontSize: "1.875rem", fontWeight: 900, letterSpacing: "-0.03em" }}>{userName} 👋</h1>
            </div>

            {!fp ? (
              /* No profile */
              <div style={{
                background: "linear-gradient(135deg, rgba(0,229,160,0.1), rgba(0,180,216,0.08))",
                border: "1px solid rgba(0,229,160,0.2)", borderRadius: 20, padding: "1.5rem", textAlign: "center",
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>👤</div>
                <p style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.375rem" }}>Configure seu perfil</p>
                <p style={{ fontSize: "0.875rem", color: "#8b9bb4", marginBottom: "1.25rem" }}>A IA precisa dos seus dados para personalizar treino e dieta</p>
                <button onClick={() => setTab("profile")} style={{
                  background: "linear-gradient(135deg,#00e5a0,#00c98a)", color: "#080b10",
                  border: "none", borderRadius: 12, padding: "0.75rem 1.5rem",
                  fontWeight: 700, cursor: "pointer", fontSize: "0.9375rem",
                }}>Completar perfil →</button>
              </div>
            ) : (
              <>
                {/* Goal card */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(0,229,160,0.12) 0%, rgba(0,180,216,0.08) 100%)",
                  border: "1px solid rgba(0,229,160,0.2)", borderRadius: 20, padding: "1.25rem",
                }}>
                  <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#00e5a0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Objetivo ativo</p>
                  <p style={{ fontSize: "1.125rem", fontWeight: 800, marginBottom: "0.75rem", textTransform: "capitalize" }}>
                    {fp.goal?.replace("hipertrofia","Hipertrofia").replace("forca","Força").replace("emagrecimento","Emagrecimento").replace("condicionamento","Condicionamento").replace("saude","Saúde geral")} · {fp.level?.replace("iniciante","Iniciante").replace("intermediario","Intermediário").replace("avancado","Avançado")}
                  </p>
                  <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                    {fp.weight && <span style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>⚖️ <strong style={{ color: "#f0f4f8" }}>{fp.weight}</strong> kg</span>}
                    {fp.height && <span style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>📏 <strong style={{ color: "#f0f4f8" }}>{fp.height}</strong> cm</span>}
                    {fp.age && <span style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>🎂 <strong style={{ color: "#f0f4f8" }}>{fp.age}</strong> anos</span>}
                  </div>
                </div>

                {/* Quick stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <button onClick={() => setTab("workout")} style={{
                    background: "#0d1520", border: "1px solid #1a2332", borderRadius: 18,
                    padding: "1.125rem", textAlign: "left", cursor: "pointer",
                  }}>
                    <div style={{ fontSize: "1.375rem", marginBottom: "0.625rem" }}>💪</div>
                    <p style={{ fontSize: "1.625rem", fontWeight: 900, color: "#00e5a0", lineHeight: 1 }}>
                      {workout?.days?.length ?? "—"}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#8b9bb4", marginTop: "0.25rem" }}>dias/semana</p>
                    {!workout && <p style={{ fontSize: "0.6875rem", color: "#00e5a0", marginTop: "0.5rem" }}>Gerar ficha →</p>}
                  </button>
                  <button onClick={() => setTab("diet")} style={{
                    background: "#0d1520", border: "1px solid #1a2332", borderRadius: 18,
                    padding: "1.125rem", textAlign: "left", cursor: "pointer",
                  }}>
                    <div style={{ fontSize: "1.375rem", marginBottom: "0.625rem" }}>🥗</div>
                    <p style={{ fontSize: "1.625rem", fontWeight: 900, color: "#00b4d8", lineHeight: 1 }}>
                      {diet?.calories ?? "—"}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#8b9bb4", marginTop: "0.25rem" }}>kcal/dia</p>
                    {!diet && <p style={{ fontSize: "0.6875rem", color: "#00b4d8", marginTop: "0.5rem" }}>Gerar dieta →</p>}
                  </button>
                </div>

                {/* Macros rings — only if diet exists */}
                {diet && (
                  <div style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 20, padding: "1.25rem" }}>
                    <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#8b9bb4", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.125rem" }}>Macros diários</p>
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                      {[
                        { label: "Proteína", value: diet.protein, max: 250, color: "#00e5a0" },
                        { label: "Carboidrato", value: diet.carbs, max: 400, color: "#00b4d8" },
                        { label: "Gordura", value: diet.fat, max: 120, color: "#f39c12" },
                      ].map((m) => (
                        <div key={m.label} style={{ textAlign: "center" }}>
                          <div style={{ position: "relative", width: 56, height: 56, margin: "0 auto 0.5rem" }}>
                            <Ring value={m.value} max={m.max} color={m.color} size={56} stroke={5} />
                            <div style={{
                              position: "absolute", inset: 0, display: "flex", alignItems: "center",
                              justifyContent: "center", fontSize: "0.625rem", fontWeight: 800, color: m.color,
                            }}>{m.value}g</div>
                          </div>
                          <p style={{ fontSize: "0.625rem", color: "#8b9bb4", lineHeight: 1.2 }}>{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Today's workout preview */}
                {workout?.days?.[0] && (
                  <div style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 20, padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
                      <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#8b9bb4", textTransform: "uppercase", letterSpacing: "0.1em" }}>Treino de hoje</p>
                      <button onClick={() => setTab("workout")} style={{
                        background: "none", border: "none", color: "#00e5a0",
                        fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", padding: 0,
                      }}>Ver tudo →</button>
                    </div>
                    <div style={{
                      background: "linear-gradient(135deg, rgba(0,229,160,0.1), rgba(0,180,216,0.06))",
                      border: "1px solid rgba(0,229,160,0.15)", borderRadius: 14, padding: "1rem",
                    }}>
                      <p style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "0.25rem" }}>{workout.days[0].day}</p>
                      <p style={{ fontSize: "0.8125rem", color: "#8b9bb4", marginBottom: "0.625rem" }}>Foco: {workout.days[0].focus}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{
                          fontSize: "0.6875rem", fontWeight: 700, color: "#00e5a0",
                          background: "rgba(0,229,160,0.1)", padding: "0.25rem 0.625rem", borderRadius: 999,
                        }}>
                          {workout.days[0].exercises?.length ?? 0} exercícios
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Today's meals preview */}
                {diet?.meals && Array.isArray(diet.meals) && (diet.meals as Array<{name: string; time: string; calories: number}>).length > 0 && (
                  <div style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 20, padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
                      <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#8b9bb4", textTransform: "uppercase", letterSpacing: "0.1em" }}>Refeições de hoje</p>
                      <button onClick={() => setTab("diet")} style={{
                        background: "none", border: "none", color: "#00b4d8",
                        fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", padding: 0,
                      }}>Ver tudo →</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {(diet.meals as Array<{name: string; time: string; calories: number}>).slice(0, 3).map((meal, i) => (
                        <div key={i} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "0.625rem 0.875rem", background: "rgba(255,255,255,0.02)",
                          borderRadius: 10, border: "1px solid #1a2332",
                        }}>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{meal.name}</p>
                            <p style={{ fontSize: "0.75rem", color: "#8b9bb4" }}>{meal.time}</p>
                          </div>
                          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#00b4d8" }}>{meal.calories} kcal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* CHAT */}
        {tab === "chat" && (
          <div style={{ height: "calc(100vh - 120px)" }}>
            <ChatSection fitnessProfile={fp} />
          </div>
        )}

        {/* WORKOUT */}
        {tab === "workout" && (
          <div style={{ padding: "1.25rem" }}>
            <WorkoutSection
              fitnessProfile={fp}
              workoutPlan={wp}
              onPlanGenerated={(data) => handlePlanUpdated("workout", data)}
            />
          </div>
        )}

        {/* DIET */}
        {tab === "diet" && (
          <div style={{ padding: "1.25rem" }}>
            <DietSection
              fitnessProfile={fp}
              dietPlan={dp}
              onPlanGenerated={(data) => handlePlanUpdated("diet", data)}
            />
          </div>
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <div style={{ padding: "1.25rem" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "0.25rem" }}>Perfil</h2>
              <p style={{ fontSize: "0.875rem", color: "#8b9bb4" }}>{user.email}</p>
            </div>
            <ProfileSetup userId={user.id} fitnessProfile={fp} onSaved={handleProfileSaved} />
          </div>
        )}
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(8,11,16,0.97)", backdropFilter: "blur(24px)",
        borderTop: "1px solid #0f1922",
        display: "flex", zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom, 4px)",
      }}>
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "0.625rem 0.25rem 0.5rem", gap: "0.25rem",
                background: "none", border: "none", cursor: "pointer",
                transition: "opacity 0.15s",
              }}
            >
              <Icon active={active} />
              <span style={{
                fontSize: "0.5625rem", fontWeight: active ? 700 : 500,
                color: active ? "#00e5a0" : "#4a5568",
                letterSpacing: "0.02em", lineHeight: 1,
              }}>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
    </div>
  );
}
