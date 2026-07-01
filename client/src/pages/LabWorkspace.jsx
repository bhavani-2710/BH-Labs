import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import FlowchartRenderer from "../components/FlowchartRenderer";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { Loader2, SendHorizontal } from "lucide-react";

const COMPILER_MAP = {
  c: "gcc-head-c",
  cpp: "gcc-head",
  python: "cpython-3.12.7",
  java: "openjdk-jdk-22+36",
  javascript: "nodejs-20.17.0",
};

const EXTENSION_MAP = {
  c: "c",
  cpp: "cpp",
  python: "py",
  java: "java",
  javascript: "js",
};

const MONACO_LANG_MAP = {
  c: "c",
  cpp: "cpp",
  python: "python",
  java: "java",
  javascript: "javascript",
};

export default function LabWorkspace({
  onBack,
  experiment,
  subPart = "a",
  onNavigate,
  onSaveCode,
  savedCode,
  apiBase = "/api",
}) {
  const subExp =
    experiment?.subExperiments?.find((s) => s.part === subPart) ||
    experiment?.subExperiments?.[0];

  const [activeLeftTab, setActiveLeftTab] = useState("theory");
  const [activeRightTab, setActiveRightTab] = useState("assistant");

  // Derive supported languages from: explicit field → starterCode → referenceSolution keys → fallback
  // NOTE: use .length checks because [] is truthy in JS — `[] || ["c"]` returns [] not ["c"]
  const refSolKeys = subExp?.referenceSolution
    ? Object.keys(subExp.referenceSolution)
    : [];
  const supportedLanguages = (subExp?.supportedLanguages?.length
    ? subExp.supportedLanguages
    : null) ||
    (subExp?.starterCode?.supportedLanguages?.length
      ? subExp.starterCode.supportedLanguages
      : null) ||
    (refSolKeys.length ? refSolKeys : null) || ["c"];

  const [editorLanguage, setEditorLanguage] = useState(
    supportedLanguages[0] || "c",
  );
  const [code, setCode] = useState("");
  const [codeByLang, setCodeByLang] = useState({});

  const [consoleOutput, setConsoleOutput] = useState("");
  const [consoleErrors, setConsoleErrors] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [consoleTab, setConsoleTab] = useState("input");
  const [stdinInput, setStdinInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: `Hello! I've analyzed your requirements for "${subExp?.title || "this experiment"}". How can I help?`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [saveStatus, setSaveStatus] = useState("Saved");

  // Viva Q&A
  const [vivaQAPairs, setVivaQAPairs] = useState([]);
  const [vivaQALoading, setVivaQALoading] = useState(false);
  const [vivaQAError, setVivaQAError] = useState(null);
  const [expandedQA, setExpandedQA] = useState(null);

  const subjectId =
    experiment?.subjectId?._id || experiment?.subjectId || experiment?.subject;
  const completionKey = subjectId ? `bhlabs_completed_${subjectId}` : null;
  const [isDone, setIsDone] = useState(false);
  const [isDoneHovered, setIsDoneHovered] = useState(false);

  useEffect(() => {
    if (!completionKey || !experiment?._id || !subPart) return;
    try {
      const saved = localStorage.getItem(completionKey);
      const completedList = saved ? JSON.parse(saved) : [];
      const key = `${experiment._id}__${subPart}`;
      setIsDone(completedList.includes(key));
    } catch {
      setIsDone(false);
    }
  }, [completionKey, experiment?._id, subPart]);

  const toggleWorkspaceCompleted = () => {
    if (!completionKey || !experiment?._id || !subPart) return;
    const key = `${experiment._id}__${subPart}`;
    try {
      const saved = localStorage.getItem(completionKey);
      let completedList = saved ? JSON.parse(saved) : [];
      const index = completedList.indexOf(key);
      let nextState = false;
      if (index > -1) {
        completedList.splice(index, 1);
        nextState = false;
      } else {
        completedList.push(key);
        nextState = true;
      }
      setIsDone(nextState);
      localStorage.setItem(completionKey, JSON.stringify(completedList));
      if (nextState) {
        onBack();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Runs when experiment/subPart changes — pre-fill starter code for all languages
  useEffect(() => {
    console.log(subExp);
    const initial = {};
    supportedLanguages.forEach((lang) => {
      initial[lang] = "";
    });
    setCodeByLang(initial);
    setConsoleOutput("");
    setConsoleErrors("");
    setEditorLanguage(supportedLanguages[0] || "c");
    setChatMessages([
      {
        sender: "ai",
        text: `Hello! I've analyzed your requirements for "${subExp?.title || "this experiment"}". How can I help?`,
      },
    ]);
  }, [experiment, subPart]);

  // Fetch Viva Q&A from backend whenever experiment+subPart changes
  useEffect(() => {
    const id = experiment?._id;

    if (!id || !subPart) return;

    let cancelled = false;

    const fetchVivaQA = async () => {
      try {
        setVivaQAPairs([]);
        setVivaQAError(null);
        setVivaQALoading(true);
        setExpandedQA(null);

        const response = await fetch(`${apiBase}/vivas/qa`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            experimentId: id,
            part: subPart,
          }),
        });

        const data = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch Viva Q&A");
        }

        if (data.qaPairs) {
          setVivaQAPairs(data.qaPairs);
        } else {
          setVivaQAError("No Q&A returned from server.");
        }
      } catch (err) {
        if (!cancelled) {
          setVivaQAError(err.message);
        }
      } finally {
        if (!cancelled) {
          setVivaQALoading(false);
        }
      }
    };

    fetchVivaQA();

    return () => {
      cancelled = true;
    };
  }, [experiment?._id, subPart]);

  // Runs when language changes — loads reference solution, then starter code, then saved code
  useEffect(() => {
    // Keep it blank by default unless we have savedCode
    setCode(savedCode || "");
  }, [editorLanguage, subPart, experiment]);

  const handleLanguageChange = (e) => {
    setEditorLanguage(e.target.value);
    setConsoleOutput("");
    setConsoleErrors("");
  };

  const streamCode = async (fullCode) => {
    let current = "";

    for (let i = 0; i < fullCode.length; i++) {
      current += fullCode[i];

      setCode(current);
      setCodeByLang((prev) => ({
        ...prev,
        [editorLanguage]: current,
      }));

      // ~60 FPS
      await new Promise((r) => setTimeout(r, 8));
    }
  };

  const handleSolveQuestion = async () => {
    const refSol = subExp?.referenceSolution?.[editorLanguage] || "";
    if (!refSol) {
      alert("No solution available for this language.");
      return;
    }

    // Set the code in editor
    await streamCode(refSol);

    // Auto-save the code if supported
    if (onSaveCode) {
      onSaveCode(experiment._id, subPart, refSol);
    }

    // Open AI assistant tab
    setActiveRightTab("assistant");

    // Initialize streaming explanation in chat
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: "Explain the solved code for me." },
      { sender: "ai", text: "Analyzing the solution code..." },
    ]);
    setIsAiTyping(true);

    try {
      console.log("/explain\n", subExp)
      const res = await fetch(`${apiBase}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experimentTitle: subExp?.title, problemStatement: subExp?.problemStatement, algorithm: subExp?.algorithm, code: refSol, language: editorLanguage }),
      });

      if (!res.ok) {
        throw new Error("Failed to load explanation from server");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let explanation = "";
      setIsAiTyping(false);

      // Update last message to start empty for streaming
      setChatMessages((prev) => {
        const next = [...prev];
        if (next.length > 0) {
          next[next.length - 1] = { sender: "ai", text: "" };
        }
        return next;
      });

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let boundary = buffer.indexOf("\n");
        while (boundary !== -1) {
          const line = buffer.substring(0, boundary).trim();
          buffer = buffer.substring(boundary + 1);
          boundary = buffer.indexOf("\n");

          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") continue;
            try {
              const json = JSON.parse(dataStr);
              const text = json.choices?.[0]?.delta?.content || "";
              if (text) {
                explanation += text;
                setChatMessages((prev) => {
                  const next = [...prev];
                  if (
                    next.length > 0 &&
                    next[next.length - 1].sender === "ai"
                  ) {
                    next[next.length - 1] = { sender: "ai", text: explanation };
                  }
                  return next;
                });
              }
            } catch (err) {
              // Ignore partial JSON parsing errors
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setIsAiTyping(false);
      setChatMessages((prev) => {
        const next = [...prev];
        if (next.length > 0 && next[next.length - 1].sender === "ai") {
          next[next.length - 1] = {
            sender: "ai",
            text: `Error generating explanation: ${err.message}`,
          };
        }
        return next;
      });
    }
  };

  /**
   * Interleaves stdin tokens into program output so it reads like a real terminal.
   * Strategy: a ': ' is a "waiting-for-input" prompt if it's either:
   *   (a) followed by another capital/word letter on the same line (chained prompts), OR
   *   (b) at the end of a line (last prompt on that line).
   * Data lines like "Original array: 64 25" are not matched because they're
   * followed by digits/already-have-content, so stdin won't corrupt them.
   */
  // Unified stdin merge: targets common prompt keywords for C/C++/Java/Python.
  // Only injects after lines like "Enter a number: ", "Input value: " etc.
  // Leaves output lines like "You entered: 42" and data lines completely untouched.
  const mergeOutputWithStdin = (rawOutput, stdin) => {
    if (!stdin?.trim() || !rawOutput) return rawOutput;
    const stdinLines = stdin
      .trim()
      .split("\n")
      .filter((l) => l.trim() !== "");
    let idx = 0;
    return rawOutput.replace(
      /\b(Enter |Input |Choose |Select |Type |Please |Provide |Give |Pick )([^:\n]*(?:\([^)]*\))?[^:\n]*)(:\s*)/gi,
      (match) => {
        if (idx < stdinLines.length) {
          return match.trimEnd() + stdinLines[idx++] + "\n";
        }
        return match;
      },
    );
  };

  // Python-specific: targets common input() prompt words, injects stdin after each.
  // Leaves data lines like "Current Task List:" untouched.
  const mergeForPython = (rawOutput, stdin) => {
    if (!stdin?.trim() || !rawOutput) return rawOutput;
    const stdinLines = stdin
      .trim()
      .split("\n")
      .filter((l) => l.trim() !== "");
    let idx = 0;
    return rawOutput.replace(
      /\b(Enter |Input |Choose |Select |Type |Please |Provide |Give |Pick )([^:\n]*(?:\([^)]*\))?[^:\n]*)(:\s*)/gi,
      (match) => {
        if (idx < stdinLines.length) {
          return match.trimEnd() + stdinLines[idx++] + "\n";
        }
        return match;
      },
    );
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
    const stdinPreview = stdinInput
      ? stdinInput
          .trim()
          .split("\n")
          .filter((l) => l.trim())
          .map((l, i) => `  [${i + 1}] ${l}`)
          .join("\n")
      : "";
    setConsoleOutput(
      `$ Running ${editorLanguage.toUpperCase()} code...${stdinPreview ? `\n$ Input provided:\n${stdinPreview}` : ""}\n$ Compiling...\n\n`,
    );

    try {
      const normalizedStdin = stdinInput
        ? stdinInput
            .split(/\r?\n/)
            .map((line) => line.trimEnd())
            .join("\n")
            .trimEnd() + "\n"
        : "";

      const isPython = ["python", "python3", "py"].includes(editorLanguage);
      const isCLike = ["c", "cpp", "java"].includes(editorLanguage);

      // For Python: detect unsupported third-party packages and show a clear message
      if (isPython) {
        const unsupportedPackages = [
          "pandas",
          "numpy",
          "matplotlib",
          "scipy",
          "sklearn",
          "tensorflow",
          "torch",
          "keras",
          "seaborn",
          "plotly",
          "cv2",
          "PIL",
          "flask",
          "django",
          "fastapi",
          "requests",
          "bs4",
          "beautifulsoup4",
          "sqlalchemy",
          "pymongo",
          "boto3",
          "pydantic",
          "celery",
          "aiohttp",
        ];
        const importRegex = /^\s*(?:import|from)\s+([\w.]+)/gm;
        const found = [];
        let m;
        while ((m = importRegex.exec(code)) !== null) {
          const pkg = m[1].split(".")[0];
          if (unsupportedPackages.includes(pkg)) found.push(pkg);
        }
        if (found.length > 0) {
          const pkgList = [...new Set(found)].join(", ");
          setIsRunning(false);
          setConsoleTab("errors");
          setConsoleErrors(
            `⚠ Third-party package(s) not supported: ${pkgList}\n\n` +
              `The online runner only supports Python's standard library.\n` +
              `Packages like pandas, numpy, etc. require a local environment.\n\n` +
              `✦ Run locally:\n` +
              `  pip install ${[...new Set(found)].join(" ")}\n` +
              `  python your_file.py`,
          );
          return;
        }
      }

      let data;

      // Use Wandbox for all languages via our server
      const res = await fetch(`${apiBase}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compiler: COMPILER_MAP[editorLanguage] || "gcc-head-c",
          code,
          language: editorLanguage,
          stdin: normalizedStdin,
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      data = await res.json();

      let out = "";
      if (data.compiler_message)
        out += `[compiler]\n${data.compiler_message}\n\n`;
      const mergedOutput = data.program_output
        ? isPython
          ? mergeForPython(data.program_output, normalizedStdin)
          : isCLike
            ? mergeOutputWithStdin(data.program_output, normalizedStdin)
            : data.program_output
        : null;
      if (mergedOutput) out += mergedOutput;
      else if (!data.compiler_error && !data.program_error)
        out += `(no output)\n`;

      let err = "";
      if (data.program_error) err = data.program_error;
      if (data.compiler_error)
        err = (err ? err + "\n" : "") + data.compiler_error;

      out +=
        data.status === "0"
          ? "\n✔ Process returned 0."
          : `\n✖ Exit code ${data.status}.`;

      setConsoleOutput((p) => p + out);
      if (err) {
        setConsoleErrors(err);
        setConsoleTab("errors");
      }

      if (onSaveCode && data.status === "0") {
        onSaveCode(experiment._id, subPart, code);
      }
    } catch (e) {
      setConsoleOutput((p) => p + `\n✖ ${e.message}`);
      setConsoleErrors(e.message);
      setConsoleTab("errors");
    } finally {
      setIsRunning(false);
    }
  };

  const askAiMessage = async (q) => {
    if (!q.trim()) return;

    // Add user's message to the chat
    const updatedMessages = [...chatMessages, { sender: "user", text: q }];
    setChatMessages(updatedMessages);
    setInputValue("");
    setIsAiTyping(true);

    // Append an empty AI message that we will stream into
    setChatMessages((prev) => [...prev, { sender: "ai", text: "" }]);

    try {
      const res = await fetch(`${apiBase}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          code,
          language: editorLanguage,
          history: chatMessages.slice(-6), // Send recent history for context
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to connect to assistant");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      setIsAiTyping(false);

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let boundary = buffer.indexOf("\n");
        while (boundary !== -1) {
          const line = buffer.substring(0, boundary).trim();
          buffer = buffer.substring(boundary + 1);
          boundary = buffer.indexOf("\n");

          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") continue;
            try {
              const json = JSON.parse(dataStr);
              const text = json.choices?.[0]?.delta?.content || "";
              if (text) {
                assistantText += text;
                setChatMessages((prev) => {
                  const next = [...prev];
                  if (
                    next.length > 0 &&
                    next[next.length - 1].sender === "ai"
                  ) {
                    next[next.length - 1] = {
                      sender: "ai",
                      text: assistantText,
                    };
                  }
                  return next;
                });
              }
            } catch (err) {
              // Ignore partial JSON parsing errors
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setIsAiTyping(false);
      setChatMessages((prev) => {
        const next = [...prev];
        if (next.length > 0 && next[next.length - 1].sender === "ai") {
          next[next.length - 1] = {
            sender: "ai",
            text: `Error: ${err.message}`,
          };
        }
        return next;
      });
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#FAFAFA] selection:bg-[#5521FF]/20 font-sans text-[13px] text-[#18181B]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-1.5 border-b border-[#E4E4E7] bg-white z-50 shrink-0 relative h-11">
        <div className="flex items-center gap-2">
          <button
            className="text-[11px] font-semibold text-[#71717A] bg-none border-none cursor-pointer px-2 py-1 rounded-[6px] transition-colors duration-150 font-sans tracking-wide hover:bg-[#F4F4F5] hover:text-[#18181B]"
            onClick={onBack}
          >
            ← Back
          </button>
          <div className="w-[1px] h-[18px] bg-[#E4E4E7] shrink-0" />
          <nav className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[#71717A] uppercase">
            <span onClick={onBack}></span>
            <span className="text-[#D4D4D8] text-[10px]">›</span>
            <span className="text-[#18181B] font-bold cursor-default">
              {subExp?.title || "Bubble Sort"}
            </span>
          </nav>
        </div>

        {/* Language selector — dropdown if multiple, static pill if single */}
        {supportedLanguages.length > 1 ? (
          <select
            className="absolute left-1/2 -translate-x-1/2 bg-[#F9F9FB] border border-[#E4E4E7] rounded-full px-3.5 py-[3px] font-mono text-[10px] text-[#71717A] uppercase tracking-widest whitespace-nowrap cursor-pointer outline-none transition-colors duration-150 hover:border-[#5521FF] hover:text-[#5521FF] focus:border-[#5521FF] focus:ring-2 focus:ring-[#5521FF]/15 max-[900px]:hidden"
            value={editorLanguage}
            onChange={handleLanguageChange}
          >
            {supportedLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        ) : (
          <div className="absolute left-1/2 -translate-x-1/2 bg-[#F9F9FB] border border-[#E4E4E7] rounded-full px-3.5 py-[3px] font-mono text-[10px] text-[#71717A] uppercase tracking-widest whitespace-nowrap hidden md:block">
            {editorLanguage.toUpperCase()} Language
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <div className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider flex items-center gap-1">
            <span className="w-[5px] h-[5px] rounded-full bg-[#22C55E] shrink-0" />{" "}
            {saveStatus}
          </div>
          <div className="w-[1px] h-[18px] bg-[#E4E4E7] shrink-0" />
          <button
            className="bg-[#22C55E]/10 text-[#166534] border border-[#22C55E]/30 px-3.5 py-[5px] rounded-[6px] text-[11px] font-bold tracking-wider uppercase cursor-pointer transition-colors duration-150 font-sans hover:bg-[#22C55E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRunCode}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run"}
          </button>
          <button
            className="bg-[#5521FF]/10 text-[#5521FF] border border-[#5521FF]/30 px-3.5 py-[5px] rounded-[6px] text-[11px] font-bold tracking-wider uppercase cursor-pointer transition-colors duration-150 font-sans hover:bg-[#5521FF]/20"
            onClick={handleSolveQuestion}
          >
            Solve Question
          </button>
          {completionKey && (
            <button
              onClick={toggleWorkspaceCompleted}
              onMouseEnter={() => setIsDoneHovered(true)}
              onMouseLeave={() => setIsDoneHovered(false)}
              className={`border px-3.5 py-[5px] rounded-[6px] text-[11px] font-bold tracking-wider uppercase cursor-pointer transition-all duration-150 font-sans ${isDone ? (isDoneHovered ? "bg-[#EF4444] border-[#EF4444] text-white" : "bg-[#10B981] border-[#10B981] text-white") : "bg-[#F4F4F5] text-[#18181B] border-[#E4E4E7] hover:bg-[#E4E4E7]"}`}
            >
              {isDone
                ? isDoneHovered
                  ? "✖ Unmark Done"
                  : "✓ Completed"
                : "Mark Completed"}
            </button>
          )}
          <button
            className="bg-[#5521FF] text-white border-none px-3.5 py-[5px] rounded-[6px] text-[11px] font-bold tracking-wider uppercase cursor-pointer transition-all duration-150 shadow-[0_2px_6px_rgba(85,33,255,0.2)] font-sans hover:brightness-110"
            onClick={() =>
              onNavigate?.("journal-view", {
                experimentId: experiment?._id,
                subPart,
              })
            }
          >
            Generate Journal
          </button>
        </div>
      </header>

      {/* IDE body */}
      <div className="flex flex-1 overflow-hidden gap-[5px] p-[5px]">
        {/* LEFT */}
        <aside className="bg-white border border-[#E4E4E7] rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)] w-[calc(25%)] shrink-0">
          <div className="flex gap-[3px] p-1 bg-[#F4F4F5] border-b border-[#E4E4E7] shrink-0">
            {["theory", "algorithm", "flowchart"].map((t) => (
              <button
                key={t}
                className={`flex-1 py-1 px-0 rounded-[5px] border-none cursor-pointer text-[10px] font-bold tracking-wider uppercase transition-colors duration-150 font-sans ${activeLeftTab === t ? "bg-[#5521FF] text-white" : "bg-transparent text-[#71717A] hover:bg-[#EBEBEB] hover:text-[#18181B]"}`}
                onClick={() => setActiveLeftTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-[18px] custom-scrollbar">
            {activeLeftTab === "theory" && (
              <>
                <span className="inline-block px-1.75 py-[1px] rounded-[3px] mb-1.75 text-[9px] font-bold tracking-widest uppercase bg-[#5521FF]/10 text-[#5521FF] border border-[#5521FF]/20">
                  BH.AI GENERATED
                </span>

                <h2 className="text-base font-extrabold text-[#1E293B] mt-2.5 mb-3.5 leading-[1.2]">
                  {subExp?.title || "Experiment"}
                </h2>

                {/* Tags */}
                <div className="mb-5">
                  {/* Difficulty */}
                  {subExp?.difficulty && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[12px] font-extrabold text-[#1E293B] uppercase tracking-widest">
                        Difficulty
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-[3px] rounded-[4px] uppercase tracking-wider ${
                          subExp.difficulty.toLowerCase() === "easy"
                            ? "bg-[#DCFCE7] text-[#166534]"
                            : subExp.difficulty.toLowerCase() === "medium"
                              ? "bg-[#FEF3C7] text-[#92400E]"
                              : "bg-[#FEE2E2] text-[#991B1B]"
                        }`}
                      >
                        {subExp.difficulty}
                      </span>
                    </div>
                  )}

                  {/* Concepts */}
                  {subExp?.concepts?.length > 0 && (
                    <div>
                      <div className="text-[12px] font-extrabold text-[#1E293B] uppercase tracking-widest mb-1.5">
                        Concepts
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {subExp.concepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold px-2 py-[3px] rounded-[4px] uppercase tracking-wider bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[12px] font-extrabold text-[#1E293B] uppercase tracking-widest mb-1.5 mt-4.5">
                  Problem Statement
                </div>
                <p className="text-[11px] text-[#475569] leading-relaxed">
                  {subExp?.problemStatement ||
                    "Implement and analyze the algorithm."}
                </p>

                {subExp?.theory && (
                  <>
                    <div className="text-[12px] font-extrabold text-[#1E293B] uppercase tracking-widest mb-1.5 mt-4.5">
                      Theory
                    </div>
                    <p className="text-[11px] text-[#475569] leading-relaxed">
                      {subExp.theory}
                    </p>
                  </>
                )}

                {/* Example Blocks */}
                {subExp?.samples && subExp.samples.length > 0 && (
                  <div className="mt-6">
                    {subExp.samples.map((sample, idx) => (
                      <div
                        key={idx}
                        className="bg-[#F8FAFC] rounded-[14px] p-4 mt-2 mb-3"
                      >
                        <div className="text-[12px] font-bold text-[#1E293B] mb-2.5">
                          Example {idx + 1}
                        </div>
                        <div className="flex flex-col gap-[3px] py-1 mb-1.5">
                          <span className="text-[#64748B] shrink-0">
                            Input:
                          </span>
                          <span className="font-mono font-medium text-[#0F172A] text-left whitespace-pre-wrap break-all text-[11px]">
                            {sample.input}
                          </span>
                        </div>
                        <div className="flex flex-col gap-[3px] py-1">
                          <span className="text-[#64748B] shrink-0">
                            Output:
                          </span>
                          <span className="font-mono font-medium text-[#0F172A] text-left whitespace-pre-wrap break-all text-[11px]">
                            {sample.output}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {activeLeftTab === "algorithm" && (
              <>
                <div className="text-[10px] font-bold text-[#5521FF] uppercase tracking-widest mb-2">
                  Step-by-Step Logic
                </div>
                <div className="bg-[#F9F9FB] border border-[#E4E4E7] rounded-lg p-3 font-mono text-[11px] leading-relaxed text-[#334155] whitespace-pre-line">
                  {subExp?.algorithm ||
                    `START\nStep 1: Read array of n elements\nStep 2: For i = 0 to n-2\n  For j = 0 to n-i-2\n    If arr[j] > arr[j+1]\n      Swap elements\nStep 3: Print sorted array\nEND`}
                </div>
              </>
            )}
            {activeLeftTab === "flowchart" && (
              <>
                <div className="text-[10px] font-bold text-[#5521FF] uppercase tracking-widest mb-2">
                  Logic Flow
                </div>
                <div className="bg-[#F9F9FB] border border-[#E4E4E7] rounded-lg p-1.5 overflow-auto">
                  <FlowchartRenderer
                    nodes={subExp?.flowchart?.nodes}
                    edges={subExp?.flowchart?.edges}
                  />
                </div>
              </>
            )}
          </div>
        </aside>

        {/* CENTER */}
        <section className="bg-white border border-[#E4E4E7] rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex-1 min-w-0">
          <div className="flex items-center bg-[#F4F4F5] border-b border-[#E4E4E7] h-[34px] shrink-0">
            <div className="flex items-center gap-1.25 px-3.5 h-full bg-white border-r border-[#E4E4E7] font-mono text-[11px] text-[#18181B]">
              <span className="text-[#5521FF] text-xs">◉</span>
              <span>main.{EXTENSION_MAP[editorLanguage] || "c"}</span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={MONACO_LANG_MAP[editorLanguage] || "c"}
              theme="light"
              value={code}
              onChange={(value) => {
                const newCode = value || "";
                setCode(newCode);
                setCodeByLang((prev) => ({
                  ...prev,
                  [editorLanguage]: newCode,
                }));
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
          <div className="h-[26%] border-t border-[#E4E4E7] bg-[#F4F4F5] flex flex-col shrink-0">
            <div className="flex items-center gap-3 px-3 border-b border-[#E4E4E7] bg-[#F9F9FB] shrink-0">
              <button
                className={`text-[10px] font-bold tracking-wider uppercase py-1.5 px-0.5 border-none bg-none cursor-pointer font-sans border-b-2 transition-colors duration-150 ${consoleTab === "input" ? "text-[#5521FF] border-[#5521FF]" : "text-[#71717A] border-transparent hover:text-[#18181B]"}`}
                onClick={() => setConsoleTab("input")}
              >
                Input
              </button>
              <button
                className={`text-[10px] font-bold tracking-wider uppercase py-1.5 px-0.5 border-none bg-none cursor-pointer font-sans border-b-2 transition-colors duration-150 ${consoleTab === "output" ? "text-[#5521FF] border-[#5521FF]" : "text-[#71717A] border-transparent hover:text-[#18181B]"}`}
                onClick={() => setConsoleTab("output")}
              >
                Output
              </button>
              <button
                className={`text-[10px] font-bold tracking-wider uppercase py-1.5 px-0.5 border-none bg-none cursor-pointer font-sans border-b-2 transition-colors duration-150 ${consoleTab === "errors" ? "text-[#5521FF] border-[#5521FF]" : "text-[#71717A] border-transparent hover:text-[#18181B]"}`}
                onClick={() => setConsoleTab("errors")}
              >
                Errors{consoleErrors ? " (1)" : ""}
              </button>
            </div>
            <div className="flex-1 p-2.5 px-3 font-mono text-[11px] text-[#71717A] overflow-y-auto leading-relaxed custom-scrollbar">
              {consoleTab === "input" && (
                <textarea
                  value={stdinInput}
                  onChange={(e) => setStdinInput(e.target.value)}
                  placeholder={
                    "Type program input here (one value per line)...\nExample:\n5\n64 25 12 22 11"
                  }
                  className="w-full h-full bg-transparent border-none resize-none outline-none font-mono text-[12px] text-[#18181B] leading-relaxed"
                />
              )}
              {consoleTab === "output" &&
                (consoleOutput ? (
                  <pre className="whitespace-pre-wrap m-0">{consoleOutput}</pre>
                ) : (
                  <span className="italic text-[#A1A1AA]">
                    Click "Run" to compile and execute your code.
                  </span>
                ))}
              {consoleTab === "errors" &&
                (consoleErrors ? (
                  <pre className="text-[#DC2626] whitespace-pre-wrap m-0">
                    {consoleErrors}
                  </pre>
                ) : (
                  <span className="italic text-[#A1A1AA]">
                    No errors found.
                  </span>
                ))}
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <aside className="w-[25%] shrink-0 flex flex-col gap-[5px] max-[900px]:hidden">
          <div className="bg-white border border-[#E4E4E7] rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex-1">
            <div className="flex gap-[3px] p-1 bg-[#F4F4F5] border-b border-[#E4E4E7] shrink-0">
              {[
                ["assistant", "Assistant"],
                ["hints", "Hints"],
                ["viva", "Viva"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={`flex-1 py-1 px-0 rounded-[5px] border-none cursor-pointer text-[10px] font-bold tracking-wider uppercase transition-colors duration-150 font-sans ${activeRightTab === key ? "bg-[#5521FF] text-white" : "bg-transparent text-[#71717A] hover:bg-[#EBEBEB] hover:text-[#18181B]"}`}
                  onClick={() => setActiveRightTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-[18px] custom-scrollbar flex flex-col">
              {activeRightTab === "assistant" && (
                <div className="flex flex-col h-full gap-2.5">
                  <div className="flex items-center gap-2 mb-2 shrink-0">
                    <div className="w-6.5 h-6.5 rounded-[6px] bg-[#5521FF] flex items-center justify-center text-white text-[12px] font-bold shrink-0">
                      AI
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[#18181B]">
                        Bh.AI Assistant
                      </div>
                      <div className="text-[9px] text-[#22C55E] flex items-center gap-[3px]">
                        <span className="w-1.25 h-1.25 rounded-full bg-[#22C55E] shrink-0" />{" "}
                        Online
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-0.5 custom-scrollbar">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={
                          msg.sender === "ai"
                            ? "bg-[#F0ECFF] border border-[#5521FF]/10 rounded-[10px] rounded-tl-[2px] p-2 px-2.5 text-[11px] leading-relaxed text-[#3730A3] self-start max-w-[92%] text-wrap"
                            : "bg-[#5521FF] text-white rounded-[10px] rounded-tr-[2px] p-2 px-2.5 text-[11px] leading-relaxed self-end max-w-[85%] shadow-[0_2px_6px_rgba(85,33,255,0.2)] text-wrap"
                        }
                      >
                        {msg.sender === "ai" ? (
                          <MarkdownRenderer text={msg.text} />
                        ) : (
                          msg.text
                        )}
                      </div>
                    ))}
                    {isAiTyping && (
                      <Loader2 className="h-4 w-4 text-[#7C3AED] animate-spin" />
                    )}
                  </div>
                  <div className="shrink-0">
                    <div className="flex flex-wrap gap-[3px] mb-1.25">
                      <button
                        className="px-2 py-[3px] bg-[#F4F4F5] border border-[#E4E4E7] rounded-[4px] text-[10px] text-[#71717A] cursor-pointer transition-colors duration-150 font-sans font-semibold hover:text-[#5521FF] hover:border-[#5521FF]"
                        onClick={() =>
                          askAiMessage("Can you explain the swap logic?")
                        }
                      >
                        Swap Logic?
                      </button>
                      <button
                        className="px-2 py-[3px] bg-[#F4F4F5] border border-[#E4E4E7] rounded-[4px] text-[10px] text-[#71717A] cursor-pointer transition-colors duration-150 font-sans font-semibold hover:text-[#5521FF] hover:border-[#5521FF]"
                        onClick={() =>
                          askAiMessage("What is the time complexity?")
                        }
                      >
                        Time Complexity?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        className="w-full bg-[#F4F4F5] border border-[#E4E4E7] rounded-lg py-2 pl-2.5 pr-9 text-[11px] text-[#18181B] outline-none font-sans transition-all focus:border-[#5521FF] focus:ring-1 focus:ring-[#5521FF] placeholder:text-[#A1A1AA]"
                        type="text"
                        placeholder="Ask Bh.AI..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && askAiMessage(inputValue)
                        }
                      />
                      <button
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-none border-none cursor-pointer text-[#5521FF] rounded-full text-xs transition-colors hover:bg-[#5521FF]/10"
                        onClick={() => askAiMessage(inputValue)}
                      >
                        <SendHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeRightTab === "hints" && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center pb-1.5 border-b border-[#E4E4E7] mb-0.5">
                    <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">
                      Available Hints
                    </span>
                  </div>
                  {subExp?.hints.map((hint, idx) => {
                    const revealed = idx < revealedHints;
                    return (
                      <div
                        key={idx}
                        className={`border border-[#E4E4E7] rounded-lg p-2.5 text-[11px] transition-colors duration-150 ${revealed ? "bg-[#F9F9FB] text-[#334155]" : "bg-[#FAFAFA] text-[#71717A]"}`}
                      >
                        <div className="text-[10px] font-bold mb-1">
                          Hint {idx + 1}
                        </div>
                        {revealed ? (
                          <p className="text-[11px] leading-relaxed">{hint}</p>
                        ) : (
                          <button
                            className="bg-[#5521FF] text-white border-none rounded-[5px] px-2.5 py-1 text-[10px] font-bold cursor-pointer font-sans mt-1 hover:bg-[#5521FF]/85"
                            onClick={() =>
                              setRevealedHints((p) => Math.max(p, idx + 1))
                            }
                          >
                            Reveal Hint
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeRightTab === "viva" && (
                <div className="flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#E4E4E7] mb-0.5 shrink-0">
                    <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">
                      Viva Q&amp;A
                    </span>
                    {vivaQAPairs.length > 0 && (
                      <span className="text-[10px] font-bold text-[#5521FF] bg-[#F0ECFF] px-2 py-[2px] rounded-full border border-[#5521FF]/15">
                        {vivaQAPairs.length} questions
                      </span>
                    )}
                  </div>

                  {/* Loading */}
                  {vivaQALoading && (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                      <Loader2 className="w-5 h-5 text-[#5521FF] animate-spin" />
                      <p className="text-[11px] text-[#71717A] font-medium text-center">
                        Generating viva questions…
                      </p>
                    </div>
                  )}

                  {/* Error */}
                  {!vivaQALoading && vivaQAError && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-[11px] text-red-600">
                      {vivaQAError}
                    </div>
                  )}

                  {/* Q&A Accordion */}
                  {!vivaQALoading && vivaQAPairs.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {vivaQAPairs.map((qa, idx) => {
                        const isOpen = expandedQA === idx;
                        return (
                          <div
                            key={idx}
                            className={`border rounded-lg overflow-hidden transition-all duration-150 ${
                              isOpen
                                ? "border-[#5521FF]/40 shadow-[0_2px_12px_rgba(85,33,255,0.08)]"
                                : "border-[#E4E4E7] hover:border-[#5521FF]/30"
                            }`}
                          >
                            {/* Question row */}
                            <button
                              className="w-full text-left px-3 py-2.5 flex items-start gap-2 bg-transparent border-none cursor-pointer"
                              onClick={() => setExpandedQA(isOpen ? null : idx)}
                            >
                              <span
                                className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black mt-[1px] ${
                                  isOpen
                                    ? "bg-[#5521FF] text-white"
                                    : "bg-[#F4F4F5] text-[#71717A]"
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <span className="text-[11px] font-semibold text-[#18181B] leading-snug flex-1">
                                {qa.question}
                              </span>
                              <span
                                className={`text-[#A1A1AA] text-[10px] shrink-0 mt-[1px] transition-transform duration-150 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              >
                                ▾
                              </span>
                            </button>

                            {/* Answer */}
                            {isOpen && (
                              <div className="px-3 pb-3 pt-0.5 border-t border-[#F0ECFF] bg-[#FAFAFE]">
                                <p className="text-[11px] text-[#3730A3] leading-relaxed">
                                  {qa.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
