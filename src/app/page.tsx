import AuthPanel from "@/components/AuthPanel";

const painPoints = [
  {
    icon: "🗓️",
    title: "Sem consistência",
    desc: "Começar é fácil. Manter é o desafio. A maioria abandona em 3 semanas por falta de estrutura.",
  },
  {
    icon: "🤷",
    title: "Sozinho no processo",
    desc: "Sem comunidade e accountability, as desculpas vencem antes do resultado.",
  },
  {
    icon: "📊",
    title: "Zero visibilidade",
    desc: "Sem dados claros, você repete os mesmos erros semana após semana.",
  },
];

const features = [
  { icon: "⚡", title: "Treinos inteligentes", desc: "IA que adapta sua rotina ao nível e objetivo." },
  { icon: "🏆", title: "Comunidade ativa", desc: "Streaks, rankings e conquistas para te manter no jogo." },
  { icon: "📈", title: "Progresso visível", desc: "Métricas de força, resistência e composição corporal." },
  { icon: "🧠", title: "Wellness 360°", desc: "Sono, nutrição e saúde mental em um único app." },
];

const stats = [
  { value: "50k+", label: "Atletas ativos" },
  { value: "2.1M", label: "Treinos realizados" },
  { value: "94%", label: "Taxa de retenção" },
  { value: "4.9★", label: "Avaliação" },
];

