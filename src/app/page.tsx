import AuthPanel from "@/components/AuthPanel";

const painPoints = [
  {
    icon: "🗓️",
    title: "Sem consistência",
    desc: "Começar é fácil. Manter é o desafio. A maioria abandona em 3 semanas por falta de estrutura e motivação.",
  },
  {
    icon: "🤷",
    title: "Sozinho no processo",
    desc: "Treinar sem comunidade é difícil. Sem accountability, as desculpas vencem antes do resultado.",
  },
  {
    icon: "📊",
    title: "Zero visibilidade",
    desc: "Você não sabe o que funciona. Sem dados claros, fica repetindo o mesmo erro semana após semana.",
  },
];

const features = [
  { icon: "⚡", title: "Treinos inteligentes", desc: "IA que adapta sua rotina ao nível, objetivo e tempo disponível." },
  { icon: "🏆", title: "Desafios em comunidade", desc: "Streaks, rankings e conquistas que mantêm você no jogo." },
  { icon: "📈", title: "Progresso visível", desc: "Métricas de força, resistência, composição corporal e bem-estar." },
  { icon: "🧠", title: "Wellness 360°", desc: "Sono, nutrição, meditação e saúde mental em um único app." },
];

const stats = [
  { value: "50k+", label: "Atletas ativos" },
  { value: "2.1M", label: "Treinos realizados" },
  { value: "94%", label: "Taxa de retenção" },
  { value: "4.9★", label: "Avaliação nas lojas" },
];

