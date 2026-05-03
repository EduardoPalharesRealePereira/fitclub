"use client";

import { useState } from "react";
import MuscleModal from "./MuscleModal";

interface Exercise { name: string; sets: number; reps: string; rest: string; tip?: string; type?: "strength" | "cardio" | "mobility"; }
interface Day { day: string; focus: string; exercises: Exercise[]; }
interface WorkoutPlan { name: string; frequency: string; goal: string; days: Day[]; }

interface Props {
  fitnessProfile: Record<string, string> | null;
  workoutPlan: Record<string, unknown> | null;
  onPlanGenerated: (data: Record<string, unknown>) => void;
}

const MUSCLE_COLORS: Record<string, string> = {
  "peito": "#e74c3c", "peitoral": "#e74c3c",
  "costas": "#2980b9", "dorsal": "#2980b9",
  "ombro": "#8e44ad", "deltóide": "#8e44ad",
  "bíceps": "#27ae60", "tríceps": "#16a085",
  "perna": "#f39c12", "quadríceps": "#f39c12", "posterior": "#d35400",
  "glúteo": "#c0392b", "panturrilha": "#7f8c8d",
  "abdômen": "#00e5a0", "abdominal": "#00e5a0", "cardio": "#00b4d8",
};

function getDayColor(focus: string) {
  const lower = focus.toLowerCase();
  for (const [k, c] of Object.entries(MUSCLE_COLORS)) if (lower.includes(k)) return c;
  return "#00e5a0";
}

