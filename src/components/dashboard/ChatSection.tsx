"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  fitnessProfile: Record<string, string> | null;
}

const QUICK_QUESTIONS = [
  "Como aumentar minha massa muscular rápido?",
  "Qual o melhor horário para treinar?",
  "Quantas proteínas devo comer por dia?",
  "Como evitar perda de músculo na dieta?",
];

export default function ChatSection({ fitnessProfile }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Olá! 👋 Sou seu personal trainer e nutricionista virtual. ${
        fitnessProfile
          ? `Vi que seu objetivo é ${fitnessProfile.goal || "melhorar sua saúde"} — vou te ajudar com isso!`
          : "Para te ajudar melhor, complete seu perfil na aba Início."
      } Como posso te ajudar hoje?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          profile: fitnessProfile,
          mode: "chat",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao conectar com a IA.";
      setMessages((prev) => [...prev, { role: "assistant", content: `❌ ${msg}` }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", minHeight: 480 }}>
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.25rem" }}>Chat com IA 💬</h2>
        <p style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>Seu personal trainer e nutricionista virtual, disponível 24h.</p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem",
        padding: "1.25rem", background: "#0d1520", borderRadius: 16,
        border: "1px solid #1a2332", marginBottom: "1rem",
      }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {m.role === "assistant" && (
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0, marginRight: "0.625rem",
                background: "linear-gradient(135deg,#00e5a0,#00b4d8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#080b10", fontWeight: 900, fontSize: "0.75rem",
              }}>F</div>
            )}
            <div style={{
              maxWidth: "78%",
              padding: "0.75rem 1rem",
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              fontSize: "0.9rem", lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              ...(m.role === "user"
                ? { background: "linear-gradient(135deg,#00e5a0,#00c98a)", color: "#080b10", fontWeight: 500 }
                : { background: "#141e2e", color: "#f0f4f8", border: "1px solid #1a2332" }),
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg,#00e5a0,#00b4d8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#080b10", fontWeight: 900, fontSize: "0.75rem",
            }}>F</div>
            <div style={{ background: "#141e2e", border: "1px solid #1a2332", borderRadius: "16px 16px 16px 4px", padding: "0.75rem 1rem" }}>
              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                {[0, 0.2, 0.4].map((d) => (
                  <div key={d} style={{
                    width: 7, height: 7, borderRadius: "50%", background: "#00e5a0",
                    animation: "pulse-dot 1.2s ease-in-out infinite",
                    animationDelay: `${d}s`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              style={{
                background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)",
                color: "#00e5a0", borderRadius: 999, padding: "0.375rem 0.875rem",
                fontSize: "0.8125rem", cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(0,229,160,0.15)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(0,229,160,0.08)"}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        style={{ display: "flex", gap: "0.75rem" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre treino, dieta, suplementação..."
          className="field"
          style={{ flex: 1 }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary"
          style={{ padding: "0.75rem 1.25rem", opacity: loading || !input.trim() ? 0.5 : 1, flexShrink: 0 }}
        >
          ↑
        </button>
      </form>
    </div>
  );
}
