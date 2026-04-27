"use client";

import { useState } from "react";

interface Food {
  name: string;
  amount: string;
  protein?: number;
  carbs?: number;
  fat?: number;
}
interface Meal {
  name: string;
  time: string;
  calories: number;
  foods: Food[];
}
interface DietPlan {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goal: string;
  meals: Meal[];
  tips?: string[];
}

interface Props {
  fitnessProfile: Record<string, string> | null;
  dietPlan: Record<string, unknown> | null;
  onPlanGenerated: (data: Record<string, unknown>) => void;
}

const MACRO_COLORS = {
  protein: "#00e5a0",
  carbs: "#00b4d8",
  fat: "#f39c12",
};

export default function DietSection({ fitnessProfile, dietPlan, onPlanGenerated }: Props) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [openMeal, setOpenMeal] = useState<number>(0);

  const plan = dietPlan as unknown as DietPlan | null;

  async function generatePlan() {
    if (!fitnessProfile) return;
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Crie meu plano alimentar completo." }],
          profile: fitnessProfile,
          mode: "diet",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const parsed = JSON.parse(data.text);
      onPlanGenerated(parsed);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao gerar dieta.");
    }
    setGenerating(false);
  }

  if (!fitnessProfile) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🥗</div>
        <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>Complete seu perfil primeiro</h2>
        <p style={{ color: "#8b9bb4" }}>A IA precisa dos seus dados para criar um plano alimentar personalizado.</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>🥗</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "0.75rem" }}>Seu plano alimentar</h2>
        <p style={{ color: "#8b9bb4", maxWidth: 400, margin: "0 auto 2rem" }}>
          A IA vai criar um plano alimentar completo com base no seu objetivo: {fitnessProfile.goal || "saúde geral"}.
        </p>
        {error && (
          <div style={{ color: "#ff6b6b", background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}
        <button onClick={generatePlan} disabled={generating} className="btn-primary" style={{ opacity: generating ? 0.7 : 1 }}>
          {generating ? "Gerando seu plano..." : "Gerar plano com IA →"}
        </button>
        {generating && <p style={{ color: "#8b9bb4", fontSize: "0.8125rem", marginTop: "1rem" }}>Aguarde alguns segundos...</p>}
      </div>
    );
  }

  const totalCals = plan.meals?.reduce((a, m) => a + (m.calories || 0), 0) || plan.calories;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 900, marginBottom: "0.25rem" }}>Plano Alimentar</h2>
          <p style={{ fontSize: "0.875rem", color: "#8b9bb4" }}>🎯 {plan.goal}</p>
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

      {/* Macros overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Calorias", value: `${totalCals}`, unit: "kcal", color: "#f0f4f8" },
          { label: "Proteína", value: `${plan.protein}g`, unit: "proteína", color: MACRO_COLORS.protein },
          { label: "Carboidrato", value: `${plan.carbs}g`, unit: "carboidrato", color: MACRO_COLORS.carbs },
          { label: "Gordura", value: `${plan.fat}g`, unit: "gordura", color: MACRO_COLORS.fat },
        ].map((m) => (
          <div key={m.label} style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 12, padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.375rem", fontWeight: 900, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: "0.7rem", color: "#8b9bb4", marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Macro bar */}
      <div style={{ marginBottom: "1.5rem", background: "#0d1520", border: "1px solid #1a2332", borderRadius: 12, padding: "1rem" }}>
        <p style={{ fontSize: "0.75rem", color: "#8b9bb4", marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Distribuição de macros</p>
        {(() => {
          const total = (plan.protein * 4) + (plan.carbs * 4) + (plan.fat * 9);
          const bars = [
            { label: "Proteína", cal: plan.protein * 4, color: MACRO_COLORS.protein },
            { label: "Carboidrato", cal: plan.carbs * 4, color: MACRO_COLORS.carbs },
            { label: "Gordura", cal: plan.fat * 9, color: MACRO_COLORS.fat },
          ];
          return (
            <div>
              <div style={{ display: "flex", height: 10, borderRadius: 99, overflow: "hidden", marginBottom: "0.625rem" }}>
                {bars.map((b) => (
                  <div key={b.label} style={{ width: `${(b.cal / total) * 100}%`, background: b.color, transition: "width 0.5s" }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {bars.map((b) => (
                  <span key={b.label} style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: b.color, display: "inline-block" }} />
                    <span style={{ color: "#8b9bb4" }}>{b.label}</span>
                    <strong style={{ color: b.color }}>{Math.round((b.cal / total) * 100)}%</strong>
                  </span>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Meal tabs */}
      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", marginBottom: "1rem", paddingBottom: "0.25rem" }}>
        {plan.meals.map((m, i) => (
          <button
            key={i}
            onClick={() => setOpenMeal(i)}
            style={{
              flexShrink: 0, padding: "0.5rem 0.875rem",
              borderRadius: 10, border: "1px solid",
              cursor: "pointer", fontSize: "0.8125rem", fontWeight: 600,
              transition: "all 0.2s",
              ...(openMeal === i
                ? { background: "rgba(0,229,160,0.1)", borderColor: "#00e5a0", color: "#00e5a0" }
                : { background: "transparent", borderColor: "#1a2332", color: "#8b9bb4" }),
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Selected meal */}
      {plan.meals[openMeal] && (() => {
        const meal = plan.meals[openMeal];
        return (
          <div style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "1.125rem 1.5rem", borderBottom: "1px solid #1a2332", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontWeight: 800, color: "#00e5a0" }}>{meal.name}</h3>
                <p style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>🕐 {meal.time}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 900 }}>{meal.calories}</div>
                <div style={{ fontSize: "0.7rem", color: "#8b9bb4", textTransform: "uppercase" }}>kcal</div>
              </div>
            </div>

            <div style={{ padding: "0.75rem" }}>
              {meal.foods.map((f, j) => (
                <div
                  key={j}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.75rem 0.875rem", borderRadius: 10, marginBottom: j < meal.foods.length - 1 ? "0.375rem" : 0,
                    background: j % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{f.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#8b9bb4" }}>{f.amount}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    {f.protein !== undefined && (
                      <span style={{ fontSize: "0.75rem", color: MACRO_COLORS.protein, background: "rgba(0,229,160,0.08)", padding: "0.2rem 0.5rem", borderRadius: 6 }}>
                        P: {f.protein}g
                      </span>
                    )}
                    {f.carbs !== undefined && (
                      <span style={{ fontSize: "0.75rem", color: MACRO_COLORS.carbs, background: "rgba(0,180,216,0.08)", padding: "0.2rem 0.5rem", borderRadius: 6 }}>
                        C: {f.carbs}g
                      </span>
                    )}
                    {f.fat !== undefined && (
                      <span style={{ fontSize: "0.75rem", color: MACRO_COLORS.fat, background: "rgba(243,156,18,0.08)", padding: "0.2rem 0.5rem", borderRadius: 6 }}>
                        G: {f.fat}g
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Tips */}
      {plan.tips && plan.tips.length > 0 && (
        <div style={{ marginTop: "1.25rem", background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.18)", borderRadius: 12, padding: "1rem 1.25rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#00e5a0", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>💡 Dicas do nutricionista</p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {plan.tips.map((tip, i) => (
              <li key={i} style={{ fontSize: "0.875rem", color: "#8b9bb4", display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#00e5a0", flexShrink: 0 }}>→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
