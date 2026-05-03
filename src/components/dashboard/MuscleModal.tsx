"use client";

import { useState } from "react";

type MuscleId =
  | "chest" | "front_shoulder" | "bicep" | "forearm" | "abs" | "oblique" | "quad" | "front_calf"
  | "trap" | "rear_shoulder" | "tricep" | "lat" | "lower_back" | "glute" | "hamstring" | "rear_calf";

const MUSCLE_NAMES: Record<MuscleId, string> = {
  chest: "Peitoral", front_shoulder: "Deltóide anterior", bicep: "Bíceps", forearm: "Antebraço",
  abs: "Abdômen", oblique: "Oblíquos", quad: "Quadríceps", front_calf: "Panturrilha (front.)",
  trap: "Trapézio", rear_shoulder: "Deltóide posterior", tricep: "Tríceps", lat: "Latíssimo do dorso",
  lower_back: "Lombar", glute: "Glúteo", hamstring: "Posterior de coxa", rear_calf: "Panturrilha (post.)",
};

const MUSCLE_MAP: Record<string, MuscleId[]> = {
  "supino": ["chest", "front_shoulder", "tricep"],
  "peck": ["chest"], "crossover": ["chest"], "crucifixo": ["chest"],
  "flexão": ["chest", "tricep", "front_shoulder"],
  "barra fixa": ["lat", "bicep", "rear_shoulder"],
  "remada": ["lat", "bicep", "rear_shoulder", "trap"],
  "pulldown": ["lat", "bicep"], "pulley": ["lat", "bicep"],
  "levantamento terra": ["lower_back", "glute", "hamstring", "trap"],
  "hiperextensão": ["lower_back", "glute"],
  "desenvolvimento": ["front_shoulder", "tricep", "trap"],
  "elevação lateral": ["front_shoulder", "rear_shoulder"],
  "crucifixo invertido": ["rear_shoulder", "trap"],
  "encolhimento": ["trap"],
  "rosca": ["bicep", "forearm"], "martelo": ["bicep", "forearm"], "scott": ["bicep"],
  "tríceps": ["tricep"], "mergulho": ["tricep", "chest"],
  "agachamento": ["quad", "glute", "hamstring"],
  "leg press": ["quad", "glute"],
  "extensora": ["quad"], "cadeira extensora": ["quad"],
  "flexora": ["hamstring"], "mesa flexora": ["hamstring"],
  "stiff": ["hamstring", "glute", "lower_back"],
  "afundo": ["quad", "glute", "hamstring"],
  "panturrilha": ["front_calf", "rear_calf"],
  "glúteo": ["glute"], "hip thrust": ["glute", "hamstring"],
  "abdominal": ["abs"], "crunch": ["abs"],
  "prancha": ["abs", "lower_back"],
  "oblíquo": ["oblique"],
};

function getMuscles(name: string): MuscleId[] {
  const lower = name.toLowerCase();
  for (const [key, muscles] of Object.entries(MUSCLE_MAP)) {
    if (lower.includes(key)) return muscles;
  }
  return [];
}

const BACK_MUSCLES: MuscleId[] = ["trap", "rear_shoulder", "tricep", "lat", "lower_back", "glute", "hamstring", "rear_calf"];

function muscleSVGProps(id: MuscleId, active: Set<MuscleId>): React.SVGProps<SVGEllipseElement | SVGPathElement> {
  const on = active.has(id);
  return {
    fill:        on ? "rgba(255,55,55,0.82)" : "rgba(255,255,255,0.055)",
    stroke:      on ? "#ff4444" : "rgba(255,255,255,0.22)",
    strokeWidth: on ? 1.5 : 0.8,
    style: {
      filter:     on ? "drop-shadow(0 0 8px rgba(255,50,50,0.9))" : "none",
      transition: "all 0.35s ease",
    },
  } as React.SVGProps<SVGEllipseElement>;
}

