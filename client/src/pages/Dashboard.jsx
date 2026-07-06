import { LayoutDashboard, BookOpen, Mic2, FileSpreadsheet, Settings, LogOut, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

export default function Dashboard({ 
  onNavigate, 
  subjects = [], 
  experiments = [], 
  vivaScore = 86, 
  completedCount = 18, 
  journalsCount = 6 
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar activePage="dashboard" onNavigate={onNavigate} experiments={experiments} />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-w-6xl mx-auto space-y-8">
        <nav className="flex justify-end"><ThemeToggle /></nav>
        {/* Welcome Banner Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-transparent rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden shadow-sm transition-colors duration-200">
          <div className="space-y-3 z-10">
            <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              Good morning, Rahul 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
              You have 3 experiments pending for this week.
            </p>
            <button 
              onClick={() => navigate(`/subject/${subjects[0]?._id}`)}
              className="bg-[#5521FF] hover:bg-violet-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:shadow-lg cursor-pointer"
            >
              View Lab Schedule
            </button>
          </div>
          <div className="mt-4 md:mt-0 z-10 w-28 h-28 bg-violet-50 dark:bg-violet-950/45 rounded-xl flex items-center justify-center border border-violet-100 dark:border-violet-900 shadow-inner transition-colors duration-200">
            <span className="text-4xl">👨‍💻</span>
          </div>
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-violet-50/30 dark:bg-violet-950/10 rounded-full blur-2xl -z-10 transition-colors duration-200"></div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-5 space-y-2 transition-colors duration-200">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-blue-900 dark:text-blue-200">24</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Total Experiments</p>
          </div>

          <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-5 space-y-2 transition-colors duration-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200 flex items-baseline gap-1.5">
              {completedCount}
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+3 this week</span>
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Completed</p>
          </div>

          <div className="bg-violet-50/70 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40 rounded-2xl p-5 space-y-2 transition-colors duration-200">
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-[#5521FF] dark:text-violet-400 flex items-center justify-center">
              <Mic2 className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-violet-900 dark:text-violet-200 flex items-baseline gap-1.5">
              {vivaScore}%
              <span className="text-xs font-bold text-[#5521FF] dark:text-violet-400">↑ 4% improvement</span>
            </p>
            <p className="text-xs text-[#5521FF] dark:text-violet-400 font-bold uppercase tracking-wider">Avg Viva Score</p>
          </div>

          <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-100 dark:border-transparent rounded-2xl p-5 space-y-2 transition-colors duration-200">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-amber-900 dark:text-amber-200">{journalsCount}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Journals Generated</p>
          </div>
        </div>


        {/* Continue Where You Left Off */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-slate-200 tracking-tight">
            Continue Where You Left Off
          </h3>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-transparent rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-[#5521FF] dark:text-violet-400 flex items-center justify-center text-xl shadow-sm">
                🔗
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">Linked List Operations</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Data Structures & Algorithms Laboratory • Unit 3</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 w-full sm:w-auto">
              <div className="flex-1 sm:flex-initial space-y-1 text-right min-w-[120px]">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-[#5521FF] h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">65% Complete</span>
              </div>
              <button 
                onClick={() => navigate("/workspace/685b2a1f3c4e8d0012a7b303/a")}
                className="bg-[#5521FF] hover:bg-violet-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition-all hover:translate-x-0.5 shadow-sm hover:shadow cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Lower Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Upcoming Sessions List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-transparent rounded-2xl p-6 shadow-sm md:col-span-2 space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-transparent pb-3">
              <h3 className="text-base font-bold font-heading text-slate-800 dark:text-slate-200 tracking-tight">
                Upcoming Lab Sessions
              </h3>
              <button onClick={() => navigate(`/subject/${subjects[0]?._id}`)} className="text-[#5521FF] dark:text-violet-400 hover:text-violet-700 text-xs font-bold">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 px-2 rounded-lg transition-colors cursor-pointer"
                onClick={() => navigate("/subject/685b2a1f3c4e8d0012a7b000")}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-center border border-slate-200 dark:border-transparent min-w-[64px] transition-colors duration-200">
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase">Oct</p>
                    <p className="text-base font-black text-slate-700 dark:text-slate-300 leading-none">24</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">Database Management Systems</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">2:00 PM - 4:00 PM • Lab 402</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </div>

              <div 
                className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 px-2 rounded-lg transition-colors cursor-pointer"
                onClick={() => navigate("/subject/685b2a1f3c4e8d0012a7b001")}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl text-center border border-slate-200 dark:border-transparent min-w-[64px] transition-colors duration-200">
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase">Oct</p>
                    <p className="text-base font-black text-slate-700 dark:text-slate-300 leading-none">26</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">Operating Systems</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">10:00 AM - 12:00 PM • Lab 101</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
          </div>

          {/* Viva Prep AI Banner Card */}
          <div className="bg-gradient-to-br from-[#5521FF] via-[#401bb5] to-[#1e1b4b] rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
            
            <div className="space-y-3 z-10">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Viva Prep AI
              </span>
              <h4 className="text-lg font-bold font-heading leading-snug">
                Ready for your "Linked List" viva?
              </h4>
              <p className="text-violet-100 text-xs font-light leading-relaxed">
                Practice with our AI mentor and master core engineering concepts before exam day.
              </p>
            </div>
            
            <div className="pt-6 z-10">
              <button 
                onClick={() => navigate("/viva/685b2a1f3c4e8d0012a7b303/a")}
                className="w-full bg-white text-violet-700 hover:bg-slate-50 text-xs font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Start Mock Viva
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}