import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Clock,
  Star,
  ListChecks,
  AlertTriangle,
  Wifi,
  Timer,
  HelpCircle,
} from "lucide-react";

// ── Instruction step data ─────────────────────────────────────────────
const INSTRUCTIONS = [
  {
    text: (
      <>
        Each question has one correct answer. Ensure you read all options
        carefully before selecting.
      </>
    ),
  },
  {
    text: (
      <>
        Use the <span className="font-bold text-slate-900">"Mark for Review"</span>{" "}
        button to flag questions you want to revisit later.
      </>
    ),
  },
  {
    text: (
      <>
        You can only navigate freely to questions which are marked for review using the question palette provided
        on the right side of the test screen.
      </>
    ),
  },
  {
    text: (
      <>
        The test will{" "}
        <span className="font-bold text-slate-900">auto-submit</span>{" "}
        immediately when the timer reaches zero. Any unsubmitted progress will
        be saved automatically.
      </>
    ),
  },
  {
    text: (
      <>
        No re-entry or retakes are permitted once the final "Submit" button has
        been clicked.
      </>
    ),
  },
];

// =====================================================================
// TestInstruction  –  pre-test instructions page
// =====================================================================
export default function TestInstruction({
  testTitle = "C Programming",
  totalQuestions = 15,
  durationMinutes = 20,
  markingScheme = "+4 / -1",
  format = "MCQ",
  onNavigate,
}) {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [agreed, setAgreed] = useState(false);

  const handleStartTest = () => {
    if (!agreed) return;
    // Navigate to the aptitude test page
    if (subjectId) {
      navigate(`/aptitude-test/${subjectId}`);
    } else {
      navigate("/aptitude-test");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // ── Stats items ─────────────────────────────────────────────────────
  const stats = [
    {
      icon: <FileText className="w-5 h-5 text-[#5521FF]" />,
      label: `${totalQuestions} Questions`,
    },
    {
      icon: <Clock className="w-5 h-5 text-[#5521FF]" />,
      label: `${durationMinutes} Minutes`,
    },
    {
      icon: <Star className="w-5 h-5 text-[#5521FF]" />,
      label: `${markingScheme} Marking`,
    },
    {
      icon: <ListChecks className="w-5 h-5 text-[#5521FF]" />,
      label: `${format} Format`,
    },
  ];

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7FB] relative">
      {/* ── Background blobs ──────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-[#5521FF] opacity-[0.03] blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-violet-500 opacity-[0.03] blur-[120px] rounded-full" />
      </div>

      {/* ── Top Header Bar ────────────────────────────────────────── */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-200 px-4 md:px-10 h-16 flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-slate-500 hover:text-[#5521FF] transition-colors text-sm font-medium cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="h-6 w-px bg-slate-200 hidden md:block" />
          <h1 className="text-xl font-semibold text-slate-900">{testTitle}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Online indicator */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-slate-500">Online</span>
          </div>
          {/* Header icons */}
          <div className="hidden md:flex gap-1">
            <button className="text-slate-500 hover:bg-slate-100 p-2 rounded-full cursor-pointer transition-colors">
              <Timer className="w-5 h-5" />
            </button>
            <button className="text-slate-500 hover:bg-slate-100 p-2 rounded-full cursor-pointer transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-[800px]">
          <section className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm border border-slate-200">
            {/* ── Card Header ─────────────────────────────────────── */}
            <div className="p-8 pb-6 border-b border-slate-200">
              <p className="text-[#5521FF] font-bold text-xs tracking-widest uppercase mb-2">
                BEFORE YOU BEGIN
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Test Instructions
              </h2>
            </div>

            {/* ── Stats Strip ─────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-50 border-b border-slate-200">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-5 flex flex-col items-center justify-center gap-1 ${
                    idx < stats.length - 1 ? "border-r border-slate-200" : ""
                  } ${idx >= 2 ? "border-t md:border-t-0 border-slate-200" : ""}`}
                >
                  {stat.icon}
                  <span className="text-sm font-medium text-slate-900">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Instructions Body ───────────────────────────────── */}
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                {INSTRUCTIONS.map((instr, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 text-[#5521FF] flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </span>
                    <p className="text-base text-slate-600 pt-1 leading-relaxed">
                      {instr.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── Warning Box ─────────────────────────────────── */}
              <div className="bg-amber-50 rounded-lg p-5 flex gap-4 border border-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-900 text-sm">
                    Important: Negative Marking Active
                  </h4>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    For every incorrect answer, 1 mark will be deducted from your
                    total score. Unattempted questions will not be penalized.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Footer Actions ──────────────────────────────────── */}
            <div className="p-8 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-[#5521FF] focus:ring-[#5521FF] cursor-pointer transition-all accent-[#5521FF]"
                />
                <span className="text-slate-500 text-sm font-medium group-hover:text-slate-900 transition-colors">
                  I have read and understood the instructions
                </span>
              </label>

              <button
                onClick={handleStartTest}
                disabled={!agreed}
                className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  agreed
                    ? "bg-[#5521FF] text-white hover:bg-violet-700 shadow-lg shadow-violet-500/20 hover:-translate-y-0.5 active:scale-[0.98]"
                    : "bg-[#5521FF] text-white opacity-50 cursor-not-allowed"
                }`}
              >
                Start Test
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
