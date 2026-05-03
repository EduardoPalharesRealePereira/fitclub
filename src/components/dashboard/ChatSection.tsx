"use client";

import { useState, useRef, useEffect } from "react";

interface Message { role: "user" | "assistant"; content: string; }

interface Props {
  fitnessProfile: Record<string, string> | null;
  workoutPlan: Record<string, unknown> | null;
  dietPlan: Record<string, unknown> | null;
  onWorkoutUpdate: (plan: Record<string, unknown>) => void;
  onDietUpdate:   (plan: Record<string, unknown>) => void;
}

const QUICK = [
  "Troque a corrida por pular corda no meu treino",
  "Substitua o arroz por batata doce na minha dieta",
  "Como aumentar massa muscular?",
  "Quantas proteínas por dia?",
];

export default function ChatSection({ fitnessProfile, workoutPlan, dietPlan, onWorkoutUpdate, onDietUpdate }: Props) {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: `Olá! 👋 Sou seu personal trainer e nutricionista virtual. ${
      fitnessProfile
        ? `Vi que seu objetivo é **${fitnessProfile.goal || "melhorar sua saúde"}**. Posso responder dúvidas e também alterar seu treino e dieta diretamente — é só pedir!`
        : "Complete seu perfil para eu te ajudar melhor."
    } Como posso te ajudar?`,
  }]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function send(text?: string) {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput("");
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
          profile: fitnessProfile,
          mode: "chat",
          workout_plan: workoutPlan,
          diet_plan: dietPlan,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Handle plan updates silently
      if (data.workoutUpdate) {
        onWorkoutUpdate(data.workoutUpdate);
        showToast("✓ Treino atualizado!");
      }
      if (data.dietUpdate) {
        onDietUpdate(data.dietUpdate);
        showToast("✓ Dieta atualizada!");
      }

      setMessages(p => [...p, { role: "assistant", content: data.text }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao conectar.";
      setMessages(p => [...p, { role: "assistant", content: `❌ ${msg}` }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,229,160,0.15)", border: "1px solid rgba(0,229,160,0.4)",
          color: "#00e5a0", borderRadius: 99, padding: "0.5rem 1.25rem",
          fontSize: "0.875rem", fontWeight: 700, zIndex: 50,
          animation: "slideUp 0.25s ease", whiteSpace: "nowrap",
        }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{ padding: "1.25rem 1.25rem 0.75rem", borderBottom: "1px solid #0f1922" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.125rem" }}>Chat IA 💬</h2>
        <p style={{ fontSize: "0.75rem", color: "#8b9bb4" }}>
          Tire dúvidas e altere seu treino e dieta conversando
        </p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.875rem", padding: "1rem 1.25rem" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: "0.5rem" }}>
            {m.role === "assistant" && (
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: "linear-gradient(135deg,#00e5a0,#00b4d8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#080b10", fontWeight: 900, fontSize: "0.6875rem",
              }}>F</div>
            )}
            <div style={{
              maxWidth: "78%", padding: "0.75rem 1rem",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              fontSize: "0.875rem", lineHeight: 1.65, whiteSpace: "pre-wrap",
              ...(m.role === "user"
                ? { background: "linear-gradient(135deg,#00e5a0,#00c98a)", color: "#080b10", fontWeight: 500 }
                : { background: "#141e2e", color: "#f0f4f8", border: "1px solid #1a2332" }),
            }}>{m.content}</div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#00e5a0,#00b4d8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#080b10", fontWeight: 900, fontSize: "0.6875rem" }}>F</div>
            <div style={{ background: "#141e2e", border: "1px solid #1a2332", borderRadius: "18px 18px 18px 4px", padding: "0.875rem 1rem" }}>
              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                {[0, 0.2, 0.4].map(d => (
                  <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#00e5a0", animation: "pulse-dot 1.2s ease-in-out infinite", animationDelay: `${d}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: "0 1.25rem 0.75rem" }}>
          <p style={{ fontSize: "0.6875rem", color: "#4a5568", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Sugestões</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q)} style={{
                background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.15)",
                color: "#8b9bb4", borderRadius: 10, padding: "0.5rem 0.875rem",
                fontSize: "0.8125rem", cursor: "pointer", textAlign: "left",
              }}>{q}</button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={e => { e.preventDefault(); send(); }} style={{
        display: "flex", gap: "0.625rem", padding: "0.75rem 1.25rem 1rem",
        borderTop: "1px solid #0f1922",
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ex: Troque o supino por flexão no meu treino..."
          className="field"
          style={{ flex: 1, fontSize: "0.875rem" }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary"
          style={{ padding: "0.75rem 1rem", opacity: loading || !input.trim() ? 0.5 : 1, flexShrink: 0 }}>↑
        </button>
      </form>
    </div>
  );
}
