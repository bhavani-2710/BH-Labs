import { useEffect, useRef } from "react";
import { ArrowRight, Play, Code, Cpu, FileText, Terminal, Lock, Send } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    background: #FAFAFA;
    color: #09090B;
    overflow-x: hidden;
  }

  ::selection { background: rgba(85, 33, 255, 0.2); }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-14px); }
  }

  .hero-mockup { animation: float 6s ease-in-out infinite; }
  .hero-mockup-wrapper { overflow: hidden; padding-bottom: 24px; }

  .glass-panel {
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(12px);
    border: 1px solid #E4E4E7;
    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  }

  /* ── Nav ── */
  .nav-links { display: flex; gap: 32px; align-items: center; }
  @media (max-width: 768px) { .nav-links { display: none; } }

  .nav-login { background: none; border: none; cursor: pointer; color: #52525B; font-size: 14px; font-family: 'Inter',sans-serif; padding: 8px 16px; }
  @media (max-width: 480px) { .nav-login { display: none; } }

  /* ── Hero heading ── */
  .hero-h1 { font-size: 48px; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 16px; }
  @media (max-width: 768px) { .hero-h1 { font-size: 36px; } }
  @media (max-width: 480px) { .hero-h1 { font-size: 28px; } }

  /* ── Hero subtext ── */
  .hero-sub { font-size: 18px; line-height: 1.6; color: #52525B; max-width: 640px; margin: 0 auto 32px; }
  @media (max-width: 480px) { .hero-sub { font-size: 15px; } }

  /* ── CTA row ── */
  .cta-row { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
  @media (max-width: 480px) {
    .cta-row { flex-direction: column; align-items: stretch; }
    .cta-row button { width: 100%; justify-content: center; }
  }

  /* ── Buttons ── */
  .primary-btn {
    background: #5521FF; color: #fff; border: none; border-radius: 999px;
    padding: 14px 32px; font-family: 'Inter',sans-serif; font-weight: 700; font-size: 18px;
    cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .primary-btn:hover { background: rgba(85,33,255,0.9); box-shadow: 0 8px 24px rgba(85,33,255,0.25); }
  @media (max-width: 480px) { .primary-btn { font-size: 16px; padding: 12px 24px; } }

  .outline-btn {
    background: #fff; color: #09090B; border: 1px solid #E4E4E7; border-radius: 999px;
    padding: 14px 32px; font-family: 'Inter',sans-serif; font-weight: 700; font-size: 18px;
    cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
    transition: background 0.2s;
  }
  .outline-btn:hover { background: #F4F4F5; }
  @media (max-width: 480px) { .outline-btn { font-size: 16px; padding: 12px 24px; } }

  .nav-btn-primary {
    background: #5521FF; color: #fff; border: none; border-radius: 999px;
    padding: 8px 16px; font-family: 'Inter',sans-serif; font-weight: 700; font-size: 14px;
    cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
    transition: background 0.2s, box-shadow 0.2s; white-space: nowrap;
  }
  .nav-btn-primary:hover { background: rgba(85,33,255,0.9); box-shadow: 0 4px 12px rgba(85,33,255,0.3); }

  /* ── Badge ── */
  .badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 4px 16px; border-radius: 999px; border: 1px solid #E4E4E7;
    background: #F4F4F5; font-size: 12px; font-weight: 600; letter-spacing: 0.05em;
    text-transform: uppercase; color: #52525B; margin-bottom: 8px; transition: border-color 0.2s;
  }
  .badge:hover { border-color: rgba(85,33,255,0.5); }
  .badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #5521FF; flex-shrink: 0; }

  /* ── Mockup content area ── */
  .mockup-content { display: flex; height: 600px; }
  @media (max-width: 900px) { .mockup-content { flex-direction: column; height: auto; } }

  .ai-sidebar {
    width: 320px; border-left: 1px solid #E4E4E7;
    background: #FAFAFA; display: flex; flex-direction: column; flex-shrink: 0;
  }
  @media (max-width: 900px) {
    .ai-sidebar { width: 100%; border-left: none; border-top: 1px solid #E4E4E7; }
  }

  /* ── Code editor pane ── */
  .code-pane { flex: 1; background: #fff; padding: 16px; overflow: auto; }
  .code-font { font-family: 'JetBrains Mono', monospace; }

  /* ── Address bar in mockup ── */
  .mock-address { font-size: 12px; color: #52525B; display: flex; align-items: center; gap: 4px; }
  @media (max-width: 600px) { .mock-address { font-size: 10px; } }

  /* ── Feature cards ── */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
  @media (max-width: 900px) { .cards-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
  @media (max-width: 580px) { .cards-grid { grid-template-columns: 1fr; gap: 16px; } }

  .feature-card {
    background: #fff; border: 1px solid #E4E4E7; border-radius: 16px;
    padding: 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  .feature-card:hover { box-shadow: 0 10px 30px rgba(85,33,255,0.1); border-color: #5521FF; }
  .feature-card:hover .icon-box { background: #5521FF; border-color: #5521FF; }
  .feature-card:hover .icon-box svg { color: #fff; }
  @media (max-width: 480px) { .feature-card { padding: 24px; } }

  .icon-box {
    width: 48px; height: 48px; background: rgba(85,33,255,0.1);
    border: 1px solid rgba(85,33,255,0.2); border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px; transition: background 0.2s, border-color 0.2s;
  }
  .icon-box svg { color: #5521FF; transition: color 0.2s; }

  /* ── AI chat ── */
  .ai-bubble {
    background: rgba(85,33,255,0.05); border: 1px solid rgba(85,33,255,0.1);
    border-radius: 8px; padding: 8px 12px; font-size: 14px; color: #52525B; font-style: italic;
  }
  .ai-input {
    width: 100%; background: #fff; border: 1px solid #E4E4E7; border-radius: 999px;
    padding: 8px 44px 8px 16px; font-family: 'Inter',sans-serif; font-size: 14px;
    outline: none; box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ai-input:focus { border-color: #5521FF; box-shadow: 0 0 0 1px #5521FF; }

  /* ── Underglow ── */
  .underglow {
    position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%);
    width: 80%; height: 80px; background: rgba(85,33,255,0.1);
    filter: blur(60px); border-radius: 999px; z-index: -1; pointer-events: none;
  }

  /* ── Footer ── */
  .footer-inner {
    display: flex; flex-wrap: wrap; justify-content: space-between;
    align-items: center; gap: 16px;
  }
  @media (max-width: 600px) {
    .footer-inner { flex-direction: column; align-items: center; text-align: center; }
  }

  .footer-links { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; }
`;

export default function LandingPage({ onStart }) {
  const glowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!glowRef.current) return;
      const dx = (e.clientX - window.innerWidth / 2) / 35;
      const dy = (e.clientY - window.innerHeight / 2) / 35;
      glowRef.current.style.transform = `translate(calc(-50% + ${dx}px), ${dy}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
    "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=100&h=100",
  ];

  const features = [
    { icon: <Code size={26} />, title: "Smart Code Editor", desc: "Integrated Monaco editor with professional-grade syntax highlighting, autocomplete, and real-time execution environments." },
    { icon: <Cpu size={26} />,  title: "Bh.AI Assistant",  desc: "Context-aware AI that understands your specific experiment requirements and helps debug or explain complex concepts instantly." },
    { icon: <FileText size={26} />, title: "Auto Journal", desc: "Generate complete, formatted practical journals with diagrams, observations, and conclusions from your workspace data." },
  ];

  return (
    <>
      <style>{styles}</style>

      {/* ── Nav ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 50,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 24px", height: 64,
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid #E4E4E7",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
            <img src="/logo.png" alt="BH.Lab Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em" }}>BH.Lab</span>
        </div>

        <nav className="nav-links">
          {["Features", "How it works", "Pricing"].map(l => (
            <a key={l} href="#" style={{ color: "#52525B", textDecoration: "none", fontSize: 16 }}
              onMouseEnter={e => e.target.style.color = "#09090B"}
              onMouseLeave={e => e.target.style.color = "#52525B"}
            >{l}</a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onStart} className="nav-login">Login</button>
          <button onClick={onStart} className="nav-btn-primary">
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ position: "relative", paddingTop: 128, paddingBottom: 48, overflow: "hidden" }}>

        {/* Ambient glow */}
        <div ref={glowRef} style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 800, height: 600, background: "rgba(85,33,255,0.05)",
          filter: "blur(120px)", borderRadius: "50%", zIndex: -1, pointerEvents: "none",
        }} />

        {/* ── Hero ── */}
        <section style={{ maxWidth: 1024, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div className="badge"><span className="badge-dot" />AI-Powered Practical Platform</div>

          <h1 className="hero-h1">
            Complete Your Practicals <br />
            <span style={{ background: "linear-gradient(to right, #09090B, #5521FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              The Smart Way
            </span>
          </h1>

          <p className="hero-sub">
            The ultimate engineering portal for modern students. Streamline your lab work with AI assistance,
            real-time code execution, and automated journal generation.
          </p>

          <div className="cta-row">
            <button onClick={onStart} className="primary-btn">Start for Free <ArrowRight size={20} /></button>
            <button onClick={onStart} className="outline-btn"><Play size={20} fill="#09090B" /> Watch Demo</button>
          </div>

          {/* Avatars */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex" }}>
              {avatars.map((src, i) => (
                <img key={i} src={src} alt="Student" style={{
                  width: 40, height: 40, borderRadius: "50%", border: "2px solid #fff",
                  objectFit: "cover", marginLeft: i === 0 ? 0 : -12,
                }} />
              ))}
            </div>
            <p style={{ fontSize: 14, color: "#52525B" }}>
              Joined by <strong style={{ color: "#5521FF" }}>1,200+</strong> engineering students this week
            </p>
          </div>
        </section>

        {/* ── Hero Mockup ── */}
        <section style={{ maxWidth: 1280, margin: "64px auto 0", padding: "0 24px" }}>
          <div className="hero-mockup-wrapper">
          <div style={{ position: "relative" }} className="hero-mockup">
            <div className="glass-panel" style={{ borderRadius: 16, overflow: "hidden", position: "relative", zIndex: 10 }}>

              {/* Title bar */}
              <div style={{
                height: 40, borderBottom: "1px solid #E4E4E7",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 16px", background: "#FAFAFA", flexShrink: 0,
              }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {["rgba(239,68,68,0.6)", "rgba(161,81,0,0.6)", "rgba(85,33,255,0.6)"].map((bg, i) => (
                    <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: bg }} />
                  ))}
                </div>
                <div className="code-font mock-address">
                  <Lock size={12} /> bh-workspace.lab/p/digital-electronics-01
                </div>
                <div style={{ width: 48 }} />
              </div>

              {/* Editor + AI pane */}
              <div className="mockup-content">

                {/* Code pane */}
                <div className="code-pane code-font">
                  <div style={{
                    display: "flex", gap: 16, color: "#52525B", fontSize: 14,
                    borderBottom: "1px solid #E4E4E7", marginBottom: 16,
                  }}>
                    <span style={{ color: "#5521FF", borderBottom: "2px solid #5521FF", fontWeight: 700, padding: "0 8px 8px" }}>main.py</span>
                    <span style={{ padding: "0 8px 8px" }}>logic_gates.vhd</span>
                    <span style={{ padding: "0 8px 8px" }}>report.md</span>
                  </div>

                  <div style={{ fontSize: 14, lineHeight: 1.6, color: "#24292e" }}>
                    <div><span style={{ color: "#d73a49" }}>import</span> numpy <span style={{ color: "#d73a49" }}>as</span> np</div>
                    <div><span style={{ color: "#d73a49" }}>from</span> lab_lib <span style={{ color: "#d73a49" }}>import</span> SignalAnalyzer</div>
                    <br />
                    <div style={{ color: "#6a737d" }}># Define input signals for NOR gate simulation</div>
                    <div>input_a = [<span style={{ color: "#005cc5" }}>0</span>, <span style={{ color: "#005cc5" }}>0</span>, <span style={{ color: "#005cc5" }}>1</span>, <span style={{ color: "#005cc5" }}>1</span>]</div>
                    <div>input_b = [<span style={{ color: "#005cc5" }}>0</span>, <span style={{ color: "#005cc5" }}>1</span>, <span style={{ color: "#005cc5" }}>0</span>, <span style={{ color: "#005cc5" }}>1</span>]</div>
                    <br />
                    <div>analyzer = SignalAnalyzer()</div>
                    <div>results = analyzer.calculate_nor(input_a, input_b)</div>
                    <br />
                    <div><span style={{ color: "#6f42c1" }}>print</span>(<span style={{ color: "#032f62" }}>f"Output Vector: {"{results}"}"</span>)</div>
                    <div style={{ marginTop: 16, padding: 16, background: "#F4F4F5", borderRadius: 8, border: "1px solid #E4E4E7" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#52525B", marginBottom: 4 }}>Terminal Output:</div>
                      <div style={{ color: "#5521FF", fontWeight: 600 }}>Running simulation...</div>
                      <div style={{ color: "#09090B" }}>Output Vector: [1, 0, 0, 0]</div>
                    </div>
                  </div>
                </div>

                {/* AI sidebar */}
                <div className="ai-sidebar">
                  <div style={{ padding: 16, borderBottom: "1px solid #E4E4E7", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20, color: "#5521FF" }}>✨</span>
                    <span style={{ fontWeight: 700 }}>BH.AI Assistant</span>
                  </div>
                  <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="ai-bubble">
                      "I've analyzed your logic table. It matches a standard NOR configuration.
                      Would you like me to generate the truth table for your journal?"
                    </div>
                    <div style={{ marginTop: "auto", position: "relative" }}>
                      <input className="ai-input" type="text" placeholder="Ask AI anything..." />
                      <button style={{
                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#5521FF", display: "flex", alignItems: "center",
                      }}>
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="underglow" />
          </div>
          </div>
        </section>

        {/* ── Feature Cards ── */}
        <section style={{ maxWidth: 1280, margin: "64px auto 0", padding: "0 24px" }}>
          <div className="cards-grid">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div className="icon-box">{icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "#52525B" }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: "#fff", borderTop: "1px solid #E4E4E7", padding: "32px 24px", marginTop: 64 }}>
        <div className="footer-inner">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                <img src="/logo.png" alt="BH.Lab Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>BH.Lab</span>
            </div>
            <p style={{ fontSize: 14, color: "#52525B" }}>© 2026 BH.Lab Engineering. All rights reserved.</p>
          </div>
          <div className="footer-links">
            {["Resources", "Documentation", "Privacy Policy", "Terms"].map(l => (
              <a key={l} href="#" style={{ fontSize: 14, color: "#52525B", textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#5521FF"}
                onMouseLeave={e => e.target.style.color = "#52525B"}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}