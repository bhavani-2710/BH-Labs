import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { generateJournalPdf } from "../utils/journalPdfGenerator";

export default function PracticalJournal({ 
  onBack, 
  experiment, 
  subPart = "a",
  codeText,
  outputText
}) {
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);

  const subExp = experiment?.subExperiments?.find(s => s.part === subPart) || experiment?.subExperiments?.[0];

  useEffect(() => {
    let active = true;
    async function loadPdf() {
      try {
        const bytes = await generateJournalPdf({
          experiment,
          subPart,
          codeText,
          outputText
        });
        if (!active) return;
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfBlob(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error("Failed to generate journal PDF:", err);
      }
    }
    loadPdf();
    return () => {
      active = false;
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [experiment, subPart, codeText, outputText]);

  const handleDownloadPdf = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    const filename = `${subExp?.title?.replace(/\s+/g, "_") || "Journal"}_Record.pdf`;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex flex-col items-center transition-colors duration-200">
      {/* Sticky Header Top Menu */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm no-print transition-colors duration-200">
        <div className="flex items-center space-x-3.5">
          <button 
            onClick={onBack}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-transparent p-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
            title={subExp?.isExecutable === false ? "Back to Experiments" : "Back to Workspace"}
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight">Practical Journal Preview</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Engineering Portal V4.2</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleDownloadPdf}
            disabled={!pdfBlob}
            className="bg-[#630ed4] hover:bg-[#520cb2] disabled:opacity-50 text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md cursor-pointer transition-all active:scale-95"
          >
            Download PDF
          </button>
        </div>
      </header>

      {/* Centered PDF Frame Container */}
      <div className="flex-1 w-full max-w-[900px] my-6 px-4 flex flex-col items-center justify-center">
        {pdfUrl ? (
          <iframe 
            src={pdfUrl} 
            title="Practical Journal PDF Preview"
            className="w-full h-[calc(100vh-140px)] border border-slate-200 dark:border-slate-800 rounded-[20px] shadow-2xl bg-white dark:bg-slate-900"
          />
        ) : (
          <div className="text-slate-500 dark:text-slate-400 font-semibold animate-pulse text-sm">
            Generating Journal PDF...
          </div>
        )}
      </div>
    </div>
  );
}
