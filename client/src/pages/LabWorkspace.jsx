import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import FlowchartRenderer from "../components/FlowchartRenderer";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { Panel, Group, Separator, usePanelRef } from "react-resizable-panels";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  SendHorizontal,
  X,
} from "lucide-react";
import monacoCustomTheme from "../utils/monacoCustomTheme";
import CollapsedLeftSidebar from "../components/CollapsedLeftSidebar";
import WorkspaceLeftSidebar from "../components/WorkspaceLeftSidebar";
import WorkspaceRightSidebar from "../components/WorkspaceRightSidebar";
import CollapsedRightSidebar from "../components/CollapsedRightSidebar";

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

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const [consoleOutput, setConsoleOutput] = useState("");
  const [consoleErrors, setConsoleErrors] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [consoleTab, setConsoleTab] = useState("input");
  const [stdinInput, setStdinInput] = useState("");
  const [testCases, setTestCases] = useState([""]);
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: `Hello! I've analyzed your requirements for "${subExp?.title || "this experiment"}". How can I help?`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
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

    // Pre-fill test cases from subExp samples
    const samples = subExp?.samples || [];
    const initialTestCases =
      samples.length > 0 ? samples.map((s) => s.input || "") : [""];
    setTestCases(initialTestCases);
    setActiveTestCaseIdx(0);
    setStdinInput(initialTestCases[0] || "");
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

  const deleteTestCase = (idx, e) => {
    e.stopPropagation();
    if (testCases.length <= 1) return;

    const nextTestCases = testCases.filter((_, i) => i !== idx);
    setTestCases(nextTestCases);

    let nextActiveIdx = activeTestCaseIdx;
    if (activeTestCaseIdx >= nextTestCases.length) {
      nextActiveIdx = nextTestCases.length - 1;
    }
    setActiveTestCaseIdx(nextActiveIdx);
    setStdinInput(nextTestCases[nextActiveIdx] || "");
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
      console.log("/explain\n", subExp);
      const res = await fetch(`${apiBase}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentTitle: subExp?.title,
          problemStatement: subExp?.problemStatement,
          algorithm: subExp?.algorithm,
          code: refSol,
          language: editorLanguage,
        }),
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

  const toggleLeft = () => setLeftCollapsed((prev) => !prev);
  const toggleRight = () => setRightCollapsed((prev) => !prev);

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
      <Group className="flex relative h-full flex-1 overflow-hidden gap-[5px] p-[5px]">
        {/* LEFT */}
        {leftCollapsed ? (
          <Panel
            defaultSize={35}
            minSize={35}
            maxSize={35}
            className="bg-white border border-[#E4E4E7] rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
          >
            <CollapsedLeftSidebar
              setActiveLeftTab={setActiveLeftTab}
              toggleSidebar={toggleLeft}
            />
          </Panel>
        ) : (
          <Panel
            defaultSize={"25%"}
            minSize={"25%"}
            maxSize={"35%"}
            className="bg-white border border-[#E4E4E7] rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
          >
            <WorkspaceLeftSidebar
              activeLeftTab={activeLeftTab}
              setActiveLeftTab={setActiveLeftTab}
              subExp={subExp}
              toggleSidebar={toggleLeft}
            />
          </Panel>
        )}

        <Separator className="group relative w-1 cursor-col-resize">
          <div className="absolute inset-0 bg-[#E4E4E7] group-hover:bg-[#5521FF] transition-colors" />
        </Separator>

        {/* CENTER */}
        <Panel
          defaultSize={"50%"}
          minSize={"30%"}
          maxSize={"90%"}
          className="bg-white border border-[#E4E4E7] rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex-1 min-w-0"
        >
          <Group orientation="vertical">
            <Panel
              defaultSize={"72%"}
              minSize={"50%"}
              className="flex flex-col min-h-0"
            >
              <div className="flex items-center bg-[#F4F4F5] border-b border-[#E4E4E7] h-[34px] shrink-0">
                <div className="flex items-center gap-1.25 px-3.5 h-full bg-white border-r border-[#E4E4E7] font-mono text-[11px] text-[#18181B]">
                  <span className="text-[#5521FF] text-xs">◉</span>
                  <span>main.{EXTENSION_MAP[editorLanguage] || "c"}</span>
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <Editor
                  beforeMount={monacoCustomTheme}
                  theme="bh-light"
                  height="100%"
                  language={MONACO_LANG_MAP[editorLanguage] || "c"}
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
                    fontFamily: "Cascadia Code",
                    automaticLayout: true,
                    padding: { top: 12 },
                    scrollBeyondLastLine: false,
                    lineNumbersMinChars: 3,
                    lineHeight: 20,
                    wordWrap: "on",
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                  }}
                />
              </div>
            </Panel>

            <Separator className="group relative h-1 cursor-row-resize">
              <div className="absolute inset-0 bg-[#E4E4E7] group-hover:bg-[#5521FF] transition-colors" />
            </Separator>

            {/* CONSOLE SECTION */}
            <Panel
              defaultSize={"28%"}
              minSize={"5%"}
              maxSize={"50%"}
              className="flex flex-col min-h-0 border-t border-[#E4E4E7] bg-[#F4F4F5]"
            >
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
              <div className="flex-1 min-h-0 p-2.5 px-3 font-mono text-[11px] text-[#71717A] overflow-auto leading-relaxed custom-scrollbar">
                {consoleTab === "input" && (
                  <div className="flex flex-col h-full gap-2.5">
                    {/* Test Case Selector Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0 select-none pb-1 border-b border-[#E4E4E7]/40">
                      {testCases.map((tc, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setActiveTestCaseIdx(idx);
                            setStdinInput(tc);
                          }}
                          className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-[11px] font-semibold transition-all duration-150 cursor-pointer ${
                            activeTestCaseIdx === idx
                              ? "bg-white border-[#E4E4E7] text-[#5521FF] shadow-[0_1px_2px_rgba(0,0,0,0.05)] font-bold"
                              : "bg-transparent border-transparent text-[#71717A] hover:bg-[#E4E4E7]/40 hover:text-[#18181B]"
                          }`}
                        >
                          <span className="p-[3px] rounded-full bg-[#5521ff]"></span>
                          <span>Case {idx + 1}</span>
                          {testCases.length > 1 && (
                            <button
                              onClick={(e) => deleteTestCase(idx, e)}
                              className="opacity-0 group-hover:opacity-100 text-[#A1A1AA] hover:text-red-500 font-bold transition-all duration-150 p-0 text-[12px] leading-none shrink-0"
                              title="Delete this test case"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const nextIdx = testCases.length;
                          setTestCases([...testCases, ""]);
                          setActiveTestCaseIdx(nextIdx);
                          setStdinInput("");
                        }}
                        className="px-2 py-1 rounded-[6px] border border-dashed border-[#D4D4D8] hover:border-[#5521FF] hover:text-[#5521FF] text-[#71717A] text-[10px] font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center gap-0.5"
                      >
                        + Add Case
                      </button>
                    </div>

                    {/* Textarea container */}
                    <div className="flex-1 relative min-h-0">
                      <textarea
                        value={stdinInput}
                        onChange={(e) => {
                          const newVal = e.target.value;
                          setStdinInput(newVal);
                          setTestCases((prev) => {
                            const next = [...prev];
                            next[activeTestCaseIdx] = newVal;
                            return next;
                          });
                        }}
                        placeholder="Type program input here (one value per line)..."
                        className="w-full h-full bg-transparent border-none resize-none outline-none font-mono text-[12px] text-[#18181B] leading-relaxed"
                      />
                    </div>
                  </div>
                )}
                {consoleTab === "output" &&
                  (consoleOutput ? (
                    <pre className="whitespace-pre-wrap m-0">
                      {consoleOutput}
                    </pre>
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
            </Panel>
          </Group>
        </Panel>

        <Separator className="group relative w-1 cursor-col-resize">
          <div className="absolute inset-0 bg-[#E4E4E7] group-hover:bg-[#5521FF] transition-colors" />
        </Separator>

        {/* RIGHT */}
        {rightCollapsed ? (
          <Panel
            defaultSize={35}
            minSize={35}
            maxSize={35}
            className="bg-white border border-[#E4E4E7] rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
          >
            <CollapsedRightSidebar
              setActiveRightTab={setActiveRightTab}
              toggleSidebar={toggleRight}
            />
          </Panel>
        ) : (
          <Panel
            defaultSize={"25%"}
            minSize={"25%"}
            maxSize={"35%"}
            className="shrink-0 flex flex-col gap-[5px] max-[900px]:hidden"
          >
            <WorkspaceRightSidebar
              activeRightTab={activeRightTab}
              setActiveRightTab={setActiveRightTab}
              chatMessages={chatMessages}
              isAiTyping={isAiTyping}
              askAiMessage={askAiMessage}
              inputValue={inputValue}
              setInputValue={setInputValue}
              subExp={subExp}
              vivaQAPairs={vivaQAPairs}
              vivaQAError={vivaQAError}
              vivaQALoading={vivaQALoading}
              expandedQA={expandedQA}
              setExpandedQA={setExpandedQA}
              toggleSidebar={toggleRight}
            />
          </Panel>
        )}
      </Group>
    </div>
  );
}
