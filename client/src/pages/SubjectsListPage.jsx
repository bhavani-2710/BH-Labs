import { useState, useEffect } from "react";
import { Book, ArrowRight, TrendingUp, LayoutDashboard, BookOpen, MessageSquare, FileText, Mic } from "lucide-react";

export default function SubjectsListPage({ onNavigate, onSelectSubject }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/subjects");
        if (res.ok) {
          const data = await res.json();
          setSubjects(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-emerald-500";
    if (progress >= 50) return "bg-violet-600";
    if (progress >= 20) return "bg-amber-500";
    return "bg-gray-300";
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
    { label: "Subjects", icon: BookOpen, key: "subjects", active: true },
    { label: "Viva Practice", icon: MessageSquare, key: "viva-practice-menu" },
    { label: "Journals", icon: FileText, key: "journals" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5fb] flex items-center justify-center">
        <p className="text-lg text-gray-500 font-medium">Loading your subjects…</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f5fb] min-h-screen flex flex-col">

      {/* ── Sidebar ── */}
      <aside
        className="hidden md:flex flex-col h-screen fixed left-0 w-56 bg-white z-30"
        style={{ borderRight: "1px solid #ede9f6" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 pt-7 pb-6">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-sm">
            <Book className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-900">BH.Lab</span>
        </div>

        <div className="mx-5 border-t border-gray-100 mb-5" />

        {/* User pill */}
        <div className="mx-3 mb-6 px-3 py-3 rounded-xl bg-violet-50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            RS
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">Rahul Sharma</div>
            <div className="text-[11px] text-violet-500 font-medium truncate">Comp Engg · SE</div>
          </div>
        </div>

        {/* Nav label */}
        <p className="px-5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
          Menu
        </p>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ label, icon: Icon, key, active }) => (
            <button
              key={key}
              onClick={() => !active && onNavigate?.(key)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${active
                  ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom context card */}
        <div className="mx-3 mb-6 mt-4 px-3 py-3 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-[11px] text-gray-400 font-medium">Semester 4 · 2024–25</p>
          <p className="text-xs text-gray-600 font-semibold mt-0.5">Mid-term in 18 days</p>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="md:ml-56 flex-1 p-6 md:p-8 pb-24 flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <nav className="flex gap-2 text-xs text-gray-400 mb-1.5">
              <span>Curriculum</span>
              <span>/</span>
              <span className="text-violet-600 font-semibold">Academic Subjects</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900">Academic Subjects</h1>
            <p className="text-gray-500 mt-1 text-sm">Track your progress across all engineering subjects</p>
          </div>

          <input
            type="text"
            placeholder="Search subjects…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-violet-400 placeholder:text-gray-400"
          />
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((subject) => {
            const progress = subject.progress ?? 45;
            const isCompleted = progress === 100;

            return (
              <div
                key={subject._id}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Progress bar top strip */}
                <div
                  className={`h-2 w-full ${progress > 70 ? "bg-emerald-400" : progress > 40 ? "bg-violet-500" : "bg-amber-400"
                    }`}
                />

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
                      <span className="font-medium text-gray-500">Progress</span>
                      <span className="font-bold text-violet-600">{progress}%</span>
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
                      className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${isCompleted
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-200"
                        }`}
                    >
                      {isCompleted ? "Review Subject" : "Continue Learning"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Take Viva */}
                    <button
                      onClick={() => onNavigate?.("viva-subject", { subjectId: subject._id })}
                      className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-violet-200 text-violet-600 hover:bg-violet-50 transition-all active:scale-[0.98]"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      Take Viva
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
            <h2 className="text-xl font-semibold mb-2">Weekly Performance Insight</h2>
            <p className="text-gray-500 text-sm">
              You've completed <span className="font-bold text-emerald-600">12 labs</span> this week.
              You're <span className="font-bold text-violet-600">15% ahead</span> of your batch in core subjects.
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
        <button onClick={() => onNavigate?.("dashboard")} className="flex flex-col items-center gap-0.5 text-gray-400">
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-violet-600">
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-bold">Subjects</span>
        </button>
        <button onClick={() => onNavigate?.("viva-practice-menu")} className="flex flex-col items-center gap-0.5 text-gray-400">
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">AI</span>
        </button>
      </nav>
    </div>
  );
}