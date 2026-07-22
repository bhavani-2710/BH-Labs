"use client";
import {
  Loader2,
  PanelLeftClose,
  PanelRightClose,
  SendHorizontal,
} from "lucide-react";
import React, { useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

const WorkspaceRightSidebar = ({
  activeRightTab,
  setActiveRightTab,
  chatMessages,
  isAiTyping,
  askAiMessage,
  inputValue,
  setInputValue,
  subExp,
  vivaQAPairs,
  vivaQAError,
  vivaQALoading,
  expandedQA,
  setExpandedQA,
  toggleSidebar,
}) => {
  const [revealedHints, setRevealedHints] = useState(0);
  return (
    <Tabs
      value={activeRightTab}
      onValueChange={setActiveRightTab}
      className="bg-white dark:bg-slate-900 border border-[#E4E4E7] dark:border-slate-800 rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex-1"
    >
      <TabsList className="flex gap-[3px] p-1 bg-[#F4F4F5] dark:bg-slate-900 border-b border-[#E4E4E7] dark:border-slate-800 shrink-0 h-auto rounded-none">
        {[
          ["assistant", "Assistant"],
          ["hints", "Hints"],
          ["viva", "Viva"],
        ].map(([key, label]) => (
          <TabsTrigger
            key={key}
            value={key}
            className={`flex-1 py-1 px-0 rounded-[5px] border-none cursor-pointer text-[10px] font-bold tracking-wider uppercase transition-colors duration-150 font-sans data-[state=active]:bg-[#5521FF] data-[state=active]:text-white bg-transparent text-[#71717A] dark:text-slate-400 hover:bg-[#EBEBEB] dark:hover:bg-slate-800 hover:text-[#18181B] dark:hover:text-slate-200 shadow-none`}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        <TabsContent value="assistant" className="p-[18px] mt-0 flex-1 flex flex-col gap-2.5">
          <div className="flex flex-col h-full gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 mb-2 shrink-0">
                <div className="w-6.5 h-6.5 rounded-[6px] bg-[#5521FF] flex items-center justify-center text-white text-[12px] font-bold shrink-0">
                  AI
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-[#18181B] dark:text-slate-100">
                    Bh.AI Assistant
                  </div>
                  <div className="text-[9px] text-[#22C55E] flex items-center gap-[3px]">
                    <span className="w-1.25 h-1.25 rounded-full bg-[#22C55E] shrink-0" />{" "}
                    Online
                  </div>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                title="Collapse"
                className="p-2 mb-2 rounded-lg cursor-pointer text-[#71717A] dark:text-slate-400 transition-colors hover:bg-[#F4F4F5] dark:hover:bg-slate-800 hover:text-[#5521FF] dark:hover:text-violet-400"
              >
                <PanelRightClose size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-0.5 custom-scrollbar">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.sender === "ai"
                      ? "bg-[#f5f5f5] dark:bg-[#1e1e2d] border border-[#5521FF]/10 dark:border-transparent rounded-xl rounded-tl-[2px] p-2 px-2.5 text-[12px] leading-relaxed text-[#3730A3] dark:text-gray-300 self-start max-w-[92%] text-wrap transition-colors duration-200"
                      : "bg-[#5521FF] text-white rounded-xl rounded-tr-[2px] p-2 px-2.5 text-[12px] leading-relaxed self-end max-w-[85%] shadow-[0_2px_6px_rgba(85,33,255,0.2)] text-wrap"
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
                  className="px-2 py-[3px] bg-[#F4F4F5] dark:bg-slate-800 border border-[#E4E4E7] dark:border-transparent rounded-[4px] text-[10px] text-[#71717A] dark:text-slate-300 cursor-pointer transition-colors duration-150 font-sans font-semibold hover:text-[#5521FF] dark:hover:text-[#5521FF] hover:border-[#5521FF] dark:hover:border-[#5521FF]"
                  onClick={() =>
                    askAiMessage("Can you explain the code in detail?")
                  }
                >
                  Detailed explanation?
                </button>
                <button
                  className="px-2 py-[3px] bg-[#F4F4F5] dark:bg-slate-800 border border-[#E4E4E7] dark:border-transparent rounded-[4px] text-[10px] text-[#71717A] dark:text-slate-300 cursor-pointer transition-colors duration-150 font-sans font-semibold hover:text-[#5521FF] dark:hover:text-[#5521FF] hover:border-[#5521FF] dark:hover:border-[#5521FF]"
                  onClick={() => askAiMessage("What is the time complexity?")}
                >
                  Time Complexity?
                </button>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-[#F4F4F5] dark:bg-slate-800 border border-[#E4E4E7] dark:border-transparent rounded-lg py-2 pl-2.5 pr-9 text-[11px] text-[#18181B] dark:text-slate-200 outline-none font-sans transition-all focus:border-[#5521FF] focus:ring-1 focus:ring-[#5521FF] placeholder:text-[#A1A1AA] dark:placeholder:text-slate-500"
                  type="text"
                  placeholder="Ask Bh.AI..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && askAiMessage(inputValue)
                  }
                />
                <button
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-none border-none cursor-pointer text-[#5521FF] dark:text-violet-400 rounded-full text-xs transition-colors hover:bg-[#5521FF]/10"
                  onClick={() => askAiMessage(inputValue)}
                >
                  <SendHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hints" className="p-[18px] mt-0 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center pb-1.5 border-b border-[#E4E4E7] dark:border-slate-800 mb-0.5">
              <span className="text-[10px] font-bold text-[#71717A] dark:text-slate-450 uppercase tracking-wider">
                Available Hints
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              title="Collapse"
              className="p-2 mb-2 rounded-lg cursor-pointer text-[#71717A] dark:text-slate-400 transition-colors hover:bg-[#F4F4F5] dark:hover:bg-slate-800 hover:text-[#5521FF] dark:hover:text-violet-400"
            >
              <PanelRightClose size={18} />
            </button>
          </div>
          {subExp?.hints.map((hint, idx) => {
            const revealed = idx < revealedHints;
            return (
              <div
                key={idx}
                className={`border border-[#E4E4E7] dark:border-slate-800 rounded-lg p-2.5 text-[11px] transition-colors duration-150 text-left ${revealed ? "bg-[#F9F9FB] dark:bg-slate-950/40 text-[#334155] dark:text-slate-300" : "bg-[#FAFAFA] dark:bg-slate-900/40 text-[#71717A] dark:text-slate-450"}`}
              >
                <div className="text-[10px] font-bold mb-1 text-slate-700 dark:text-white">
                  Hint {idx + 1}
                </div>
                {revealed ? (
                  <p className="text-[11px] leading-relaxed dark:text-white">{hint}</p>
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
        </TabsContent>

        <TabsContent value="viva" className="p-[18px] mt-0 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 pb-1.5 border-b border-[#E4E4E7] dark:border-slate-800 mb-0.5 shrink-0">
              <span className="text-[10px] font-bold text-[#71717A] dark:text-slate-400 uppercase tracking-wider">
                Viva Q&amp;A
              </span>
              {vivaQAPairs.length > 0 && (
                <span className="text-[10px] font-bold text-[#5521FF] dark:text-violet-400 bg-[#F0ECFF] dark:bg-violet-950/40 px-2 py-[2px] rounded-full border border-[#5521FF]/15 dark:border-violet-900/15">
                  {vivaQAPairs.length} questions
                </span>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              title="Collapse"
              className="p-2 mb-2 rounded-lg cursor-pointer text-[#71717A] dark:text-slate-400 transition-colors hover:bg-[#F4F4F5] dark:hover:bg-slate-800 hover:text-[#5521FF] dark:hover:text-violet-400"
            >
              <PanelRightClose size={18} />
            </button>
          </div>

          {/* Loading */}
          {vivaQALoading && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="w-5 h-5 text-[#5521FF] animate-spin" />
              <p className="text-[11px] text-[#71717A] dark:text-slate-400 font-medium text-center">
                Generating viva questions…
              </p>
            </div>
          )}

          {/* Error */}
          {!vivaQALoading && vivaQAError && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg p-3 text-[11px] text-red-600 dark:text-rose-300">
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
                        ? "border-[#5521FF]/40 dark:border-violet-500/40 shadow-[0_2px_12px_rgba(85,33,255,0.08)]"
                        : "border-[#E4E4E7] dark:border-slate-800 hover:border-[#5521FF]/30 dark:hover:border-violet-500/30"
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
                            : "bg-[#F4F4F5] dark:bg-slate-800 text-[#71717A] dark:text-slate-300"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-[#18181B] dark:text-slate-100 leading-snug flex-1">
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
                      <div className="px-3 pb-3 pt-0.5 border-t border-[#F0ECFF] dark:border-slate-800 bg-[#FAFAFE] dark:bg-slate-900/50 text-left">
                        <p className="text-[11px] text-[#3730A3] dark:text-violet-300 leading-relaxed">
                          {qa.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default WorkspaceRightSidebar;
