import { useEffect, useRef } from "react";
import { ArrowRight, Play, Code, Cpu, FileText, Lock, Send } from "lucide-react";

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
    <div className="selection:bg-[#5521FF]/20 font-sans bg-[#FAFAFA] text-[#09090B] min-h-screen overflow-x-hidden">
      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/85 backdrop-blur-[20px] border-b border-[#E4E4E7]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            <img src="/logo.png" alt="BH.Lab Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-[22px] tracking-[-0.02em]">BH.Lab</span>
        </div>

        <nav className="flex gap-8 items-center max-md:hidden">
          {["Features", "How it works", "Pricing"].map(l => (
            <a key={l} href="#" className="text-[#52525B] no-underline text-base hover:text-[#09090B] transition-colors duration-150">{l}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={onStart} className="bg-none border-none cursor-pointer text-[#52525B] text-sm font-sans px-4 py-2 hover:text-[#09090B] max-[480px]:hidden">Login</button>
          <button onClick={onStart} className="bg-[#5521FF] text-white border-none rounded-full px-4 py-2 font-sans font-bold text-sm cursor-pointer inline-flex items-center gap-2 transition-all hover:bg-[#5521FF]/90 hover:shadow-[0_4px_12px_rgba(85,33,255,0.3)] whitespace-nowrap">
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative pt-32 pb-12 overflow-hidden">

        {/* Ambient glow */}
        <div ref={glowRef} className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#5521FF]/5 blur-[120px] rounded-full -z-10 pointer-events-none" style={{ transform: "translate(-50%, 0)" }} />

        {/* ── Hero ── */}
        <section className="max-w-[1024px] mx-auto px-6 text-center">
          <div className="badge inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#E4E4E7] bg-[#F4F4F5] text-xs font-semibold tracking-wider uppercase text-[#52525B] mb-2 transition-colors hover:border-[#5521FF]/50">
            <span className="w-2 h-2 rounded-full bg-[#5521FF] shrink-0" />
            AI-Powered Practical Platform
          </div>

          <h1 className="text-[48px] max-md:text-[36px] max-[480px]:text-[28px] font-bold leading-[1.1] tracking-[-0.02em] mb-4">
            Complete Your Practicals <br />
            <span className="bg-gradient-to-r from-[#09090B] to-[#5521FF] bg-clip-text text-transparent">
              The Smart Way
            </span>
          </h1>

          <p className="text-[18px] max-[480px]:text-[15px] leading-[1.6] text-[#52525B] max-w-[640px] mx-auto mb-8">
            The ultimate engineering portal for modern students. Streamline your lab work with AI assistance,
            real-time code execution, and automated journal generation.
          </p>

          <div className="flex justify-center gap-4 flex-wrap mb-8 max-[480px]:flex-col max-[480px]:items-stretch">
            <button onClick={onStart} className="bg-[#5521FF] text-white border-none rounded-full px-8 py-3.5 font-sans font-bold text-[18px] cursor-pointer inline-flex items-center gap-2 transition-all hover:bg-[#5521FF]/90 hover:shadow-[0_8px_24px_rgba(85,33,255,0.25)] max-[480px]:text-[16px] max-[480px]:px-6 max-[480px]:py-3 max-[480px]:w-full max-[480px]:justify-center">Start for Free <ArrowRight size={20} /></button>
            <button onClick={onStart} className="bg-white text-[#09090B] border border-[#E4E4E7] rounded-full px-8 py-3.5 font-sans font-bold text-[18px] cursor-pointer inline-flex items-center gap-2 transition-colors hover:bg-[#F4F4F5] max-[480px]:text-[16px] max-[480px]:px-6 max-[480px]:py-3 max-[480px]:w-full max-[480px]:justify-center"><Play size={20} fill="#09090B" /> Watch Demo</button>
          </div>

          {/* Avatars */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex">
              {avatars.map((src, i) => (
                <img key={i} src={src} alt="Student" className={`w-10 h-10 rounded-full border-2 border-white object-cover ${i === 0 ? "ml-0" : "-ml-3"}`} />
              ))}
            </div>
            <p className="text-sm text-[#52525B]">
              Joined by <strong className="text-[#5521FF]">1,200+</strong> engineering students this week
            </p>
          </div>
        </section>

        {/* ── Hero Mockup ── */}
        <section className="max-w-[1280px] mx-auto mt-16 px-6">
          <div className="overflow-hidden pb-6">
            <div className="relative animate-float">
              <div className="bg-white/95 backdrop-blur-[12px] border border-[#E4E4E7] shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden relative z-10">

                {/* Title bar */}
                <div className="h-10 border-b border-[#E4E4E7] flex items-center justify-between px-4 bg-[#FAFAFA] shrink-0">
                  <div className="flex gap-2">
                    {["bg-red-500/60", "bg-amber-600/60", "bg-[#5521FF]/60"].map((bgClass, i) => (
                      <div key={i} className={`w-3 h-3 rounded-full ${bgClass}`} />
                    ))}
                  </div>
                  <div className="font-mono text-xs text-[#52525B] flex items-center gap-1 max-[600px]:text-[10px]">
                    <Lock size={12} /> bh-workspace.lab/p/digital-electronics-01
                  </div>
                  <div className="w-12" />
                </div>

                {/* Editor + AI pane */}
                <div className="flex h-[600px] max-md:flex-col max-md:h-auto">

                  {/* Code pane */}
                  <div className="flex-1 bg-white p-4 overflow-auto font-mono text-sm leading-relaxed text-[#24292e]">
                    <div className="flex gap-4 text-[#52525B] text-sm border-b border-[#E4E4E7] mb-4">
                      <span className="text-[#5521FF] border-b-2 border-b-[#5521FF] font-bold px-2 pb-2">main.py</span>
                      <span className="px-2 pb-2">logic_gates.vhd</span>
                      <span className="px-2 pb-2">report.md</span>
                    </div>

                    <div>
                      <div><span className="text-[#d73a49]">import</span> numpy <span className="text-[#d73a49]">as</span> np</div>
                      <div><span className="text-[#d73a49]">from</span> lab_lib <span className="text-[#d73a49]">import</span> SignalAnalyzer</div>
                      <br />
                      <div className="text-[#6a737d]"># Define input signals for NOR gate simulation</div>
                      <div>input_a = [<span className="text-[#005cc5]">0</span>, <span className="text-[#005cc5]">0</span>, <span className="text-[#005cc5]">1</span>, <span className="text-[#005cc5]">1</span>]</div>
                      <div>input_b = [<span className="text-[#005cc5]">0</span>, <span className="text-[#005cc5]">1</span>, <span className="text-[#005cc5]">0</span>, <span className="text-[#005cc5]">1</span>]</div>
                      <br />
                      <div>analyzer = SignalAnalyzer()</div>
                      <div>results = analyzer.calculate_nor(input_a, input_b)</div>
                      <br />
                      <div><span className="text-[#6f42c1]">print</span>(<span className="text-[#032f62]">f"Output Vector: {"{results}"}"</span>)</div>
                      <div className="mt-4 p-4 bg-[#F4F4F5] border border-[#E4E4E7] rounded-lg">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] mb-1">Terminal Output:</div>
                        <div className="text-[#5521FF] font-semibold">Running simulation...</div>
                        <div className="text-[#09090B]">Output Vector: [1, 0, 0, 0]</div>
                      </div>
                    </div>
                  </div>

                  {/* AI sidebar */}
                  <div className="w-[320px] border-l border-[#E4E4E7] bg-[#FAFAFA] flex flex-col shrink-0 max-md:w-full max-md:border-l-0 max-md:border-t max-md:border-[#E4E4E7]">
                    <div className="p-4 border-b border-[#E4E4E7] flex items-center gap-2">
                      <span className="text-xl text-[#5521FF]">✨</span>
                      <span className="font-bold">BH.AI Assistant</span>
                    </div>
                    <div className="flex-1 p-4 flex flex-col gap-4">
                      <div className="bg-[#5521FF]/5 border border-[#5521FF]/10 rounded-lg p-2 px-3 text-sm text-[#52525B] italic">
                        "I've analyzed your logic table. It matches a standard NOR configuration.
                        Would you like me to generate the truth table for your journal?"
                      </div>
                      <div className="mt-auto relative">
                        <input className="w-full bg-white border border-[#E4E4E7] rounded-full py-2 pl-4 pr-11 font-sans text-sm outline-none shadow-sm transition-all focus:border-[#5521FF] focus:ring-1 focus:ring-[#5521FF]" type="text" placeholder="Ask AI anything..." />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#5521FF] flex items-center">
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-[#5521FF]/10 blur-[60px] rounded-full -z-10 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* ── Feature Cards ── */}
        <section className="max-w-[1280px] mx-auto mt-16 px-6">
          <div className="grid grid-cols-3 gap-8 max-md:grid-cols-2 max-md:gap-5 max-[580px]:grid-cols-1 max-[580px]:gap-4">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white border border-[#E4E4E7] rounded-2xl p-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_10px_30px_rgba(85,33,255,0.1)] hover:border-[#5521FF] group max-[480px]:p-6">
                <div className="w-12 h-12 bg-[#5521FF]/10 border border-[#5521FF]/20 rounded-xl flex items-center justify-center mb-4 transition-all duration-200 group-hover:bg-[#5521FF] group-hover:border-[#5521FF] text-[#5521FF] group-hover:text-white">
                  {icon}
                </div>
                <h3 className="text-[22px] font-semibold mb-2">{title}</h3>
                <p className="text-[15px] leading-relaxed text-[#52525B]">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-[#E4E4E7] py-8 px-6 mt-16">
        <div className="flex flex-wrap justify-between items-center gap-4 max-[600px]:flex-col max-[600px]:items-center max-[600px]:text-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center overflow-hidden shrink-0">
                <img src="/logo.png" alt="BH.Lab Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-base">BH.Lab</span>
            </div>
            <p className="text-sm text-[#52525B]">© 2026 BH.Lab Engineering. All rights reserved.</p>
          </div>
          <div className="flex gap-6 flex-wrap justify-center">
            {["Resources", "Documentation", "Privacy Policy", "Terms"].map(l => (
              <a key={l} href="#" className="text-sm text-[#52525B] no-underline hover:text-[#5521FF] transition-colors duration-150">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}