export default function Home() {
  return (
    <main style={{ background: "#080b10", minHeight: "100vh", color: "#f0f4f8" }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 1.5rem",
        background: "rgba(8,11,16,0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,229,160,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "linear-gradient(135deg,#00e5a0,#00b4d8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#080b10", fontWeight: 900, fontSize: "1rem",
          }}>F</div>
          <span style={{ fontWeight: 800, fontSize: "1.125rem", letterSpacing: "-0.02em" }}>FitClub</span>
        </div>
        <a href="#auth" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}>
          Começar grátis
        </a>
      </header>

      {/* ── HERO ── */}
      <section
        className="grid-dots"
        style={{ paddingTop: "7rem", paddingBottom: "5rem", position: "relative", overflow: "hidden" }}
      >
        {/* Glow orbs */}
        <div style={{
          position: "absolute", top: "10%", left: "20%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,229,160,0.07) 0%, transparent 70%)",
          filter: "blur(50px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "30%", right: "15%",
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,180,216,0.05) 0%, transparent 70%)",
          filter: "blur(50px)", pointerEvents: "none",
        }} />

        <div className="hero-inner" style={{
          maxWidth: 1152, margin: "0 auto",
          padding: "0 1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "3rem",
        }}>
          {/* Text col */}
          <div style={{ maxWidth: 580 }}>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.375rem 1rem", borderRadius: 999,
              background: "rgba(0,229,160,0.1)",
              border: "1px solid rgba(0,229,160,0.25)",
              color: "#00e5a0", fontSize: "0.75rem", fontWeight: 700,
              marginBottom: "1.5rem",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#00e5a0", display: "inline-block",
                animation: "pulse-dot 1.8s ease-in-out infinite",
              }} />
              App #1 de fitness com comunidade no Brasil
            </div>

            <h1 style={{
              fontSize: "clamp(2.4rem, 5vw, 3.75rem)",
              fontWeight: 900, lineHeight: 1.08,
              letterSpacing: "-0.03em", marginBottom: "1.25rem",
            }}>
              Seu melhor eu{" "}
              <span className="gradient-text">começa aqui.</span>
            </h1>

            <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: "#8b9bb4", marginBottom: "2rem", maxWidth: 480 }}>
              FitClub une tecnologia adaptativa, comunidade real e dados inteligentes para
              transformar sua jornada de fitness e wellness — sem achismos, sem abandono.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem" }}>
              <a href="#auth" className="btn-primary">Começar grátis →</a>
              <a href="#features" className="btn-ghost">Como funciona</a>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ display: "flex" }}>
                {["💪","🔥","⚡","🏃"].map((e, i) => (
                  <div key={i} style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "#0d1520", border: "2px solid #1a2332",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.875rem", marginLeft: i > 0 ? -10 : 0,
                  }}>{e}</div>
                ))}
              </div>
              <span style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>
                <strong style={{ color: "#00e5a0" }}>+50.000</strong> atletas transformados
              </span>
            </div>
          </div>

          {/* Auth col */}
          <div id="auth" style={{ width: "100%", maxWidth: 460 }}>
            <AuthPanel />
          </div>
        </div>

        {/* responsive grid: side-by-side on large screens */}
        <style>{`
          @media (min-width: 960px) {
            .hero-grid { grid-template-columns: 1fr 1fr !important; align-items: center; }
          }
        `}</style>
      </section>

      {/* ── STATS ── */}
      <section style={{ borderTop: "1px solid #1a2332", borderBottom: "1px solid #1a2332" }}>
        <div className="stats-grid" style={{
          maxWidth: 1152, margin: "0 auto", padding: "3.5rem 1.5rem",
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem",
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p className="gradient-text" style={{ fontSize: "2.25rem", fontWeight: 900, lineHeight: 1.1 }}>{s.value}</p>
              <p style={{ fontSize: "0.8125rem", color: "#8b9bb4", marginTop: "0.25rem" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PAIN POINTS ── */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>O problema que todo mundo conhece</p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem" }}>
              Por que 80% das pessoas{" "}
              <span className="gradient-text">desistem do fitness?</span>
            </h2>
            <p style={{ fontSize: "1rem", color: "#8b9bb4", maxWidth: 520, margin: "0 auto" }}>
              Não é falta de vontade. É falta de sistema. FitClub resolve as três causas raízes do abandono.
            </p>
          </div>

          <div className="pain-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            {painPoints.map((p) => (
              <div key={p.title} className="card" style={{ padding: "1.75rem" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: "rgba(0,229,160,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", marginBottom: "1rem",
                }}>{p.icon}</div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.5rem" }}>{p.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#8b9bb4", lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        id="features"
        className="grid-dots"
        style={{ padding: "5rem 1.5rem", borderTop: "1px solid #1a2332" }}
      >
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>A solução FitClub</p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.15 }}>
              Tudo que você precisa,{" "}
              <span className="gradient-text">em um lugar</span>
            </h2>
          </div>

          <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            {features.map((f) => (
              <div key={f.title} className="card" style={{ padding: "1.5rem" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: "rgba(0,229,160,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.375rem", marginBottom: "0.875rem",
                }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: "0.375rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#8b9bb4", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            borderRadius: "1.5rem", padding: "3.5rem 2rem",
            background: "linear-gradient(135deg, rgba(0,229,160,0.07) 0%, rgba(0,180,216,0.05) 100%)",
            border: "1px solid rgba(0,229,160,0.18)",
            textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 0%, rgba(0,229,160,0.12) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem" }}>
                Pronto para a{" "}
                <span className="gradient-text">transformação?</span>
              </h2>
              <p style={{ fontSize: "1rem", color: "#8b9bb4", marginBottom: "2rem", maxWidth: 440, margin: "0 auto 2rem" }}>
                Junte-se a mais de 50.000 pessoas que escolheram consistência sobre motivação.
              </p>
              <a href="#auth" className="btn-primary">Criar minha conta grátis →</a>
              <p style={{ fontSize: "0.75rem", color: "#8b9bb4", marginTop: "1rem" }}>
                Sem cartão de crédito · Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #1a2332", padding: "2.5rem 1.5rem" }}>
        <div style={{
          maxWidth: 1152, margin: "0 auto",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "1.25rem",
          textAlign: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: "linear-gradient(135deg,#00e5a0,#00b4d8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#080b10", fontWeight: 900, fontSize: "0.875rem",
            }}>F</div>
            <span style={{ fontWeight: 700 }}>FitClub</span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#8b9bb4" }}>
            © 2026 FitClub. Feito com 💪 para a comunidade fitness.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacidade", "Termos", "Suporte"].map((l) => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* Responsive overrides */}
      <style>{`
        @media (min-width: 640px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .pain-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .feat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          footer > div { flex-direction: row !important; justify-content: space-between; text-align: left; }
        }
        @media (min-width: 900px) {
          .hero-inner { grid-template-columns: 1fr 1fr !important; align-items: center; }
          .feat-grid { grid-template-columns: repeat(4, 1fr) !important; }
          #auth { max-width: 100% !important; }
        }
      `}</style>
    </main>
  );
}
