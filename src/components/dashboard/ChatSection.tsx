"use client";

import { useState, useRef, useEffect } from "react";

interface Message { role: "user" | "assistant"; content: string; }
interface Props { fitnessProfile: Record<string, string> | null; }

const QUICK = [
  "Como aumentar massa muscular?",
  "Melhor horário para treinar?",
  "Quantas proteínas por dia?",
  "Como evitar perda de músculo?",
];

export default function ChatSection({ fitnessProfile }: Props) {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: `Olá! 👋 Sou seu personal trainer e nutricionista virtual. ${fitnessProfile
      ? `Vi que seu objetivo é ${fitnessProfile.goal || "melhorar sua saúde"} — vou te ajudar!`
      : "Complete seu perfil para eu te ajudar melhor."} Como posso te ajudar?`,
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send(text?: string) {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput("");
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })), profile: fitnessProfile, mode: "chat" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((p) => [...p, { role: "assistant", content: data.text }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao conectar.";
      setMessages((p) => [...p, { role: "assistant", content: `❌ ${msg}` }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "0" }}>
      {/* Header */}
      <div style={{ padding: "1.25rem 1.25rem 0.75rem", borderBottom: "1px solid #0f1922" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.125rem" }}>Chat IA 💬</h2>
        <p style={{ fontSize: "0.75rem", color: "#8b9bb4" }}>Personal trainer e nutricionista virtual, 24h</p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", display: "flex", flexDirection: "column",
        gap: "0.875rem", padding: "1rem 1.25rem",
      }}>
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
              maxWidth: "75%", padding: "0.75rem 1rem",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              fontSize: "0.9rem", lineHeight: 1.6, whiteSpace: "pre-wrap",
              ...(m.role === "user"
                ? { background: "linear-gradient(135deg,#00e5a0,#00c98a)", color: "#080b10", fontWeight: 500 }
                : { background: "#141e2e", color: "#f0f4f8", border: "1px solid #1a2332" }),
            }}>{m.content}</div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg,#00e5a0,#00b4d8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#080b10", fontWeight: 900, fontSize: "0.6875rem",
            }}>F</div>
            <div style={{ background: "#141e2e", border: "1px solid #1a2332", borderRadius: "18px 18px 18px 4px", padding: "0.875rem 1rem" }}>
              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                {[0, 0.2, 0.4].map((d) => (
                  <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#00e5a0", animation: "pulse-dot 1.2s ease-in-out infinite", animationDelay: `${d}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", padding: "0 1.25rem 0.75rem" }}>
          {QUICK.map((q) => (
            <button key={q} onClick={() => send(q)} style={{
              background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)",
              color: "#00e5a0", borderRadius: 999, padding: "0.375rem 0.875rem",
              fontSize: "0.75rem", cursor: "pointer",
            }}>{q}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{
        display: "flex", gap: "0.625rem", padding: "0.75rem 1.25rem 1rem",
        borderTop: "1px solid #0f1922",
      }}>
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre treino, dieta..."
          className="field" style={{ flex: 1, fontSize: "0.875rem" }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary"
          style={{ padding: "0.75rem 1rem", opacity: loading || !input.trim() ? 0.5 : 1, flexShrink: 0 }}>↑</button>
      </form>
    </div>
  );
}
