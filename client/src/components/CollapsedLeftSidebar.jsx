import { BookOpen, BrainCircuit, PanelLeftOpen, Workflow } from "lucide-react";
import React from "react";

const CollapsedLeftSidebar = ({ setActiveLeftTab, toggleSidebar }) => {
  return (
    <div className="h-full flex flex-col items-center py-3 gap-3 bg-white dark:bg-slate-900 transition-colors duration-200">
      <button
        title="Expand"
        onClick={toggleSidebar}
        className="p-2 rounded-lg cursor-pointer transition-colors text-slate-500 dark:text-slate-400 hover:bg-[#F4F4F5] dark:hover:bg-slate-800 hover:text-[#5521FF] dark:hover:text-violet-400"
      >
        <PanelLeftOpen size={18} />
      </button>

      <button
        onClick={() => {
          setActiveLeftTab("theory");
          toggleSidebar();
        }}
        id="theory"
        title="Theory"
        className="p-2 rounded-lg cursor-pointer text-[#71717A] dark:text-slate-400 transition-colors hover:bg-[#F4F4F5] dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <BookOpen size={18} />
      </button>

      <button
        onClick={() => {
          setActiveLeftTab("algorithm");
          toggleSidebar();
        }}
        id="algorithm"
        title="Algorithm"
        className="p-2 rounded-lg cursor-pointer text-[#71717A] dark:text-slate-400 transition-colors hover:bg-[#F4F4F5] dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <BrainCircuit size={18} />
      </button>

      <button
        onClick={() => {
          setActiveLeftTab("flowchart");
          toggleSidebar();
        }}
        id="flowchart"
        title="Flowchart"
        className="p-2 rounded-lg cursor-pointer text-[#71717A] dark:text-slate-400 transition-colors hover:bg-[#F4F4F5] dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <Workflow size={18} />
      </button>
    </div>
  );
};

export default CollapsedLeftSidebar;