/* ── Front view ────────────────────────────────────────── */
function FrontBody({ active }: { active: Set<MuscleId> }) {
  const mp = (id: MuscleId) => muscleSVGProps(id, active);
  const outline = { fill: "none" as const, stroke: "rgba(255,255,255,0.18)", strokeWidth: 1 };

  return (
    <svg viewBox="0 0 200 410" style={{ width: "100%", height: "100%" }}>
      {/* Outline */}
      <circle cx="100" cy="28" r="21" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
      <path d="M90,49 L90,67 L110,67 L110,49" {...outline} />
      {/* Torso */}
      <path d="M55,67 C38,74 33,92 37,152 L48,186 L73,193 L73,205 L127,205 L127,193 L152,186 L163,152 C167,92 162,74 145,67 Z" {...outline} />
      {/* Arms */}
      <path d="M55,67 L35,82 L27,158 L42,158 L52,186" {...outline} />
      <path d="M145,67 L165,82 L173,158 L158,158 L148,186" {...outline} />
      {/* Legs */}
      <path d="M73,205 L65,312 L65,400 L92,400 L97,312 L97,205" {...outline} />
      <path d="M127,205 L135,312 L135,400 L108,400 L103,312 L103,205" {...outline} />
      {/* Collarbone */}
      <path d="M90,67 Q100,74 110,67" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* CHEST */}
      <ellipse cx="76" cy="90" rx="22" ry="18" transform="rotate(-8,76,90)" {...mp("chest")} />
      <ellipse cx="124" cy="90" rx="22" ry="18" transform="rotate(8,124,90)" {...mp("chest")} />
      {/* FRONT SHOULDER */}
      <ellipse cx="48" cy="80" rx="15" ry="12" transform="rotate(-20,48,80)" {...mp("front_shoulder")} />
      <ellipse cx="152" cy="80" rx="15" ry="12" transform="rotate(20,152,80)" {...mp("front_shoulder")} />
      {/* BICEP */}
      <ellipse cx="37" cy="122" rx="9" ry="20" {...mp("bicep")} />
      <ellipse cx="163" cy="122" rx="9" ry="20" {...mp("bicep")} />
      {/* FOREARM */}
      <ellipse cx="33" cy="163" rx="7" ry="18" {...mp("forearm")} />
      <ellipse cx="167" cy="163" rx="7" ry="18" {...mp("forearm")} />
      {/* ABS */}
      <ellipse cx="87" cy="115" rx="10" ry="7" {...mp("abs")} />
      <ellipse cx="113" cy="115" rx="10" ry="7" {...mp("abs")} />
      <ellipse cx="87" cy="132" rx="10" ry="7" {...mp("abs")} />
      <ellipse cx="113" cy="132" rx="10" ry="7" {...mp("abs")} />
      <ellipse cx="87" cy="149" rx="10" ry="7" {...mp("abs")} />
      <ellipse cx="113" cy="149" rx="10" ry="7" {...mp("abs")} />
      {/* OBLIQUE */}
      <ellipse cx="65" cy="142" rx="10" ry="22" transform="rotate(-12,65,142)" {...mp("oblique")} />
      <ellipse cx="135" cy="142" rx="10" ry="22" transform="rotate(12,135,142)" {...mp("oblique")} />
      {/* QUAD */}
      <ellipse cx="79" cy="263" rx="20" ry="44" {...mp("quad")} />
      <ellipse cx="121" cy="263" rx="20" ry="44" {...mp("quad")} />
      {/* FRONT CALF */}
      <ellipse cx="75" cy="350" rx="13" ry="28" {...mp("front_calf")} />
      <ellipse cx="125" cy="350" rx="13" ry="28" {...mp("front_calf")} />
    </svg>
  );
}

/* ── Back view ─────────────────────────────────────────── */
function BackBody({ active }: { active: Set<MuscleId> }) {
  const mp = (id: MuscleId) => muscleSVGProps(id, active);
  const outline = { fill: "none" as const, stroke: "rgba(255,255,255,0.18)", strokeWidth: 1 };

  return (
    <svg viewBox="0 0 200 410" style={{ width: "100%", height: "100%" }}>
      {/* Outline */}
      <circle cx="100" cy="28" r="21" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
      <path d="M90,49 L90,67 L110,67 L110,49" {...outline} />
      <path d="M55,67 C38,74 33,92 37,152 L48,186 L73,193 L73,205 L127,205 L127,193 L152,186 L163,152 C167,92 162,74 145,67 Z" {...outline} />
      <path d="M55,67 L35,82 L27,158 L42,158 L52,186" {...outline} />
      <path d="M145,67 L165,82 L173,158 L158,158 L148,186" {...outline} />
      <path d="M73,205 L65,312 L65,400 L92,400 L97,312 L97,205" {...outline} />
      <path d="M127,205 L135,312 L135,400 L108,400 L103,312 L103,205" {...outline} />

      {/* TRAP */}
      <path d="M88,67 Q100,72 112,67 Q132,80 118,92 L100,96 L82,92 Q68,80 88,67 Z" {...mp("trap")} />
      {/* REAR SHOULDER */}
      <ellipse cx="48" cy="80" rx="15" ry="12" transform="rotate(-20,48,80)" {...mp("rear_shoulder")} />
      <ellipse cx="152" cy="80" rx="15" ry="12" transform="rotate(20,152,80)" {...mp("rear_shoulder")} />
      {/* TRICEP */}
      <ellipse cx="37" cy="118" rx="9" ry="22" {...mp("tricep")} />
      <ellipse cx="163" cy="118" rx="9" ry="22" {...mp("tricep")} />
      {/* LAT */}
      <path d="M57,90 Q48,115 52,148 L68,156 L76,120 Z" {...mp("lat")} />
      <path d="M143,90 Q152,115 148,148 L132,156 L124,120 Z" {...mp("lat")} />
      {/* LOWER BACK */}
      <ellipse cx="100" cy="163" rx="30" ry="18" {...mp("lower_back")} />
      {/* GLUTE */}
      <ellipse cx="79" cy="200" rx="24" ry="19" {...mp("glute")} />
      <ellipse cx="121" cy="200" rx="24" ry="19" {...mp("glute")} />
      {/* HAMSTRING */}
      <ellipse cx="79" cy="262" rx="20" ry="44" {...mp("hamstring")} />
      <ellipse cx="121" cy="262" rx="20" ry="44" {...mp("hamstring")} />
      {/* REAR CALF */}
      <ellipse cx="75" cy="348" rx="13" ry="29" {...mp("rear_calf")} />
      <ellipse cx="125" cy="348" rx="13" ry="29" {...mp("rear_calf")} />
    </svg>
  );
}

