"use client";
import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-transparent rounded-xl select-none transition-all w-fit">
      <button
        onClick={() => setTheme("light")}
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer ${
          theme === "light"
            ? "bg-white text-[#522bff] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            : "text-slate-400 hover:text-slate-600"
        }`}
        title="Light Mode"
      >
        <Sun size={15} className={theme === "light" ? "stroke-[2.5]" : "stroke-[1.8]"} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer ${
          theme === "dark"
            ? "bg-[#0f0f0f] text-[#522bff] shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            : "text-slate-500 hover:text-slate-700"
        }`}
        title="Dark Mode"
      >
        <Moon size={15} className={theme === "dark" ? "stroke-[2.5]" : "stroke-[1.8]"} />
      </button>
    </div>
  );
}
