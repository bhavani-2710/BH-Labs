"use client";
import { Bot, Lightbulb, MessageCircleQuestion, PanelRightOpen } from "lucide-react";

const CollapsedRightSidebar = ({ setActiveRightTab, toggleSidebar }) => {
  return (
    <div className="h-full flex flex-col items-center py-3 gap-3 bg-white dark:bg-slate-900 transition-colors duration-200">
      <button
        title="Expand"
        onClick={toggleSidebar}
        className="p-2 rounded-lg cursor-pointer transition-colors text-slate-700 dark:text-slate-200 hover:bg-[#F4F4F5] dark:hover:bg-slate-800 hover:text-[#5521FF] dark:hover:text-violet-400"
      >
        <PanelRightOpen size={18} />
      </button>

      <button
        onClick={() => {
          setActiveRightTab("assistant");
          toggleSidebar();
        }}
        id="assistant"
        title="BH.AI Assistant"
        className="p-2 rounded-lg cursor-pointer text-[#71717A] dark:text-slate-400 transition-colors hover:bg-[#F4F4F5] dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <Bot size={18} />
      </button>

      <button
        onClick={() => {
          setActiveRightTab("hints");
          toggleSidebar();
        }}
        id="hints"
        title="Hints"
        className="p-2 rounded-lg cursor-pointer text-[#71717A] dark:text-slate-400 transition-colors hover:bg-[#F4F4F5] dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <Lightbulb size={18} />
      </button>

      <button
        onClick={() => {
          setActiveRightTab("viva");
          toggleSidebar();
        }}
        id="viva"
        title="Viva QAs"
        className="p-2 rounded-lg cursor-pointer text-[#71717A] dark:text-slate-400 transition-colors hover:bg-[#F4F4F5] dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <MessageCircleQuestion size={18} />
      </button>
    </div>
  );
};

export default CollapsedRightSidebar;
