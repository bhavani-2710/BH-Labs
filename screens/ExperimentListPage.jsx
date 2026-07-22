"use client";
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
  Trash2,
} from "lucide-react";
const muLogo = "/mu-logo.png";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

export default function ExperimentListPage({
  onNavigate,
  subjectId,
  subjects = [],
  experiments = [],
  onSelectExperiment,
  deptId,
}) {
  // Delete experiment handler
  const handleDelete = async (expId) => {
    try {
      const response = await fetch(`/api/experiments/${expId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete experiment');
      }
      // Optimistically remove from UI by updating state if needed
      // Assuming parent re-fetches experiments, we simply reload
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Error deleting experiment');
    }
  };
  const [expandedExperiments, setExpandedExperiments] = useState(new Set());
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);

  const currentSubject =
    subjects.find((s) => s._id === subjectId) || subjects[0];

  const activeSyllabusPdf = useMemo(() => {
    if (!currentSubject) return "";
    if (deptId && Array.isArray(currentSubject.departments)) {
      const matched = currentSubject.departments.find(
        (d) => String(d.department?._id || d.department) === String(deptId)
      );
      if (matched?.syllabusPdf) return matched.syllabusPdf;
    }
    if (Array.isArray(currentSubject.departments)) {
      const firstWithPdf = currentSubject.departments.find((d) => d.syllabusPdf);
      if (firstWithPdf?.syllabusPdf) return firstWithPdf.syllabusPdf;
    }
    return currentSubject.syllabusPdf || "";
  }, [currentSubject, deptId]);

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
    <div className="bg-[#F8F9FB] dark:bg-slate-950 flex min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar activePage="subjects" onNavigate={onNavigate} experiments={experiments} />

      {/* Main Content Container */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header
          className="h-12 px-8 flex items-center justify-between bg-[#F8F9FB] dark:bg-slate-950 transition-colors duration-200"
          data-purpose="page-header"
        >
          <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2">
            <button
              onClick={() => onNavigate?.("subjects")}
              className="hover:text-slate-700 dark:hover:text-slate-300"
            >
              Subjects
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 dark:text-slate-100 font-semibold">
              {currentSubject?.name || "Subject Name"}
            </span>
          </nav>
          <div className="mt-5"><ThemeToggle /></div>
        </header>

        {/* Scrollable Content */}
        <div className="px-8 py-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {currentSubject?.name || "Subject Name"}
              </h1>
              <p className="text-slate-400 dark:text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                {total} Experiments
                {currentSubject?.departments?.length > 0 && (() => {
                  if (deptId) {
                    const matched = currentSubject.departments.find(
                      (d) => String(d.department?._id || d.department) === String(deptId)
                    );
                    if (matched) {
                      const deptCode = matched.code || matched.department?.code || matched.department?.name || String(matched.department);
                      return ` · ${deptCode} (Sem ${matched.semester})`;
                    }
                  }
                  return " · " + currentSubject.departments.map(d => {
                    const dept = d.code || d.department?.code || d.department?.name || String(d.department);
                    return `${dept} (Sem ${d.semester})`;
                  }).join(" · ");
                })()}
              </p>
            </div>
            <button className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-600 dark:text-slate-400 text-xs font-bold shadow-sm hover:border-slate-300 transition-colors">
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
                    <Card
                      key={exp._id}
                      className="rounded-lg overflow-hidden"
                      data-purpose={`experiment-card-${num}`}
                    >
                      <div
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative"
                        onClick={() => hasSubs && toggleExpand(exp._id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#F0ECFF] dark:bg-violet-950 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                            <span className="text-[#5521FF] dark:text-violet-400 font-bold text-xs">
                              {num}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-800 dark:text-slate-200 text-xs">
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
                                  className={`text-[10px] font-medium block uppercase tracking-tighter ${allDone ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"}`}
                                >
                                  {doneCount} / {subExperiments.length} Done
                                </span>
                                <Progress
                                  value={pct}
                                  className="w-20 h-1.5 mt-1"
                                  indicatorClassName={allDone ? "bg-emerald-500" : "bg-[#5521FF]"}
                                />
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
                        <div className="bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
                          <div className="py-2 px-4 flex flex-col first:pt-0">
                            {subExperiments.map((sub, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  onSelectExperiment?.(exp._id, sub.part)
                                }
                                className={`flex items-center justify-between cursor-pointer group py-1 w-full text-left ${index !== 0 ? "border-t border-slate-200/70 dark:border-slate-800 mt-0.5 pt-1.5" : ""}`}
                              >
                                <div className="flex items-center gap-2.5">
                                  {isCompleted(exp._id, sub.part) ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-[#5521FF] dark:group-hover:bg-violet-400 transition-colors"></div>
                                  )}
                                  <span

                                    className={`text-[11px] font-medium transition-colors ${
                                      isCompleted(exp._id, sub.part)
                                        ? "text-emerald-600 line-through"
                                        : "text-slate-700 dark:text-slate-300 group-hover:text-[#5521FF] dark:group-hover:text-violet-400"
                                    }`}
                                  >
                                    {sub.title || `Sub-experiment ${sub.part}`}
                                  </span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-500 group-hover:text-[#5521FF] dark:group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-20 text-slate-500 dark:text-slate-400">
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
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-colors duration-200"
                data-purpose="analytics-card"
              >
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1 text-sm">
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
                      className="dark:stroke-slate-800"
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
                    <span className="text-xl font-bold text-slate-800 dark:text-slate-200">
                      {overallPct}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                      Overall
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                        Completed
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {completedExperimentsCount} / {total}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{
                          width: `${total > 0 ? (completedExperimentsCount / total) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                        Pending
                      </span>
                      <span className="text-[11px] font-bold text-orange-500 dark:text-orange-400">
                        {total - completedExperimentsCount} / {total}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full transition-all"
                        style={{
                          width: `${total > 0 ? ((total - completedExperimentsCount) / total) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2.5 mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-transparent rounded-lg text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer">
                  <Download className="w-3.5 h-3.5" />
                  Export Progress
                </button>
              </div>

              {/* Syllabus Block */}
              <div
                className="bg-[#F0ECFF] dark:bg-violet-950/20 rounded-2xl border border-[#5521FF]/20 dark:border-[#5521FF]/30 p-8 relative overflow-hidden group transition-colors duration-200"
                data-purpose="syllabus-card"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <img src={muLogo} className="w-16 h-16 object-contain" />

                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      Mumbai University Verified Curriculum
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-medium">
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

      <Dialog open={isSyllabusOpen} onOpenChange={setIsSyllabusOpen}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <DialogTitle className="text-sm font-bold text-slate-800 text-left">
              {currentSubject?.name || "Subject"} - Syllabus Preview
            </DialogTitle>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider text-left">
              Mumbai University Curriculum
            </p>
          </DialogHeader>
          <div className="flex-1 bg-slate-100 relative">
            <iframe
              src={activeSyllabusPdf ? `${activeSyllabusPdf}#navpanes=0` : ""}
              title="Syllabus PDF Preview"
              className="w-full h-full border-0"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
