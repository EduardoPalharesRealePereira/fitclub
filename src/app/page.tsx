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
    title: "Zero visibilidade do progresso",
    desc: "Você não sabe o que funciona. Sem dados claros, fica repetindo o mesmo erro semana após semana.",
  },
];

const features = [
  {
    icon: "⚡",
    title: "Treinos inteligentes",
    desc: "IA que adapta sua rotina ao seu nível, objetivos e tempo disponível — direto no seu bolso.",
  },
  {
    icon: "🏆",
    title: "Desafios em comunidade",
    desc: "Compete e colabora com pessoas reais. Streaks, rankings e conquistas que mantêm você no jogo.",
  },
  {
    icon: "📈",
    title: "Progresso que você vê",
    desc: "Métricas visuais de evolução: força, resistência, composição corporal e bem-estar mental.",
  },
  {
    icon: "🧠",
    title: "Wellness 360°",
    desc: "Além do físico: sono, nutrição, meditação e saúde mental integrados em um único app.",
  },
];

const stats = [
  { value: "50k+", label: "Atletas ativos" },
  { value: "2.1M", label: "Treinos realizados" },
  { value: "94%", label: "Taxa de retenção" },
  { value: "4.9★", label: "Avaliação nas lojas" },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#080b10" }}>
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(8, 11, 16, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,229,160,0.08)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-black"
            style={{ background: "linear-gradient(135deg, #00e5a0, #00b4d8)", color: "#080b10" }}
          >
            F
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: "#f0f4f8" }}>
            FitClub
          </span>
        </div>
        <a href="#auth" className="btn-primary px-5 py-2 rounded-xl text-sm hidden sm:block">
          Começar grátis
        </a>
      </nav>

      {/* Hero */}
      <section className="grid-bg relative pt-32 pb-24 px-6 overflow-hidden">
        <div
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,229,160,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute top-40 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,180,216,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
              style={{
                background: "rgba(0,229,160,0.1)",
                border: "1px solid rgba(0,229,160,0.25)",
                color: "#00e5a0",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#00e5a0" }} />
              App #1 de fitness com comunidade no Brasil
            </div>

            <h1
              className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-6"
              style={{ color: "#f0f4f8" }}
            >
              Seu melhor eu{" "}
              <span className="gradient-text block">começa aqui.</span>
            </h1>

            <p className="text-lg leading-relaxed mb-10" style={{ color: "#8b9bb4" }}>
              FitClub une tecnologia adaptativa, comunidade real e dados inteligentes para
              transformar sua jornada de fitness e wellness — sem achismos, sem abandono.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#auth" className="btn-primary px-8 py-4 rounded-xl text-base text-center">
                Começar grátis →
              </a>
              <a href="#features" className="btn-ghost px-8 py-4 rounded-xl text-base text-center">
                Como funciona
              </a>
            </div>

            <div className="flex items-center gap-4 mt-10">
              <div className="flex -space-x-2">
                {["💪", "🔥", "⚡", "🏃"].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm border-2"
                    style={{ background: "#0d1520", borderColor: "#1a2332" }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <p className="text-sm" style={{ color: "#8b9bb4" }}>
                <span style={{ color: "#00e5a0", fontWeight: 700 }}>+50.000</span> atletas já
                transformaram seus resultados
              </p>
            </div>
          </div>

          {/* Auth panel */}
          <div id="auth">
            <AuthPanel />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: "1px solid #1a2332", borderBottom: "1px solid #1a2332" }}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-black gradient-text mb-1">{s.value}</p>
              <p className="text-sm" style={{ color: "#8b9bb4" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#00e5a0" }}>
              O problema que todo mundo conhece
            </p>
            <h2
              className="text-4xl sm:text-5xl font-black leading-tight mb-5"
              style={{ color: "#f0f4f8" }}
            >
              Por que 80% das pessoas{" "}
              <span className="gradient-text">desistem do fitness?</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#8b9bb4" }}>
              Não é falta de vontade. É falta de sistema. FitClub resolve as três causas raízes do
              abandono.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {painPoints.map((p) => (
              <div
                key={p.title}
                className="card-border rounded-2xl p-8"
                style={{ background: "#0d1520" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: "rgba(0,229,160,0.08)" }}
                >
                  {p.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "#f0f4f8" }}>
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8b9bb4" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-24 px-6 grid-bg"
        style={{ borderTop: "1px solid #1a2332" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#00e5a0" }}>
              A solução FitClub
            </p>
            <h2
              className="text-4xl sm:text-5xl font-black leading-tight"
              style={{ color: "#f0f4f8" }}
            >
              Tudo que você precisa,{" "}
              <span className="gradient-text">em um lugar</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-border rounded-2xl p-7 group"
                style={{ background: "rgba(13, 21, 32, 0.6)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: "rgba(0,229,160,0.1)" }}
                >
                  {f.icon}
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: "#f0f4f8" }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8b9bb4" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="rounded-3xl p-12 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,229,160,0.08) 0%, rgba(0,180,216,0.06) 100%)",
              border: "1px solid rgba(0,229,160,0.2)",
            }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(0,229,160,0.15) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10">
              <h2
                className="text-4xl sm:text-5xl font-black leading-tight mb-5"
                style={{ color: "#f0f4f8" }}
              >
                Pronto para a{" "}
                <span className="gradient-text">transformação?</span>
              </h2>
              <p className="text-lg mb-8" style={{ color: "#8b9bb4" }}>
                Junte-se a mais de 50.000 pessoas que já escolheram consistência sobre motivação.
                Comece grátis hoje.
              </p>
              <a href="#auth" className="btn-primary inline-block px-10 py-4 rounded-xl text-base">
                Criar minha conta grátis →
              </a>
              <p className="text-xs mt-4" style={{ color: "#8b9bb4" }}>
                Sem cartão de crédito · Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6" style={{ borderTop: "1px solid #1a2332" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg, #00e5a0, #00b4d8)", color: "#080b10" }}
            >
              F
            </div>
            <span className="font-bold" style={{ color: "#f0f4f8" }}>
              FitClub
            </span>
          </div>
          <p className="text-xs" style={{ color: "#8b9bb4" }}>
            © 2026 FitClub. Feito com 💪 para a comunidade fitness.
          </p>
          <div className="flex gap-6 text-xs" style={{ color: "#8b9bb4" }}>
            <a href="#" className="hover:text-white transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Termos
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Suporte
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
