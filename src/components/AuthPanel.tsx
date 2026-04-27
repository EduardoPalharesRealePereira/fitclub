"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register";

export default function AuthPanel() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage({ type: "error", text: error.message });
      else setMessage({ type: "success", text: "Bem-vindo de volta! 💪" });
    } else {
      // Usa Edge Function para criar usuário sem email de confirmação
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, full_name: name }),
        }
      );
      const data = await res.json();

      if (!res.ok || data.error) {
        setMessage({ type: "error", text: data.error ?? "Erro ao criar conta." });
      } else {
        // Seta a sessão recebida da Edge Function
        if (data.session) {
          await supabase.auth.setSession(data.session);
        }
        setMessage({ type: "success", text: "Conta criada! Bem-vindo ao FitClub 🎉" });
      }
    }

    setLoading(false);
  }

  return (
    <div
      className="card"
      style={{ padding: "2rem", backdropFilter: "blur(16px)" }}
    >
      {/* Toggle */}
      <div
        style={{
          display: "flex",
          background: "rgba(8,11,16,0.9)",
          border: "1px solid #1a2332",
          borderRadius: "0.75rem",
          padding: "4px",
          marginBottom: "1.75rem",
        }}
      >
        {(["login", "register"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setMessage(null); }}
            style={{
              flex: 1,
              padding: "0.625rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              transition: "all 0.2s",
              ...(mode === m
                ? {
                    background: "linear-gradient(135deg, #00e5a0, #00c98a)",
                    color: "#080b10",
                    boxShadow: "0 4px 14px rgba(0,229,160,0.3)",
                  }
                : { background: "transparent", color: "#8b9bb4" }),
            }}
          >
            {m === "login" ? "Entrar" : "Criar conta"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {mode === "register" && (
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "#8b9bb4", marginBottom: "0.5rem" }}>
              Nome completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              className="field"
            />
          </div>
        )}

        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "#8b9bb4", marginBottom: "0.5rem" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="field"
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "#8b9bb4", marginBottom: "0.5rem" }}>
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "register" ? "Mínimo 8 caracteres" : "••••••••"}
            required
            minLength={mode === "register" ? 8 : 6}
            className="field"
          />
        </div>

        {message && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              background: message.type === "success" ? "rgba(0,229,160,0.1)" : "rgba(255,80,80,0.1)",
              border: `1px solid ${message.type === "success" ? "rgba(0,229,160,0.3)" : "rgba(255,80,80,0.3)"}`,
              color: message.type === "success" ? "#00e5a0" : "#ff6b6b",
            }}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{
            width: "100%",
            marginTop: "0.25rem",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Aguarde..." : mode === "login" ? "Entrar no FitClub" : "Começar agora — grátis"}
        </button>
      </form>

      {mode === "login" && (
        <p style={{ textAlign: "center", fontSize: "0.75rem", marginTop: "1.25rem", color: "#8b9bb4" }}>
          Esqueceu a senha?{" "}
          <button style={{ background: "none", border: "none", color: "#00e5a0", cursor: "pointer", fontWeight: 600 }}>
            Recuperar acesso
          </button>
        </p>
      )}

      <p style={{ textAlign: "center", fontSize: "0.75rem", marginTop: "1rem", color: "#8b9bb4" }}>
        {mode === "login" ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
        <button
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(null); }}
          style={{ background: "none", border: "none", color: "#00e5a0", cursor: "pointer", fontWeight: 700 }}
        >
          {mode === "login" ? "Criar agora" : "Entrar"}
        </button>
      </p>
    </div>
  );
}
