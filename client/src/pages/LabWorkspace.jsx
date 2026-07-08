import { useState, useEffect, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { Panel, Group, Separator } from "react-resizable-panels";
import {
  ArrowLeft,
  Loader2,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

import monacoCustomTheme from "../utils/monacoCustomTheme";
import CollapsedLeftSidebar from "../components/CollapsedLeftSidebar";
import WorkspaceLeftSidebar from "../components/WorkspaceLeftSidebar";
import WorkspaceRightSidebar from "../components/WorkspaceRightSidebar";
import CollapsedRightSidebar from "../components/CollapsedRightSidebar";
import { generateJournalPdf } from "../utils/journalPdfGenerator";
import { runJsInWebWorker } from "../workers/jsWorkerHelper";
import { runPythonInWebWorker } from "../workers/pythonWorkerHelper";
import ThemeToggle from "../components/ThemeToggle";

const COMPILER_MAP = {
  c: "gcc-head-c",
  cpp: "gcc-head",
  python: "cpython-3.12.7",
  java: "openjdk-jdk-22+36",
  javascript: "nodejs-20.17.0",
  sql: "sqlite-3.46.1",
};

const EXTENSION_MAP = {
  c: "c",
  cpp: "cpp",
  python: "py",
  java: "java",
  javascript: "js",
  sql: "sql",
};

const MONACO_LANG_MAP = {
  c: "c",
  cpp: "cpp",
  python: "python",
  java: "java",
  javascript: "javascript",
  sql: "sql",
};

const runWebDesignSandboxFromCodes = (htmlCode, jsCode) => {
  let mergedSource = htmlCode || "";
  const js = jsCode || "";

  // Script block that overrides console.log to capture logs in our console tab
  const consoleOverrideScript = `
    <script>
      (function() {
        const _log = console.log;
        const _error = console.error;
        const _warn = console.warn;
        
        function sendLog(type, args) {
          const message = args.map(arg => {
            if (typeof arg === 'object') {
              try { return JSON.stringify(arg); } catch(e) { return String(arg); }
            }
            return String(arg);
          }).join(' ');
          window.parent.postMessage({ type: 'iframe-console', logType: type, message }, '*');
        }

        console.log = function(...args) {
          _log.apply(console, args);
          sendLog('log', args);
        };
        console.warn = function(...args) {
          _warn.apply(console, args);
          sendLog('warn', args);
        };
        console.error = function(...args) {
          _error.apply(console, args);
          sendLog('error', args);
        };
        
        window.addEventListener('error', function(e) {
          window.parent.postMessage({ type: 'iframe-error', message: e.message }, '*');
        });
      })();
    </script>
  `;

  // Inject console override at the very beginning of <head> or <html>
  if (mergedSource.includes("<head>")) {
    mergedSource = mergedSource.replace("<head>", `<head>${consoleOverrideScript}`);
  } else if (mergedSource.includes("<html>")) {
    mergedSource = mergedSource.replace("<html>", `<html>${consoleOverrideScript}`);
  } else {
    mergedSource = consoleOverrideScript + mergedSource;
  }

  // Inject the user's script
  const userScriptTag = `<script>${js}</script>`;
  if (mergedSource.includes('<script src="script.js"></script>')) {
    mergedSource = mergedSource.replace('<script src="script.js"></script>', userScriptTag);
  } else if (mergedSource.includes("<script src='script.js'></script>")) {
    mergedSource = mergedSource.replace("<script src='script.js'></script>", userScriptTag);
  } else if (mergedSource.includes("</body>")) {
    mergedSource = mergedSource.replace("</body>", `${userScriptTag}</body>`);
  } else {
    mergedSource = mergedSource + userScriptTag;
  }

  return mergedSource;
};

export default function LabWorkspace({
  onBack,
  experiment,
  subject,
  subPart = "a",
  onNavigate,
  onSaveCode,
  savedCode,
}) {
  const { theme, toggleTheme } = useTheme();
  const subExp =
    experiment?.subExperiments?.find((s) => s.part === subPart) ||
    experiment?.subExperiments?.[0];


  const [activeLeftTab, setActiveLeftTab] = useState("theory");
  const [activeRightTab, setActiveRightTab] = useState("assistant");

  // Boilerplate templates 
  const getTemplate = (lang) => {
    switch (lang) {
      case "c":
        return `/**
 * @file main.c
 * @brief Program entry point
 */
#include <stdio.h>

int main() {
    // Write your code here

    return 0;
}
`;

      case "cpp":
        return `/**
 * @file main.cpp
 * @brief Program entry point
 */
#include <iostream>

int main() {
    // Write your code here

    return 0;
}`;
      case "python":
        return `"""
main.py
Module entry point.
"""


def main():
    """Program entry point."""
    # Write your code here
    pass


if __name__ == "__main__":
    main()`;

      case "java":
        return `/**
 * Main class - program entry point.
 */
class Main {

    /**
     * Program entry point.
     * @param args command-line arguments
     */
    public static void main(String[] args) {
        // Write your code here

    }
}
`;

      case "javascript":
        return `/**
 * Program entry point.
 */
function main() {
  // Write your code here
}

main();
`;

      case "html":
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Web Page</title>
  <style>
    /* ── Reset & Base ── */
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
      color: #333;
    }

    /* ── Layout ── */
    header {
      background: #35424a;
      color: #fff;
      padding: 1rem;
      text-align: center;
    }

    main {
      max-width: 960px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    footer {
      background: #35424a;
      color: #fff;
      text-align: center;
      padding: 0.75rem;
      margin-top: 2rem;
    }
  </style>
</head>
<body>

  <header>
    <h1>My Web Page</h1>
  </header>

  <main>
    <section>
      <h2>Welcome</h2>
      <p>Start editing this page and click <strong>Run</strong> to see the live preview.</p>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 My Page</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
`;

      case "sql":
        return `-- Write your SQL queries below.
-- Create tables, insert data, and run SELECT queries.

-- Example:
CREATE TABLE student (
    id   INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

INSERT INTO student VALUES (1, 'Alice');
INSERT INTO student VALUES (2, 'Bob');

SELECT * FROM student;
`;

      default:
        return `// Write your code here\n`;
    }
  };

  const getReferenceSolution = (lang) => {
    if (!subExp?.referenceSolution) return "";
    const solutions = subExp.referenceSolution;
    let val = "";
    if (typeof solutions.get === "function") {
      val = solutions.get(lang) || "";
    } else {
      val = solutions[lang] || "";
    }
    return val;
    return val;
  };

  // Keys present on the referenceSolution object (Map or plain object)
  const refSolKeys = useMemo(() => {
    if (!subExp?.referenceSolution) return [];
    const solutions = subExp.referenceSolution;
    if (typeof solutions.keys === "function") {
      return Array.from(solutions.keys());
    }
    return Object.keys(solutions);
  }, [subExp]);

  // Derive supported languages purely from referenceSolution keys.
  // Falls back to an explicit subExp.supportedLanguages field only if no
  // reference solution languages are defined at all.
  // Derive supported languages purely from referenceSolution keys.
  // If referenceSolution contains only SQL keys (DBMS experiments), keep sql.
  // Otherwise filter out SQL and fall back to ["c"] if nothing else remains.
  const supportedLanguages = useMemo(() => {
    const sqlKeys = new Set(["sql", "sqlite"]);
    const excludeSql = (langs) => langs.filter((lang) => !sqlKeys.has(lang));

    if (refSolKeys.length > 0) {
      // If every key is SQL-based, expose exactly ["sql"]
      const allSql = refSolKeys.every((k) => sqlKeys.has(k));
      if (allSql) return ["sql"];
      const filtered = excludeSql(refSolKeys);
      return filtered.length > 0 ? filtered : ["c"];
    }

    const fallback = subExp?.supportedLanguages?.length
      ? subExp.supportedLanguages
      : ["c"];

    const allSql = fallback.every((k) => sqlKeys.has(k));
    if (allSql) return ["sql"];
    const filtered = excludeSql(fallback);
    return filtered.length > 0 ? filtered : ["c"];
  }, [subExp, refSolKeys]);

  const isWebDesign = useMemo(() => {
    return refSolKeys.includes("html") && refSolKeys.includes("javascript");
  }, [refSolKeys]);

  const [webDesignActiveFile, setWebDesignActiveFile] = useState("html");
  const [iframeSrcDoc, setIframeSrcDoc] = useState("");

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

  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalPdfUrl, setJournalPdfUrl] = useState("");
  const [journalPdfBlob, setJournalPdfBlob] = useState(null);
  const [isGeneratingJournal, setIsGeneratingJournal] = useState(false);

  useEffect(() => {
    if (!showJournalModal) {
      if (journalPdfUrl) {
        URL.revokeObjectURL(journalPdfUrl);
        setJournalPdfUrl("");
      }
      setJournalPdfBlob(null);
      return;
    }

    let active = true;
    setIsGeneratingJournal(true);

    async function loadPdf() {
      try {
        const bytes = await generateJournalPdf({
          experiment,
          subPart,
          codeText: isWebDesign
            ? JSON.stringify({
              html: codeByLang.html || "",
              javascript: codeByLang.javascript || "",
            })
            : code,
          outputText: consoleOutput,
        });
        if (!active) return;
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setJournalPdfBlob(blob);
        setJournalPdfUrl(url);
      } catch (err) {
        console.error("Failed to generate journal PDF:", err);
      } finally {
        if (active) {
          setIsGeneratingJournal(false);
        }
      }
    }

    loadPdf();

    return () => {
      active = false;
    };
  }, [showJournalModal, experiment, subPart, code, consoleOutput, codeByLang, isWebDesign]);

  const handleDownloadJournalPdf = () => {
    if (!journalPdfBlob) return;
    const url = URL.createObjectURL(journalPdfBlob);
    const link = document.createElement("a");
    link.href = url;
    const filename = `${(subExp?.title || "Journal").replace(/\s+/g, "_")}_Record.pdf`;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

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
    const defaultLang =
      refSolKeys.length > 0 && supportedLanguages.includes(refSolKeys[0])
        ? refSolKeys[0]
        : supportedLanguages[0] || "c";

    const isWD = refSolKeys.includes("html") && refSolKeys.includes("javascript");

    if (isWD) {
      initial["html"] = getTemplate("html");
      initial["javascript"] = getTemplate("javascript");

      let savedObj = null;
      if (savedCode) {
        try {
          savedObj = JSON.parse(savedCode);
        } catch (e) {
          console.error("Failed to parse saved Web Design code:", e);
        }
      }

      if (savedObj) {
        if (savedObj.html !== undefined) initial["html"] = savedObj.html;
        if (savedObj.javascript !== undefined) initial["javascript"] = savedObj.javascript;
      }

      setCodeByLang(initial);
      setConsoleOutput("");
      setConsoleErrors("");
      setEditorLanguage("javascript");
      setWebDesignActiveFile("html");
      setCode(initial["html"] || "");
    } else {
      supportedLanguages.forEach((lang) => {
        initial[lang] = getTemplate(lang);
      });

      if (savedCode) {
        initial[defaultLang] = savedCode;
      }

      setCodeByLang(initial);
      setConsoleOutput("");
      setConsoleErrors("");
      setEditorLanguage(defaultLang);
      setCode(savedCode || initial[defaultLang] || "");
    }

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

        const response = await fetch(`/api/vivas/qa`, {
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

  // Handle messages from sandboxed iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data) return;
      if (event.data.type === "iframe-console") {
        const { logType, message } = event.data;
        if (logType === "error") {
          setConsoleErrors((prev) => (prev ? prev + "\n" : "") + message);
        } else {
          setConsoleOutput((prev) => (prev ? prev + "\n" : "") + message);
        }
      } else if (event.data.type === "iframe-error") {
        const { message } = event.data;
        setConsoleErrors((prev) => (prev ? prev + "\n" : "") + `Runtime Error: ${message}`);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Sync console tab for Web Design
  useEffect(() => {
    if (isWebDesign) {
      setConsoleTab("preview");
    } else {
      setConsoleTab("input");
    }
  }, [isWebDesign]);

  const handleTabChange = (targetFile) => {
    setWebDesignActiveFile(targetFile);
    setCode(codeByLang[targetFile] || "");
  };

  // Runs when language changes — load from codeByLang or starter template
  // Runs when language changes — load from codeByLang or starter template
  // Skip entirely for Web Design: code is controlled by webDesignActiveFile, not editorLanguage
  useEffect(() => {
    if (isWebDesign) return;
    if (
      codeByLang[editorLanguage] !== undefined &&
      codeByLang[editorLanguage] !== ""
    ) {
      setCode(codeByLang[editorLanguage]);
    } else {
      setCode(getTemplate(editorLanguage));
    }
  }, [editorLanguage, isWebDesign]);

  // Keep editorLanguage in sync if supportedLanguages list shifts
  useEffect(() => {
    if (
      supportedLanguages.length > 0 &&
      !supportedLanguages.includes(editorLanguage)
    ) {
      setEditorLanguage(supportedLanguages[0]);
    }
  }, [supportedLanguages, editorLanguage]);

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
        [isWebDesign ? webDesignActiveFile : editorLanguage]: current,
      }));

      // ~60 FPS
      await new Promise((r) => setTimeout(r, 8));
    }
  };

  const handleSolveQuestion = async () => {
    if (isWebDesign) {
      const refHtml = getReferenceSolution("html");
      const refJs = getReferenceSolution("javascript");

      if (!refHtml && !refJs) {
        alert("No solution available for this experiment.");
        return;
      }

      const initial = {
        html: refHtml || "",
        javascript: refJs || "",
      };

      setCodeByLang(initial);

      // Stream the code of the currently active file tab
      const activeRef = webDesignActiveFile === "html" ? initial.html : initial.javascript;
      await streamCode(activeRef);

      // Save the combined code
      const serialized = JSON.stringify(initial);
      if (onSaveCode) {
        onSaveCode(experiment._id, subPart, serialized);
      }

      // Open AI assistant tab
      setActiveRightTab("assistant");

      // Initialize streaming explanation in chat
      setChatMessages((prev) => [
        ...prev,
        { sender: "user", text: "Explain the solved HTML & JavaScript code for me." },
        { sender: "ai", text: "Analyzing the solution code..." },
      ]);
      setIsAiTyping(true);

      try {
        const res = await fetch(`/api/explain`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            experimentTitle: subExp?.title,
            problemStatement: subExp?.problemStatement,
            algorithm: subExp?.algorithm,
            code: `<!-- index.html -->\n${initial.html}\n\n// script.js\n${initial.javascript}`,
            language: "html/javascript",
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
      return;
    }

    const refSol = getReferenceSolution(editorLanguage);
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
      const res = await fetch(`/api/explain`, {
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
    if (isWebDesign) {
      setIsRunning(true);
      setConsoleOutput("");
      setConsoleErrors("");
      setConsoleTab("preview");

      const htmlVal = codeByLang.html || "";
      const jsVal = codeByLang.javascript || "";

      // Save code first
      if (onSaveCode) {
        onSaveCode(
          experiment._id,
          subPart,
          JSON.stringify({
            html: htmlVal,
            javascript: jsVal,
          })
        );
      }

      setTimeout(() => {
        const merged = runWebDesignSandboxFromCodes(htmlVal, jsVal);
        setIframeSrcDoc(merged);
        setIsRunning(false);
        setSaveStatus("Saved");
      }, 500);
      return;
    }

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
          "tensorflow",
          "torch",
          "keras",
          "cv2",
          "flask",
          "django",
          "fastapi",
          "requests",
          "pymongo",
          "boto3",
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
            `The online runner supports Python's standard library and scientific libraries (numpy, pandas, matplotlib, etc.).\n` +
            `Heavy packages like tensorflow, torch, flask, etc. require a local environment.\n\n` +
            `✦ Run locally:\n` +
            `  pip install ${[...new Set(found)].join(" ")}\n` +
            `  python your_file.py`,
          );
          return;
        }
      }

      let data;

      if (editorLanguage === "javascript") {
        data = await runJsInWebWorker(code);
      } else if (["python", "python3", "py"].includes(editorLanguage)) {
        data = await runPythonInWebWorker(code, normalizedStdin);
      } else {
        // Use Wandbox for all other languages via our server
        const res = await fetch(`/api/run`, {
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
      }

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
      const res = await fetch(`/api/chat`, {
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
    <div className="h-screen flex flex-col overflow-hidden bg-[#FAFAFA] dark:bg-slate-950 selection:bg-[#5521FF]/20 font-sans text-[13px] text-[#18181B] dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-1.5 border-b border-[#E4E4E7] dark:border-transparent bg-white dark:bg-slate-900 z-50 shrink-0 relative h-11 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <button
            className="text-[11px] flex items-center justify-center gap-1 font-semibold text-[#71717A] dark:text-slate-400 bg-none border-none cursor-pointer px-2 py-1 rounded-[6px] transition-colors duration-150 font-sans tracking-wide hover:bg-[#F4F4F5] dark:hover:bg-slate-800 hover:text-[#18181B] dark:hover:text-slate-200"
            onClick={onBack}
          >
            <ArrowLeft size={16} /> <span>Back</span>
          </button>
          <div className="w-[1px] h-3.5 bg-slate-200 dark:bg-slate-800" />
          <ThemeToggle />
          <nav className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[#71717A] uppercase">
            <span onClick={onBack}></span>
          </nav>
        </div>

        {/* Language selector — dropdown if multiple, static pill if single */}
        {isWebDesign ? (
          <div className="absolute left-1/2 -translate-x-1/2 bg-[#F9F9FB] dark:bg-slate-800 border border-[#E4E4E7] dark:border-transparent rounded-full px-3.5 py-[3px] font-mono text-[10px] text-[#71717A] dark:text-slate-300 uppercase tracking-widest whitespace-nowrap hidden md:block transition-colors duration-200">
            JAVASCRIPT Language
          </div>
        ) : supportedLanguages.length > 1 ? (
          <select
            className="absolute left-1/2 -translate-x-1/2 bg-[#F9F9FB] dark:bg-slate-800 border border-[#E4E4E7] dark:border-transparent rounded-full px-3.5 py-[3px] font-mono text-[10px] text-[#71717A] dark:text-slate-300 uppercase tracking-widest whitespace-nowrap cursor-pointer outline-none transition-colors duration-150 hover:border-[#5521FF] hover:text-[#5521FF] focus:border-[#5521FF] focus:ring-2 focus:ring-[#5521FF]/15 max-[900px]:hidden"
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
          <div className="absolute left-1/2 -translate-x-1/2 bg-[#F9F9FB] dark:bg-slate-800 border border-[#E4E4E7] dark:border-transparent rounded-full px-3.5 py-[3px] font-mono text-[10px] text-[#71717A] dark:text-slate-300 uppercase tracking-widest whitespace-nowrap hidden md:block transition-colors duration-200">
            {editorLanguage.toUpperCase()} Language
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <div className="text-[10px] font-semibold text-[#71717A] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span className="w-[5px] h-[5px] rounded-full bg-[#22C55E] shrink-0" />{" "}
            {saveStatus}
          </div>
          <div className="w-[1px] h-[18px] bg-[#E4E4E7] dark:bg-slate-800 shrink-0" />
          <button
            className="bg-[#22C55E]/10 dark:bg-emerald-950/20 text-[#166534] dark:text-emerald-400 border border-[#22C55E]/30 dark:border-emerald-900/30 px-3.5 py-[5px] rounded-[6px] text-[11px] font-bold tracking-wider uppercase cursor-pointer transition-colors duration-150 font-sans hover:bg-[#22C55E]/20 dark:hover:bg-emerald-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRunCode}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run"}
          </button>
          <button
            className="bg-[#5521FF]/10 dark:bg-[#5521FF]/20 text-[#5521FF] dark:text-violet-300 border border-[#5521FF]/30 dark:border-[#5521FF]/40 px-3.5 py-[5px] rounded-[6px] text-[11px] font-bold tracking-wider uppercase cursor-pointer transition-colors duration-150 font-sans hover:bg-[#5521FF]/20 dark:hover:bg-[#5521FF]/30"
            onClick={handleSolveQuestion}
          >
            Solve Question
          </button>
          {completionKey && (
            <button
              onClick={toggleWorkspaceCompleted}
              onMouseEnter={() => setIsDoneHovered(true)}
              onMouseLeave={() => setIsDoneHovered(false)}
              className={`border px-3.5 py-[5px] rounded-[6px] text-[11px] font-bold tracking-wider uppercase cursor-pointer transition-all duration-150 font-sans ${isDone ? (isDoneHovered ? "bg-[#EF4444] border-[#EF4444] text-white" : "bg-[#10B981] border-[#10B981] text-white") : "bg-[#F4F4F5] dark:bg-slate-800 text-[#18181B] dark:text-slate-200 border-[#E4E4E7] dark:border-transparent hover:bg-[#E4E4E7] dark:hover:bg-slate-700"}`}
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
            onClick={() => setShowJournalModal(true)}
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
            className="bg-white dark:bg-black border border-[#E4E4E7] rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
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
            className="bg-white dark:bg-black border border-[#E4E4E7] dark:border-slate-900 rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
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
          <div className="absolute inset-0 bg-[#E4E4E7] dark:bg-slate-900 group-hover:bg-[#5521FF] transition-colors" />
        </Separator>

        {/* CENTER */}
        <Panel
          defaultSize={"50%"}
          minSize={"30%"}
          maxSize={"90%"}
          className="bg-white border border-[#E4E4E7] dark:border-slate-900 rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex-1 min-w-0"
        >
          <Group orientation="vertical">
            <Panel
              defaultSize={"72%"}
              minSize={"20%"}
              className="flex flex-col min-h-0"
            >
              <div className="flex items-center bg-[#F4F4F5] dark:bg-[#0f0f0f] border-b border-[#E4E4E7] dark:border-slate-900 h-[34px] shrink-0">
                {isWebDesign ? (
                  <>
                    <button
                      onClick={() => handleTabChange("html")}
                      className={`flex items-center gap-2 px-4 h-full border-r border-[#E4E4E7] dark:border-slate-900 font-mono text-[11px] transition-all cursor-pointer ${webDesignActiveFile === "html"
                          ? "bg-white dark:bg-black text-[#18181B] dark:text-white font-bold"
                          : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-900/50"
                        }`}
                    >
                      <span className="text-orange-500 text-xs">◉</span>
                      <span>index.html</span>
                    </button>
                    <button
                      onClick={() => handleTabChange("javascript")}
                      className={`flex items-center gap-2 px-4 h-full border-r border-[#E4E4E7] dark:border-slate-900 font-mono text-[11px] transition-all cursor-pointer ${webDesignActiveFile === "javascript"
                          ? "bg-white dark:bg-black text-[#18181B] dark:text-white font-bold"
                          : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-900/50"
                        }`}
                    >
                      <span className="text-yellow-500 text-xs">◉</span>
                      <span>script.js</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-1.25 px-3.5 h-full bg-white dark:bg-black border-r border-[#E4E4E7] dark:border-slate-900 font-mono text-[11px] text-[#18181B] dark:text-white">
                    <span className="text-[#5521FF] text-xs">◉</span>
                    <span>main.{EXTENSION_MAP[editorLanguage] || "c"}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <Editor
                  beforeMount={monacoCustomTheme}
                  theme={theme === "dark" ? "bh-dark" : "bh-light"}
                  height="100%"
                  language={isWebDesign ? webDesignActiveFile : (MONACO_LANG_MAP[editorLanguage] || "c")}
                  value={code}
                  onChange={(value) => {
                    const newCode = value || "";
                    setCode(newCode);

                    if (isWebDesign) {
                      setCodeByLang((prev) => {
                        const updated = {
                          ...prev,
                          [webDesignActiveFile]: newCode,
                        };
                        setSaveStatus("Saving...");
                        if (onSaveCode) {
                          onSaveCode(
                            experiment._id,
                            subPart,
                            JSON.stringify({
                              html: updated.html || "",
                              javascript: updated.javascript || "",
                            })
                          );
                        }
                        setTimeout(() => setSaveStatus("Saved"), 600);
                        return updated;
                      });
                    } else {
                      setCodeByLang((prev) => ({
                        ...prev,
                        [editorLanguage]: newCode,
                      }));
                      setSaveStatus("Saving...");
                      if (onSaveCode) {
                        onSaveCode(experiment._id, subPart, newCode);
                      }
                      setTimeout(() => setSaveStatus("Saved"), 600);
                    }
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
              <div className="absolute inset-0 bg-[#E4E4E7] dark:bg-slate-800 group-hover:bg-[#5521FF] transition-colors" />
            </Separator>

            {/* CONSOLE SECTION */}
            <Panel
              defaultSize={"28%"}
              minSize={"5%"}
              maxSize={"80%"}
              className="flex flex-col min-h-0 border-t border-[#E4E4E7] dark:border-transparent bg-[#F4F4F5] dark:bg-slate-900 transition-colors duration-200"
            >
              <div className="flex items-center gap-3 px-3 border-b border-[#E4E4E7] dark:border-transparent bg-[#F9F9FB] dark:bg-slate-950 shrink-0 transition-colors duration-200">
                {isWebDesign ? (
                  <>
                    <button
                      className={`text-[10px] font-bold tracking-wider uppercase py-1.5 px-0.5 border-none bg-none cursor-pointer font-sans border-b-2 transition-colors duration-150 ${consoleTab === "preview"
                          ? "text-[#5521FF] dark:text-violet-400 border-[#5521FF] dark:border-violet-400"
                          : "text-[#71717A] dark:text-slate-400 border-transparent hover:text-[#18181B] dark:hover:text-slate-200"
                        }`}
                      onClick={() => setConsoleTab("preview")}
                    >
                      Preview
                    </button>
                    <button
                      className={`text-[10px] font-bold tracking-wider uppercase py-1.5 px-0.5 border-none bg-none cursor-pointer font-sans border-b-2 transition-colors duration-150 ${consoleTab === "output"
                          ? "text-[#5521FF] dark:text-violet-400 border-[#5521FF] dark:border-violet-400"
                          : "text-[#71717A] dark:text-slate-400 border-transparent hover:text-[#18181B] dark:hover:text-slate-200"
                        }`}
                      onClick={() => setConsoleTab("output")}
                    >
                      Console
                    </button>
                    <button
                      className={`text-[10px] font-bold tracking-wider uppercase py-1.5 px-0.5 border-none bg-none cursor-pointer font-sans border-b-2 transition-colors duration-150 ${consoleTab === "errors"
                          ? "text-[#5521FF] dark:text-violet-400 border-[#5521FF] dark:border-violet-400"
                          : "text-[#71717A] dark:text-slate-400 border-transparent hover:text-[#18181B] dark:hover:text-slate-200"
                        }`}
                      onClick={() => setConsoleTab("errors")}
                    >
                      Errors{consoleErrors ? ` (${consoleErrors.split('\n').filter(Boolean).length})` : ""}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`text-[10px] font-bold tracking-wider uppercase py-1.5 px-0.5 border-none bg-none cursor-pointer font-sans border-b-2 transition-colors duration-150 ${consoleTab === "input"
                          ? "text-[#5521FF] dark:text-violet-400 border-[#5521FF] dark:border-violet-400"
                          : "text-[#71717A] dark:text-slate-400 border-transparent hover:text-[#18181B] dark:hover:text-slate-200"
                        }`}
                      onClick={() => setConsoleTab("input")}
                    >
                      Input
                    </button>
                    <button
                      className={`text-[10px] font-bold tracking-wider uppercase py-1.5 px-0.5 border-none bg-none cursor-pointer font-sans border-b-2 transition-colors duration-150 ${consoleTab === "output"
                          ? "text-[#5521FF] dark:text-violet-400 border-[#5521FF] dark:border-violet-400"
                          : "text-[#71717A] dark:text-slate-400 border-transparent hover:text-[#18181B] dark:hover:text-slate-200"
                        }`}
                      onClick={() => setConsoleTab("output")}
                    >
                      Output
                    </button>
                    <button
                      className={`text-[10px] font-bold tracking-wider uppercase py-1.5 px-0.5 border-none bg-none cursor-pointer font-sans border-b-2 transition-colors duration-150 ${consoleTab === "errors"
                          ? "text-[#5521FF] dark:text-violet-400 border-[#5521FF] dark:border-violet-400"
                          : "text-[#71717A] dark:text-slate-400 border-transparent hover:text-[#18181B] dark:hover:text-slate-200"
                        }`}
                      onClick={() => setConsoleTab("errors")}
                    >
                      Errors{consoleErrors ? " (1)" : ""}
                    </button>
                  </>
                )}
              </div>
              <div className="flex-1 min-h-0 p-2.5 px-3 font-mono text-[11px] text-[#71717A] dark:text-slate-300 overflow-auto leading-relaxed custom-scrollbar">
                {consoleTab === "preview" && isWebDesign && (
                  <div className="w-full h-full bg-white relative rounded-[8px] overflow-hidden border border-slate-200 dark:border-slate-800">
                    {iframeSrcDoc ? (
                      <iframe
                        srcDoc={iframeSrcDoc}
                        title="Web Design Preview"
                        sandbox="allow-scripts allow-modals allow-popups allow-forms"
                        className="w-full h-full border-none bg-white"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[#A1A1AA] italic bg-white dark:bg-slate-900">
                        Click "Run" to render preview
                      </div>
                    )}
                  </div>
                )}
                {consoleTab === "input" && !isWebDesign && (
                  <div className="flex flex-col h-full gap-2.5">
                    {/* Test Case Selector Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0 select-none pb-1 border-b border-[#E4E4E7]/40 dark:border-transparent/40">
                      {testCases.map((tc, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setActiveTestCaseIdx(idx);
                            setStdinInput(tc);
                          }}
                          className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-[11px] font-semibold transition-all duration-150 cursor-pointer ${activeTestCaseIdx === idx
                              ? "bg-white dark:bg-slate-800 border-[#E4E4E7] dark:border-transparent text-[#5521FF] dark:text-violet-400 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-none font-bold"
                              : "bg-transparent border-transparent text-[#71717A] dark:text-slate-400 hover:bg-[#E4E4E7]/40 dark:hover:bg-slate-800/40 hover:text-[#18181B] dark:hover:text-slate-200"
                            }`}
                        >
                          <span className="p-[3px] rounded-full bg-[#5521ff]"></span>
                          <span>Case {idx + 1}</span>
                          {testCases.length > 1 && (
                            <button
                              onClick={(e) => deleteTestCase(idx, e)}
                              className="opacity-0 group-hover:opacity-100 text-[#A1A1AA] dark:text-slate-500 hover:text-red-500 font-bold transition-all duration-150 p-0 text-[12px] leading-none shrink-0"
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
                        className="px-2 py-1 rounded-[6px] border border-dashed border-[#D4D4D8] dark:border-transparent hover:border-[#5521FF] dark:hover:border-violet-400 hover:text-[#5521FF] dark:hover:text-violet-400 text-[#71717A] dark:text-slate-400 text-[10px] font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center gap-0.5"
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
                        className="w-full h-full bg-transparent border-none resize-none outline-none font-mono text-[12px] text-[#18181B] dark:text-slate-200 leading-relaxed"
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
                      {isWebDesign ? "No console logs printed." : 'Click "Run" to compile and execute your code.'}
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
          <div className="absolute inset-0 bg-[#E4E4E7] dark:bg-slate-900 group-hover:bg-[#5521FF] transition-colors" />
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

      {/* Journal Preview Modal */}
      {showJournalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-[#FAFAFA] dark:bg-slate-900 w-full max-w-[900px] h-[90vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden border border-slate-200/50 dark:border-transparent transition-colors duration-200">
            {/* Header */}
            <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-transparent px-6 py-4 flex items-center justify-between shadow-sm transition-colors duration-200">
              <div className="flex items-center space-x-3.5">
                <button
                  onClick={() => setShowJournalModal(false)}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-transparent p-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95"
                  title="Close Preview"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
                <div>
                  <h1 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight">
                    Practical Journal Preview
                  </h1>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Engineering Portal V4.2
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDownloadJournalPdf}
                  disabled={isGeneratingJournal || !journalPdfBlob}
                  className="bg-[#630ed4] hover:bg-[#520cb2] disabled:opacity-50 text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md cursor-pointer transition-all active:scale-95"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setShowJournalModal(false)}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-full cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview Frame */}
            <div className="flex-1 p-6 flex items-center justify-center bg-slate-100/50 dark:bg-slate-950 transition-colors duration-200">
              {isGeneratingJournal ? (
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="w-8 h-8 text-[#630ed4] animate-spin" />
                  <span className="text-slate-500 dark:text-slate-400 font-semibold text-xs">
                    Generating Journal PDF...
                  </span>
                </div>
              ) : journalPdfUrl ? (
                <iframe
                  src={`${journalPdfUrl}#navpanes=0&toolbar=1`}
                  title="Practical Journal PDF Preview"
                  className="w-full h-full border border-slate-200 dark:border-transparent rounded-[20px] shadow-lg bg-white"
                />
              ) : (
                <span className="text-slate-400 text-xs font-semibold">
                  Failed to load preview
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
