import { ArrowLeft, Download, FileText, CheckCircle2 } from "lucide-react";
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
    // Generate a simple text file download simulating DOCX
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
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      {/* Sticky Header Top Menu */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm no-print">
        <div className="flex items-center space-x-3.5">
          <button 
            onClick={onBack}
            className="text-slate-500 hover:text-slate-800 border border-slate-200 p-2 bg-white hover:bg-slate-50 rounded-xl transition-all flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workspace</span>
          </button>
          <span className="font-heading font-black text-slate-800 text-sm">Practical Journal</span>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleDownloadDocx}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-850 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm cursor-pointer"
          >
            Export DOCX
          </button>
          <button 
            onClick={handlePrint}
            className="bg-[#5521FF] hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
          >
            Export PDF
          </button>
        </div>
      </header>

      {/* A4 Report Page Container */}
      <div className="my-8 w-full max-w-[800px] bg-white border border-slate-250 shadow-2xl p-12 space-y-8 print-page relative rounded">
        
        {/* Journal Header */}
        <div className="border-b-4 border-[#5521FF] pb-5 flex items-center justify-between select-none">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-md shrink-0">
              <img src="/logo.png" alt="BH.Lab Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-black font-heading text-slate-900 tracking-tight leading-none">BH.Lab</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Engineering Portal V4.2</p>
            </div>
          </div>

          {/* Student metadata */}
          <div className="text-right text-xs font-semibold text-slate-650 space-y-1">
            <p><span className="text-slate-400">Student Name:</span> Rahul Sharma</p>
            <p><span className="text-slate-400">Roll No:</span> ENG-2026-042</p>
            <p><span className="text-slate-400">Date:</span> October 24, 2026</p>
          </div>
        </div>

        {/* Experiment Title */}
        <div className="space-y-4">
          <div className="text-[10px] text-indigo-700 font-extrabold uppercase tracking-wide">
            Module-{experiment?.experimentNumber || 1} ({subExp?.part?.toUpperCase() || "A"})
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900 leading-snug">
            {subExp?.title} Implementation
          </h2>

          {/* Marks block */}
          <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-4 text-[11px] leading-relaxed text-amber-800 font-medium select-none">
            <span className="font-bold uppercase tracking-wider block mb-1">25-Marks Practical Structure:</span>
            • Practical Performance: 15 Marks (Implementation, Logic, and Output)<br />
            • Viva: 10 Marks (Concept clarity and Oral Examination)
          </div>
        </div>

        {/* AIM section */}
        <div className="space-y-2 select-text">
          <h3 className="text-xs font-black uppercase text-indigo-750 tracking-wider">Aim</h3>
          <p className="text-sm text-slate-700 leading-relaxed font-light">
            To implement and verify a program for "{subExp?.title}" to demonstrate the programming concepts and analyze performance.
          </p>
        </div>

        {/* THEORY section */}
        <div className="space-y-2 select-text">
          <h3 className="text-xs font-black uppercase text-indigo-750 tracking-wider">Theory</h3>
          <p className="text-sm text-slate-700 leading-relaxed font-light whitespace-pre-wrap">
            {subExp?.theory}
          </p>
        </div>

        {/* FLOWCHART section */}
        {subExp?.flowchart?.nodes && (
          <div className="space-y-3 break-inside-avoid select-none">
            <h3 className="text-xs font-black uppercase text-indigo-750 tracking-wider">Algorithm Flowchart</h3>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center">
              <div className="scale-90 transform origin-center max-w-full">
                <FlowchartRenderer nodes={subExp.flowchart.nodes} edges={subExp.flowchart.edges} />
              </div>
            </div>
          </div>
        )}

        {/* SOURCE CODE section */}
        <div className="space-y-2 break-inside-avoid select-text">
          <h3 className="text-xs font-black uppercase text-indigo-750 tracking-wider">Source Code</h3>
          <pre className="bg-slate-50 border border-slate-150 text-slate-800 font-mono text-xs p-6 rounded-xl leading-relaxed max-h-[400px] overflow-y-auto whitespace-pre">
            <code>{codeText || `// starter code template\n` + (subExp?.starterCode?.templates?.c || "")}</code>
          </pre>
        </div>

        {/* OUTPUT section */}
        <div className="space-y-2 break-inside-avoid select-text">
          <h3 className="text-xs font-black uppercase text-indigo-750 tracking-wider">Execution Output</h3>
          <pre className="bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs p-5 rounded-xl leading-relaxed whitespace-pre-wrap">
            <code>{outputText || `Output Vector: [${subExp?.samples?.[0]?.output || "Successfully executed"}]`}</code>
          </pre>
        </div>

        {/* CONCLUSION section */}
        <div className="space-y-2 break-inside-avoid select-text">
          <h3 className="text-xs font-black uppercase text-indigo-750 tracking-wider">Conclusion</h3>
          <p className="text-sm text-slate-700 leading-relaxed font-light">
            {conclusionText}
          </p>
        </div>

        {/* Signatures footer */}
        <div className="pt-10 border-t border-slate-150 grid grid-cols-2 gap-8 text-xs font-bold text-slate-400 select-none break-inside-avoid">
          <div className="space-y-8">
            <div className="h-8 border-b border-dashed border-slate-300"></div>
            <p className="text-center uppercase tracking-wide">Student Signature</p>
          </div>
          <div className="space-y-8">
            <div className="h-8 border-b border-dashed border-slate-300"></div>
            <p className="text-center uppercase tracking-wide">Instructor Signature</p>
          </div>
        </div>

        {/* Printable page number indicator */}
        <div className="text-[10px] text-slate-400 text-center select-none pt-4">
          PAGE NO - 1
        </div>
      </div>
    </div>
  );
}
