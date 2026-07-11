import { useState, useEffect } from "react";
import {
  ArrowRight,
  TrendingUp,
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  FileText,
  Search,
  ChevronDown,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import ThemeToggle from "../components/ThemeToggle";

export default function SubjectsListPage({
  experiments,
  subjects,
  onNavigate,
  onSelectSubject,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(""); // department._id or ""
  const [deptLoading, setDeptLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch all departments for the filter dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`/api/departments`);
        if (!res.ok) throw new Error("Failed to fetch departments");
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        console.error("Could not load departments:", err);
      } finally {
        setDeptLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Filter subjects by search text and selected department
  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch = s.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (!selectedDept) return true;

    return (s.departments || []).some((d) => {
      const deptId = d.department?._id || d.department;
      return String(deptId) === String(selectedDept);
    });
  });

  const getProgressColor = () => "bg-orange-500";

  return (
    <div className="bg-[#f7f5fb] dark:bg-slate-950 min-h-screen flex transition-colors duration-200">
      {/* ── Sidebar ── */}
      <Sidebar
        activePage="subjects"
        onNavigate={onNavigate}
        experiments={experiments}
      />

      {/* ── Main Content ── */}
      <main className="flex-1 p-6 md:p-8 pb-24 flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Practical Subjects
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm">
              Track your progress across all engineering subjects
            </p>
          </div>

          {/* Search + Department filter + Theme toggle */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Search bar */}
            <div className="relative w-full md:w-60">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search subjects…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold text-[#09090B] dark:text-zinc-200 focus:outline-none focus:border-violet-400 placeholder:text-gray-400 transition-colors"
              />
            </div>

            {/* Premium Custom Department filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={deptLoading}
                className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer disabled:opacity-50 min-w-[210px]"
              >
                <span className="truncate">
                  {selectedDept
                    ? departments.find((d) => d._id === selectedDept)?.name ||
                      "All Departments"
                    : "All Departments"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <>
                  {/* Click outside backdrop */}
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsOpen(false)}
                  />

                  <div className="absolute right-0 mt-2 w-72 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-40 max-h-80 overflow-y-auto py-2 backdrop-blur-md transition-all duration-150">
                    <button
                      onClick={() => {
                        setSelectedDept("");
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-violet-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${
                        !selectedDept
                          ? "text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-slate-800/50"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      All Departments
                    </button>
                    {departments.map((dept) => {
                      const isSelected = dept._id === selectedDept;
                      return (
                        <button
                          key={dept._id}
                          onClick={() => {
                            setSelectedDept(dept._id);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-violet-50 dark:hover:bg-slate-800 transition-colors flex flex-col ${isSelected ? "text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-slate-800/50" : "text-slate-700 dark:text-slate-300"}`}
                        >
                          <span className="truncate font-bold">
                            {dept.name}
                          </span>
                          <span className="text-[10px] opacity-60 font-medium">
                            {dept.code}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <ThemeToggle />
          </div>
        </div>

        {/* Active filter badge */}
        {selectedDept &&
          (() => {
            const dept = departments.find((d) => d._id === selectedDept);
            return dept ? (
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 rounded-full text-xs font-semibold">
                  {dept.name}
                  <button
                    onClick={() => setSelectedDept("")}
                    className="ml-1 text-violet-500 hover:text-violet-700 dark:hover:text-violet-200 transition-colors leading-none"
                    aria-label="Clear department filter"
                  >
                    ×
                  </button>
                </span>
                <span className="text-xs text-gray-400 dark:text-slate-500">
                  {filteredSubjects.length} subject
                  {filteredSubjects.length !== 1 ? "s" : ""}
                </span>
              </div>
            ) : null;
          })()}

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((subject) => {
            const subjectId = subject._id;
            const subjectExperiments = experiments.filter((e) => {
              return (
                e.subjectId === subjectId ||
                e.subject === subjectId ||
                e.subjectId?._id === subjectId
              );
            });

            let completedMainExps = 0;
            const totalMainExps = subjectExperiments.length;

            try {
              const saved = localStorage.getItem(
                `bhlabs_completed_${subjectId}`,
              );
              const completedList = saved ? JSON.parse(saved) : [];
              subjectExperiments.forEach((exp) => {
                const subExperiments = exp.subExperiments || [];
                if (subExperiments.length > 0) {
                  const allDone = subExperiments.every((sub) =>
                    completedList.includes(`${exp._id}__${sub.part}`),
                  );
                  if (allDone) {
                    completedMainExps++;
                  }
                }
              });
            } catch (err) {
              console.error(err);
            }

            const progress =
              totalMainExps > 0
                ? Math.round((completedMainExps / totalMainExps) * 100)
                : 0;
            const isCompleted = progress === 100;

            // Department + semester tags setup
            const deptTags = (subject.departments || [])
              .filter((d) => {
                const isPopulated =
                  d.department &&
                  typeof d.department === "object" &&
                  d.department.name;
                if (!isPopulated) return false;
                if (
                  selectedDept &&
                  String(d.department._id) !== String(selectedDept)
                )
                  return false;
                return true;
              })
              .map((d) => ({
                name: d.department.name,
                code: d.code || d.department.code || "",
                semester: d.semester,
              }));

            return (
              <Card
                key={subject._id}
                className="overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl"
              >
                <CardContent className="p-6">
                  <h3
                    className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2 leading-snug cursor-pointer hover:text-violet-700 dark:hover:text-violet-400 transition-colors"
                    onClick={() => onSelectSubject?.(subject._id, selectedDept)}
                  >
                    {subject.name}
                  </h3>

                  {/* Dept / semester tags — only shown when populated */}
                  {deptTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {deptTags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-300 text-[10px] font-semibold rounded-full border border-violet-100 dark:border-violet-900/30"
                        >
                          {tag.name}
                          {tag.code && (
                            <span className="opacity-60">({tag.code})</span>
                          )}
                          <span className="opacity-50">·</span>
                          Sem {tag.semester}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Progress bar using imported Progress component */}
                  <div className="mb-5">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-medium text-gray-500 dark:text-slate-400">
                        Progress
                      </span>
                      <span className="font-bold text-[#5521FF] dark:text-violet-400">
                        {progress}%
                      </span>
                    </div>
                    <Progress
                      value={progress}
                      className="h-2"
                      indicatorClassName={getProgressColor(progress)}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() =>
                        onSelectSubject?.(subject._id, selectedDept)
                      }
                      className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                        isCompleted
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                          : "bg-[#5521FF] hover:bg-violet-700 text-white shadow-sm shadow-violet-200"
                      }`}
                    >
                      {isCompleted ? "Review Subject" : "Continue Learning"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() =>
                        onNavigate?.("test-instructions", {
                          subjectId: subject._id,
                        })
                      }
                      className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-violet-200 dark:border-transparent text-[#5521FF] dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Take Test
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Insight Banner */}
        <div className="mt-10 p-7 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl relative overflow-hidden transition-colors duration-200">
          <div className="max-w-lg">
            <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              Weekly Performance Insight
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              You've completed{" "}
              <span className="font-bold text-emerald-600 dark:text-emerald-450">
                12 labs
              </span>{" "}
              this week. You're{" "}
              <span className="font-bold text-[#5521FF] dark:text-violet-400">
                15% ahead
              </span>{" "}
              of your batch in core subjects.
            </p>
          </div>
          <div className="absolute bottom-3 right-6 opacity-[0.07] text-[#09090B] dark:text-white pointer-events-none">
            <TrendingUp size={100} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-10 pb-2 text-center text-xs text-gray-400 dark:text-slate-500">
          © 2024–25 BH.Lab · Built for engineering students
        </footer>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex items-center justify-around z-50 transition-colors duration-200">
        <button
          onClick={() => onNavigate?.("dashboard")}
          className="flex flex-col items-center gap-0.5 text-gray-400 dark:text-slate-500"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-[#5521FF] dark:text-violet-400">
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-bold">Subjects</span>
        </button>
        <button
          onClick={() => onNavigate?.("viva-practice-menu")}
          className="flex flex-col items-center gap-0.5 text-gray-400 dark:text-slate-500"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">AI</span>
        </button>
      </nav>
    </div>
  );
}
