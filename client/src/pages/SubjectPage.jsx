import { useState, useMemo, useEffect } from "react";
import { 
  LayoutDashboard, BookOpen, PenTool, FileText, Settings, LogOut, 
  Share2, Download, ArrowRight, ChevronRight, Terminal, AlertCircle, ChevronDown,
  GraduationCap, ExternalLink, CheckCircle2
} from "lucide-react";

export default function SubjectPage({
  onNavigate,
  subjectId,
  subjects = [],
  experiments = [],
  onSelectExperiment,
}) {
  const [filter, setFilter] = useState("all");
  const [expandedExperiments, setExpandedExperiments] = useState(new Set());

  const currentSubject = subjects.find((s) => s._id === subjectId) || subjects[0];

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
    setExpandedExperiments(prev => {
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
    } catch { return new Set(); }
  });

  const toggleCompleted = (expId, subPart, e) => {
    e.stopPropagation();
    const key = `${expId}__${subPart}`;
    setCompletedSet(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      localStorage.setItem(completionKey, JSON.stringify([...next]));
      return next;
    });
  };

  const isCompleted = (expId, subPart) => completedSet.has(`${expId}__${subPart}`);

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
  const overallPct = total > 0 ? Math.round((completedExperimentsCount / total) * 100) : 0;
  const offset = C - (overallPct / 100) * C;

  return (
    <div className="bg-[#F8F9FB] flex min-h-screen text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0" data-purpose="main-navigation">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-sm shrink-0">
              <img src="/logo.png" alt="BH.Lab Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold text-[#5521FF]">BH.Lab</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Engineering Portal</p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <button onClick={() => onNavigate?.("dashboard")} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all w-full text-left">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 bg-[#F0ECFF] text-[#5521FF] rounded-xl transition-all w-full text-left">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium text-sm">My Subjects</span>
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all w-full text-left">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </button>
          <button onClick={() => onNavigate?.("landing")} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all w-full text-left">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Container */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-12 px-8 flex items-center justify-between bg-[#F8F9FB]" data-purpose="page-header">
          <nav className="flex items-center text-xs text-slate-500 gap-2">
            <button onClick={() => onNavigate?.("dashboard")} className="hover:text-slate-700">Dashboard</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-semibold">{currentSubject?.name || "Subject Name"}</span>
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 border border-slate-200 rounded-full hover:bg-white transition-colors bg-white">
              <Share2 className="w-4 h-4 text-slate-600" />
            </button>
            <button className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 transition-colors shadow-sm" onClick={() => onNavigate?.("journals")}>
              Generate Journal
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="px-8 py-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{currentSubject?.name || "Subject Name"}</h1>
              <p className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">{total} Experiments · Semester {currentSubject?.semester || 3}</p>
            </div>
            <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 text-xs font-bold shadow-sm hover:border-slate-300">
              All ({total})
            </button>
          </div>
          
          <div className="flex gap-8 items-start">
            {/* Experiments List */}
            <section className="flex-1 space-y-3" data-purpose="experiments-section">
              {filteredMainExperiments.length > 0 ? (
                filteredMainExperiments.map((exp) => {
                  const num = String(exp.experimentNumber || exp.number || "??").padStart(2, "0");
                  const isExpanded = expandedExperiments.has(exp._id);
                  const subExperiments = exp.subExperiments || [];
                  const hasSubs = subExperiments.length > 0;

                  return (
                    <div key={exp._id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden" data-purpose={`experiment-card-${num}`}>
                      <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors relative" onClick={() => hasSubs && toggleExpand(exp._id)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#F0ECFF] rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-[#5521FF] font-bold text-xs">{num}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-xs">{exp.problemStatement || exp.title || `Experiment ${num}`}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {(() => {
                              const doneCount = subExperiments.filter(s => isCompleted(exp._id, s.part)).length;
                              const pct = subExperiments.length > 0 ? (doneCount / subExperiments.length) * 100 : 0;
                              const allDone = doneCount === subExperiments.length && subExperiments.length > 0;
                              return (
                                <div className="text-right hidden sm:block">
                                  <span className={`text-[10px] font-bold block uppercase tracking-tighter ${allDone ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {doneCount} / {subExperiments.length} Done
                                  </span>
                                  <div className="w-20 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                                    <div className={`h-full transition-all ${allDone ? 'bg-emerald-500' : 'bg-[#5521FF]'}`} style={{ width: `${pct}%` }}></div>
                                  </div>
                                </div>
                              );
                            })()}
                          {hasSubs && (
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </div>
                      
                      {isExpanded && hasSubs && (
                        <div className="bg-slate-50/50 border-t border-slate-100">
                          <div className="py-2 px-4">
                            {subExperiments.map((sub, index) => (
                              <button 
                                key={index}
                                onClick={() => onSelectExperiment?.(exp._id, sub.part)}
                                className={`flex items-center justify-between group py-1 w-full text-left ${index !== 0 ? 'border-t border-slate-100/60 mt-0.5 pt-1.5' : ''}`}
                              >
                                <div className="flex items-center gap-2.5">
                                  {isCompleted(exp._id, sub.part) ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                  ) : (
                                    <div className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-[#5521FF] transition-colors"></div>
                                  )}
                                  <span className={`text-[10px] font-medium transition-colors ${
                                    isCompleted(exp._id, sub.part)
                                      ? 'text-emerald-600 line-through'
                                      : 'text-slate-700 group-hover:text-[#5521FF]'
                                  }`}>
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
            <aside className="w-80 space-y-4 hidden lg:block" data-purpose="dashboard-sidebar">
              {/* Lab Analytics Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm" data-purpose="analytics-card">
                <h3 className="font-bold text-slate-800 mb-5 text-sm">Lab Analytics</h3>
                <div className="flex justify-center mb-6 relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" fill="transparent" r={R} stroke="#F1F5F9" strokeWidth="10"></circle>
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
                    <span className="text-xl font-bold text-slate-800">{overallPct}%</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Overall</span>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] text-slate-500 font-bold uppercase">Completed</span>
                      <span className="text-[11px] font-bold text-emerald-600">{completedExperimentsCount} / {total}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all" style={{ width: `${total > 0 ? (completedExperimentsCount / total) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] text-slate-500 font-bold uppercase">Pending</span>
                      <span className="text-[11px] font-bold text-orange-500">{total - completedExperimentsCount} / {total}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full transition-all" style={{ width: `${total > 0 ? ((total - completedExperimentsCount) / total) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                  <Download className="w-3.5 h-3.5" />
                  Export Progress
                </button>
              </div>

              {/* Syllabus Block */}
              <div className="bg-[#F0ECFF] rounded-2xl border border-[#5521FF]/20 p-8 relative overflow-hidden group" data-purpose="syllabus-card">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <GraduationCap className="w-20 h-20 rotate-12" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-[#5521FF] rounded-xl flex items-center justify-center shadow-lg shadow-[#5521FF]/30">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">Mumbai University Syllabus</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-8 leading-relaxed font-medium">
                    Ensure your coursework aligns with the latest semester guidelines.
                  </p>
                  <a 
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#5521FF] text-white rounded-2xl font-bold text-xs shadow-xl shadow-[#5521FF]/30 hover:bg-[#5521FF]/90 hover:scale-[1.02] active:scale-95 transition-all" 
                    href={currentSubject?.syllabusPdf || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Verify Syllabus
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}