export default function Home() {
  return (
    <main style={{ background: "#080b10", minHeight: "100vh", color: "#f0f4f8" }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.875rem 1.25rem",
        background: "rgba(8,11,16,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,229,160,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
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
      <section className="grid-dots" style={{ paddingTop: "5rem", position: "relative", overflow: "hidden" }}>
        {/* Glow orbs */}
        <div style={{
          position: "absolute", top: "5%", left: "10%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,229,160,0.07) 0%, transparent 70%)",
          filter: "blur(50px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "30%", right: "5%",
          width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,180,216,0.05) 0%, transparent 70%)",
          filter: "blur(50px)", pointerEvents: "none",
        }} />

        {/* Hero content: stacks on mobile, side-by-side on desktop */}
        <div className="hero-inner" style={{
          maxWidth: 1100, margin: "0 auto",
          padding: "2rem 1.25rem 4rem",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2.5rem",
        }}>

          {/* Text col */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.375rem 0.875rem", borderRadius: 999,
              background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.25)",
              color: "#00e5a0", fontSize: "0.7rem", fontWeight: 700, marginBottom: "1.25rem",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", background: "#00e5a0",
                display: "inline-block", animation: "pulse-dot 1.8s ease-in-out infinite",
              }} />
              App #1 de fitness com comunidade no Brasil
            </div>

            <h1 style={{
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              fontWeight: 900, lineHeight: 1.1,
              letterSpacing: "-0.03em", marginBottom: "1rem",
            }}>
              Seu melhor eu{" "}
              <span className="gradient-text">começa aqui.</span>
            </h1>

            <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "#8b9bb4", marginBottom: "1.75rem" }}>
              FitClub une tecnologia adaptativa, comunidade real e dados inteligentes
              para transformar sua jornada fitness — sem achismos, sem abandono.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.75rem" }}>
              <a href="#auth" className="btn-primary" style={{ fontSize: "0.875rem" }}>Começar grátis →</a>
              <a href="#features" className="btn-ghost" style={{ fontSize: "0.875rem" }}>Como funciona</a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ display: "flex" }}>
                {["💪","🔥","⚡","🏃"].map((e, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "#0d1520", border: "2px solid #1a2332",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8125rem", marginLeft: i > 0 ? -9 : 0,
                  }}>{e}</div>
                ))}
              </div>
              <span style={{ fontSize: "0.8125rem", color: "#8b9bb4" }}>
                <strong style={{ color: "#00e5a0" }}>+50.000</strong> atletas transformados
              </span>
            </div>
          </div>

          {/* Auth col */}
          <div id="auth">
            <AuthPanel />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ borderTop: "1px solid #1a2332", borderBottom: "1px solid #1a2332" }}>
        <div className="stats-grid" style={{
          maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.25rem",
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem",
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p className="gradient-text" style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 900, lineHeight: 1.1 }}>{s.value}</p>
              <p style={{ fontSize: "0.8125rem", color: "#8b9bb4", marginTop: "0.25rem" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PAIN POINTS ── */}
      <section style={{ padding: "4rem 1.25rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p className="section-label" style={{ marginBottom: "0.625rem" }}>O problema que todo mundo conhece</p>
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.75rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "0.875rem" }}>
              Por que 80% desistem{" "}
              <span className="gradient-text">do fitness?</span>
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "#8b9bb4", maxWidth: 500, margin: "0 auto" }}>
              Não é falta de vontade. É falta de sistema. FitClub resolve as três causas raízes do abandono.
            </p>
          </div>

          <div className="pain-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            {painPoints.map((p) => (
              <div key={p.title} className="card" style={{ padding: "1.5rem" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: "rgba(0,229,160,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.375rem", marginBottom: "0.875rem",
                }}>{p.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{p.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#8b9bb4", lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="grid-dots" style={{ padding: "4rem 1.25rem", borderTop: "1px solid #1a2332" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p className="section-label" style={{ marginBottom: "0.625rem" }}>A solução FitClub</p>
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.75rem)", fontWeight: 900, lineHeight: 1.15 }}>
              Tudo que você precisa,{" "}
              <span className="gradient-text">em um lugar</span>
            </h2>
          </div>

          <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
            {features.map((f) => (
              <div key={f.title} className="card" style={{ padding: "1.25rem" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(0,229,160,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem", marginBottom: "0.75rem",
                }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: "0.35rem", fontSize: "0.9375rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.8125rem", color: "#8b9bb4", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "4rem 1.25rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            borderRadius: "1.25rem", padding: "3rem 1.25rem",
            background: "linear-gradient(135deg, rgba(0,229,160,0.07) 0%, rgba(0,180,216,0.05) 100%)",
            border: "1px solid rgba(0,229,160,0.18)",
            textAlign: "center", position: "relative", overflow: "hidden",
            boxSizing: "border-box",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 0%, rgba(0,229,160,0.12) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "0.875rem" }}>
                Pronto para a{" "}
                <span className="gradient-text">transformação?</span>
              </h2>
              <p style={{ fontSize: "0.9375rem", color: "#8b9bb4", marginBottom: "1.75rem" }}>
                Junte-se a mais de 50.000 pessoas que escolheram consistência sobre motivação.
              </p>
              <a href="#auth" className="btn-primary" style={{ maxWidth: "100%", width: "fit-content", margin: "0 auto", display: "flex" }}>Criar minha conta grátis →</a>
              <p style={{ fontSize: "0.75rem", color: "#8b9bb4", marginTop: "0.875rem" }}>
                Sem cartão de crédito · Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #1a2332", padding: "2rem 1.25rem" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "1rem", textAlign: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              background: "linear-gradient(135deg,#00e5a0,#00b4d8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#080b10", fontWeight: 900, fontSize: "0.8125rem",
            }}>F</div>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>FitClub</span>
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

      {/* ── RESPONSIVE ── */}
      <style>{`
        /* Mobile first — single column already set inline */

        /* Tablet: 600px+ */
        @media (min-width: 600px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .pain-grid  { grid-template-columns: repeat(3, 1fr) !important; }
        }

        /* Desktop: 900px+ */
        @media (min-width: 900px) {
          .hero-inner { grid-template-columns: 1fr 1fr !important; align-items: center; }
          .feat-grid  { grid-template-columns: repeat(4, 1fr) !important; }
          footer > div { flex-direction: row !important; justify-content: space-between; text-align: left !important; }
        }
      `}</style>
    </main>
  );
}
