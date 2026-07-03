import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Terminal,
  Bell,
  HelpCircle,
  Star,
  BarChart3,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Trophy,
  Clock,
  PlayCircle,
  Lightbulb,
  Zap,
  RefreshCw,
  Download,
  Info,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { renderQuestionText } from "../utils/renderQuestionText";

/**
 * CircularGauge
 * SVG-based circular progress indicator used to display the final test score
 * as a percentage. Animates the arc stroke on mount via CSS transition.
 *
 * @param {object} props
 * @param {number} props.percentage   - Score value between 0 and 100.
 * @param {number} [props.size=200]   - Diameter of the SVG in pixels.
 * @param {number} [props.strokeWidth=14] - Width of the progress arc stroke.
 */
function CircularGauge({ percentage, size = 200, strokeWidth = 14 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3525cd"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold text-[#3525cd]">
          {Math.round(percentage)}%
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Final Score
        </span>
      </div>
    </div>
  );
}

export default function AssessmentResult({
  testTitle = "C Programming - Section A",
  studentName = "Akshay Sharma",
  candidateId = "9421",
  correctCount,
  incorrectCount,
  unansweredCount,
  timeTaken, // in seconds
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Get state from location (from PracticalTest submit flow) or localStorage ──────────
  const state = useMemo(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      return location.state;
    }
    const saved = localStorage.getItem("practical_test_last_result");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved result", e);
      }
    }
    return {};
  }, [location.state]);

  const correct = correctCount ?? state.correct ?? 13;
  const incorrect = incorrectCount ?? state.incorrect ?? 1;
  const unanswered = unansweredCount ?? state.unanswered ?? 1;
  const elapsed = timeTaken ?? state.elapsed ?? 542; // default: 9 min 2s

  const questions = state.questions || [];
  const answers = state.answers || {};
  const displayTitle = state.testTitle || testTitle;

  // Mock fallback questions for visual excellence if visited directly
  const mockQuestions = [
    {
      text: "Which of the following is the correct syntax to define a pointer to an integer?",
      options: ["int p;", "int *p;", "int &p;", "ptr int p;"],
      correctIndex: 1
    },
    {
      text: "What will be the output of the following C code snippet?\n```c\nint a = 10;\nint b = 20;\nprintf(\"%d\", a > b ? a : b);\n```",
      options: ["10", "20", "compile error", "runtime error"],
      correctIndex: 1
    },
    {
      text: "Which sorting algorithm partition strategy uses a pivot to divide elements into smaller and larger subarrays?",
      options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Insertion Sort"],
      correctIndex: 1
    }
  ];

  const finalQuestions = questions.length > 0 ? questions : mockQuestions;
  const finalAnswers = questions.length > 0 ? answers : { 0: 1, 1: 0, 2: 1 };

  const total = finalQuestions.length;
  const percentage = total > 0 ? (correct / total) * 100 : 0;

  // Average time per question
  const avgTimePerQuestion = useMemo(() => {
    const attempted = correct + incorrect;
    if (attempted === 0) return 0;
    return Math.round(elapsed / attempted);
  }, [correct, incorrect, elapsed]);

  // Dynamic topic stats based on question subexperiment field
  const topicStats = useMemo(() => {
    const statsMap = {};

    finalQuestions.forEach((q, idx) => {
      const topicName = q.subexperiment || "General Concept";
      if (!statsMap[topicName]) {
        statsMap[topicName] = { total: 0, correctCount: 0 };
      }
      statsMap[topicName].total += 1;
      if (finalAnswers[idx] === q.correctIndex) {
        statsMap[topicName].correctCount += 1;
      }
    });

    return Object.entries(statsMap)
      .map(([name, data]) => {
        const pct = Math.round((data.correctCount / data.total) * 100);
        let status = `Developing (${pct}%)`;
        let statusColor = "text-amber-600 font-bold";
        let barColor = "bg-amber-500";

        if (pct >= 85) {
          status = `Mastered (${pct}%)`;
          statusColor = "text-emerald-600 font-bold";
          barColor = "bg-emerald-500";
        } else if (pct >= 60) {
          status = `Strong (${pct}%)`;
          statusColor = "text-[#3525cd] font-bold";
          barColor = "bg-[#3525cd]";
        } else if (pct === 0) {
          status = `Needs Review (${pct}%)`;
          statusColor = "text-red-500 font-bold";
          barColor = "bg-red-400";
        }
        return { name, percentage: pct, status, statusColor, barColor };
      });
  }, [finalQuestions, finalAnswers]);

  // Performance assessment text and rank placement
  const performanceInfo = useMemo(() => {
    if (percentage >= 85) {
      return {
        badge: "Top 10% of Candidates",
        headline: `Excellent performance, ${studentName.split(" ")[0]}!`,
        desc: "Your logical thinking, analytical skills, and implementation details are exceptional. You've outperformed 92% of users in this section. Minor refinements in edge-case optimization will put you in the elite bracket.",
      };
    } else if (percentage >= 70) {
      return {
        badge: "Top 25% of Candidates",
        headline: `Good effort, ${studentName.split(" ")[0]}!`,
        desc: "Solid understanding of fundamental concepts. Your logic flow is strong, but paying closer attention to boundary inputs, trace states, and algorithm constraints will boost your scores.",
      };
    } else {
      return {
        badge: "Developing Skills",
        headline: `Keep practicing, ${studentName.split(" ")[0]}!`,
        desc: "You have a basic grasp of the core concepts, but there are multiple conceptual gaps to address, specifically around constraints, state tracing, and boundary edge cases.",
      };
    }
  }, [percentage, studentName]);

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-[#1b1b24] font-sans">
      {/* ── Top Navigation Bar ────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full h-16 z-50 flex justify-between items-center px-6 md:px-10 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-[#1b1b24] tracking-tight">
            {displayTitle}
          </h1>
          <span className="px-3 py-1 bg-[#3525cd]/10 text-[#3525cd] font-semibold text-xs rounded-full">
            Submitted
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <button className="text-slate-500 hover:bg-slate-100 p-2 rounded-full cursor-pointer transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-slate-500 hover:bg-slate-100 p-2 rounded-full cursor-pointer transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right">
              <p className="font-semibold text-sm text-[#1b1b24] leading-none">
                {studentName}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Candidate ID: {candidateId}
              </p>
            </div>
            <img
              className="w-10 h-10 rounded-full border-2 border-[#3525cd]/20 object-cover"
              alt="Candidate Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY6ZUY14pkquScGhRMreTqFx-P1EeXGk9MNr2dDb7veEPqqmm_5jedKypdtGgOqp6WF3vm4ltQhphH9g953i8GqFMYLwncRUqMmzl7QGsog0v4_E0481P5gI7W1zH9KqGWKS_0upNyCCXO36JgmJAGVI-GqL9O9H_CccFAFNCSa6aSCUuLpb0xPng60ZPQAohOt0StUuV-x9lMpdPWP5Vxf_wIX2I7M_Tx6Q-8qz_lKn1w0iUliK3-3mID-TWrpaUOQit3VO1VGWY"
            />
          </div>
        </div>
      </nav>

      {/* ── Main content area ─────────────────────────────────────────── */}
      <main className="pt-24 pb-16 px-4 md:px-10 max-w-[1280px] mx-auto space-y-8">

        {/* Hero Section: Score & Peer Comparison */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Score display card */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-8 md:p-10 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-10">
            <CircularGauge percentage={percentage} />
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-current" />
                {performanceInfo.badge}
              </div>
              <h2 className="text-3xl font-extrabold text-[#1b1b24] mb-3 tracking-tight">
                {performanceInfo.headline}
              </h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl">
                {performanceInfo.desc}
              </p>
            </div>
          </div>

          {/* Peer Comparison Card */}
          <div className="lg:col-span-4 bg-[#3525cd] text-white rounded-2xl p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-6 w-full">
              <h3 className="text-lg font-bold text-white/80">Peer Comparison</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium">Your Score</span>
                    <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium">Global Average</span>
                    <span className="text-2xl font-bold">68%</span>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="bg-white/40 h-full w-[68%]" />
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative background icon */}
            <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none select-none">
              <BarChart3 className="w-36 h-36" />
            </div>
          </div>
        </section>

        {/* Stats Breakdown Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1b1b24]">{correct}</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Correct Answers
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1b1b24]">{incorrect}</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Incorrect Answers
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
              <MinusCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1b1b24]">{unanswered}</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Skipped Questions
              </p>
            </div>
          </div>
        </section>

        {/* Performance Insights */}
        <section>
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 shadow-sm relative overflow-hidden min-h-[220px] flex flex-col items-start gap-6">
            <div
              className="absolute right-0 top-0 h-full w-1/2 hidden md:block opacity-[0.15] bg-cover bg-center pointer-events-none select-none mix-blend-multiply"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, #3525cd 0%, transparent 60%), radial-gradient(circle at 60% 80%, #3525cd 0%, transparent 50%)",
              }}
            />
            <h3 className="text-lg font-bold text-[#3525cd] flex items-center gap-2 z-10">
              <Lightbulb className="w-5 h-5 fill-current" />
              Performance Insights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full z-10">
              {/* High Velocity */}
              <div className="flex gap-4 items-start p-5 bg-white/60 rounded-2xl border border-slate-200/50 shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Zap className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-slate-800">High Velocity</p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Your response time was 15% faster than the top decile of candidates.
                  </p>
                </div>
              </div>
              {/* Solving Speed */}
              <div className="flex gap-4 items-start p-5 bg-white/60 rounded-2xl border border-slate-200/50 shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Zap className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-slate-800">Speed Efficiency</p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Average: <strong className="text-slate-700">{avgTimePerQuestion}s/q</strong>. Total duration: {Math.floor(elapsed / 60)}m {elapsed % 60}s.
                  </p>
                </div>
              </div>
              {/* Conceptual Strength */}
              <div className="flex gap-4 items-start p-5 bg-white/60 rounded-2xl border border-slate-200/50 shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3525cd]/10 flex items-center justify-center text-[#3525cd]">
                  <Lightbulb className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-slate-800">Conceptual Strength</p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    High confidence across tested subexperiments on first attempt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Question Review */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-[#1b1b24]">
                Question-by-Question Analysis
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Review the AI-generated questions from subexperiments, your answers, and the correct options.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Correct
              </span>
              <span className="flex items-center gap-1.5 text-red-600">
                <XCircle className="w-4 h-4" /> Incorrect
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <MinusCircle className="w-4 h-4" /> Skipped
              </span>
            </div>
          </div>

          <div className="space-y-6 divide-y divide-slate-100">
            {finalQuestions.map((q, idx) => {
              const userAnswerIdx = finalAnswers[idx];
              const isUnanswered = userAnswerIdx === undefined;
              const isCorrect = !isUnanswered && userAnswerIdx === q.correctIndex;

              let statusIcon = <MinusCircle className="w-5 h-5 text-slate-400 shrink-0 mt-1" />;
              if (!isUnanswered) {
                statusIcon = isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                );
              }

              return (
                <div key={idx} className={`pt-6 first:pt-0 ${idx > 0 ? "mt-6" : ""}`}>
                  <div className="flex items-start gap-4">
                    {statusIcon}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-bold text-slate-800 text-sm mt-0.5">Question {idx + 1}</span>
                        {!isUnanswered && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                            {isCorrect ? "Correct" : "Incorrect"}
                          </span>
                        )}
                        {isUnanswered && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                            Skipped
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 leading-relaxed text-left">
                        {renderQuestionText(q.text)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                        {q.options.map((opt, optIdx) => {
                          const isCorrectOpt = optIdx === q.correctIndex;
                          const isUserSel = optIdx === userAnswerIdx;

                          let optStyle = "border-slate-200 text-slate-600 bg-slate-50/40 hover:bg-slate-50/80";
                          let optIcon = null;

                          if (isCorrectOpt) {
                            optStyle = "border-emerald-200 text-emerald-800 bg-emerald-50/50 font-medium";
                            optIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
                          } else if (isUserSel && !isCorrect) {
                            optStyle = "border-red-200 text-red-800 bg-red-50/50 font-medium";
                            optIcon = <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />;
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-colors duration-150 text-left ${optStyle}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest mr-1">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{renderQuestionText(opt)}</span>
                              </div>
                              {optIcon}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Action Footer */}
        <footer className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              const subId = state.subjectId || localStorage.getItem("practical_test_last_subject_id") || "";
              navigate(`/test-instructions/${subId}`);
            }}
            className="w-full md:w-64 py-3.5 rounded-xl bg-[#3525cd] text-white font-bold text-sm shadow-md shadow-[#3525cd]/20 hover:bg-[#3525cd]/90 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Retake Practice Test
          </button>
            <button 
            onClick={() => window.print()}
            className="w-full md:w-64 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            Download Detailed Report
          </button>
        </footer>
  <style>{`
          @media print {
            nav, footer, button, .no-print {
              display: none !important;
            }
            main {
              padding: 0 !important;
              margin: 0 !important;
              max-width: 100% !important;
            }
            body {
              background-color: white !important;
            }
            pre {
              white-space: pre-wrap !important;
              word-wrap: break-word !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
}