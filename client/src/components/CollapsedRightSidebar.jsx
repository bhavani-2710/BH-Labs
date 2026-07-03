import { BookOpen, Bot, BrainCircuit, Lightbulb, MessageCircleQuestion, PanelRightOpen, Workflow } from "lucide-react";
import React from "react";

const CollapsedRightSidebar = ({ setActiveRightTab, toggleSidebar }) => {
  return (
    <div className="h-full flex flex-col items-center py-3 gap-3 bg-white">
      <button
        title="Expand"
        onClick={toggleSidebar}
        className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-[#F4F4F5] hover:text-[#5521FF]"
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
        className="p-2 rounded-lg cursor-pointer text-[#71717A] transition-colors hover:bg-[#F4F4F5]"
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
        className="p-2 rounded-lg cursor-pointer text-[#71717A] transition-colors hover:bg-[#F4F4F5]"
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
        className="p-2 rounded-lg cursor-pointer text-[#71717A] transition-colors hover:bg-[#F4F4F5]"
      >
        <MessageCircleQuestion size={18} />
      </button>
    </div>
  );
};

export default CollapsedRightSidebar;
