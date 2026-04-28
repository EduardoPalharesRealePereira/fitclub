"use client";

import { useState } from "react";

interface Food { name: string; amount: string; protein?: number; carbs?: number; fat?: number; }
interface Meal { name: string; time: string; calories: number; foods: Food[]; }
interface DietPlan { calories: number; protein: number; carbs: number; fat: number; goal: string; meals: Meal[]; tips?: string[]; }

interface Props {
  fitnessProfile: Record<string, string> | null;
  dietPlan: Record<string, unknown> | null;
  onPlanGenerated: (data: Record<string, unknown>) => void;
}

const MACRO = { protein: "#00e5a0", carbs: "#00b4d8", fat: "#f39c12" };

function MacroBar({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }) {
  const total = protein * 4 + carbs * 4 + fat * 9;
  const bars = [
    { label: "Prot.", pct: (protein * 4) / total, color: MACRO.protein },
    { label: "Carbo", pct: (carbs * 4) / total, color: MACRO.carbs },
    { label: "Gord.", pct: (fat * 9) / total, color: MACRO.fat },
  ];
  return (
    <div>
      <div style={{ display: "flex", height: 8, borderRadius: 99, overflow: "hidden", marginBottom: "0.625rem" }}>
        {bars.map((b) => <div key={b.label} style={{ width: `${b.pct * 100}%`, background: b.color }} />)}
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        {bars.map((b) => (
          <span key={b.label} style={{ fontSize: "0.6875rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: 2, background: b.color, display: "inline-block" }} />
            <span style={{ color: "#8b9bb4" }}>{b.label}</span>
            <strong style={{ color: b.color }}>{Math.round(b.pct * 100)}%</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DietSection({ fitnessProfile, dietPlan, onPlanGenerated }: Props) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [openMeal, setOpenMeal] = useState(0);
  const plan = dietPlan as unknown as DietPlan | null;

  async function generatePlan() {
    if (!fitnessProfile) return;
    setGenerating(true); setError("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: "Crie meu plano alimentar completo." }], profile: fitnessProfile, mode: "diet" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onPlanGenerated(JSON.parse(data.text));
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Erro ao gerar dieta."); }
    setGenerating(false);
  }

  if (!fitnessProfile) return (
    <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🥗</div>
      <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>Complete seu perfil primeiro</h2>
      <p style={{ color: "#8b9bb4", fontSize: "0.875rem" }}>A IA precisa dos seus dados para criar um plano alimentar.</p>
    </div>
  );

  if (!plan) return (
    <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🥗</div>
      <h2 style={{ fontSize: "1.375rem", fontWeight: 900, marginBottom: "0.625rem" }}>Seu plano alimentar</h2>
      <p style={{ color: "#8b9bb4", marginBottom: "1.75rem", fontSize: "0.9rem" }}>
        Plano personalizado para <strong style={{ color: "#f0f4f8" }}>{fitnessProfile.goal || "saúde geral"}</strong>.
      </p>
      {error && <div style={{ color: "#ff6b6b", background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 12, padding: "0.75rem 1rem", marginBottom: "1.25rem", fontSize: "0.875rem" }}>{error}</div>}
      <button onClick={generatePlan} disabled={generating} className="btn-primary" style={{ opacity: generating ? 0.7 : 1 }}>
        {generating ? "Gerando seu plano..." : "Gerar plano com IA →"}
      </button>
      {generating && <p style={{ color: "#8b9bb4", fontSize: "0.8125rem", marginTop: "0.875rem" }}>Aguarde alguns segundos...</p>}
    </div>
  );

  const totalCals = plan.meals?.reduce((a, m) => a + (m.calories || 0), 0) || plan.calories;
  const meal = plan.meals[openMeal];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.2rem" }}>Plano Alimentar</h2>
          <p style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>🎯 {plan.goal}</p>
        </div>
        <button onClick={generatePlan} disabled={generating} style={{
          background: "transparent", border: "1px solid rgba(0,229,160,0.3)", color: "#00e5a0",
          borderRadius: 10, padding: "0.4rem 0.875rem", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", opacity: generating ? 0.6 : 1,
        }}>↺ Regerar</button>
      </div>

      {/* Macro overview */}
      <div style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 20, padding: "1.25rem", marginBottom: "1rem" }}>
        {/* Calorie row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <p style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>{totalCals}</p>
            <p style={{ fontSize: "0.75rem", color: "#8b9bb4", marginTop: "0.2rem" }}>kcal / dia</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {[
              { label: "Prot.", value: plan.protein, unit: "g", color: MACRO.protein },
              { label: "Carbo", value: plan.carbs, unit: "g", color: MACRO.carbs },
              { label: "Gord.", value: plan.fat, unit: "g", color: MACRO.fat },
            ].map((m) => (
              <div key={m.label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "1.125rem", fontWeight: 900, color: m.color, lineHeight: 1 }}>{m.value}{m.unit}</p>
                <p style={{ fontSize: "0.5625rem", color: "#8b9bb4", marginTop: "0.2rem", textTransform: "uppercase" }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
        <MacroBar protein={plan.protein} carbs={plan.carbs} fat={plan.fat} />
      </div>

      {/* Meal chips */}
      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", marginBottom: "1.25rem", paddingBottom: "0.25rem" }}>
        {plan.meals.map((m, i) => (
          <button key={i} onClick={() => setOpenMeal(i)} style={{
            flexShrink: 0, padding: "0.5rem 1rem", borderRadius: 99, border: "1.5px solid",
            cursor: "pointer", fontSize: "0.8125rem", fontWeight: 600, transition: "all 0.2s",
            ...(openMeal === i
              ? { background: "rgba(0,229,160,0.12)", borderColor: "#00e5a0", color: "#00e5a0" }
              : { background: "transparent", borderColor: "#1a2332", color: "#8b9bb4" }),
          }}>{m.name}</button>
        ))}
      </div>

      {/* Selected meal */}
      {meal && (
        <div style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 20, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1a2332", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontWeight: 800, color: "#00e5a0", marginBottom: "0.125rem" }}>{meal.name}</h3>
              <p style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>🕐 {meal.time}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "1.25rem", fontWeight: 900 }}>{meal.calories}</p>
              <p style={{ fontSize: "0.625rem", color: "#8b9bb4", textTransform: "uppercase" }}>kcal</p>
            </div>
          </div>
          <div style={{ padding: "0.75rem" }}>
            {meal.foods.map((f, j) => (
              <div key={j} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.75rem 0.875rem", borderRadius: 12,
                marginBottom: j < meal.foods.length - 1 ? "0.375rem" : 0,
                background: j % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                gap: "0.5rem",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "#8b9bb4" }}>{f.amount}</p>
                </div>
                <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
                  {f.protein !== undefined && <span style={{ fontSize: "0.6875rem", color: MACRO.protein, background: "rgba(0,229,160,0.08)", padding: "0.2rem 0.4rem", borderRadius: 6 }}>P {f.protein}g</span>}
                  {f.carbs !== undefined && <span style={{ fontSize: "0.6875rem", color: MACRO.carbs, background: "rgba(0,180,216,0.08)", padding: "0.2rem 0.4rem", borderRadius: 6 }}>C {f.carbs}g</span>}
                  {f.fat !== undefined && <span style={{ fontSize: "0.6875rem", color: MACRO.fat, background: "rgba(243,156,18,0.08)", padding: "0.2rem 0.4rem", borderRadius: 6 }}>G {f.fat}g</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {plan.tips && plan.tips.length > 0 && (
        <div style={{ marginTop: "1rem", background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.15)", borderRadius: 16, padding: "1rem 1.25rem" }}>
          <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#00e5a0", marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>💡 Dicas</p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {plan.tips.map((tip, i) => (
              <li key={i} style={{ fontSize: "0.875rem", color: "#8b9bb4", display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#00e5a0", flexShrink: 0 }}>→</span>{tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
