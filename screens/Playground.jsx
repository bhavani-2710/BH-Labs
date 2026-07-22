"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { ArrowLeft, Terminal as TerminalIcon, Play, RefreshCw, AlertCircle, ChevronDown, Check } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import monacoCustomTheme from "../utils/monacoCustomTheme";
import { runJsInWebWorker } from "../workers/jsWorkerHelper";
import { runPythonInWebWorker } from "../workers/pythonWorkerHelper";
import { runCInWebWorker } from "../workers/cWorkerHelper";

const DEFAULT_TEMPLATES = {
  javascript: `/**
 * JavaScript Code Playground
 */
function main() {
  console.log("Hello, World!");
}

main();
`,
  python: `"""
Python Code Playground
"""
def main():
    print("Hello, World!")
    
    # Try reading from stdin if you typed inputs:
    # name = input("Enter your name: ")
    # print(f"Hello, {name}!")

if __name__ == "__main__":
    main()
`,
  cpp: `/**
 * C++ Code Playground
 */
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    
    // Example of reading stdin:
    // std::string name;
    // if (std::cin >> name) {
    //     std::cout << "Hello, " << name << "!" << std::endl;
    // }
    
    return 0;
}
`,
  c: `/**
 * C Code Playground
 */
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    // Example of reading stdin:
    // char name[50];
    // if (scanf("%49s", name) == 1) {
    //     printf("Hello, %s!\\n", name);
    // }
    
    return 0;
}
`,
  java: `/**
 * Java Code Playground
 */
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Example of reading stdin:
        // Scanner scanner = new Scanner(System.in);
        // if (scanner.hasNext()) {
        //     String input = scanner.next();
        //     System.out.println("Input received: " + input);
        // }
    }
}
`
};

const COMPILER_MAP = {
  java: "openjdk-jdk-22+36",
};

