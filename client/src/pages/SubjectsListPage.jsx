import { useState, useEffect } from "react";
import {
  Book,
  ArrowRight,
  TrendingUp,
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  FileText,
  Mic,
  Search,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function SubjectsListPage({ experiments, subjects, onNavigate, onSelectSubject }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubjects = subjects.filter((s) =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getProgressColor = (progress) => {
    return "bg-orange-500";
  };

  return (
    <div className="bg-[#f7f5fb] min-h-screen flex">
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
            <h1 className="text-xl font-bold text-slate-900">
              Practical Subjects
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Track your progress across all engineering subjects
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search subjects…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-violet-400 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((subject) => {
            // Compute dynamic progress using localStorage completion data
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

            return (
              <div
                key={subject._id}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-5 leading-snug cursor-pointer hover:text-violet-700 transition-colors"
                    onClick={() => onSelectSubject?.(subject._id)}
                  >
                    {subject.name}
                  </h3>

                  {/* Progress bar */}
                  <div className="mb-5">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-medium text-gray-500">
                        Progress
                      </span>
                      <span className="font-bold text-[#5521FF]">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-2.5">
                    {/* Continue Learning */}
                    <button
                      onClick={() => onSelectSubject?.(subject._id)}
                      className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-[#5521FF] hover:bg-violet-700 text-white shadow-sm shadow-violet-200"
                      }`}
                    >
                      {isCompleted ? "Review Subject" : "Continue Learning"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Take Test */}
                    <button
                      onClick={() =>
                        onNavigate?.("test-instructions", { subjectId: subject._id })
                      }
                      className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-violet-200 text-[#5521FF] hover:bg-violet-50 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Take Test
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Insight Banner */}
        <div className="mt-10 p-7 bg-white border border-gray-200 rounded-3xl relative overflow-hidden">
          <div className="max-w-lg">
            <h2 className="text-xl font-semibold mb-2">
              Weekly Performance Insight
            </h2>
            <p className="text-gray-500 text-sm">
              You've completed{" "}
              <span className="font-bold text-emerald-600">12 labs</span> this
              week. You're{" "}
              <span className="font-bold text-[#5521FF]">15% ahead</span> of
              your batch in core subjects.
            </p>
          </div>
          <div className="absolute bottom-3 right-6 opacity-[0.07] pointer-events-none">
            <TrendingUp size={100} />
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="mt-auto pt-10 pb-2 text-center text-xs text-gray-400">
          © 2024–25 BH.Lab · Built for engineering students
        </footer>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around z-50">
        <button
          onClick={() => onNavigate?.("dashboard")}
          className="flex flex-col items-center gap-0.5 text-gray-400"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-[#5521FF]">
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-bold">Subjects</span>
        </button>
        <button
          onClick={() => onNavigate?.("viva-practice-menu")}
          className="flex flex-col items-center gap-0.5 text-gray-400"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">AI</span>
        </button>
      </nav>
    </div>
  );
}
