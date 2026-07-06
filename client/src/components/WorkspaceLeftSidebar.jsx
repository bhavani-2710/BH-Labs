import React from "react";
import FlowchartRenderer from "./FlowchartRenderer";
import { PanelLeftClose } from "lucide-react";

const WorkspaceLeftSidebar = ({
  activeLeftTab,
  setActiveLeftTab,
  subExp,
  toggleSidebar,
}) => {
  return (
    <>
      <div className="flex gap-[3px] p-1 bg-[#F4F4F5] dark:bg-slate-900 border-b border-[#E4E4E7] dark:border-transparent shrink-0 transition-colors duration-200">
        {["theory", "algorithm", "flowchart"].map((t) => (
          <button
            key={t}
            className={`flex-1 py-1 px-0 rounded-[5px] border-none cursor-pointer text-[10px] font-bold tracking-wider uppercase transition-colors duration-150 font-sans ${activeLeftTab === t ? "bg-[#5521FF] text-white" : "bg-transparent text-[#71717A] dark:text-slate-400 hover:bg-[#EBEBEB] dark:hover:bg-slate-800 hover:text-[#18181B] dark:hover:text-slate-200"}`}
            onClick={() => setActiveLeftTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-[18px] custom-scrollbar flex flex-col">
        {activeLeftTab === "theory" && (
          <>
            <div className="flex items-center justify-between">
              <span className="inline-block px-1.75 py-[1px] rounded-[3px] mb-1.5 text-[9px] font-bold tracking-widest uppercase bg-[#5521FF]/10 dark:bg-violet-950/40 text-[#5521FF] dark:text-violet-300 border border-[#5521FF]/20 dark:border-[#5521FF]/30">
                BH.AI GENERATED
              </span>

              <button
                onClick={toggleSidebar}
                title="Collapse"
                className="p-2 mb-2 rounded-lg cursor-pointer text-[#71717A] dark:text-slate-450 transition-colors hover:bg-[#F4F4F5] dark:hover:bg-slate-800 hover:text-[#5521FF] dark:hover:text-violet-400"
              >
                <PanelLeftClose size={18} />
              </button>
            </div>

            <h2 className="text-base font-extrabold text-[#1E293B] dark:text-slate-200 mt-2.5 mb-3.5 leading-[1.2]">
              {subExp?.title || "Experiment"}
            </h2>

            {/* Tags */}
            <div className="mb-5">
              {/* Difficulty */}
              {subExp?.difficulty && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[12px] font-extrabold text-[#1E293B] dark:text-slate-300 uppercase tracking-widest">
                    Difficulty
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-[3px] rounded-[4px] uppercase tracking-wider ${
                      subExp.difficulty.toLowerCase() === "easy"
                        ? "bg-[#DCFCE7] dark:bg-emerald-950/30 text-[#166534] dark:text-emerald-400"
                        : subExp.difficulty.toLowerCase() === "medium"
                          ? "bg-[#FEF3C7] dark:bg-amber-950/30 text-[#92400E] dark:text-amber-400"
                          : "bg-[#FEE2E2] dark:bg-rose-950/30 text-[#991B1B] dark:text-rose-400"
                    }`}
                  >
                    {subExp.difficulty}
                  </span>
                </div>
              )}

              {/* Concepts */}
              {subExp?.concepts?.length > 0 && (
                <div>
                  <div className="text-[12px] font-extrabold text-[#1E293B] dark:text-slate-300 uppercase tracking-widest mb-1.5">
                    Concepts
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {subExp.concepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2 py-[3px] rounded-[4px] uppercase tracking-wider bg-[#F1F5F9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 border border-[#E2E8F0] dark:border-transparent"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-[12px] font-extrabold text-[#1E293B] dark:text-slate-300 uppercase tracking-widest mb-1.5 mt-4.5">
              Problem Statement
            </div>
            <p className="text-[11px] text-[#475569] dark:text-slate-300 leading-relaxed">
              {subExp?.problemStatement ||
                "Implement and analyze the algorithm."}
            </p>

            {subExp?.theory && (
              <>
                <div className="text-[12px] font-extrabold text-[#1E293B] dark:text-slate-300 uppercase tracking-widest mb-1.5 mt-4.5">
                  Theory
                </div>

                <p className="text-[11px] text-[#475569] dark:text-slate-300 leading-relaxed">
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
                    className="bg-[#F8FAFC] dark:bg-slate-900 rounded-[14px] p-4 mt-2 mb-3 border border-transparent dark:border-transparent transition-colors"
                  >
                    <div className="text-[12px] font-bold text-[#1E293B] dark:text-slate-200 mb-2.5">
                      Example {idx + 1}
                    </div>
                    <div className="flex flex-col gap-[3px] py-1 mb-1.5">
                      <span className="text-[#64748B] dark:text-slate-450 shrink-0">Input:</span>
                      <span className="font-mono font-medium text-[#0F172A] dark:text-slate-200 text-left whitespace-pre-wrap break-all text-[11px]">
                        {sample.input}
                      </span>
                    </div>
                    <div className="flex flex-col gap-[3px] py-1">
                      <span className="text-[#64748B] dark:text-slate-450 shrink-0">Output:</span>
                      <span className="font-mono font-medium text-[#0F172A] dark:text-slate-200 text-left whitespace-pre-wrap break-all text-[11px]">
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
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold text-[#5521FF] dark:text-violet-400 uppercase tracking-widest mb-2">
                Step-by-Step Logic
              </div>
              <button
                onClick={toggleSidebar}
                title="Collapse"
                className="p-2 mb-2 rounded-lg cursor-pointer text-[#71717A] dark:text-slate-400 transition-colors hover:bg-[#F4F4F5] dark:hover:bg-slate-800 hover:text-[#5521FF] dark:hover:text-violet-400"
              >
                <PanelLeftClose size={18} />
              </button>
            </div>

            <div className="bg-[#F9F9FB] dark:bg-slate-900 border border-[#E4E4E7] dark:border-transparent rounded-lg p-3 font-mono text-[11px] leading-relaxed text-[#334155] dark:text-slate-300 whitespace-pre-line transition-colors">
              {subExp?.algorithm || "No algorithm to display"}
            </div>
          </>
        )}
        {activeLeftTab === "flowchart" && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold text-[#5521FF] dark:text-violet-400 uppercase tracking-widest mb-2">
                Logic Flow
              </div>
              <button
                onClick={toggleSidebar}
                title="Collapse"
                className="p-2 mb-2 rounded-lg cursor-pointer text-[#71717A] dark:text-slate-400 transition-colors hover:bg-[#F4F4F5] dark:hover:bg-slate-800 hover:text-[#5521FF] dark:hover:text-violet-400"
              >
                <PanelLeftClose size={18} />
              </button>
            </div>
            <div className="bg-[#F9F9FB] dark:bg-slate-900 border border-[#E4E4E7] dark:border-transparent rounded-lg p-1.5 overflow-auto transition-colors">
              <FlowchartRenderer
                nodes={subExp?.flowchart?.nodes}
                edges={subExp?.flowchart?.edges}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default WorkspaceLeftSidebar;
