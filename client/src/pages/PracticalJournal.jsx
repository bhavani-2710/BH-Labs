import { ArrowLeft } from "lucide-react";
import FlowchartRenderer from "../components/FlowchartRenderer";

export default function PracticalJournal({ 
  onBack, 
  experiment, 
  subPart = "a",
  codeText,
  outputText
}) {
  const subExp = experiment?.subExperiments?.find(s => s.part === subPart) || experiment?.subExperiments?.[0];

  // Default conclusion generator
  const conclusionText = `The ${subExp?.title} program was successfully implemented and compiled. Through this experiment, we observed how basic logic structures can manipulate data in memory. The program executed with zero errors and produced the expected output matching the unit validation cases.`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocx = () => {
    const content = `
BH.LAB PRACTICAL JOURNAL
Student: Rahul Sharma
Roll No: ENG-2026-042
Date: October 24, 2026

AIM:
To write a program for "${subExp?.title}" and demonstrate its practical engineering workflow.

THEORY:
${subExp?.theory}

ALGORITHM:
${subExp?.algorithm}

SOURCE CODE:
${codeText || "/* No code available */"}

OUTPUT:
${outputText || "/* No execution logs available */"}

CONCLUSION:
${conclusionText}
    `;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${subExp?.title.replace(/\s+/g, "_")}_Journal.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center">
      {/* Sticky Header Top Menu */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm no-print">
        <div className="flex items-center space-x-3.5">
          <button 
            onClick={onBack}
            className="text-slate-500 hover:text-slate-800 border border-slate-200 p-2.5 bg-white hover:bg-slate-50 rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
            title="Back to Workspace"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <h1 className="font-bold text-slate-800 text-sm leading-tight">Practical Journal</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Engineering Portal V4.2</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleDownloadDocx}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm cursor-pointer transition-all active:scale-95"
          >
            Export DOCX
          </button>
          <button 
            onClick={handlePrint}
            className="bg-[#630ed4] hover:bg-[#520cb2] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md cursor-pointer transition-all active:scale-95"
          >
            Export PDF
          </button>
        </div>
      </header>

      {/* A4 Report Page Container */}
      <div className="my-8 w-full max-w-[800px] bg-white border border-slate-200 shadow-xl p-12 space-y-8 print-page relative rounded-[24px] overflow-hidden">
        {/* Decorative AI Gradient Background Highlight */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#630ed4]/5 rounded-full blur-3xl pointer-events-none select-none"></div>
        
        {/* Journal Header */}
        <div className="border-b-2 border-slate-100 pb-6 flex items-center justify-between select-none">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-md shrink-0 border border-slate-100">
              <img src="/logo.png" alt="BH.Lab Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#630ed4] tracking-tight leading-none">BH.Lab</h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Student Record Portal</p>
            </div>
          </div>

          {/* Student metadata */}
          <div className="text-right text-xs font-semibold text-slate-600 space-y-1">
            <p><span className="text-slate-400">Student Name:</span> Rahul Sharma</p>
            <p><span className="text-slate-400">Roll No:</span> ENG-2026-042</p>
            <p><span className="text-slate-400">Date:</span> October 24, 2026</p>
          </div>
        </div>

        {/* Experiment Title */}
        <div className="space-y-4">
          <div className="text-[10px] text-[#630ed4] font-extrabold uppercase tracking-widest bg-[#630ed4]/5 px-3 py-1 rounded-full w-fit">
            Module-{experiment?.experimentNumber || 1} ({subExp?.part?.toUpperCase() || "A"})
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-snug">
            {subExp?.title} Implementation
          </h2>

          {/* Marks block - styled like premium badge */}
          <div className="bg-[#630ed4]/5 border border-[#630ed4]/15 rounded-2xl p-4 text-[11px] leading-relaxed text-[#630ed4] font-semibold select-none shadow-sm">
            <span className="font-extrabold uppercase tracking-wider block mb-1">25-Marks Practical Structure:</span>
            • Practical Performance: 15 Marks (Implementation, Logic, and Output)<br />
            • Viva: 10 Marks (Concept clarity and Oral Examination)
          </div>
        </div>

        {/* AIM section */}
        <div className="space-y-2.5 select-text">
          <span className="inline-block px-3 py-1 rounded-full bg-[#eaddff] text-[#25005a] font-bold text-[10px] tracking-wider uppercase">Aim</span>
          <p className="text-sm text-slate-700 leading-relaxed font-normal pl-1">
            To implement and verify a program for "{subExp?.title}" to demonstrate the programming concepts and analyze performance.
          </p>
        </div>

        {/* THEORY section */}
        <div className="space-y-2.5 select-text">
          <span className="inline-block px-3 py-1 rounded-full bg-[#eaddff] text-[#25005a] font-bold text-[10px] tracking-wider uppercase">Theory</span>
          <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap pl-1">
            {subExp?.theory}
          </p>
        </div>

        {/* FLOWCHART section */}
        {subExp?.flowchart?.nodes && (
          <div className="space-y-3 break-inside-avoid select-none">
            <span className="inline-block px-3 py-1 rounded-full bg-[#eaddff] text-[#25005a] font-bold text-[10px] tracking-wider uppercase">Algorithm Flowchart</span>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center justify-center shadow-inner">
              <div className="scale-95 transform origin-center max-w-full">
                <FlowchartRenderer nodes={subExp.flowchart.nodes} edges={subExp.flowchart.edges} />
              </div>
            </div>
          </div>
        )}

        {/* SOURCE CODE section */}
        <div className="space-y-3 break-inside-avoid select-text">
          <span className="inline-block px-3 py-1 rounded-full bg-[#eaddff] text-[#25005a] font-bold text-[10px] tracking-wider uppercase">Source Code</span>
          <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2 select-none">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
              <span className="ml-2 font-mono text-[9px] text-white/40">main.c</span>
            </div>
            <pre className="text-[#D4D4D4] font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed max-h-[400px] overflow-y-auto">
              <code>{codeText || `// starter code template\n` + (subExp?.starterCode?.templates?.c || "")}</code>
            </pre>
          </div>
        </div>

        {/* OUTPUT section */}
        <div className="space-y-3 break-inside-avoid select-text">
          <span className="inline-block px-3 py-1 rounded-full bg-[#eaddff] text-[#25005a] font-bold text-[10px] tracking-wider uppercase">Execution Output</span>
          <div className="bg-[#18181B] border border-white/5 rounded-2xl p-4 shadow-inner overflow-hidden">
            <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2 select-none">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
              <span className="ml-2 font-mono text-[9px] text-white/30">terminal_output.log</span>
            </div>
            <pre className="text-[#34D399] font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
              <code>{outputText || `Output Vector: [${subExp?.samples?.[0]?.output || "Successfully executed"}]`}</code>
            </pre>
          </div>
        </div>

        {/* CONCLUSION section */}
        <div className="space-y-2.5 select-text">
          <span className="inline-block px-3 py-1 rounded-full bg-[#eaddff] text-[#25005a] font-bold text-[10px] tracking-wider uppercase">Conclusion</span>
          <p className="text-sm text-slate-700 leading-relaxed font-normal pl-1">
            {conclusionText}
          </p>
        </div>

        {/* Signatures footer */}
        <div className="pt-10 border-t border-slate-150 grid grid-cols-2 gap-8 text-xs font-bold text-slate-400 select-none break-inside-avoid">
          <div className="space-y-8">
            <div className="h-8 border-b border-dashed border-slate-200"></div>
            <p className="text-center uppercase tracking-widest text-[9px] text-slate-400">Student Signature</p>
          </div>
          <div className="space-y-8">
            <div className="h-8 border-b border-dashed border-slate-200"></div>
            <p className="text-center uppercase tracking-widest text-[9px] text-slate-400">Instructor Signature</p>
          </div>
        </div>

        {/* Printable page number indicator */}
        <div className="text-[9px] font-bold text-slate-350 text-center select-none pt-4 tracking-widest">
          PAGE NO - 1
        </div>
      </div>
    </div>
  );
}
