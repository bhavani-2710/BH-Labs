import { useState, useEffect, useRef } from "react";
import {
  Play,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Terminal,
  ChevronDown,
  ChevronUp,
  Cpu,
  Book,
  FileCode,
  Lightbulb,
  Layers,
  Wifi,
  WifiOff,
  Code
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { mockSubjects, mockExperiments } from "./data/mockData.js";

// Multi-language starter boilerplate code templates
const languageTemplates = {
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}`,
  python: `def main():\n    print("Hello World")\n\nif __name__ == "__main__":\n    main()`,
  java: `class Prog {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}`,
  javascript: `function main() {\n    console.log("Hello World");\n}\n\nmain();`
};

// Compiler mapping to Wandbox compiler keys
const compilerMap = {
  c: "gcc-head-c",
  cpp: "gcc-head",
  python: "cpython-3.12.7",
  java: "openjdk-jdk-22+36",
  javascript: "nodejs-20.17.0"
};

function App() {
  // Navigation State
  const [view, setView] = useState("dashboard"); // dashboard, experiments, workspace
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  // Data State
  const [subjects, setSubjects] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Workspace IDE State
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("c"); // c, cpp, python, java, javascript
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("problem"); // problem, theory

  // AI Assistant State
  const [hintsRevealed, setHintsRevealed] = useState(0);

  // Viva Accordion State
  const [expandedViva, setExpandedViva] = useState({});

  // Fetch subjects and experiments from backend, fallback to mockData
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const subjectsRes = await fetch("/api/subjects");
        if (!subjectsRes.ok) throw new Error("Failed to fetch subjects");
        const subjectsData = await subjectsRes.json();

        const experimentsRes = await fetch("/api/experiments");
        if (!experimentsRes.ok) throw new Error("Failed to fetch experiments");
        const experimentsData = await experimentsRes.json();

        setSubjects(subjectsData);
        setExperiments(experimentsData);
        setIsOffline(false);
      } catch (error) {
        console.warn("Backend not available, falling back to local demo state:", error);
        setSubjects(mockSubjects);
        setExperiments(mockExperiments);
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter experiments for the selected subject
  const subjectExperiments = experiments.filter((exp) => {
    if (!selectedSubject) return false;
    // Database returns ref subjectId as object or string
    const subId = typeof exp.subjectId === "object" && exp.subjectId !== null
      ? exp.subjectId._id
      : exp.subjectId;
    return subId === selectedSubject._id;
  });

  // Handle navigating to workspace
  const handleOpenWorkspace = (experiment) => {
    setSelectedExperiment(experiment);
    setCode(experiment.starterCode);
    
    // Auto-detect subject programming language
    const subjectNameLower = selectedSubject.name.toLowerCase();
    let defaultLang = "c";
    if (subjectNameLower.includes("python")) defaultLang = "python";
    else if (subjectNameLower.includes("c++") || subjectNameLower.includes("cpp")) defaultLang = "cpp";
    else if (subjectNameLower.includes("java")) defaultLang = "java";
    else if (subjectNameLower.includes("javascript") || subjectNameLower.includes("node")) defaultLang = "javascript";

    setLanguage(defaultLang);
    setConsoleLogs([
      { type: "info", text: `Loaded workspace for: ${experiment.title}` },
      { type: "info", text: `Language set to: ${defaultLang.toUpperCase()}` },
      { type: "input", text: "Ready to run. Press 'Run Code' to execute." }
    ]);
    setHintsRevealed(0);
    setExpandedViva({});
    setActiveTab("problem");
    setView("workspace");
  };

  // Handle language switch from compiler select dropdown
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    // Overwrite the editor content with the starter template for the chosen language
    if (languageTemplates[newLang] !== undefined) {
      setCode(languageTemplates[newLang]);
      setConsoleLogs((prev) => [
        ...prev,
        { type: "info", text: `Language changed to ${newLang.toUpperCase()}. Boilerplate loaded.` }
      ]);
    }
  };

  // Sandboxed Wandbox Code Execution (0% Server Load)
  const runCode = async () => {
    setIsRunning(true);
    setConsoleLogs((prev) => [
      ...prev,
      { type: "info", text: `Compiling & running program...` }
    ]);

    const startTime = performance.now();

    try {
      const compiler = compilerMap[language] || "gcc-head-c";
      const res = await fetch("https://wandbox.org/api/compile.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compiler, code })
      });

      if (!res.ok) throw new Error("Wandbox compilation request failed");

      const data = await res.json();
      const endTime = performance.now();
      const execTime = ((endTime - startTime) / 1000).toFixed(3);

      const logs = [];

      // Check for compilation errors or warnings
      if (data.compiler_message || data.compiler_error) {
        const msg = data.compiler_message || data.compiler_error;
        if (data.status !== "0" && !data.program_message) {
          logs.push({
            type: "error",
            text: `Compilation Error:\n${msg}`
          });
        } else if (msg) {
          logs.push({
            type: "info",
            text: `Compiler Warnings/Messages:\n${msg}`
          });
        }
      }

      // Check for program output (stdout)
      if (data.program_output) {
        logs.push({ type: "stdout", text: data.program_output });
      }

      // Check for runtime errors (stderr)
      if (data.program_error) {
        logs.push({ type: "error", text: `Runtime Error:\n${data.program_error}` });
      }

      // Process termination status
      if (data.status === "0") {
        logs.push({
          type: "success",
          text: `\nProcess returned 0 (0x0)  execution time : ${execTime} s\nProgram executed successfully.`
        });
      } else if (data.status) {
        logs.push({
          type: "error",
          text: `\nProcess finished with exit code ${data.status}.`
        });
      }

      setConsoleLogs((prev) => [...prev, ...logs]);
    } catch (err) {
      console.warn("Wandbox execution unavailable, using client simulation fallback:", err);
      // Fallback local simulation (so the demo works even without network connection)
      setTimeout(() => {
        let logs = [];
        if (language === "c") {
          const hasInclude = code.includes("#include");
          const hasMain = code.includes("main") && (code.includes("{") || code.includes("def") === false);

          if (!hasInclude) {
            logs.push({
              type: "error",
              text: "gcc compiler error: stdio.h missing or not included.\nAt line 1: #include <stdio.h> expected."
            });
          } else if (!hasMain) {
            logs.push({
              type: "error",
              text: "gcc linker error: undefined reference to 'main'.\nExecution failed."
            });
          } else if (code.includes("printf")) {
            logs.push({ type: "stdout", text: "Hello World" });
            logs.push({ type: "success", text: "\nProcess returned 0 (0x0)  execution time : 0.052 s\nProgram executed successfully (Local Simulation)." });
          } else {
            logs.push({ type: "success", text: "Program executed successfully (Local Simulation).\n(Process returned 0 with empty stdout)" });
          }
        } else {
          if (code.includes("print(") || code.includes("print ")) {
            logs.push({ type: "stdout", text: "Hello World" });
            logs.push({ type: "success", text: "\n--------------------------------\nProcess finished with exit code 0\nProgram executed successfully (Local Simulation)." });
          } else {
            logs.push({ type: "success", text: "Program executed successfully (Local Simulation).\n(Process returned 0 with empty stdout)" });
          }
        }
        setConsoleLogs((prev) => [...prev, ...logs]);
      }, 1000);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRevealHint = () => {
    if (selectedExperiment && hintsRevealed < selectedExperiment.hints.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  const toggleViva = (index) => {
    setExpandedViva((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "hard":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="h-screen bg-[#07080d] text-slate-100 flex flex-col font-sans antialiased overflow-hidden selection:bg-accent-blue/30 selection:text-white">
      {/* Header bar */}
      <header className="sticky top-0 z-40 border-b border-dark-border bg-dark-bg/80 backdrop-blur-md px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20">
            <Cpu className="h-4 w-4 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              BH.Lab <span className="text-xs font-semibold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full ml-1 border border-accent-blue/20">MVP</span>
            </h1>
          </div>
        </div>

        {/* Real-time Status Badge */}
        <div className="flex items-center gap-2">
          {isOffline ? (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-xs text-amber-400">
              <WifiOff className="h-3.5 w-3.5" />
              <span>Offline Demo Mode</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs text-emerald-400">
              <Wifi className="h-3.5 w-3.5" />
              <span>API Connected</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400">Loading learning workspace...</p>
          </div>
        ) : (
          <>
            {/* VIEW: DASHBOARD */}
            {view === "dashboard" && (
              <div className="flex-1 overflow-y-auto px-6 py-12">
                <div className="max-w-6xl mx-auto w-full flex flex-col justify-center">
                  {/* Hero Section */}
                  <div className="text-center mb-12 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                      Practical Engineering Labs
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg">
                      Build, test, and master programming experiments in a mini cloud-based IDE designed for students.
                    </p>
                  </div>

                  {/* Subject Cards Grid */}
                  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
                    {subjects.map((sub) => {
                      const isC = sub.name.toLowerCase().includes("c programming");
                      return (
                        <div
                          key={sub._id}
                          onClick={() => {
                            setSelectedSubject(sub);
                            setView("experiments");
                          }}
                          className={`group relative rounded-2xl p-8 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 glass-card hover:bg-dark-card/90 border border-dark-border hover:border-slate-700/50 ${
                            isC ? "hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]" : "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                          }`}
                        >
                          {/* Accent top glow line */}
                          <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r ${
                            isC ? "from-accent-cyan to-accent-blue" : "from-accent-blue to-accent-purple"
                          }`}></div>

                          <div className="flex items-start justify-between">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                              isC ? "bg-accent-cyan/10 text-accent-cyan" : "bg-accent-blue/10 text-accent-blue"
                            }`}>
                              {isC ? <Code className="h-6 w-6" /> : <Terminal className="h-6 w-6" />}
                            </div>
                            <span className="text-xs font-semibold text-slate-500 bg-slate-800/40 px-2.5 py-1 rounded-full border border-slate-700/50">
                              Semester {sub.semester}
                            </span>
                          </div>

                          <h3 className="text-2xl font-bold mt-6 mb-3 group-hover:text-white transition-colors">
                            {sub.name}
                          </h3>
                          <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            {sub.description}
                          </p>

                          <div className="flex items-center justify-between text-sm font-semibold text-slate-300">
                            <span>
                              {experiments.filter(e => {
                                const subId = typeof e.subjectId === "object" && e.subjectId !== null ? e.subjectId._id : e.subjectId;
                                return subId === sub._id;
                              }).length || 3} Experiments
                            </span>
                            <span className={`flex items-center gap-1 group-hover:translate-x-1.5 transition-transform ${
                              isC ? "text-accent-cyan" : "text-accent-blue"
                            }`}>
                              View Experiments &rarr;
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: EXPERIMENTS PAGE */}
            {view === "experiments" && selectedSubject && (
              <div className="flex-1 overflow-y-auto px-6 py-8">
                <div className="max-w-6xl mx-auto w-full flex flex-col">
                  {/* Navigation Back */}
                  <button
                    onClick={() => {
                      setView("dashboard");
                      setSelectedSubject(null);
                    }}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 self-start transition-colors font-medium text-sm group"
                  >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Subjects
                  </button>

                  {/* Subject Info Header */}
                  <div className="glass p-8 rounded-2xl border border-dark-border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-extrabold text-white">{selectedSubject.name}</h2>
                        <span className="text-xs font-semibold text-accent-blue bg-accent-blue/10 border border-accent-blue/20 px-3 py-1 rounded-full">
                          {selectedSubject.code}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                        {selectedSubject.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2.5 rounded-xl self-start md:self-auto text-xs text-slate-400">
                      <BookOpen className="h-4 w-4 text-accent-blue" />
                      <span>Syllabus: AICTE Practical Learning System</span>
                    </div>
                  </div>

                  {/* Experiments List Title */}
                  <h3 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-accent-blue" />
                    Available Practical Experiments
                  </h3>

                  {/* Experiments Cards Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {subjectExperiments.map((exp) => (
                      <div
                        key={exp._id}
                        onClick={() => handleOpenWorkspace(exp)}
                        className="group flex flex-col justify-between p-6 rounded-xl glass-card hover:bg-dark-card border border-dark-border hover:border-slate-700/50 cursor-pointer transition-all duration-300 hover:shadow-md"
                      >
                        <div>
                          {/* Card Top */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-500">
                              EXP #{exp.experimentNumber}
                            </span>
                            <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${getDifficultyColor(exp.difficulty)}`}>
                              {exp.difficulty}
                            </span>
                          </div>

                          {/* Title & Desc */}
                          <h4 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors mb-2">
                            {exp.title}
                          </h4>
                          <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4">
                            {exp.problemStatement}
                          </p>
                        </div>

                        {/* Concepts Tag List */}
                        <div>
                          <div className="flex flex-wrap gap-1.5 mb-6">
                            {exp.concepts?.map((c, i) => (
                              <span key={i} className="text-[10px] text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded border border-slate-800">
                                {c}
                              </span>
                            ))}
                          </div>

                          {/* Action Link */}
                          <div className="flex items-center justify-between pt-3 border-t border-dark-border/40 text-xs font-semibold text-accent-blue group-hover:text-accent-cyan">
                            <span>Open Workspace</span>
                            <span>&rarr;</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {subjectExperiments.length === 0 && (
                      <div className="col-span-full text-center py-12 border border-dashed border-dark-border rounded-xl">
                        <p className="text-slate-500 text-sm">No experiments registered for this subject yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: LAB WORKSPACE */}
            {view === "workspace" && selectedExperiment && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Workspace Subheader */}
                <div className="bg-dark-bg border-b border-dark-border px-6 py-2 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setView("experiments")}
                      className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 py-1 px-2.5 rounded hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back
                    </button>
                    <span className="h-4 w-[1px] bg-dark-border"></span>
                    <span className="text-xs text-slate-500 font-medium">
                      {selectedSubject.name} &bull; Experiment #{selectedExperiment.experimentNumber}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {selectedExperiment.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${getDifficultyColor(selectedExperiment.difficulty)}`}>
                      {selectedExperiment.difficulty}
                    </span>
                  </div>
                </div>

                {/* IDE 3-Column Layout */}
                <div className="flex-1 flex overflow-hidden">
                  
                  {/* COLUMN 1: LEFT SIDEBAR (Instructions) */}
                  <div className="w-[30%] border-r border-dark-border bg-[#090a0f] flex flex-col overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-dark-border bg-slate-950/40 text-xs">
                      <button
                        onClick={() => setActiveTab("problem")}
                        className={`flex-1 py-3 px-4 font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                          activeTab === "problem"
                            ? "border-accent-blue text-white bg-slate-900/50"
                            : "border-transparent text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <FileCode className="h-3.5 w-3.5" />
                        Problem & Steps
                      </button>
                      <button
                        onClick={() => setActiveTab("theory")}
                        className={`flex-1 py-3 px-4 font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                          activeTab === "theory"
                            ? "border-accent-blue text-white bg-slate-900/50"
                            : "border-transparent text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Book className="h-3.5 w-3.5" />
                        Theory & Logic
                      </button>
                    </div>

                    {/* Tab contents (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                      {activeTab === "problem" && (
                        <>
                          {/* Concepts */}
                          <div className="space-y-2">
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Concepts</h5>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedExperiment.concepts?.map((c, i) => (
                                <span key={i} className="text-xs bg-accent-blue/10 border border-accent-blue/20 text-accent-blue px-2.5 py-0.5 rounded-full font-medium">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Problem Statement */}
                          <div className="space-y-2">
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Problem Statement</h5>
                            <div className="text-slate-300 text-sm leading-relaxed p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                              {selectedExperiment.problemStatement}
                            </div>
                          </div>

                          {/* Sample Input / Output */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sample Input</h5>
                              <pre className="text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-900 text-amber-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                {selectedExperiment.sampleInput || "No input"}
                              </pre>
                            </div>
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sample Output</h5>
                              <pre className="text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-900 text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                {selectedExperiment.sampleOutput || "Output expected"}
                              </pre>
                            </div>
                          </div>

                          {/* Algorithm Steps */}
                          <div className="space-y-2">
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proposed Algorithm</h5>
                            <div className="text-slate-300 text-sm whitespace-pre-line leading-relaxed bg-slate-900/20 border border-dark-border/40 p-4 rounded-xl font-mono text-[13px] border-l-2 border-l-accent-purple">
                              {selectedExperiment.algorithm}
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "theory" && (
                        <>
                          {/* Theoretical background */}
                          <div className="space-y-3">
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Book className="h-3.5 w-3.5 text-accent-blue" />
                              Theoretical Background
                            </h5>
                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-900/40 border border-slate-850 p-4 rounded-xl">
                              {selectedExperiment.theory}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* COLUMN 2: CENTER IDE (Monaco Editor & Console) */}
                  <div className="w-[45%] flex flex-col overflow-hidden bg-slate-950 border-r border-dark-border">
                    {/* IDE Header Bar */}
                    <div className="bg-[#12141c] border-b border-dark-border px-4 py-2 flex items-center justify-between text-xs flex-shrink-0">
                      {/* Language indicator */}
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Language:</span>
                        <select
                          value={language}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="bg-slate-905 border border-dark-border text-slate-200 px-2 py-1 rounded font-semibold focus:outline-none focus:border-accent-blue cursor-pointer"
                        >
                          <option value="c">C (GCC)</option>
                          <option value="cpp">C++ (GCC)</option>
                          <option value="python">Python (3.12)</option>
                          <option value="java">Java (OpenJDK 22)</option>
                          <option value="javascript">JavaScript (Node.js)</option>
                        </select>
                      </div>

                      {/* Run button */}
                      <button
                        onClick={runCode}
                        disabled={isRunning}
                        className={`flex items-center gap-1.5 font-bold px-4 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          isRunning
                            ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-600/10 hover:shadow-emerald-500/20"
                        }`}
                      >
                        {isRunning ? (
                          <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Play className="h-3.5 w-3.5 fill-current" />
                        )}
                        <span>Run Code</span>
                      </button>
                    </div>

                    {/* Monaco Editor Container */}
                    <div className="flex-1 relative bg-[#1e1e1e] overflow-hidden">
                      <Editor
                        height="100%"
                        language={language}
                        theme="vs-dark"
                        value={code}
                        onChange={(val) => setCode(val || "")}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          fontFamily: "'Fira Code', Consolas, Monaco, monospace",
                          cursorBlinking: "smooth",
                          smoothScrolling: true,
                          automaticLayout: true,
                          padding: { top: 16, bottom: 16 }
                        }}
                      />
                    </div>

                    {/* Console Panel (Fixed to Bottom of current Viewport) */}
                    <div className="h-[35%] bg-[#08090d] border-t border-dark-border flex flex-col overflow-hidden flex-shrink-0">
                      {/* Console Title Bar */}
                      <div className="bg-[#12141c] border-b border-dark-border px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Terminal className="h-3.5 w-3.5 text-accent-blue" />
                          Console Output
                        </span>
                        <button
                          onClick={() => setConsoleLogs([])}
                          className="hover:text-white transition-colors text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border border-slate-700 rounded hover:bg-slate-800 cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>

                      {/* Console Text Output (Scrolls inside, box size never changes) */}
                      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5">
                        {consoleLogs.map((log, index) => {
                          let textStyle = "text-slate-300";
                          if (log.type === "info") textStyle = "text-slate-500";
                          if (log.type === "error") textStyle = "text-rose-500 font-semibold";
                          if (log.type === "success") textStyle = "text-emerald-400 font-semibold";
                          if (log.type === "stdout") textStyle = "text-white bg-slate-900/60 p-2 border-l border-accent-blue rounded my-1 block";

                          return (
                            <div key={index} className="animate-fade-in whitespace-pre-wrap leading-relaxed">
                              {log.type === "error" && <span className="text-rose-500 font-bold mr-1">[!]</span>}
                              {log.type === "success" && <span className="text-emerald-400 font-bold mr-1">[✓]</span>}
                              <span className={textStyle}>{log.text}</span>
                            </div>
                          );
                        })}
                        {consoleLogs.length === 0 && (
                          <div className="text-slate-600 italic">No output. Run code to view logs.</div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* COLUMN 3: RIGHT SIDEBAR (AI assistant & Viva accordion) */}
                  <div className="w-[25%] bg-[#090a0f] flex flex-col overflow-y-auto border-b border-dark-border divide-y divide-dark-border">
                    
                    {/* Section A: AI Assistant Panel */}
                    <div className="p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="h-4 w-4 text-amber-400 animate-pulse" />
                        AI Lab Assistant
                      </h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Need guidance? The virtual TA can progressively provide structured hints for your logic implementation.
                      </p>

                      {/* Revealed hints list */}
                      <div className="space-y-3 mt-2">
                        {selectedExperiment.hints?.slice(0, hintsRevealed).map((hint, i) => (
                          <div
                            key={i}
                            className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 text-xs text-amber-200 animate-fade-in"
                          >
                            <span className="font-bold text-[10px] tracking-wider uppercase text-amber-500 block mb-1">
                              Hint {i + 1}
                            </span>
                            {hint}
                          </div>
                        ))}
                      </div>

                      {/* Hint Trigger Button */}
                      {hintsRevealed < selectedExperiment.hints.length ? (
                        <button
                          onClick={handleRevealHint}
                          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-xs hover:bg-amber-500/20 transition-all shadow-sm cursor-pointer"
                        >
                          <HelpCircle className="h-4 w-4" />
                          <span>Need Help? Show Hint {hintsRevealed + 1}</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>All available hints shown!</span>
                        </div>
                      )}
                    </div>

                    {/* Section B: Viva Accordion */}
                    <div className="p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-accent-purple" />
                        Viva Vocé Prep
                      </h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Prepare for practical exam oral checks with standard questions from the examiner.
                      </p>

                      <div className="space-y-2 mt-3">
                        {selectedExperiment.vivaQuestions?.map((viva, index) => {
                          const isExpanded = !!expandedViva[index];
                          return (
                            <div
                              key={index}
                              className="border border-dark-border/60 rounded-xl overflow-hidden bg-slate-950/40"
                            >
                              <button
                                onClick={() => toggleViva(index)}
                                className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                              >
                                <span>{viva.question}</span>
                                {isExpanded ? (
                                  <ChevronUp className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 ml-2" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 ml-2" />
                                )}
                              </button>

                              {isExpanded && (
                                <div className="px-4 pb-3 text-xs text-slate-400 leading-relaxed border-t border-dark-border/40 pt-2 animate-fade-in bg-slate-900/10">
                                  {viva.answer}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {(!selectedExperiment.vivaQuestions || selectedExperiment.vivaQuestions.length === 0) && (
                          <div className="text-slate-600 italic text-xs">No questions loaded.</div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;