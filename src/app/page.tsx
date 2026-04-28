import AuthPanel from "@/components/AuthPanel";

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#080b10",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background glow */}
      <div style={{
        position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,229,160,0.07) 0%, transparent 65%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "10%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,180,216,0.05) 0%, transparent 65%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      {/* Card container */}
      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #00e5a0, #00b4d8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem",
            boxShadow: "0 8px 32px rgba(0,229,160,0.25)",
          }}>
            <span style={{ color: "#080b10", fontWeight: 900, fontSize: "1.5rem" }}>F</span>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.375rem" }}>
            FitClub
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#8b9bb4" }}>
            Seu personal trainer com IA
          </p>
        </div>

        {/* Auth */}
        <AuthPanel />

      </div>
    </main>
  );
}
