import { useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Terminal, Settings, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";


export default function Sidebar({ activePage, onNavigate, experiments = [] }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleNavigate = (page) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      if (page === "dashboard") navigate("/dashboard");
      else if (page === "subjects") navigate("/subjects");
      else if (page === "landing") navigate("/");
      else navigate(`/${page}`);
    }
  };

  const hasExperiments = experiments && experiments.length > 0;
  const firstExpId = experiments[0]?._id;
  const secondExpId = experiments[1]?._id || firstExpId;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0 transition-colors duration-200">
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-md shrink-0">
            <img src="/logo.png" alt="BH.Lab Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-bold font-heading tracking-tight text-slate-900 dark:text-slate-100">
            BH.Lab
          </span>
        </div>

        {/* User Profile Card */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex items-center space-x-3 transition-colors duration-200">
          <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 flex items-center justify-center font-bold text-sm shrink-0">
            RS
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Rahul Sharma</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Computer Engineering</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Second Year</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          <button
            onClick={() => handleNavigate("dashboard")}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all text-left cursor-pointer ${
              activePage === "dashboard"
                ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleNavigate("subjects")}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all text-left cursor-pointer ${
              activePage === "subjects"
                ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Subjects</span>
          </button>
          <button
            onClick={() => handleNavigate("playground")}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all text-left cursor-pointer ${
              activePage === "playground"
                ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Terminal className="w-4 h-4 shrink-0" />
            <span>Playground</span>
          </button>
        </nav>
      </div>

      {/* Bottom actions */}
      <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-4">
        <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all text-left cursor-pointer">
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => handleNavigate("landing")}
          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