/* ── Modal ─────────────────────────────────────────────── */
interface ExerciseInfo {
  name: string;
  tip?: string;
  sets: number;
  reps: string;
  rest: string;
  type?: string;
}

export default function MuscleModal({ exercise, onClose }: { exercise: ExerciseInfo; onClose: () => void }) {
  const muscles   = getMuscles(exercise.name);
  const activeSet = new Set(muscles) as Set<MuscleId>;

  // Auto-select back view if exercise is primarily back muscles
  const backCount  = muscles.filter(m => BACK_MUSCLES.includes(m)).length;
  const [view, setView] = useState<"front" | "back">(backCount > muscles.length / 2 ? "back" : "front");

  const uniqueMuscles = [...new Set(muscles)];

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.94)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: 380, background: "#07090f", border: "1px solid #1a2332", borderRadius: 24, overflow: "hidden", animation: "slideUp 0.28s ease" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: "1rem 1.25rem 0.875rem", borderBottom: "1px solid #0f1922", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ fontWeight: 900, fontSize: "1.0625rem", marginBottom: "0.375rem" }}>{exercise.name}</h3>
            <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
              {[`${exercise.sets}× séries`, exercise.reps + " reps", exercise.rest + " desc."].map(s => (
                <span key={s} style={{ fontSize: "0.6875rem", background: "#141e2e", color: "#8b9bb4", borderRadius: 6, padding: "0.15rem 0.5rem" }}>{s}</span>
              ))}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8b9bb4", fontSize: "1.5rem", cursor: "pointer", lineHeight: 1, padding: "0 0 0 0.5rem" }}>×</button>
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", background: "#0a0f1a", margin: "0.875rem", borderRadius: 12, padding: "0.25rem" }}>
          {(["front", "back"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              flex: 1, padding: "0.5rem", borderRadius: 10, border: "none", cursor: "pointer",
              background: view === v ? "#1a2332" : "transparent",
              color: view === v ? "#f0f4f8" : "#4a5568",
              fontWeight: view === v ? 700 : 400, fontSize: "0.875rem", transition: "all 0.2s",
            }}>{v === "front" ? "Frente" : "Costas"}</button>
          ))}
        </div>

        {/* SVG body */}
        <div style={{ padding: "0 1rem", height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {view === "front" ? <FrontBody active={activeSet} /> : <BackBody active={activeSet} />}
        </div>

        {/* Muscles list */}
        {uniqueMuscles.length > 0 ? (
          <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid #0f1922" }}>
            <p style={{ fontSize: "0.625rem", color: "#8b9bb4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Músculos trabalhados</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {uniqueMuscles.map(m => (
                <span key={m} style={{
                  fontSize: "0.8125rem", fontWeight: 600,
                  color: "#ff6060", background: "rgba(255,60,60,0.1)",
                  border: "1px solid rgba(255,60,60,0.28)", borderRadius: 8,
                  padding: "0.2rem 0.6rem",
                }}>{MUSCLE_NAMES[m]}</span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid #0f1922" }}>
            <p style={{ fontSize: "0.8125rem", color: "#4a5568" }}>Exercício cardiovascular — trabalha o corpo todo.</p>
          </div>
        )}

        {/* Tip */}
        {exercise.tip && (
          <div style={{ padding: "0.75rem 1.25rem 1.125rem", borderTop: "1px solid #0f1922" }}>
            <p style={{ fontSize: "0.8125rem", color: "#8b9bb4", lineHeight: 1.5 }}>💡 {exercise.tip}</p>
          </div>
        )}
      </div>
    </div>
  );
}
