"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const goals = [
  { value: "hipertrofia", label: "💪 Hipertrofia", desc: "Ganho de massa muscular" },
  { value: "forca", label: "🏋️ Força", desc: "Aumento de força máxima" },
  { value: "emagrecimento", label: "🔥 Emagrecimento", desc: "Perda de gordura corporal" },
  { value: "condicionamento", label: "🏃 Condicionamento", desc: "Resistência e cardio" },
  { value: "saude", label: "❤️ Saúde geral", desc: "Qualidade de vida e bem-estar" },
];

const levels = [
  { value: "iniciante", label: "Iniciante", desc: "Menos de 1 ano" },
  { value: "intermediario", label: "Intermediário", desc: "1 a 3 anos" },
  { value: "avancado", label: "Avançado", desc: "Mais de 3 anos" },
];

interface Props {
  userId: string;
  fitnessProfile: Record<string, string> | null;
  onSaved: (data: Record<string, unknown>) => void;
}

export default function ProfileSetup({ userId, fitnessProfile, onSaved }: Props) {
  const [form, setForm] = useState({
    name: fitnessProfile?.name || "",
    age: fitnessProfile?.age || "",
    sex: fitnessProfile?.sex || "",
    weight: fitnessProfile?.weight || "",
    height: fitnessProfile?.height || "",
    goal: fitnessProfile?.goal || "",
    level: fitnessProfile?.level || "",
    notes: fitnessProfile?.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  const isComplete = !!fitnessProfile;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update({ fitness_profile: form, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (!error) {
      setSaved(true);
      onSaved({ fitness_profile: form });
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  const field = (label: string, name: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#8b9bb4", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
        placeholder={placeholder}
        className="field"
      />
    </div>
  );

  return (
    <div style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 16, padding: "1.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            {isComplete ? "Seu perfil" : "Complete seu perfil"}
          </h2>
          <p style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>
            {isComplete ? "Atualize seus dados quando necessário." : "A IA usa esses dados para criar planos 100% personalizados."}
          </p>
        </div>
        {isComplete && (
          <span style={{ fontSize: "0.75rem", color: "#00e5a0", background: "rgba(0,229,160,0.1)", padding: "0.25rem 0.75rem", borderRadius: 999, border: "1px solid rgba(0,229,160,0.3)" }}>
            ✓ Completo
          </span>
        )}
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
          {field("Nome", "name", "text", "Seu nome")}
          {field("Idade", "age", "number", "Ex: 25")}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#8b9bb4", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Sexo
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[{ v: "M", l: "Masc." }, { v: "F", l: "Fem." }].map((s) => (
                <button
                  key={s.v}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, sex: s.v }))}
                  style={{
                    flex: 1, padding: "0.65rem", borderRadius: 10, border: "1px solid",
                    cursor: "pointer", fontSize: "0.875rem", fontWeight: 600,
                    transition: "all 0.2s",
                    ...(form.sex === s.v
                      ? { background: "rgba(0,229,160,0.12)", borderColor: "#00e5a0", color: "#00e5a0" }
                      : { background: "rgba(13,21,32,0.95)", borderColor: "#1a2332", color: "#8b9bb4" }),
                  }}
                >{s.l}</button>
              ))}
            </div>
          </div>
          {field("Peso (kg)", "weight", "number", "Ex: 75")}
          {field("Altura (cm)", "height", "number", "Ex: 175")}
        </div>

        {/* Goal */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#8b9bb4", marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Objetivo principal
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.5rem" }}>
            {goals.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, goal: g.value }))}
                style={{
                  padding: "0.75rem", borderRadius: 10, border: "1px solid",
                  cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                  ...(form.goal === g.value
                    ? { background: "rgba(0,229,160,0.12)", borderColor: "#00e5a0" }
                    : { background: "rgba(13,21,32,0.95)", borderColor: "#1a2332" }),
                }}
              >
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: form.goal === g.value ? "#00e5a0" : "#f0f4f8", marginBottom: "0.2rem" }}>{g.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#8b9bb4" }}>{g.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Level */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#8b9bb4", marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Nível de experiência
          </label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {levels.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, level: l.value }))}
                style={{
                  flex: 1, minWidth: 120, padding: "0.75rem 1rem",
                  borderRadius: 10, border: "1px solid", cursor: "pointer",
                  textAlign: "left", transition: "all 0.2s",
                  ...(form.level === l.value
                    ? { background: "rgba(0,229,160,0.12)", borderColor: "#00e5a0" }
                    : { background: "rgba(13,21,32,0.95)", borderColor: "#1a2332" }),
                }}
              >
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: form.level === l.value ? "#00e5a0" : "#f0f4f8" }}>{l.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#8b9bb4" }}>{l.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#8b9bb4", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Restrições ou observações
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Ex: dor no joelho, alergia a lactose, treino em casa sem equipamentos..."
            rows={3}
            className="field"
            style={{ resize: "vertical" }}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
          style={{ opacity: saving ? 0.7 : 1 }}
        >
          {saving ? "Salvando..." : saved ? "✓ Salvo!" : isComplete ? "Atualizar perfil" : "Salvar e continuar →"}
        </button>
      </form>
    </div>
  );
}
