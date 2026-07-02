import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Cloud, AlertTriangle, X, HelpCircle } from "lucide-react";
// ── Helper: format elapsed seconds as HH:MM:SS ────────────────────────
function formatTime(totalSeconds) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// ── Helper: parse and render code snippets dynamically ────────────────
function renderQuestionText(text) {
  if (!text) return null;
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("```")) {
      const content = part.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
      return (
        <pre key={idx} className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto text-xs font-mono text-violet-800 leading-relaxed max-w-full text-left">
          <code>{content}</code>
        </pre>
      );
    }

    const inlineParts = part.split(/(`[^`\n]+`)/g);
    return (
      <span key={idx} className="whitespace-pre-line">
        {inlineParts.map((subPart, sIdx) => {
          if (subPart.startsWith("`") && subPart.endsWith("`")) {
            return (
              <code key={sIdx} className="px-1.5 py-0.5 mx-0.5 bg-slate-100 border border-slate-200 text-violet-700 rounded font-mono text-xs">
                {subPart.slice(1, -1)}
              </code>
            );
          }
          return subPart;
        })}
      </span>
    );
  });
}

// ── Question Status Enum ──────────────────────────────────────────────
const STATUS = {
  UNANSWERED: "unanswered",
  CORRECT: "correct",
  INCORRECT: "incorrect",
};

// =====================================================================
// AptitudeTest  –  main page component
// =====================================================================
export default function AptitudeTest({
  testTitle = "C Programming",
  studentName = "Akshay Manjrekar",
  onNavigate,
  onSubmit,
}) {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  // ── State ───────────────────────────────────────────────────────────
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        if (!subjectId) {
          throw new Error("No subject ID provided in route parameters.");
        }
        const res = await fetch(`/api/aptitude/questions/${subjectId}`);
        if (!res.ok) throw new Error("Failed to load questions from server API.");
        const data = await res.json();
        setQuestionsList(data);
      } catch (err) {
        console.error("Load questions error:", err);
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [subjectId]);

  const TOTAL_TIME = 20 * 60; // 20 minutes in seconds
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // committed answers (determines grid colors)
  const [tempAnswers, setTempAnswers] = useState({}); // temporary selections before save and next
  const [markedForReview, setMarkedForReview] = useState({}); // { [qIndex]: boolean }
  const [remaining, setRemaining] = useState(TOTAL_TIME);
  const [submitted, setSubmitted] = useState(false);
  const elapsed = TOTAL_TIME - remaining;
  const timerRef = useRef(null);
  const submittedRef = useRef(false); // avoid double-submit from auto-submit

  // ── Countdown Timer ─────────────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemaining((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const [showBlockerModal, setShowBlockerModal] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Intercept browser back/forward buttons using window popstate
  useEffect(() => {
    if (submitted) return;

    // Push a dummy history state so we have something to pop back to
    window.history.pushState(null, "", window.location.pathname);

    const handlePopState = (e) => {
      // Re-push state to keep user on same page
      window.history.pushState(null, "", window.location.pathname);
      // Trigger blocker modal
      setShowBlockerModal(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [submitted]);

  // Prevent browser tab close / refresh
  useEffect(() => {
    if (submitted) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submitted]);

  // ── Derived ─────────────────────────────────────────────────────────
  const currentQuestion = questionsList[currentIndex];
  const totalQuestions = questionsList.length;

  const getQuestionStatus = useCallback(
    (idx) => {
      if (answers[idx] === undefined || !questionsList[idx]) return STATUS.UNANSWERED;
      return answers[idx] === questionsList[idx].correctIndex
        ? STATUS.CORRECT
        : STATUS.INCORRECT;
    },
    [answers, questionsList],
  );

  const stats = {
    correct: Object.keys(answers).filter(
      (i) => questionsList[i] && answers[i] === questionsList[i].correctIndex,
    ).length,
    incorrect: Object.keys(answers).filter(
      (i) => questionsList[i] && answers[i] !== questionsList[i].correctIndex,
    ).length,
    unanswered:
      totalQuestions -
      Object.keys(answers).filter((i) => answers[i] !== undefined).length,
  };

  const initials = studentName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ── Handlers ────────────────────────────────────────────────────────
  const selectOption = (optionIndex) => {
    if (submitted) return;
    setTempAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const goNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex((i) => i + 1);
  };

  const toggleMarkForReview = () => {
    if (submitted) return;
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const saveAndNext = () => {
    const currentTemp = tempAnswers[currentIndex];
    if (currentTemp !== undefined) {
      setAnswers((prev) => ({ ...prev, [currentIndex]: currentTemp }));
    }
    goNext();
  };

  const handleSubmit = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    clearInterval(timerRef.current);
    setSubmitted(true);
    
    // Merge any uncommitted temp selections
    const finalAnswers = { ...answers, ...tempAnswers };
    const finalStats = {
      correct: Object.keys(finalAnswers).filter(
        (i) => questionsList[i] && finalAnswers[i] === questionsList[i].correctIndex,
      ).length,
      incorrect: Object.keys(finalAnswers).filter(
        (i) => questionsList[i] && finalAnswers[i] !== questionsList[i].correctIndex,
      ).length,
      unanswered:
        totalQuestions -
        Object.keys(finalAnswers).filter((i) => finalAnswers[i] !== undefined).length,
    };

    if (onSubmit) onSubmit({ answers: finalAnswers, elapsed, stats: finalStats, questions: questionsList });
  };

  // ── Auto-submit when time runs out ──────────────────────────────────
  useEffect(() => {
    if (remaining <= 0 && !submitted) {
      handleSubmit();
    }
  }, [remaining, submitted]);

  const jumpToQuestion = (idx) => {
    if (submitted) return;
    const isAllowed = idx === currentIndex || markedForReview[idx];
    if (isAllowed) {
      setCurrentIndex(idx);
    }
  };

  // ── Last-saved timestamp ────────────────────────────────────────────
  const lastSavedTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-violet-200 border-t-[#5521FF] animate-spin" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse text-center px-4">
          Generating fresh test questions from subexperiments...
        </p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Main Content — full width, no sidebar */}
      <main className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">{testTitle}</h2>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs">
              {initials}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">{testTitle}</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── Question Card ─────────────────────────────────── */}
            <div className="flex-1 bg-white shadow-sm border border-slate-100 p-8 min-h-[600px] relative rounded-3xl">
              {/* Watermark */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none"
                aria-hidden="true"
              >
                <div className="w-96 h-96 rounded-full bg-violet-200" />
              </div>

              {/* Question Text */}
              <div className="flex items-start space-x-2 mb-8">
                <span className="font-bold text-slate-900">
                  {currentIndex + 1}.
                </span>
                <h3 className="font-bold text-slate-900">
                  {renderQuestionText(currentQuestion.text)}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-6 ml-6">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected =
                    (tempAnswers[currentIndex] !== undefined
                      ? tempAnswers[currentIndex]
                      : answers[currentIndex]) === optIdx;
                  return (
                    <label
                      key={optIdx}
                      className="flex items-center space-x-4 cursor-pointer group"
                      onClick={() => selectOption(optIdx)}
                    >
                      <div
                        className={`relative flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors ${
                          isSelected
                            ? "border-[#5521FF]"
                            : "border-slate-400 group-hover:border-violet-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 bg-[#5521FF] rounded-full" />
                        )}
                      </div>
                      <span className="text-sm text-slate-700">{renderQuestionText(opt)}</span>
                    </label>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="absolute bottom-8 right-8 flex items-center gap-2.5">
                <button
                  onClick={toggleMarkForReview}
                  className={`font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors uppercase tracking-wider text-xs flex items-center gap-1.5 cursor-pointer ${
                    markedForReview[currentIndex]
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {markedForReview[currentIndex] ? "Marked for Review" : "Mark for Review"}
                </button>
                {currentIndex < totalQuestions - 1 ? (
                  <button
                    onClick={saveAndNext}
                    className="bg-[#5521FF] text-white font-bold py-2.5 px-5 rounded-lg shadow-sm hover:opacity-90 transition-opacity uppercase tracking-wider text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    Save & Next
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="bg-[#5521FF] text-white font-bold py-2.5 px-5 rounded-lg shadow-sm hover:opacity-90 transition-opacity uppercase tracking-wider text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>

            {/* ── Stats Panel ───────────────────────────────────── */}
            <aside className="w-full lg:w-[360px] space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                {/* Student Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {studentName}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {testTitle}
                    </p>
                  </div>
                </div>

                <hr className="border-slate-100 mb-6" />

                {/* Legend */}
                <div className="mb-4">
                  <p className="text-sm font-bold text-slate-800 mb-3">
                    Questions
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                      <span className="text-[10px] text-slate-500">
                        Correct
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-3 h-3 bg-red-600 rounded-sm" />
                      <span className="text-[10px] text-slate-500">
                        Incorrect
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-3 h-3 bg-amber-500 rounded-sm" />
                      <span className="text-[10px] text-slate-500">
                        Review
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-sm" />
                      <span className="text-[10px] text-slate-500">
                        Unanswered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Question Grid */}
                <div className="grid grid-cols-4 gap-3 mb-8">
                  {questionsList.map((_, idx) => {
                    const status = getQuestionStatus(idx);
                    const isMarked = markedForReview[idx];
                    const isAllowed = idx === currentIndex || isMarked;
                    
                    let bgClass = "bg-slate-100 text-slate-500";
                    if (isMarked) {
                      bgClass = "bg-amber-500 text-white";
                    } else if (status === STATUS.CORRECT) {
                      bgClass = "bg-emerald-500 text-white";
                    } else if (status === STATUS.INCORRECT) {
                      bgClass = "bg-red-600 text-white";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => jumpToQuestion(idx)}
                        disabled={!isAllowed}
                        className={`${bgClass} text-base font-bold flex items-center justify-center h-14 rounded-xl transition-all ${
                          isAllowed
                            ? "cursor-pointer hover:opacity-80 shadow-sm"
                            : "cursor-not-allowed opacity-45"
                        } ${
                          idx === currentIndex
                            ? "ring-2 ring-[#5521FF] ring-offset-2"
                            : ""
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Submit Button */}
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  disabled={submitted}
                  className={`w-full font-bold py-2.5 px-4 rounded-lg shadow-sm uppercase tracking-wider text-xs transition-opacity cursor-pointer ${
                    submitted
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-[#5521FF] text-white hover:opacity-90"
                  }`}
                >
                  {submitted ? "Submitted" : "Submit"}
                </button>

                {/* Score Summary (after submit) */}
                {submitted && (
                  <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                    <p className="text-sm font-bold text-slate-800">Results</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Correct</span>
                      <span className="font-bold text-emerald-600">
                        {stats.correct}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Incorrect</span>
                      <span className="font-bold text-red-600">
                        {stats.incorrect}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Unanswered</span>
                      <span className="font-bold text-slate-600">
                        {stats.unanswered}
                      </span>
                    </div>
                    <hr className="border-slate-100" />
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Score</span>
                      <span className="font-bold text-[#5521FF]">
                        {stats.correct}/{totalQuestions}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Time Taken</span>
                      <span className="font-bold text-slate-800">
                        {formatTime(elapsed)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* ── Floating Countdown Timer (bottom-right) ─────────────────── */}
      <div className={`fixed bottom-6 right-6 shadow-lg border p-4 rounded-xl z-50 flex flex-col items-end transition-colors ${
        remaining <= 120 ? "bg-red-50 border-red-200" : "bg-white border-slate-100"
      }`}>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Time Remaining
        </p>
        <div className="flex items-center space-x-2">
          <Clock className={`w-5 h-5 ${remaining <= 120 ? "text-red-600" : "text-[#5521FF]"}`} />
          <span className={`text-2xl font-bold font-mono tracking-tight ${
            remaining <= 120 ? "text-red-600" : "text-[#5521FF]"
          }`}>
            {formatTime(remaining)}
          </span>
        </div>
      </div>

      {/* ── Floating System Status (bottom-left) ─────────────────── */}
      <div className="fixed bottom-6 left-6 bg-white shadow-lg border border-slate-100 p-4 rounded-xl z-50 flex flex-col items-start w-64">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          System Status
        </p>
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="text-sm font-medium text-slate-800">
            Internet connection stable
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-500">
          <Cloud className="w-3.5 h-3.5" />
          <span className="text-[10px]">
            Last answer saved at {lastSavedTime}
          </span>
        </div>
      </div>

      {/* ── Navigation Blocker Modal ──────────────────────────────── */}
      {showBlockerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 pb-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Leave this test?
                </h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Your test is still in progress. If you leave now, all your
                  answers will be lost and you won't be able to resume.
                </p>
              </div>
              <button
                onClick={() => setShowBlockerModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Actions */}
            <div className="p-6 pt-2 flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowBlockerModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Continue Test
              </button>
              <button
                onClick={() => {
                  clearInterval(timerRef.current);
                  // Allow navigation by bypassing blocker
                  submittedRef.current = true;
                  navigate(-1);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors cursor-pointer"
              >
                Leave Test
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Submit Confirmation Modal ─────────────────────────────── */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 pb-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-[#5521FF]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Submit Answers?
                </h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to submit your answers? You will not be
                  able to modify them or resume the test once submitted.
                </p>
              </div>
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Actions */}
            <div className="p-6 pt-2 flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleSubmit();
                }}
                className="px-4 py-2 rounded-lg bg-[#5521FF] text-white font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer animate-pulse"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
