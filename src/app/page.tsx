import AuthPanel from "@/components/AuthPanel";

export default function Home() {
  return (
    <div style={{ background: "#080b10", minHeight: "100vh", color: "#f0f4f8", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.875rem 1.5rem",
        background: "rgba(8,11,16,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid #0f1922",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg,#00e5a0,#00b4d8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#080b10", fontWeight: 900, fontSize: "1rem",
          }}>F</div>
          <span style={{ fontWeight: 800, fontSize: "1.0625rem", letterSpacing: "-0.02em" }}>FitClub</span>
        </div>
        <a href="#auth" className="btn-primary" style={{ padding: "0.5rem 1.125rem", fontSize: "0.8125rem" }}>
          Começar grátis
        </a>
      </header>

      {/* ── HERO ── */}
      <section style={{ paddingTop: "5rem", minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
          <div className="hero-inner" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem", alignItems: "center" }}>

            {/* Left — text */}
            <div>
              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.35rem 0.875rem", borderRadius: 999,
                background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)",
                color: "#00e5a0", fontSize: "0.75rem", fontWeight: 700, marginBottom: "1.5rem",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5a0", display: "inline-block", animation: "pulse-dot 1.8s ease-in-out infinite" }} />
                Personal trainer + nutricionista com IA
              </div>

              <h1 style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900,
                lineHeight: 1.06, letterSpacing: "-0.04em", marginBottom: "1.25rem",
              }}>
                Seu corpo.<br />
                <span className="gradient-text">Seu plano.</span><br />
                Sua evolução.
              </h1>

              <p style={{ fontSize: "1.0625rem", color: "#8b9bb4", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 440 }}>
                FitClub usa inteligência artificial para criar treinos e dietas 100% personalizados para o seu corpo, objetivo e rotina.
              </p>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
                <a href="#auth" className="btn-primary">Criar conta grátis →</a>
                <a href="#como-funciona" className="btn-ghost">Ver como funciona</a>
              </div>

              {/* Social proof */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex" }}>
                  {["💪","🔥","⚡","🏃","🧠"].map((e, i) => (
                    <div key={i} style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "#0d1520", border: "2px solid #0f1922",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.8125rem", marginLeft: i > 0 ? -9 : 0,
                    }}>{e}</div>
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700 }}>+50.000 atletas</p>
                  <p style={{ fontSize: "0.75rem", color: "#8b9bb4" }}>já transformaram seu corpo</p>
                </div>
              </div>
            </div>

            {/* Right — App mockup */}
            <div id="auth" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Auth panel */}
              <AuthPanel />

              {/* Mini stats below auth */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem" }}>
                {[
                  { value: "50k+", label: "Atletas" },
                  { value: "4.9★", label: "Avaliação" },
                  { value: "94%", label: "Retêm" },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: "#0d1520", border: "1px solid #1a2332",
                    borderRadius: 12, padding: "0.75rem", textAlign: "center",
                  }}>
                    <p style={{ fontSize: "1rem", fontWeight: 900, color: "#00e5a0" }}>{s.value}</p>
                    <p style={{ fontSize: "0.6875rem", color: "#8b9bb4", marginTop: "0.125rem" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" style={{ padding: "5rem 1.5rem", borderTop: "1px solid #0f1922" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#00e5a0", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>Como funciona</p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
              3 passos para<br /><span className="gradient-text">mudar de vida</span>
            </h2>
          </div>

          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            {[
              {
                step: "01",
                icon: "👤",
                title: "Crie seu perfil",
                desc: "Informe seu peso, altura, objetivo e nível de experiência. Leva menos de 2 minutos.",
              },
              {
                step: "02",
                icon: "🤖",
                title: "IA monta seu plano",
                desc: "Nossa IA gera treino semanal e dieta completa 100% personalizados para você.",
              },
              {
                step: "03",
                icon: "📈",
                title: "Execute e evolua",
                desc: "Siga o plano, tire dúvidas no chat e regenere sempre que quiser mudar.",
              },
            ].map((item, i) => (
              <div key={i} style={{
                background: "#0d1520", border: "1px solid #1a2332",
                borderRadius: 20, padding: "1.5rem",
                display: "flex", gap: "1.25rem", alignItems: "flex-start",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
                }}>{item.icon}</div>
                <div>
                  <p style={{ fontSize: "0.625rem", fontWeight: 800, color: "#00e5a0", letterSpacing: "0.1em", marginBottom: "0.375rem" }}>PASSO {item.step}</p>
                  <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "0.375rem" }}>{item.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#8b9bb4", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #0f1922", background: "rgba(13,21,32,0.4)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#00e5a0", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>O que você tem</p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
              Tudo que você precisa,<br /><span className="gradient-text">em um app</span>
            </h2>
          </div>

          <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.875rem" }}>
            {[
              { icon: "🤖", title: "IA Personal Trainer", desc: "Chat direto com IA especialista em treino e nutrição, disponível 24h." },
              { icon: "💪", title: "Ficha de treino", desc: "Treino semanal completo gerado por IA, com exercícios, séries e dicas." },
              { icon: "🥗", title: "Plano alimentar", desc: "Dieta personalizada com macros, refeições e horários definidos." },
              { icon: "📊", title: "Macros e calorias", desc: "Proteína, carboidrato e gordura balanceados para o seu objetivo." },
            ].map((f) => (
              <div key={f.title} style={{
                background: "#0d1520", border: "1px solid #1a2332",
                borderRadius: 18, padding: "1.25rem",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: "rgba(0,229,160,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem", marginBottom: "0.75rem",
                }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.375rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.8125rem", color: "#8b9bb4", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #0f1922" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(0,229,160,0.08), rgba(0,180,216,0.05))",
            border: "1px solid rgba(0,229,160,0.15)", borderRadius: 24, padding: "3rem 1.5rem",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚀</div>
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "0.875rem" }}>
              Pronto para começar?
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "#8b9bb4", marginBottom: "2rem", lineHeight: 1.6 }}>
              Crie sua conta grátis e tenha seu treino e dieta prontos em menos de 1 minuto.
            </p>
            <a href="#auth" className="btn-primary" style={{ margin: "0 auto", display: "inline-flex" }}>
              Criar minha conta →
            </a>
            <p style={{ fontSize: "0.75rem", color: "#8b9bb4", marginTop: "1rem" }}>
              Sem cartão de crédito · Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #0f1922", padding: "1.5rem" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: "1rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: "linear-gradient(135deg,#00e5a0,#00b4d8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#080b10", fontWeight: 900, fontSize: "0.8125rem",
            }}>F</div>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>FitClub</span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#4a5568" }}>© 2026 FitClub. Todos os direitos reservados.</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacidade", "Termos", "Suporte"].map((l) => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── RESPONSIVE ── */}
      <style>{`
        @media (min-width: 860px) {
          .hero-inner { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .feat-grid  { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
