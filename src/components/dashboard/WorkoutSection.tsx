"use client";

import { useState } from "react";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  tip?: string;
}
interface Day {
  day: string;
  focus: string;
  exercises: Exercise[];
}
interface WorkoutPlan {
  name: string;
  frequency: string;
  goal: string;
  days: Day[];
}

interface Props {
  fitnessProfile: Record<string, string> | null;
  workoutPlan: Record<string, unknown> | null;
  onPlanGenerated: (data: Record<string, unknown>) => void;
}

const muscleColors: Record<string, string> = {
  "peito": "#e74c3c", "peitoral": "#e74c3c",
  "costas": "#2980b9", "dorsal": "#2980b9",
  "ombro": "#8e44ad", "deltóide": "#8e44ad",
  "bíceps": "#27ae60", "tríceps": "#16a085",
  "perna": "#f39c12", "quadríceps": "#f39c12", "posterior": "#d35400",
  "glúteo": "#c0392b", "panturrilha": "#7f8c8d",
  "abdômen": "#00e5a0", "abdominal": "#00e5a0",
  "cardio": "#00b4d8",
};

function getDayColor(focus: string) {
  const lower = focus.toLowerCase();
  for (const [key, color] of Object.entries(muscleColors)) {
    if (lower.includes(key)) return color;
  }
  return "#00e5a0";
}

export default function WorkoutSection({ fitnessProfile, workoutPlan, onPlanGenerated }: Props) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [openDay, setOpenDay] = useState<number>(0);

  const plan = workoutPlan as unknown as WorkoutPlan | null;

  async function generatePlan() {
    if (!fitnessProfile) return;
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Gere minha ficha de treino completa." }],
          profile: fitnessProfile,
          mode: "workout",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const parsed = JSON.parse(data.text);
      onPlanGenerated(parsed);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao gerar treino.");
    }
    setGenerating(false);
  }

  if (!fitnessProfile) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
        <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>Complete seu perfil primeiro</h2>
        <p style={{ color: "#8b9bb4" }}>A IA precisa dos seus dados para criar uma ficha personalizada.</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>💪</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "0.75rem" }}>Sua ficha de treino</h2>
        <p style={{ color: "#8b9bb4", marginBottom: "2rem", maxWidth: 400, margin: "0 auto 2rem" }}>
          A IA vai criar uma ficha completa e personalizada com base no seu perfil: objetivo {fitnessProfile.goal}, nível {fitnessProfile.level}.
        </p>
        {error && (
          <div style={{ color: "#ff6b6b", background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}
        <button onClick={generatePlan} disabled={generating} className="btn-primary" style={{ opacity: generating ? 0.7 : 1 }}>
          {generating ? "Gerando sua ficha..." : "Gerar ficha com IA →"}
        </button>
        {generating && (
          <p style={{ color: "#8b9bb4", fontSize: "0.8125rem", marginTop: "1rem" }}>Isso pode levar alguns segundos...</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 900, marginBottom: "0.25rem" }}>{plan.name}</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>🗓️ {plan.frequency}</span>
            <span style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>🎯 {plan.goal}</span>
          </div>
        </div>
        <button
          onClick={generatePlan}
          disabled={generating}
          style={{
            background: "transparent", border: "1px solid rgba(0,229,160,0.35)",
            color: "#00e5a0", borderRadius: 10, padding: "0.5rem 1rem",
            fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
            opacity: generating ? 0.6 : 1,
          }}
        >
          {generating ? "Gerando..." : "↺ Regenerar"}
        </button>
      </div>

      {/* Day tabs */}
      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", marginBottom: "1.25rem", paddingBottom: "0.25rem" }}>
        {plan.days.map((d, i) => {
          const color = getDayColor(d.focus);
          return (
            <button
              key={i}
              onClick={() => setOpenDay(i)}
              style={{
                flexShrink: 0, padding: "0.625rem 1rem",
                borderRadius: 10, border: "1px solid",
                cursor: "pointer", fontSize: "0.8125rem", fontWeight: 600,
                transition: "all 0.2s",
                ...(openDay === i
                  ? { background: `${color}18`, borderColor: color, color }
                  : { background: "transparent", borderColor: "#1a2332", color: "#8b9bb4" }),
              }}
            >
              {d.day.split("-")[0].trim()}
            </button>
          );
        })}
      </div>

      {/* Selected day */}
      {plan.days[openDay] && (() => {
        const d = plan.days[openDay];
        const color = getDayColor(d.focus);
        return (
          <div style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 16, overflow: "hidden" }}>
            {/* Day header */}
            <div style={{ padding: "1.25rem 1.5rem", background: `linear-gradient(135deg, ${color}14, transparent)`, borderBottom: "1px solid #1a2332" }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", color, marginBottom: "0.2rem" }}>{d.day}</h3>
              <p style={{ fontSize: "0.875rem", color: "#8b9bb4" }}>Foco: {d.focus}</p>
            </div>

            {/* Exercises */}
            <div style={{ padding: "1rem" }}>
              {d.exercises.map((ex, j) => (
                <div
                  key={j}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "0.75rem",
                    padding: "1rem",
                    borderRadius: 12,
                    marginBottom: j < d.exercises.length - 1 ? "0.5rem" : 0,
                    background: j % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                    border: "1px solid #1a2332",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.25rem" }}>
                      <span style={{ display: "inline-block", width: 24, height: 24, borderRadius: 6, background: `${color}20`, color, fontSize: "0.75rem", fontWeight: 900, textAlign: "center", lineHeight: "24px", marginRight: "0.5rem" }}>
                        {j + 1}
                      </span>
                      {ex.name}
                    </div>
                    {ex.tip && <p style={{ fontSize: "0.75rem", color: "#8b9bb4", marginLeft: 32 }}>💡 {ex.tip}</p>}
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    {[
                      { label: "Séries", value: `${ex.sets}x` },
                      { label: "Reps", value: ex.reps },
                      { label: "Descanso", value: ex.rest },
                    ].map((s) => (
                      <div key={s.label} style={{ textAlign: "center", background: "#141e2e", borderRadius: 8, padding: "0.375rem 0.625rem", minWidth: 52 }}>
                        <div style={{ fontSize: "0.9375rem", fontWeight: 800, color }}>{s.value}</div>
                        <div style={{ fontSize: "0.6rem", color: "#8b9bb4", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
