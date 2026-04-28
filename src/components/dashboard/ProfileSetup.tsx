"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const goals = [
  { value: "hipertrofia", label: "💪 Hipertrofia", desc: "Ganho de massa muscular" },
  { value: "forca", label: "🏋️ Força", desc: "Aumento de força máxima" },
  { value: "emagrecimento", label: "🔥 Emagrecimento", desc: "Perda de gordura corporal" },
  { value: "condicionamento", label: "🏃 Condicionamento", desc: "Resistência e cardio" },
  { value: "saude", label: "❤️ Saúde geral", desc: "Qualidade de vida" },
];

const levels = [
  { value: "iniciante", label: "Iniciante", desc: "Menos de 1 ano" },
  { value: "intermediario", label: "Intermediário", desc: "1 a 3 anos" },
  { value: "avancado", label: "Avançado", desc: "Mais de 3 anos" },
];

interface Props {
  userId: string;
  fitnessProfile: Record<string, string> | null;
  onSaved: (data: Record<string, unknown>, isFirstTime: boolean) => void;
}

export default function ProfileSetup({ userId, fitnessProfile, onSaved }: Props) {
  const [form, setForm] = useState({
    name:   fitnessProfile?.name   || "",
    age:    fitnessProfile?.age    || "",
    sex:    fitnessProfile?.sex    || "",
    weight: fitnessProfile?.weight || "",
    height: fitnessProfile?.height || "",
    goal:   fitnessProfile?.goal   || "",
    level:  fitnessProfile?.level  || "",
    notes:  fitnessProfile?.notes  || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const isFirstTime = !fitnessProfile;

  // Validate required fields (notes is optional)
  function validate(): string {
    if (!form.name.trim())   return "Informe seu nome.";
    if (!form.age.trim())    return "Informe sua idade.";
    if (!form.sex)           return "Selecione seu sexo.";
    if (!form.weight.trim()) return "Informe seu peso.";
    if (!form.height.trim()) return "Informe sua altura.";
    if (!form.goal)          return "Selecione seu objetivo.";
    if (!form.level)         return "Selecione seu nível de experiência.";
    return "";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setSaving(true);
    const { error: dbErr } = await supabase
      .from("users")
      .update({ fitness_profile: form, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (!dbErr) {
      onSaved({ fitness_profile: form }, isFirstTime);
    } else {
      setError("Erro ao salvar. Tente novamente.");
    }
    setSaving(false);
  }

  const inputField = (label: string, name: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#8b9bb4", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => { setError(""); setForm((p) => ({ ...p, [name]: e.target.value })); }}
        placeholder={placeholder}
        className="field"
        style={{ colorScheme: "dark" }}
      />
    </div>
  );

  return (
    <div>
      {/* Header — only shown when editing existing profile */}
      {!isFirstTime && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 800, marginBottom: "0.25rem" }}>Seu perfil</h2>
            <p style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>Atualize seus dados quando necessário.</p>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#00e5a0", background: "rgba(0,229,160,0.1)", padding: "0.25rem 0.75rem", borderRadius: 999, border: "1px solid rgba(0,229,160,0.3)" }}>
            ✓ Completo
          </span>
        </div>
      )}

      <form onSubmit={handleSave} noValidate>
        {/* Basic info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "0.875rem" }}>
          {inputField("Nome", "name", "text", "Seu nome")}
          {inputField("Idade", "age", "number", "Ex: 25")}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.875rem", marginBottom: "0.875rem" }}>
          {/* Sex */}
          <div style={{ gridColumn: "span 1" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#8b9bb4", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Sexo
            </label>
            <div style={{ display: "flex", gap: "0.5rem", height: "calc(100% - 1.25rem)" }}>
              {[{ v: "M", l: "Masc." }, { v: "F", l: "Fem." }].map((s) => (
                <button key={s.v} type="button" onClick={() => { setError(""); setForm((p) => ({ ...p, sex: s.v })); }} style={{
                  flex: 1, padding: "0.65rem", borderRadius: 10, border: "1px solid",
                  cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, transition: "all 0.2s",
                  ...(form.sex === s.v
                    ? { background: "rgba(0,229,160,0.12)", borderColor: "#00e5a0", color: "#00e5a0" }
                    : { background: "#0d1520", borderColor: "#1a2332", color: "#8b9bb4" }),
                }}>{s.l}</button>
              ))}
            </div>
          </div>
          {inputField("Peso (kg)", "weight", "number", "Ex: 75")}
          {inputField("Altura (cm)", "height", "number", "Ex: 175")}
        </div>

        {/* Goal */}
        <div style={{ marginBottom: "0.875rem" }}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#8b9bb4", marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Objetivo principal
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {goals.map((g) => (
              <button key={g.value} type="button" onClick={() => { setError(""); setForm((p) => ({ ...p, goal: g.value })); }} style={{
                padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid",
                cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                ...(form.goal === g.value
                  ? { background: "rgba(0,229,160,0.1)", borderColor: "#00e5a0" }
                  : { background: "#0d1520", borderColor: "#1a2332" }),
              }}>
                <div>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: form.goal === g.value ? "#00e5a0" : "#f0f4f8" }}>{g.label}</span>
                  <span style={{ fontSize: "0.8125rem", color: "#8b9bb4", marginLeft: "0.5rem" }}>— {g.desc}</span>
                </div>
                {form.goal === g.value && <span style={{ color: "#00e5a0", fontSize: "1rem" }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Level */}
        <div style={{ marginBottom: "0.875rem" }}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#8b9bb4", marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Nível de experiência
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {levels.map((l) => (
              <button key={l.value} type="button" onClick={() => { setError(""); setForm((p) => ({ ...p, level: l.value })); }} style={{
                flex: 1, padding: "0.75rem 0.5rem", borderRadius: 12, border: "1px solid",
                cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                ...(form.level === l.value
                  ? { background: "rgba(0,229,160,0.1)", borderColor: "#00e5a0" }
                  : { background: "#0d1520", borderColor: "#1a2332" }),
              }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: form.level === l.value ? "#00e5a0" : "#f0f4f8", marginBottom: "0.125rem" }}>{l.label}</div>
                <div style={{ fontSize: "0.6875rem", color: "#8b9bb4" }}>{l.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes — optional */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#8b9bb4", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Restrições <span style={{ color: "#4a5568", fontWeight: 400, textTransform: "none" }}>(opcional)</span>
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Ex: dor no joelho, alergia a lactose, treino em casa..."
            rows={2}
            className="field"
            style={{ resize: "none", colorScheme: "dark" }}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            color: "#ff6b6b", background: "rgba(255,80,80,0.08)",
            border: "1px solid rgba(255,80,80,0.25)", borderRadius: 10,
            padding: "0.625rem 1rem", fontSize: "0.875rem", marginBottom: "1rem",
          }}>
            ⚠️ {error}
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-primary" style={{ width: "100%", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Salvando..." : isFirstTime ? "Continuar →" : "Atualizar perfil"}
        </button>
      </form>
    </div>
  );
}
