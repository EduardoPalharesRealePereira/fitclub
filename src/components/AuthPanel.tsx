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
      else setMessage({ type: "success", text: "Login realizado! Redirecionando..." });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) setMessage({ type: "error", text: error.message });
      else
        setMessage({
          type: "success",
          text: "Conta criada! Verifique seu email para confirmar.",
        });
    }

    setLoading(false);
  }

  return (
    <div
      id="auth"
      className="card-border rounded-2xl p-8"
      style={{ background: "rgba(13, 21, 32, 0.85)", backdropFilter: "blur(16px)" }}
    >
      {/* Tab toggle */}
      <div
        className="flex rounded-xl p-1 mb-8"
        style={{ background: "rgba(8, 11, 16, 0.8)", border: "1px solid #1a2332" }}
      >
        {(["login", "register"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setMessage(null); }}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
            style={
              mode === m
                ? {
                    background: "linear-gradient(135deg, #00e5a0, #00c98a)",
                    color: "#080b10",
                    boxShadow: "0 4px 16px rgba(0,229,160,0.3)",
                  }
                : { color: "#8b9bb4" }
            }
          >
            {m === "login" ? "Entrar" : "Criar conta"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === "register" && (
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "#8b9bb4" }}>
              Nome completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              className="input-field w-full px-4 py-3 rounded-xl text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: "#8b9bb4" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="input-field w-full px-4 py-3 rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: "#8b9bb4" }}>
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "register" ? "Mínimo 8 caracteres" : "••••••••"}
            required
            minLength={mode === "register" ? 8 : 6}
            className="input-field w-full px-4 py-3 rounded-xl text-sm"
          />
        </div>

        {message && (
          <div
            className="px-4 py-3 rounded-xl text-sm font-medium"
            style={{
              background:
                message.type === "success"
                  ? "rgba(0, 229, 160, 0.1)"
                  : "rgba(255, 80, 80, 0.1)",
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
          className="btn-primary w-full py-3.5 rounded-xl text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading
            ? "Aguarde..."
            : mode === "login"
            ? "Entrar no FitClub"
            : "Começar agora — grátis"}
        </button>
      </form>

      {mode === "login" && (
        <p className="text-center text-xs mt-5" style={{ color: "#8b9bb4" }}>
          Esqueceu a senha?{" "}
          <button className="cursor-pointer" style={{ color: "#00e5a0" }}>
            Recuperar acesso
          </button>
        </p>
      )}

      <p className="text-center text-xs mt-4" style={{ color: "#8b9bb4" }}>
        {mode === "login" ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
        <button
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(null); }}
          className="font-semibold cursor-pointer"
          style={{ color: "#00e5a0" }}
        >
          {mode === "login" ? "Criar agora" : "Entrar"}
        </button>
      </p>
    </div>
  );
}
