import { BookOpen, BrainCircuit, PanelLeftOpen, Workflow } from "lucide-react";
import React from "react";

const CollapsedLeftSidebar = ({ setActiveLeftTab, toggleSidebar }) => {
  return (
    <div className="h-full flex flex-col items-center py-3 gap-3 bg-white">
      <button
        title="Expand"
        onClick={toggleSidebar}
        className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-[#F4F4F5] hover:text-[#5521FF]"
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
        className="p-2 rounded-lg cursor-pointer text-[#71717A] transition-colors hover:bg-[#F4F4F5]"
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
        className="p-2 rounded-lg cursor-pointer text-[#71717A] transition-colors hover:bg-[#F4F4F5]"
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
        className="p-2 rounded-lg cursor-pointer text-[#71717A] transition-colors hover:bg-[#F4F4F5]"
      >
        <Workflow size={18} />
      </button>
    </div>
  );
};

export default CollapsedLeftSidebar;
