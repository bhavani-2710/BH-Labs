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
  Timer,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

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
        Use the{" "}
        <span className="font-bold text-slate-900 dark:text-slate-300">"Mark for Review"</span>{" "}
        button to flag questions you want to revisit later.
      </>
    ),
  },
  {
    text: (
      <>
        You can navigate freely to already visited questions using the question
        palette provided on the right side of the test screen.
      </>
    ),
  },
  {
    text: (
      <>
        The test will{" "}
        <span className="font-bold text-slate-900 dark:text-slate-300">auto-submit</span>{" "}
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
  totalQuestions = 10,
  durationMinutes = 20,
  markingScheme = "+4 / -1",
  format = "MCQ",
  onNavigate,
}) {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartTest = async () => {
    if (!agreed) return;
    setLoading(true);

    try {
      // optional: show loader state
      const res = await fetch(`/api/practical-test/questions/${subjectId}`);

      if (!res.ok) {
        throw new Error("Failed to generate test questions");
      }

      const questions = await res.json();

      navigate(`/practical-test/${subjectId}`, {
        state: {
          questions,
          testTitle,
          durationMinutes,
        },
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to generate test. Please try again.");
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
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] dark:bg-slate-950 flex flex-col items-center justify-center gap-4 transition-colors">
        <div className="w-12 h-12 rounded-full border-4 border-violet-200 dark:border-violet-900 border-t-[#5521FF] animate-spin" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse text-center px-4">
          Building your customized practical test...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7FB] dark:bg-slate-950 relative transition-colors duration-200">
      {/* ── Background blobs ──────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-[#5521FF] opacity-[0.03] blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-violet-500 opacity-[0.03] blur-[120px] rounded-full" />
      </div>

      {/* ── Top Header Bar ────────────────────────────────────────── */}
      <header className="bg-white dark:bg-slate-900 sticky top-0 z-50 border-b border-slate-200 dark:border-transparent px-4 md:px-10 h-16 flex justify-between items-center w-full transition-colors duration-200">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-[#5521FF] dark:hover:text-violet-400 transition-colors text-sm font-medium cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{testTitle}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Online indicator */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-transparent transition-colors">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Online</span>
          </div>
          {/* Header icons */}
          <div className="hidden md:flex gap-1">
            <button className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full cursor-pointer transition-colors">
              <Timer className="w-5 h-5" />
            </button>
            <button className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full cursor-pointer transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-[800px]">
          <Card className="rounded-2xl overflow-hidden flex flex-col shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent className="p-0 flex flex-col">
              {/* ── Card Header ─────────────────────────────────────── */}
              <div className="p-8 pb-6 border-b border-slate-200 dark:border-slate-800">
                <p className="text-[#5521FF] dark:text-violet-400 font-bold text-xs tracking-widest uppercase mb-2">
                  BEFORE YOU BEGIN
                </p>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight text-left">
                  Test Instructions
                </h2>
              </div>

              {/* ── Stats Strip ─────────────────────────────────────── */}
              <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`p-5 flex flex-col items-center justify-center gap-1 ${
                      idx < stats.length - 1 ? "border-r border-slate-200 dark:border-slate-800" : ""
                    } ${idx >= 2 ? "border-t md:border-t-0 border-slate-200 dark:border-slate-800" : ""}`}
                  >
                    {stat.icon}
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
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
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/40 text-[#5521FF] dark:text-violet-400 flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </span>
                      <p className="text-base text-slate-600 dark:text-slate-300 pt-1 leading-relaxed text-left">
                        {instr.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ── Warning Box ─────────────────────────────────── */}
                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-5 flex gap-4 border border-amber-200 dark:border-amber-900/50">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-left">
                    <h4 className="font-bold text-amber-900 dark:text-amber-300 text-sm">
                      Important: Negative Marking Active
                    </h4>
                    <p className="text-amber-800 dark:text-amber-400 text-sm leading-relaxed">
                      For every incorrect answer, 1 mark will be deducted from
                      your total score. Unattempted questions will not be
                      penalized.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Footer Actions ──────────────────────────────────── */}
              <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-[#5521FF] focus:ring-[#5521FF] cursor-pointer transition-all accent-[#5521FF] dark:bg-slate-950"
                  />
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
