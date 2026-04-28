"use client";

import { useState } from "react";
import ProfileSetup from "./ProfileSetup";
import ChatSection from "./ChatSection";
import WorkoutSection from "./WorkoutSection";
import DietSection from "./DietSection";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Tab = "home" | "chat" | "workout" | "diet";

interface Props {
  user: { id: string; email: string };
  initialProfile: Record<string, unknown> | null;
}

const tabs = [
  { id: "home", label: "Início", icon: "🏠" },
  { id: "chat", label: "Chat IA", icon: "💬" },
  { id: "workout", label: "Treino", icon: "💪" },
  { id: "diet", label: "Dieta", icon: "🥗" },
] as const;

export default function DashboardShell({ user, initialProfile }: Props) {
  const [tab, setTab] = useState<Tab>("home");
  const [profile, setProfile] = useState<Record<string, unknown> | null>(initialProfile);
  const router = useRouter();
  const supabase = createClient();

  const fitnessProfile = profile?.fitness_profile as Record<string, string> | null;
  const workoutPlan = profile?.workout_plan as Record<string, unknown> | null;
  const dietPlan = profile?.diet_plan as Record<string, unknown> | null;
  const userName = (fitnessProfile?.name as string) || (profile?.full_name as string) || user.email.split("@")[0];

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  function handleProfileSaved(updated: Record<string, unknown>) {
    setProfile((prev) => ({ ...prev, ...updated }));
  }

  function handlePlanUpdated(type: "workout" | "diet", data: Record<string, unknown>) {
    setProfile((prev) => ({ ...prev, [`${type}_plan`]: data }));
  }

  const needsProfile = !fitnessProfile;

  return (
    <div style={{ minHeight: "100vh", background: "#080b10", color: "#f0f4f8", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 1.5rem",
        background: "rgba(8,11,16,0.95)",
        borderBottom: "1px solid #1a2332",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg,#00e5a0,#00b4d8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#080b10", fontWeight: 900, fontSize: "1rem",
          }}>F</div>
          <span style={{ fontWeight: 800, fontSize: "1.0625rem" }}>FitClub</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>
            Olá, <strong style={{ color: "#f0f4f8" }}>{userName}</strong>
          </span>
          <button
            onClick={handleSignOut}
            style={{
              background: "transparent", border: "1px solid #1a2332",
              color: "#8b9bb4", borderRadius: 8, padding: "0.375rem 0.875rem",
              fontSize: "0.8125rem", cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "#00e5a0"; e.currentTarget.style.color = "#00e5a0"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "#1a2332"; e.currentTarget.style.color = "#8b9bb4"; }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Tab nav — desktop top, mobile bottom */}
      <nav style={{
        display: "flex", gap: "0.25rem",
        padding: "0.75rem 1.5rem",
        background: "#0d1117",
        borderBottom: "1px solid #1a2332",
        overflowX: "auto",
      }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 1.125rem",
              borderRadius: 10, cursor: "pointer",
              fontSize: "0.875rem", fontWeight: 600,
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              ...(tab === t.id
                ? { background: "rgba(0,229,160,0.12)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.3)" }
                : { background: "transparent", color: "#8b9bb4", border: "none" }),
            }}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, padding: "1.5rem", maxWidth: 900, width: "100%", margin: "0 auto" }}>

        {/* Profile setup banner */}
        {needsProfile && tab !== "home" && (
          <div style={{
            marginBottom: "1.5rem", padding: "1rem 1.25rem",
            background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.25)",
            borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "0.75rem",
          }}>
            <span style={{ fontSize: "0.875rem", color: "#f0f4f8" }}>
              ⚠️ Preencha seu perfil para a IA gerar planos personalizados.
            </span>
            <button
              onClick={() => setTab("home")}
              style={{
                background: "linear-gradient(135deg,#00e5a0,#00c98a)",
                color: "#080b10", border: "none", borderRadius: 8,
                padding: "0.5rem 1rem", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer",
              }}
            >
              Completar perfil →
            </button>
          </div>
        )}

        {/* HOME */}
        {tab === "home" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 900, marginBottom: "0.375rem" }}>
                Bem-vindo, <span style={{ background: "linear-gradient(135deg,#00e5a0,#00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{userName} 👋</span>
              </h1>
              <p style={{ color: "#8b9bb4", fontSize: "0.9375rem" }}>
                {needsProfile ? "Vamos começar preenchendo seus dados para personalizar sua experiência." : "Seu painel está pronto. O que vamos fazer hoje?"}
              </p>
            </div>

            {/* Profile Setup */}
            <ProfileSetup
              userId={user.id}
              fitnessProfile={fitnessProfile}
              onSaved={handleProfileSaved}
            />

            {/* Quick access cards (only if profile set) */}
            {!needsProfile && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
                {[
                  { tab: "chat", icon: "💬", title: "Chat com IA", desc: "Tire dúvidas sobre treino e dieta" },
                  { tab: "workout", icon: "💪", title: "Ver Treino", desc: workoutPlan ? "Sua ficha está pronta" : "Gerar ficha personalizada" },
                  { tab: "diet", icon: "🥗", title: "Ver Dieta", desc: dietPlan ? "Seu plano está pronto" : "Gerar plano alimentar" },
                ].map((card) => (
                  <button
                    key={card.tab}
                    onClick={() => setTab(card.tab as Tab)}
                    style={{
                      background: "#0d1520", border: "1px solid #1a2332",
                      borderRadius: 14, padding: "1.25rem",
                      textAlign: "left", cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(0,229,160,0.35)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "#1a2332"; e.currentTarget.style.transform = "none"; }}
                  >
                    <div style={{ fontSize: "1.75rem", marginBottom: "0.625rem" }}>{card.icon}</div>
                    <div style={{ fontWeight: 700, marginBottom: "0.25rem", color: "#f0f4f8" }}>{card.title}</div>
                    <div style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>{card.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHAT */}
        {tab === "chat" && (
          <ChatSection fitnessProfile={fitnessProfile} />
        )}

        {/* WORKOUT */}
        {tab === "workout" && (
          <WorkoutSection
            fitnessProfile={fitnessProfile}
            workoutPlan={workoutPlan}
            onPlanGenerated={(data) => handlePlanUpdated("workout", data)}
          />
        )}

        {/* DIET */}
        {tab === "diet" && (
          <DietSection
            fitnessProfile={fitnessProfile}
            dietPlan={dietPlan}
            onPlanGenerated={(data) => handlePlanUpdated("diet", data)}
          />
        )}
      </main>
    </div>
  );
}
