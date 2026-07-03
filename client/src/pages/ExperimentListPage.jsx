import { useState, useMemo, useEffect } from "react";
import {
  Share2,
  Download,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  X,
} from "lucide-react";
import muLogo from "../assets/mu-logo.png";
import Sidebar from "../components/Sidebar";

export default function ExperimentListPage({
  onNavigate,
  subjectId,
  subjects = [],
  experiments = [],
  onSelectExperiment,
}) {
  const [expandedExperiments, setExpandedExperiments] = useState(new Set());
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);

  const currentSubject =
    subjects.find((s) => s._id === subjectId) || subjects[0];

  const subjectExperiments = useMemo(() => {
    if (!subjectId) return [];
    return experiments.filter((e) => {
      return (
        e.subjectId === subjectId ||
        e.subject === subjectId ||
        e.subjectId?._id === subjectId
      );
    });
  }, [experiments, subjectId]);

  const toggleExpand = (expId) => {
    setExpandedExperiments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(expId)) {
        newSet.delete(expId);
      } else {
        newSet.add(expId);
      }
      return newSet;
    });
  };

  // Completion tracking via localStorage
  const completionKey = `bhlabs_completed_${subjectId}`;
  const [completedSet, setCompletedSet] = useState(() => {
    try {
      const saved = localStorage.getItem(`bhlabs_completed_${subjectId}`);
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  const isCompleted = (expId, subPart) =>
    completedSet.has(`${expId}__${subPart}`);

  const completedExperimentsCount = useMemo(() => {
    return subjectExperiments.filter((exp) => {
      const subExperiments = exp.subExperiments || [];
      if (subExperiments.length === 0) return false;
      return subExperiments.every((sub) => isCompleted(exp._id, sub.part));
    }).length;
  }, [subjectExperiments, completedSet]);

  const filteredMainExperiments = useMemo(() => {
    return subjectExperiments.filter(() => true); // Show all
  }, [subjectExperiments]);

  const total = subjectExperiments.length || 0;

  const R = 56;
  const C = 2 * Math.PI * R;
  const overallPct =
    total > 0 ? Math.round((completedExperimentsCount / total) * 100) : 0;
  const offset = C - (overallPct / 100) * C;

  return (
    <div className="bg-[#F8F9FB] flex min-h-screen text-slate-800">
      {/* Sidebar */}
      <Sidebar activePage="subjects" onNavigate={onNavigate} experiments={experiments} />

      {/* Main Content Container */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header
          className="h-12 px-8 flex items-center justify-between bg-[#F8F9FB]"
          data-purpose="page-header"
        >
          <nav className="flex items-center text-xs text-slate-500 gap-2">
            <button
              onClick={() => onNavigate?.("subjects")}
              className="hover:text-slate-700"
            >
              Subjects
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-semibold">
              {currentSubject?.name || "Subject Name"}
            </span>
          </nav>
        </header>

        {/* Scrollable Content */}
        <div className="px-8 py-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {currentSubject?.name || "Subject Name"}
              </h1>
              <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                {total} Experiments · Semester {currentSubject?.semester || 3}
              </p>
            </div>
            <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 text-xs font-bold shadow-sm hover:border-slate-300">
              All ({total})
            </button>
          </div>

          <div className="flex gap-8 items-start">
            {/* Experiments List */}
            <section
              className="flex-1 space-y-3"
              data-purpose="experiments-section"
            >
              {filteredMainExperiments.length > 0 ? (
                filteredMainExperiments.map((exp) => {
                  const num = String(
                    exp.experimentNumber || exp.number || "??",
                  ).padStart(2, "0");
                  const isExpanded = expandedExperiments.has(exp._id);
                  const subExperiments = exp.subExperiments || [];
                  const hasSubs = subExperiments.length > 0;

                  return (
                    <div
                      key={exp._id}
                      className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
                      data-purpose={`experiment-card-${num}`}
                    >
                      <div
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors relative"
                        onClick={() => hasSubs && toggleExpand(exp._id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#F0ECFF] rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-[#5521FF] font-bold text-xs">
                              {num}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-800 text-xs">
                              {exp.problemStatement ||
                                exp.title ||
                                `Experiment ${num}`}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {(() => {
                            const doneCount = subExperiments.filter((s) =>
                              isCompleted(exp._id, s.part),
                            ).length;
                            const pct =
                              subExperiments.length > 0
                                ? (doneCount / subExperiments.length) * 100
                                : 0;
                            const allDone =
                              doneCount === subExperiments.length &&
                              subExperiments.length > 0;
                            return (
                              <div className="text-right hidden sm:block">
                                <span
                                  className={`text-[10px] font-medium block uppercase tracking-tighter ${allDone ? "text-emerald-500" : "text-slate-400"}`}
                                >
                                  {doneCount} / {subExperiments.length} Done
                                </span>
                                <div className="w-20 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${allDone ? "bg-emerald-500" : "bg-[#5521FF]"}`}
                                    style={{ width: `${pct}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })()}
                          {hasSubs && (
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            />
                          )}
                        </div>
                      </div>

                      {isExpanded && hasSubs && (
                        <div className="bg-slate-50/50 border-t border-slate-200">
                          <div className="py-2 px-4 flex flex-col first:pt-0">
                            {subExperiments.map((sub, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  onSelectExperiment?.(exp._id, sub.part)
                                }
                                className={`flex items-center justify-between cursor-pointer group py-1 w-full text-left ${index !== 0 ? "border-t border-slate-200/70 mt-0.5 pt-1.5" : ""}`}
                              >
                                <div className="flex items-center gap-2.5">
                                  {isCompleted(exp._id, sub.part) ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-[#5521FF] transition-colors"></div>
                                  )}
                                  <span
                                    className={`text-[11px] font-medium transition-colors ${
                                      isCompleted(exp._id, sub.part)
                                        ? "text-emerald-600 line-through"
                                        : "text-slate-700 group-hover:text-[#5521FF]"
                                    }`}
                                  >
                                    {sub.title || `Sub-experiment ${sub.part}`}
                                  </span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#5521FF] group-hover:translate-x-1 transition-all" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 text-slate-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No experiments found</h3>
                </div>
              )}
            </section>

            {/* Right Sidebar */}
            <aside
              className="w-80 space-y-4 hidden lg:block"
              data-purpose="dashboard-sidebar"
            >
              {/* Lab Analytics Card */}
              <div
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm"
                data-purpose="analytics-card"
              >
                <h3 className="font-bold text-slate-800 mb-1 text-sm">
                  Lab Analytics
                </h3>
                <div className="flex justify-center relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      fill="transparent"
                      r={R}
                      stroke="#F1F5F9"
                      strokeWidth="10"
                    ></circle>
                    <circle
                      className="transition-all duration-500"
                      cx="64"
                      cy="64"
                      fill="transparent"
                      r={R}
                      stroke="#5521FF"
                      strokeDasharray={C}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      strokeWidth="10"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-slate-800">
                      {overallPct}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                      Overall
                    </span>
                  </div>
                </div>
                <div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] text-slate-500 font-bold uppercase">
                        Completed
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600">
                        {completedExperimentsCount} / {total}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{
                          width: `${total > 0 ? (completedExperimentsCount / total) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] text-slate-500 font-bold uppercase">
                        Pending
                      </span>
                      <span className="text-[11px] font-bold text-orange-500">
                        {total - completedExperimentsCount} / {total}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full transition-all"
                        style={{
                          width: `${total > 0 ? ((total - completedExperimentsCount) / total) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                  <Download className="w-3.5 h-3.5" />
                  Export Progress
                </button>
              </div>

              {/* Syllabus Block */}
              <div
                className="bg-[#F0ECFF] rounded-2xl border border-[#5521FF]/20 p-8 relative overflow-hidden group"
                data-purpose="syllabus-card"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <img src={muLogo} className="w-16 h-16 object-contain" />

                    <h3 className="text-sm font-bold text-slate-800 leading-tight">
                      Mumbai University Verified Curriculum
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">
                    Content is verified and structured according to the latest
                    semester syllabus.
                  </p>
                  <button
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#5521FF] text-white rounded-xl font-bold text-xs hover:bg-[#5521FF]/90 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                    onClick={() => setIsSyllabusOpen(true)}
                  >
                    View Syllabus
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {isSyllabusOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40"
          onClick={() => setIsSyllabusOpen(false)}
        >
          <div 
            className="bg-white rounded-sm shadow-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {currentSubject?.name || "Subject"} - Syllabus Preview
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Mumbai University Curriculum
                </p>
              </div>
              <button
                onClick={() => setIsSyllabusOpen(false)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 hover:bg-slate-100 font-bold transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Modal Body / PDF Preview */}
            <div className="flex-1 bg-slate-100 relative">
              <iframe
                src={currentSubject?.syllabusPdf ? `${currentSubject.syllabusPdf}#navpanes=0` : ""}
                title="Syllabus PDF Preview"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