export default function Playground({ experiments = [] }) {
  const { theme } = useTheme();
  
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("playground_lang") || "javascript";
  });
  
  const [codeByLang, setCodeByLang] = useState(() => {
    const saved = localStorage.getItem("playground_codes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_TEMPLATES, ...parsed };
      } catch (e) {
        // Fall back to default
      }
    }
    return { ...DEFAULT_TEMPLATES };
  });

  const router = useRouter();
  const [code, setCode] = useState(() => {
    const savedCode = codeByLang[language];
    return savedCode !== undefined ? savedCode : DEFAULT_TEMPLATES[language];
  });
  const [stdin, setStdin] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [consoleErrors, setConsoleErrors] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Sync code when language changes
  useEffect(() => {
    const savedCode = codeByLang[language];
    setCode(savedCode !== undefined ? savedCode : DEFAULT_TEMPLATES[language]);
    localStorage.setItem("playground_lang", language);
  }, [language]);

  // Persist code changes
  const handleCodeChange = (newVal) => {
    const val = newVal || "";
    setCode(val);
    setCodeByLang((prev) => {
      const updated = { ...prev, [language]: val };
      localStorage.setItem("playground_codes", JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetCode = () => {
    if (window.confirm(`Reset ${language} editor to default template?`)) {
      handleCodeChange(DEFAULT_TEMPLATES[language]);
    }
  };

  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsoleOutput("");
    setConsoleErrors("");

    const normalizedStdin = stdin.trim();

    try {
      let data;
      if (language === "javascript") {
        data = await runJsInWebWorker(code);
      } else if (language === "python") {
        data = await runPythonInWebWorker(code, normalizedStdin);
      } else if (language === "cpp" || language === "c") {
        data = await runCInWebWorker(code, language, normalizedStdin);
      } else {
        // Send to Java executor via our server
        const res = await fetch(`/api/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            compiler: COMPILER_MAP[language],
            code,
            language: "java",
            stdin: normalizedStdin,
          }),
        });
        if (!res.ok) throw new Error(`Execution request failed with status: ${res.status}`);
        data = await res.json();
      }

      let out = "";
      if (data.compiler_message) {
        out += `[Compiler Output]\n${data.compiler_message}\n\n`;
      }
      
      if (data.program_output) {
        out += data.program_output;
      }
      
      if (!data.program_output && !data.compiler_error && !data.program_error) {
        out += "(program execution succeeded with no output)\n";
      }

      let err = "";
      if (data.program_error) err = data.program_error;
      if (data.compiler_error) {
        err = (err ? err + "\n" : "") + data.compiler_error;
      }

      setConsoleOutput(out);
      if (err) {
        setConsoleErrors(err);
      }
    } catch (e) {
      setConsoleErrors(e.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200 overflow-hidden h-screen">
      {/* Main Workspace Panel */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Workspace Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-10 transition-colors duration-200">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl transition-all cursor-pointer flex items-center justify-center"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 flex items-center justify-center">
                <TerminalIcon className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800 dark:text-slate-200">Interactive Sandbox</h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Write, compile, and run code in real-time</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center justify-between space-x-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer min-w-[120px]"
              >
                <span className="capitalize">{language === "javascript" ? "JavaScript" : language === "cpp" ? "C++" : language === "c" ? "C" : language}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              
              {showLangDropdown && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowLangDropdown(false)}></div>
                  <div className="absolute right-0 mt-1.5 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-30 overflow-hidden animate-in fade-in-50 duration-100">
                    {["javascript", "python", "java", "cpp", "c"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left cursor-pointer transition-colors ${
                          language === lang
                            ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 font-bold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        <span className="capitalize">{lang === "javascript" ? "JavaScript" : lang === "cpp" ? "C++" : lang === "c" ? "C" : lang}</span>
                        {language === lang && <Check className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetCode}
              title="Reset Code Template"
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Run Button */}
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 cursor-pointer ${
                isRunning
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-700 hover:translate-y-[-0.5px]"
              }`}
            >
              <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? "animate-spin" : ""}`} />
              <span>{isRunning ? "Running..." : "Run Code"}</span>
            </button>

            <ThemeToggle />
          </div>
        </header>

        {/* 50/50 Workspace Content */}
        <div className="flex-1 flex min-h-0 min-w-0 transition-colors duration-200">
          
          {/* Left panel: Code Editor (50%) */}
          <div className="w-1/2 flex flex-col border-r border-slate-200 dark:border-slate-800 min-h-0 bg-white dark:bg-black">
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 px-4 py-2 border-b border-slate-200 dark:border-slate-800 select-none text-[11px] font-mono text-slate-500">
              <span className="text-violet-600 mr-2">◉</span>
              <span>sandbox.{language === "javascript" ? "js" : language === "python" ? "py" : language === "java" ? "java" : language === "cpp" ? "cpp" : "c"}</span>
            </div>
            
            <div className="flex-1 min-h-0">
              <Editor
                beforeMount={monacoCustomTheme}
                theme={theme === "dark" ? "bh-dark" : "bh-light"}
                height="100%"
                language={language}
                value={code}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: "Cascadia Code, Fira Code, Courier New",
                  automaticLayout: true,
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                  lineNumbersMinChars: 3,
                  lineHeight: 20,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>

          {/* Right panel: Stdin & Terminal (50%) */}
          <div className="w-1/2 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-950">
            
            {/* Top portion: Stdin Input Box */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                <span>Program Input (stdin)</span>
                <span className="text-[10px] text-slate-400 font-medium">(Optional)</span>
              </label>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Type inputs for your program here (e.g. input values separated by spaces or newlines)..."
                className="w-full h-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>

            {/* Bottom portion: Terminal Terminal output */}
            <div className="flex-1 flex flex-col min-h-0">
              
              {/* Terminal Title */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 select-none text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1.5 font-mono">
                  <TerminalIcon className="w-3.5 h-3.5 text-slate-400" />
                  Console Output
                </span>
                {consoleErrors && (
                  <span className="flex items-center gap-1 text-rose-500 text-[10px] font-bold">
                    <AlertCircle className="w-3 h-3" />
                    Process failed
                  </span>
                )}
              </div>

              {/* Terminal Console log body */}
              <div className="flex-grow p-4 overflow-y-auto bg-white dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 border-t border-slate-200 dark:border-transparent font-mono text-xs leading-relaxed space-y-2 selection:bg-violet-500/30">
                {consoleOutput && (
                  <pre className="whitespace-pre-wrap select-text">{consoleOutput}</pre>
                )}
                
                {consoleErrors && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-rose-300 font-mono text-xs whitespace-pre-wrap select-text">
                    {consoleErrors}
                  </div>
                )}
                
                {!consoleOutput && !consoleErrors && (
                  <div className="text-slate-400 dark:text-slate-500 italic select-none h-full flex items-center justify-center">
                    No output. Run code to see execution logs.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
