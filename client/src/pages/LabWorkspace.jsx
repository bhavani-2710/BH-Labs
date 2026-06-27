import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import FlowchartRenderer from "../components/FlowchartRenderer";

const COMPILER_MAP = {
  c: "gcc-head-c",
  cpp: "gcc-head",
  python: "cpython-3.12.7",
  java: "openjdk-jdk-22+36",
  javascript: "nodejs-20.17.0"
};

const EXTENSION_MAP = {
  c: "c",
  cpp: "cpp",
  python: "py",
  java: "java",
  javascript: "js"
};

const MONACO_LANG_MAP = {
  c: "c",
  cpp: "cpp",
  python: "python",
  java: "java",
  javascript: "javascript"
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    background: #FAFAFA;
    color: #18181B;
    overflow: hidden;
    height: 100vh;
    font-size: 13px;
  }

  ::selection { background: rgba(124,58,237,0.2); }

  .custom-scrollbar::-webkit-scrollbar { width: 3px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 10px; }

  /* ── Header ── */
  .ws-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 16px; border-bottom: 1px solid #E4E4E7;
    background: #fff; z-index: 50; flex-shrink: 0; position: relative;
    height: 44px;
  }

  .ws-breadcrumb {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.05em;
    color: #71717A; text-transform: uppercase;
  }
  .ws-breadcrumb span { cursor: pointer; }
  .ws-breadcrumb span:last-child { color: #18181B; font-weight: 700; cursor: default; }
  .ws-breadcrumb-sep { color: #D4D4D8; font-size: 10px; }

  .ws-lang-pill {
    position: absolute; left: 50%; transform: translateX(-50%);
    background: #F9F9FB; border: 1px solid #E4E4E7; border-radius: 999px;
    padding: 3px 14px; font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: #71717A; text-transform: uppercase; letter-spacing: 0.1em;
    white-space: nowrap;
  }

  .ws-lang-select {
    position: absolute; left: 50%; transform: translateX(-50%);
    background: #F9F9FB; border: 1px solid #E4E4E7; border-radius: 999px;
    padding: 3px 14px; font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: #71717A; text-transform: uppercase; letter-spacing: 0.1em;
    white-space: nowrap; cursor: pointer; outline: none;
    transition: border-color 0.15s;
  }
  .ws-lang-select:hover { border-color: #7C3AED; color: #7C3AED; }
  .ws-lang-select:focus { border-color: #7C3AED; box-shadow: 0 0 0 2px rgba(124,58,237,0.15); }

  @media (max-width: 900px) {
    .ws-lang-pill, .ws-lang-select { display: none; }
  }

  .ws-header-right { display: flex; align-items: center; gap: 10px; }

  .autosave-label { font-size: 10px; font-weight: 600; color: #71717A; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 4px; }
  .autosave-dot { width: 5px; height: 5px; border-radius: 50%; background: #22C55E; flex-shrink: 0; }

  .divider-v { width: 1px; height: 18px; background: #E4E4E7; flex-shrink: 0; }

  .btn-back {
    font-size: 11px; font-weight: 600; color: #71717A; background: none; border: none;
    cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: background 0.15s, color 0.15s;
    font-family: 'Inter', sans-serif; letter-spacing: 0.02em;
  }
  .btn-back:hover { background: #F4F4F5; color: #18181B; }

  .btn-run {
    background: rgba(34,197,94,0.1); color: #166534;
    border: 1px solid rgba(34,197,94,0.3); padding: 5px 14px;
    border-radius: 6px; font-size: 11px; font-weight: 700;
    letter-spacing: 0.05em; text-transform: uppercase;
    cursor: pointer; transition: background 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .btn-run:hover { background: rgba(34,197,94,0.2); }
  .btn-run:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-journal {
    background: #7C3AED; color: #fff; border: none;
    padding: 5px 14px; border-radius: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
    cursor: pointer; transition: filter 0.15s;
    box-shadow: 0 2px 6px rgba(124,58,237,0.2);
    font-family: 'Inter', sans-serif;
  }
  .btn-journal:hover { filter: brightness(1.1); }

  /* ── IDE body ── */
  .ws-body { display: flex; flex: 1; overflow: hidden; gap: 5px; padding: 5px; }

  /* ── Panel ── */
  .panel {
    background: #fff; border: 1px solid #E4E4E7;
    border-radius: 10px; overflow: hidden; display: flex; flex-direction: column;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }

  /* ── Tab bar ── */
  .tab-bar {
    display: flex; gap: 3px; padding: 4px;
    background: #F4F4F5; border-bottom: 1px solid #E4E4E7; flex-shrink: 0;
  }
  .tab-btn {
    flex: 1; padding: 4px 0; border-radius: 5px; border: none; cursor: pointer;
    font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
    background: transparent; color: #71717A;
    transition: background 0.15s, color 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .tab-btn:hover { background: #EBEBEB; color: #18181B; }
  .tab-btn.active { background: #7C3AED; color: #fff; }

  /* ── Left panel ── */
  .left-panel { width: 21%; flex-shrink: 0; }
  @media (max-width: 1100px) { .left-panel { display: none; } }

  .panel-content { flex: 1; overflow-y: auto; padding: 12px; }

  .ai-badge {
    display: inline-block; padding: 1px 7px; border-radius: 3px; margin-bottom: 7px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    background: rgba(124,58,237,0.1); color: #7C3AED; border: 1px solid rgba(124,58,237,0.2);
  }

  .theory-h2 { font-size: 15px; font-weight: 700; color: #18181B; margin-bottom: 8px; line-height: 1.3; }
  .theory-p  { font-size: 12px; line-height: 1.6; color: #71717A; margin-bottom: 10px; }
  .theory-quote {
    padding: 8px 12px; background: #F5F3FF; border-radius: 8px;
    border: 1px solid rgba(124,58,237,0.1); font-style: italic;
    font-size: 12px; color: #5B21B6; margin-bottom: 12px; line-height: 1.5;
  }

  .key-concepts-label {
    font-size: 10px; font-weight: 700; color: #7C3AED;
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;
  }
  .concept-item {
    display: flex; gap: 6px; align-items: flex-start;
    font-size: 12px; color: #71717A; margin-bottom: 5px; line-height: 1.4;
  }
  .concept-check { color: #7C3AED; flex-shrink: 0; font-size: 11px; }

  .algo-box {
    background: #F9F9FB; border: 1px solid #E4E4E7; border-radius: 8px;
    padding: 12px; font-family: 'JetBrains Mono', monospace;
    font-size: 11px; line-height: 1.7; color: #334155; white-space: pre-line;
  }

  /* ── Center panel ── */
  .center-panel { flex: 1; min-width: 0; }

  .editor-tab-bar {
    display: flex; align-items: center; background: #F4F4F5;
    border-bottom: 1px solid #E4E4E7; height: 34px; flex-shrink: 0;
  }
  .editor-tab {
    display: flex; align-items: center; gap: 5px;
    padding: 0 14px; height: 100%;
    background: #fff; border-right: 1px solid #E4E4E7;
    font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #18181B;
  }
  .editor-tab-dot { color: #7C3AED; font-size: 12px; }

  /* ── Console ── */
  .console-wrap {
    height: 26%; border-top: 1px solid #E4E4E7;
    background: #F4F4F5; display: flex; flex-direction: column; flex-shrink: 0;
  }
  .console-tab-bar {
    display: flex; align-items: center; gap: 12px;
    padding: 0 12px; border-bottom: 1px solid #E4E4E7;
    background: #F9F9FB; flex-shrink: 0;
  }
  .console-tab {
    font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
    padding: 6px 2px; border: none; background: none; cursor: pointer;
    color: #71717A; border-bottom: 2px solid transparent; transition: color 0.15s, border-color 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .console-tab.active  { color: #7C3AED; border-bottom-color: #7C3AED; }
  .console-tab:hover:not(.active) { color: #18181B; }

  .console-body {
    flex: 1; padding: 10px 12px;
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    color: #71717A; overflow-y: auto; line-height: 1.6;
  }
  .console-prompt { color: #7C3AED; font-weight: 700; margin-right: 6px; }
  .console-success { color: #16A34A; margin-top: 3px; }
  .console-output  { color: #18181B; margin-top: 6px; }
  .console-output span { color: #7C3AED; font-weight: 700; }
  .console-exit    { color: rgba(113,113,122,0.45); margin-top: 10px; }

  /* ── Right panel ── */
  .right-panel { width: 24%; flex-shrink: 0; display: flex; flex-direction: column; gap: 5px; }
  @media (max-width: 900px) { .right-panel { display: none; } }

  /* ── AI chat ── */
  .ai-header  { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-shrink: 0; }
  .ai-avatar  {
    width: 26px; height: 26px; border-radius: 6px;
    background: #7C3AED; display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 12px; font-weight: 700; flex-shrink: 0;
  }
  .ai-name   { font-size: 11px; font-weight: 700; color: #18181B; }
  .ai-status { font-size: 9px; color: #22C55E; display: flex; align-items: center; gap: 3px; }
  .ai-dot    { width: 5px; height: 5px; border-radius: 50%; background: #22C55E; flex-shrink: 0; }

  .chat-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 2px; }

  .bubble-ai {
    background: #F5F3FF; border: 1px solid rgba(124,58,237,0.1);
    border-radius: 10px; border-top-left-radius: 2px;
    padding: 8px 10px; font-size: 11px; line-height: 1.6; color: #3730A3;
    align-self: flex-start; max-width: 92%;
  }
  .bubble-user {
    background: #7C3AED; color: #fff;
    border-radius: 10px; border-top-right-radius: 2px;
    padding: 8px 10px; font-size: 11px; line-height: 1.6;
    align-self: flex-end; max-width: 85%;
    box-shadow: 0 2px 6px rgba(124,58,237,0.2);
  }

  .typing-bubble {
    background: #F5F3FF; border: 1px solid rgba(124,58,237,0.1);
    border-radius: 10px; border-top-left-radius: 2px;
    padding: 8px 12px; display: inline-flex; align-items: center; gap: 3px;
  }
  .typing-dot {
    width: 5px; height: 5px; border-radius: 50%; background: #A78BFA;
    animation: tdot 1s infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.15s; }
  .typing-dot:nth-child(3) { animation-delay: 0.3s; }
  @keyframes tdot {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-4px); }
  }

  .quick-chips { display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 5px; }
  .chip {
    padding: 3px 8px; background: #F4F4F5; border: 1px solid #E4E4E7;
    border-radius: 4px; font-size: 10px; color: #71717A; cursor: pointer;
    transition: color 0.15s, border-color 0.15s; font-family: 'Inter', sans-serif; font-weight: 600;
  }
  .chip:hover { color: #7C3AED; border-color: #7C3AED; }

  .ai-input-wrap { position: relative; }
  .ai-input {
    width: 100%; background: #F4F4F5; border: 1px solid #E4E4E7;
    border-radius: 8px; padding: 8px 36px 8px 10px;
    font-size: 11px; color: #18181B; outline: none;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .ai-input:focus { border-color: #7C3AED; box-shadow: 0 0 0 1px #7C3AED; }
  .ai-input::placeholder { color: #A1A1AA; }
  .ai-send {
    position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
    width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
    background: none; border: none; cursor: pointer; color: #7C3AED;
    border-radius: 50%; font-size: 12px; transition: background 0.15s;
  }
  .ai-send:hover { background: rgba(124,58,237,0.1); }

  /* ── Hints ── */
  .hint-card {
    border: 1px solid #E4E4E7; border-radius: 8px; padding: 10px;
    font-size: 11px; transition: background 0.15s;
  }
  .hint-card.revealed { background: #F9F9FB; color: #334155; }
  .hint-card.locked   { background: #FAFAFA; color: #71717A; }
  .hint-num  { font-size: 10px; font-weight: 700; margin-bottom: 4px; }
  .hint-reveal-btn {
    background: #7C3AED; color: #fff; border: none; border-radius: 5px;
    padding: 4px 10px; font-size: 10px; font-weight: 700; cursor: pointer;
    font-family: 'Inter', sans-serif; margin-top: 4px;
  }
  .hint-reveal-btn:hover { background: rgba(124,58,237,0.85); }

  /* ── Score / Viva card ── */
  .score-card {
    background: #fff; border: 1px solid #E4E4E7; border-radius: 10px; padding: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  .score-card:hover { box-shadow: 0 6px 20px rgba(124,58,237,0.08); border-color: #7C3AED; }

  .score-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .score-label  { font-size: 10px; font-weight: 700; color: #71717A; text-transform: uppercase; letter-spacing: 0.05em; }
  .score-latest { font-size: 10px; font-weight: 700; color: #7C3AED; }

  .score-row    { display: flex; align-items: center; gap: 10px; }
  .score-pct    { font-size: 28px; font-weight: 900; color: #18181B; letter-spacing: -0.03em; flex-shrink: 0; }
  .score-bar-wrap { flex: 1; height: 6px; background: #F4F4F5; border-radius: 999px; overflow: hidden; }
  .score-bar-fill { height: 100%; background: #7C3AED; border-radius: 999px; }

  .btn-viva {
    width: 100%; margin-top: 10px; padding: 8px 0;
    background: #7C3AED; color: #fff; border: none; border-radius: 8px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
    cursor: pointer; box-shadow: 0 3px 10px rgba(124,58,237,0.2);
    transition: transform 0.1s; font-family: 'Inter', sans-serif;
  }
  .btn-viva:hover  { transform: scale(1.02); }
  .btn-viva:active { transform: scale(0.98); }

  .viva-why {
    background: #F5F3FF; border: 1px solid rgba(124,58,237,0.1);
    border-radius: 8px; padding: 10px; font-size: 11px; color: #52525B; line-height: 1.7;
  }
  .viva-why strong { color: #18181B; font-weight: 700; display: block; margin-bottom: 5px; }
`;

export default function LabWorkspace({
  onBack,
  experiment,
  subPart = "a",
  onNavigate,
  onSaveCode,
  savedCode,
  apiBase = "http://localhost:5000/api"
}) {
  const subExp = experiment?.subExperiments?.find(s => s.part === subPart) || experiment?.subExperiments?.[0];

  const [activeLeftTab, setActiveLeftTab] = useState("theory");
  const [activeRightTab, setActiveRightTab] = useState("assistant");

  // Check both top-level and inside starterCode for supportedLanguages
  const supportedLanguages =
    subExp?.supportedLanguages ||
    subExp?.starterCode?.supportedLanguages ||
    ["c"];

  const [editorLanguage, setEditorLanguage] = useState(supportedLanguages[0]);
  const [code, setCode] = useState("");
  const [codeByLang, setCodeByLang] = useState({});

  const [consoleOutput, setConsoleOutput] = useState("");
  const [consoleErrors, setConsoleErrors] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [consoleTab, setConsoleTab] = useState("output");
  const [chatMessages, setChatMessages] = useState([{
    sender: "ai",
    text: `Hello! I've analyzed your requirements for "${subExp?.title || "this experiment"}". How can I help?`
  }]);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [saveStatus, setSaveStatus] = useState("Saved");

  const hintsList = [
    "Identify the input variables: for sorting, we need an integer array.",
    "Outer loop runs n-1 times; inner loop runs n-i-1 times.",
    "Use precise terms in viva: 'time complexity', 'nested loop', 'auxiliary space'.",
    "Always close files with fclose() to avoid memory leaks."
  ];

  // Runs when experiment/subPart changes — pre-fill starter code for all languages
  useEffect(() => {
    const initial = {};
    supportedLanguages.forEach(lang => {
      initial[lang] = subExp?.starterCode?.templates?.[lang] || "";
    });
    setCodeByLang(initial);
    setConsoleOutput("");
    setConsoleErrors("");
    setEditorLanguage(supportedLanguages[0]);
    setChatMessages([{
      sender: "ai",
      text: `Hello! I've analyzed your requirements for "${subExp?.title || "this experiment"}". How can I help?`
    }]);
  }, [experiment, subPart]);

  // Runs when language changes — loads that language's code
  useEffect(() => {
    const perLangSaved = codeByLang[editorLanguage];
    const starter = subExp?.starterCode?.templates?.[editorLanguage] || "";
    setCode(savedCode || perLangSaved || starter);
  }, [editorLanguage, subPart, experiment]);

  const handleLanguageChange = (e) => {
    setEditorLanguage(e.target.value);
    setConsoleOutput("");
    setConsoleErrors("");
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setConsoleOutput("Error: Code is empty.");
      setConsoleErrors("Please write some code before running.");
      setConsoleTab("errors");
      return;
    }

    setIsRunning(true);
    setConsoleTab("output");
    setConsoleErrors("");
    setConsoleOutput(`$ Running ${editorLanguage.toUpperCase()} code...\nCompiling...\n`);

    try {
      const res = await fetch(`${apiBase}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compiler: COMPILER_MAP[editorLanguage] || "gcc-head-c",
          code,
          language: editorLanguage
        })
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      let out = "", err = "";
      if (data.compiler_message) out += `Compiler:\n${data.compiler_message}\n\n`;
      if (data.program_output) out += `Output:\n${data.program_output}\n`;
      if (data.program_error) err = data.program_error;
      if (data.compiler_error) err = (err ? err + "\n" : "") + data.compiler_error;

      out += data.status === "0" ? "\n✔ Process returned 0." : `\n✖ Exit code ${data.status}.`;

      setConsoleOutput(p => p + out);
      if (err) {
        setConsoleErrors(err);
        setConsoleTab("errors");
      }

      if (onSaveCode && data.status === "0") {
        onSaveCode(experiment._id, subPart, code);
      }
    } catch (e) {
      setConsoleOutput(p => p + `\n✖ ${e.message}`);
      setConsoleErrors(e.message);
      setConsoleTab("errors");
    } finally {
      setIsRunning(false);
    }
  };

  const askAiMessage = (q) => {
    if (!q.trim()) return;
    setChatMessages(p => [...p, { sender: "user", text: q }]);
    setInputValue(""); setIsAiTyping(true);
    setTimeout(() => {
      const ql = q.toLowerCase();
      const reply = ql.includes("complexity") || ql.includes("time")
        ? "Bubble Sort uses nested loops → O(n²) worst-case time complexity."
        : ql.includes("swap") || ql.includes("temp")
          ? "A temp variable holds one value while swapping so the original isn't overwritten."
          : ql.includes("error") || ql.includes("debug")
            ? "Check that <stdio.h> is imported and parameter types match."
            : `For "${subExp?.title || "this experiment"}", let me know if you'd like a flowchart walkthrough.`;
      setChatMessages(p => [...p, { sender: "ai", text: reply }]);
      setIsAiTyping(false);
    }, 1000);
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "#FAFAFA" }}>

        {/* Header */}
        <header className="ws-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="btn-back" onClick={onBack}>← Back</button>
            <div className="divider-v" />
            <nav className="ws-breadcrumb">
              <span onClick={onBack}></span>
              <span className="ws-breadcrumb-sep">›</span>
              <span>{subExp?.title || "Bubble Sort"}</span>
            </nav>
          </div>

          {/* Language selector — dropdown if multiple, static pill if single */}
          {supportedLanguages.length > 1 ? (
            <select
              className="ws-lang-select"
              value={editorLanguage}
              onChange={handleLanguageChange}
            >
              {supportedLanguages.map(lang => (
                <option key={lang} value={lang}>{lang.toUpperCase()}</option>
              ))}
            </select>
          ) : (
            <div className="ws-lang-pill">{editorLanguage.toUpperCase()} Language</div>
          )}

          <div className="ws-header-right">
            <div className="autosave-label">
              <span className="autosave-dot" /> {saveStatus}
            </div>
            <div className="divider-v" />
            <button className="btn-run" onClick={handleRunCode} disabled={isRunning}>
              {isRunning ? "Running..." : "Run"}
            </button>
            <button className="btn-journal" onClick={() => onNavigate?.("journal-view", { experimentId: experiment?._id, subPart })}>
              Generate Journal
            </button>
          </div>
        </header>

        {/* IDE body */}
        <div className="ws-body">

          {/* LEFT */}
          <aside className="panel left-panel">
            <div className="tab-bar">
              {["theory", "algorithm", "flowchart"].map(t => (
                <button key={t} className={`tab-btn${activeLeftTab === t ? " active" : ""}`} onClick={() => setActiveLeftTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="panel-content custom-scrollbar">
              {activeLeftTab === "theory" && <>
                <span className="ai-badge">Bh.AI Generated</span>
                <h2 className="theory-h2">{subExp?.title || "Bubble Sort"}</h2>
                <h2>Problem Statement</h2>
                <p className="theory-p">{subExp?.problemStatement || "Bubble Sort repeatedly swaps adjacent elements if they are in the wrong order."}</p>
                <br></br>
                <h2>Theory</h2>
                {subExp?.theory && <p className="theory-p" style={{ marginTop: 10 }}>{subExp.theory}</p>}
              </>}
              {activeLeftTab === "algorithm" && <>
                <div className="key-concepts-label" style={{ marginBottom: 8 }}>Step-by-Step Logic</div>
                <div className="algo-box">{subExp?.algorithm || `START\nStep 1: Read array of n elements\nStep 2: For i = 0 to n-2\n  For j = 0 to n-i-2\n    If arr[j] > arr[j+1]\n      Swap elements\nStep 3: Print sorted array\nEND`}</div>
              </>}
              {activeLeftTab === "flowchart" && <>
                <div className="key-concepts-label" style={{ marginBottom: 8 }}>Logic Flow</div>
                <div style={{ background: "#F9F9FB", border: "1px solid #E4E4E7", borderRadius: 8, padding: 6, overflow: "hidden" }}>
                  <FlowchartRenderer nodes={subExp?.flowchart?.nodes} edges={subExp?.flowchart?.edges} />
                </div>
              </>}
            </div>
          </aside>

          {/* CENTER */}
          <section className="panel center-panel">
            <div className="editor-tab-bar">
              <div className="editor-tab">
                <span className="editor-tab-dot">◉</span>
                <span>main.{EXTENSION_MAP[editorLanguage] || "c"}</span>
              </div>
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <Editor
                height="100%"
                language={MONACO_LANG_MAP[editorLanguage] || "c"}
                theme="light"
                value={code}
                onChange={(value) => {
                  const newCode = value || "";
                  setCode(newCode);
                  setCodeByLang(prev => ({ ...prev, [editorLanguage]: newCode }));
                  setSaveStatus("Saving...");
                  if (onSaveCode) {
                    onSaveCode(experiment._id, subPart, newCode);
                  }
                  setTimeout(() => setSaveStatus("Saved"), 600);
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: "JetBrains Mono, monospace",
                  automaticLayout: true,
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                  lineNumbersMinChars: 3,
                  lineHeight: 20,
                  wordWrap: "on",
                }}
              />
            </div>
            <div className="console-wrap">
              <div className="console-tab-bar">
                <button className={`console-tab${consoleTab === "output" ? " active" : ""}`} onClick={() => setConsoleTab("output")}>Output</button>
                <button className={`console-tab${consoleTab === "errors" ? " active" : ""}`} onClick={() => setConsoleTab("errors")}>
                  Errors{consoleErrors ? " (1)" : ""}
                </button>
              </div>
              <div className="console-body custom-scrollbar">
                {consoleTab === "output" ? (
                  consoleOutput ? (
                    <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{consoleOutput}</pre>
                  ) : (
                    <span style={{ fontStyle: "italic", color: "#A1A1AA" }}>
                      Click "Run" to compile and execute your code.
                    </span>
                  )
                ) : (
                  consoleErrors ? (
                    <pre style={{ color: "#DC2626", whiteSpace: "pre-wrap", margin: 0 }}>
                      {consoleErrors}
                    </pre>
                  ) : (
                    <span style={{ fontStyle: "italic", color: "#A1A1AA" }}>
                      No errors found.
                    </span>
                  )
                )}
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="right-panel">
            <div className="panel" style={{ flex: 1, overflow: "hidden" }}>
              <div className="tab-bar">
                {[["assistant", "Assistant"], ["hints", "Hints"], ["viva", "Viva"]].map(([key, label]) => (
                  <button key={key} className={`tab-btn${activeRightTab === key ? " active" : ""}`} onClick={() => setActiveRightTab(key)}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="panel-content custom-scrollbar" style={{ display: "flex", flexDirection: "column" }}>

                {activeRightTab === "assistant" && (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 10 }}>
                    <div className="ai-header">
                      <div className="ai-avatar">AI</div>
                      <div>
                        <div className="ai-name">Bh.AI Assistant</div>
                        <div className="ai-status"><span className="ai-dot" /> Online</div>
                      </div>
                    </div>
                    <div className="chat-scroll custom-scrollbar" style={{ flex: 1 }}>
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={msg.sender === "ai" ? "bubble-ai" : "bubble-user"}>{msg.text}</div>
                      ))}
                      {isAiTyping && (
                        <div className="typing-bubble">
                          <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                        </div>
                      )}
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <div className="quick-chips">
                        <button className="chip" onClick={() => askAiMessage("Can you explain the swap logic?")}>Swap Logic?</button>
                        <button className="chip" onClick={() => askAiMessage("What is the time complexity?")}>Time Complexity?</button>
                      </div>
                      <div className="ai-input-wrap">
                        <input className="ai-input" type="text" placeholder="Ask Bh.AI..."
                          value={inputValue}
                          onChange={e => setInputValue(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && askAiMessage(inputValue)}
                        />
                        <button className="ai-send" onClick={() => askAiMessage(inputValue)}>➤</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeRightTab === "hints" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 6, borderBottom: "1px solid #E4E4E7", marginBottom: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#71717A", textTransform: "uppercase", letterSpacing: "0.05em" }}>Available Hints</span>
                      <span style={{ fontSize: 10, background: "#F5F3FF", border: "1px solid rgba(124,58,237,0.15)", color: "#7C3AED", fontWeight: 700, padding: "1px 7px", borderRadius: 3 }}>100 XP</span>
                    </div>
                    {hintsList.map((hint, idx) => {
                      const revealed = idx < revealedHints;
                      return (
                        <div key={idx} className={`hint-card ${revealed ? "revealed" : "locked"}`}>
                          <div className="hint-num">Hint {idx + 1}</div>
                          {revealed
                            ? <p style={{ fontSize: 11, lineHeight: 1.6 }}>{hint}</p>
                            : <button className="hint-reveal-btn" onClick={() => setRevealedHints(p => Math.max(p, idx + 1))}>Reveal (−5 XP)</button>
                          }
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeRightTab === "viva" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div className="score-card">
                      <div className="score-label-row">
                        <span className="score-label">Viva Prep</span>
                        <span className="score-latest">Latest Score</span>
                      </div>
                      <div className="score-row">
                        <div className="score-pct">86%</div>
                        <div className="score-bar-wrap"><div className="score-bar-fill" style={{ width: "86%" }} /></div>
                      </div>
                      <button className="btn-viva" onClick={() => onNavigate?.("viva-practice", { subjectId: experiment?.subjectId, experimentId: experiment?._id, part: subPart })}>
                        Start Viva Practice
                      </button>
                    </div>
                    <div className="viva-why">
                      <strong>Why practice?</strong>
                      <span>1. Simulates actual oral exam questions.</span><br />
                      <span>2. Analyzes verbal confidence and terminology.</span><br />
                      <span>3. Contributes up to 10 marks to your record.</span>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}