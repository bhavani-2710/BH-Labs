import React from "react";
import FlowchartRenderer from "./FlowchartRenderer";
import { PanelLeftClose } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

const WorkspaceLeftSidebar = ({
  activeLeftTab,
  setActiveLeftTab,
  subExp,
  toggleSidebar,
}) => {
  return (
    <Tabs value={activeLeftTab} onValueChange={setActiveLeftTab} className="flex-1 flex flex-col h-full overflow-hidden">
      <TabsList className="flex gap-[3px] p-1 bg-[#F4F4F5] dark:bg-slate-900 border-b border-[#E4E4E7] dark:border-slate-800 shrink-0 h-auto rounded-none">
        {["theory", "algorithm", "flowchart"].map((t) => (
          <TabsTrigger
            key={t}
            value={t}
            className={`flex-1 py-1 px-0 rounded-[5px] border-none cursor-pointer text-[10px] font-bold tracking-wider uppercase transition-colors duration-150 font-sans data-[state=active]:bg-[#5521FF] data-[state=active]:text-white bg-transparent text-[#71717A] dark:text-slate-400 hover:bg-[#EBEBEB] dark:hover:bg-slate-800 hover:text-[#18181B] dark:hover:text-slate-200 shadow-none`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <TabsContent value="theory" className="p-[18px] mt-0">
          <div className="flex items-center justify-between">
            <span className="inline-block px-1.75 py-[1px] rounded-[3px] mb-1.5 text-[9px] font-bold tracking-widest uppercase bg-[#5521FF]/10 text-[#5521FF] border border-[#5521FF]/20">
              BH.AI GENERATED
            </span>

            <button
              onClick={toggleSidebar}
              title="Collapse"
              className="p-2 mb-2 rounded-lg cursor-pointer text-[#71717A] dark:text-slate-400 transition-colors hover:bg-[#F4F4F5] dark:hover:bg-slate-800 hover:text-[#5521FF] dark:hover:text-violet-400"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>

          <h2 className="text-base font-extrabold text-[#1E293B] dark:text-slate-100 mt-2.5 mb-3.5 leading-[1.2] text-left">
            {subExp?.title || "Experiment"}
          </h2>

          {/* Tags */}
          <div className="mb-5">
            {/* Difficulty */}
            {subExp?.difficulty && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[12px] font-extrabold text-[#1E293B] dark:text-slate-200 uppercase tracking-widest">
                  Difficulty
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-[3px] rounded-[4px] uppercase tracking-wider ${
                    subExp.difficulty.toLowerCase() === "easy"
                      ? "bg-[#DCFCE7] text-[#166534] dark:bg-emerald-950/30 dark:text-emerald-450"
                      : subExp.difficulty.toLowerCase() === "medium"
                        ? "bg-[#FEF3C7] text-[#92400E] dark:bg-amber-950/30 dark:text-amber-400"
                        : "bg-[#FEE2E2] text-[#991B1B] dark:bg-red-950/30 dark:text-red-400"
                  }`}
                >
                  {subExp.difficulty}
                </span>
              </div>
            )}

            {/* Concepts */}
            {subExp?.concepts?.length > 0 && (
              <div>
                <div className="text-[12px] font-extrabold text-[#1E293B] dark:text-slate-200 uppercase tracking-widest mb-1.5 text-left">
                  Concepts
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {subExp.concepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2 py-[3px] rounded-[4px] uppercase tracking-wider bg-[#F1F5F9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-[12px] font-extrabold text-[#1E293B] dark:text-slate-200 uppercase tracking-widest mb-1.5 mt-4.5 text-left">
            Problem Statement
          </div>
          <p className="text-[11px] text-[#475569] dark:text-slate-350 leading-relaxed text-left">
            {subExp?.problemStatement ||
              "Implement and analyze the algorithm."}
          </p>

          {subExp?.theory && (
            <>
              <div className="text-[12px] font-extrabold text-[#1E293B] dark:text-slate-200 uppercase tracking-widest mb-1.5 mt-4.5 text-left">
                Theory
              </div>
              <p className="text-[11px] text-[#475569] dark:text-slate-350 leading-relaxed text-left">
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
                  className="bg-[#F8FAFC] dark:bg-slate-900/60 border border-transparent dark:border-slate-800 rounded-[14px] p-4 mt-2 mb-3"
                >
                  <div className="text-[12px] font-bold text-[#1E293B] dark:text-slate-100 mb-2.5 text-left">
                    Example {idx + 1}
                  </div>
                  <div className="flex flex-col gap-[3px] py-1 mb-1.5">
                    <span className="text-[#64748B] dark:text-slate-400 shrink-0 text-left">Input:</span>
                    <span className="font-mono font-medium text-[#0F172A] dark:text-slate-200 text-left whitespace-pre-wrap break-all text-[11px]">
                      {sample.input}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[3px] py-1">
                    <span className="text-[#64748B] dark:text-slate-400 shrink-0 text-left">Output:</span>
                    <span className="font-mono font-medium text-[#0F172A] dark:text-slate-200 text-left whitespace-pre-wrap break-all text-[11px]">
                      {sample.output}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="algorithm" className="p-[18px] mt-0 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
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

          <div className="bg-[#F9F9FB] dark:bg-[#0C111D] border border-[#E4E4E7] dark:border-slate-800 rounded-lg p-3 font-mono text-[11px] leading-relaxed text-[#334155] dark:text-slate-350 whitespace-pre-line text-left flex-1 overflow-y-auto">
            {subExp?.algorithm || "No algorithm to display"}
          </div>
        </TabsContent>
        <TabsContent value="flowchart" className="p-[18px] mt-0 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
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
          <div className="bg-[#F9F9FB] dark:bg-[#0C111D] border border-[#E4E4E7] dark:border-slate-800 rounded-lg p-1.5 overflow-auto flex-1">
            <FlowchartRenderer
              nodes={subExp?.flowchart?.nodes}
              edges={subExp?.flowchart?.edges}
            />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default WorkspaceLeftSidebar;