export default function WorkoutSection({ fitnessProfile, workoutPlan, onPlanGenerated }: Props) {
  const [generating,     setGenerating]     = useState(false);
  const [error,          setError]          = useState("");
  const [openDay,        setOpenDay]        = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const plan = workoutPlan as unknown as WorkoutPlan | null;

  async function generatePlan() {
    if (!fitnessProfile) return;
    setGenerating(true); setError("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: "Gere minha ficha de treino completa." }], profile: fitnessProfile, mode: "workout" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onPlanGenerated(JSON.parse(data.text));
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Erro ao gerar treino."); }
    setGenerating(false);
  }

  if (!fitnessProfile) return (
    <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
      <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>Complete seu perfil primeiro</h2>
      <p style={{ color: "#8b9bb4", fontSize: "0.875rem" }}>A IA precisa dos seus dados para criar uma ficha personalizada.</p>
    </div>
  );

  if (!plan) return (
    <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💪</div>
      <h2 style={{ fontSize: "1.375rem", fontWeight: 900, marginBottom: "0.625rem" }}>Sua ficha de treino</h2>
      <p style={{ color: "#8b9bb4", marginBottom: "1.75rem", fontSize: "0.9rem" }}>
        Treino para <strong style={{ color: "#f0f4f8" }}>{fitnessProfile.goal}</strong>, nível <strong style={{ color: "#f0f4f8" }}>{fitnessProfile.level}</strong>.
      </p>
      {error && <div style={{ color: "#ff6b6b", background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 12, padding: "0.75rem 1rem", marginBottom: "1.25rem", fontSize: "0.875rem" }}>{error}</div>}
      <button onClick={generatePlan} disabled={generating} className="btn-primary" style={{ opacity: generating ? 0.7 : 1 }}>
        {generating ? "Gerando sua ficha..." : "Gerar ficha com IA →"}
      </button>
      {generating && <p style={{ color: "#8b9bb4", fontSize: "0.8125rem", marginTop: "0.875rem" }}>Isso pode levar alguns segundos...</p>}
    </div>
  );

  const today = plan.days[openDay];
  const color = getDayColor(today.focus);

  return (
    <div>
      {/* Muscle modal */}
      {selectedExercise && (
        <MuscleModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.2rem" }}>{plan.name}</h2>
          <p style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>🗓️ {plan.frequency} · 🎯 {plan.goal}</p>
        </div>
        <button onClick={generatePlan} disabled={generating} style={{
          background: "transparent", border: "1px solid rgba(0,229,160,0.3)", color: "#00e5a0",
          borderRadius: 10, padding: "0.4rem 0.875rem", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", opacity: generating ? 0.6 : 1,
        }}>↺ Regerar</button>
      </div>

      {/* Day chips */}
      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", marginBottom: "1.25rem", paddingBottom: "0.25rem" }}>
        {plan.days.map((d, i) => {
          const c = getDayColor(d.focus);
          return (
            <button key={i} onClick={() => setOpenDay(i)} style={{
              flexShrink: 0, padding: "0.5rem 1rem", borderRadius: 99, border: "1.5px solid",
              cursor: "pointer", fontSize: "0.8125rem", fontWeight: 600, transition: "all 0.2s",
              ...(openDay === i
                ? { background: `${c}18`, borderColor: c, color: c }
                : { background: "transparent", borderColor: "#1a2332", color: "#8b9bb4" }),
            }}>
              {d.day.split("-")[0].trim().split(" ")[0]}
            </button>
          );
        })}
      </div>

      {/* Selected day card */}
      <div style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 20, overflow: "hidden" }}>
        <div style={{ padding: "1.125rem 1.25rem", background: `linear-gradient(135deg, ${color}14, transparent)`, borderBottom: "1px solid #1a2332" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ fontWeight: 800, color, marginBottom: "0.2rem" }}>{today.day}</h3>
            <span style={{ fontSize: "0.75rem", color: "#8b9bb4", background: "#141e2e", borderRadius: 8, padding: "0.2rem 0.6rem" }}>
              {today.exercises.length} exercícios
            </span>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>Foco: {today.focus}</p>
        </div>

        <div style={{ padding: "0.75rem" }}>
          {today.exercises.map((ex, j) => {
            // Rely on the AI-provided "type" field first; name-based detection only as fallback when type is absent
            const isCardio = ex.type === "cardio" || (
              !ex.type && (
                /\besteira\b/i.test(ex.name) ||
                /\bpular corda\b/i.test(ex.name) ||
                /\bcorrida\b/i.test(ex.name) ||
                /\bhiit\b/i.test(ex.name) ||
                /\bsprint\b/i.test(ex.name) ||
                /\bbike ergom/i.test(ex.name) ||
                /\bremo ergom/i.test(ex.name) ||
                /\bescada rolante\b/i.test(ex.name)
              )
            );
            const exColor = isCardio ? "#00b4d8" : color;
            return (
              <div key={j}
                onClick={() => setSelectedExercise(ex)}
                role="button"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.875rem 1rem", borderRadius: 14,
                  marginBottom: j < today.exercises.length - 1 ? "0.5rem" : 0,
                  background: isCardio ? "rgba(0,180,216,0.06)" : (j % 2 === 0 ? "rgba(255,255,255,0.025)" : "transparent"),
                  border: isCardio ? "1px solid rgba(0,180,216,0.25)" : "1px solid #1a2332",
                  gap: "0.75rem", cursor: "pointer", transition: "border-color 0.18s, background 0.18s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = isCardio ? "#00b4d8" : exColor + "66")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = isCardio ? "rgba(0,180,216,0.25)" : "#1a2332")}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9375rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 6, background: `${exColor}20`,
                      color: exColor, fontSize: isCardio ? "0.75rem" : "0.6875rem", fontWeight: 900,
                      display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>{isCardio ? "♥" : j + 1}</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: isCardio ? "#00b4d8" : "#f0f4f8" }}>{ex.name}</span>
                    {isCardio
                      ? <span style={{ fontSize: "0.6rem", background: "rgba(0,180,216,0.15)", color: "#00b4d8", borderRadius: 4, padding: "0.1rem 0.35rem", fontWeight: 700, textTransform: "uppercase", flexShrink: 0 }}>cardio</span>
                      : <span style={{ fontSize: "0.55rem", color: "#4a5568", flexShrink: 0 }}>ver músculos</span>
                    }
                  </div>
                  {ex.tip && <p style={{ fontSize: "0.75rem", color: "#8b9bb4", marginLeft: 30 }}>💡 {ex.tip}</p>}
                </div>
                <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
                  {ex.rest !== "-" ? (
                    [{ v: `${ex.sets}x`, l: "séries" }, { v: ex.reps, l: "reps" }, { v: ex.rest, l: "desc." }].map((s) => (
                      <div key={s.l} style={{ textAlign: "center", background: "#141e2e", borderRadius: 8, padding: "0.3rem 0.5rem", minWidth: 40 }}>
                        <div style={{ fontSize: "0.8125rem", fontWeight: 800, color: exColor }}>{s.v}</div>
                        <div style={{ fontSize: "0.5rem", color: "#8b9bb4", textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.l}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", background: "#141e2e", borderRadius: 8, padding: "0.3rem 0.75rem" }}>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 800, color: exColor }}>{ex.reps}</div>
                      <div style={{ fontSize: "0.5rem", color: "#8b9bb4", textTransform: "uppercase", letterSpacing: "0.04em" }}>duração</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
