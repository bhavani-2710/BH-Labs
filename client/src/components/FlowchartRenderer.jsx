import React from "react";
import { ArrowDown, ArrowRight } from "lucide-react";

export default function FlowchartRenderer({ nodes = [], edges = [] }) {
  // Simple check
  if (!nodes || nodes.length === 0) {
    return (
      <div className="text-gray-400 italic text-center p-4">
        No flowchart data available.
      </div>
    );
  }

  // Get color and shape class based on node type
  const getNodeStyles = (type) => {
    switch (type?.toLowerCase()) {
      case "start":
      case "end":
        return {
          bg: "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-950/40",
          border: "border-purple-500",
          text: "text-purple-700 dark:text-purple-300",
          shape: "rounded-full px-6 py-2.5 font-semibold tracking-wide border-2",
        };
      case "input":
      case "output":
        return {
          bg: "bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/20 dark:hover:bg-teal-950/40",
          border: "border-teal-500",
          text: "text-teal-700 dark:text-teal-300",
          // Styled like a parallelogram using clip-path or skew
          shape: "rounded border-2 px-5 py-3 transform -skew-x-6",
        };
      case "decision":
        return {
          bg: "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40",
          border: "border-amber-500",
          text: "text-amber-700 dark:text-amber-300",
          shape: "border-2 w-32 h-32 flex items-center justify-center rotate-45 text-center p-2 rounded-lg font-medium",
        };
      case "process":
      default:
        return {
          bg: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/40",
          border: "border-blue-500",
          text: "text-blue-700 dark:text-blue-300",
          shape: "rounded-lg border-2 px-5 py-3 font-medium",
        };
    }
  };
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 max-w-full overflow-x-auto">
      {nodes.map((node, index) => {
        const style = getNodeStyles(node.type);
        const isLast = index === nodes.length - 1;

        return (
          <React.Fragment key={node.id}>
            <div className="flex flex-col items-center group transition-all duration-300">
              {node.type === "decision" ? (
                // For decision nodes, render inside a container that handles the rotation for label readability
                <div className="relative my-4 flex items-center justify-center">
                  <div className={`${style.bg} ${style.border} ${style.shape} shadow-sm group-hover:shadow-md transition-all duration-300`}>
                    <div className="-rotate-45 max-w-[90px] text-xs font-semibold leading-tight text-center">
                      {node.label}
                    </div>
                  </div>
                  {/* Branch Labels */}
                  <div className="absolute top-1/2 -left-12 transform -translate-y-1/2 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded border dark:border-gray-700">
                    Yes
                  </div>
                  <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded border dark:border-gray-700">
                    No
                  </div>
                </div>
              ) : (
                <div
                  className={`${style.bg} ${style.border} ${style.shape} ${style.text} shadow-sm group-hover:shadow-md transition-all duration-300 text-center max-w-xs text-sm border-2`}
                >
                  {/* For skewed nodes, skew text back to normal */}
                  <div className={node.type === "input" || node.type === "output" ? "transform skew-x-6 font-medium" : ""}>
                    {node.label}
                  </div>
                </div>
              )}
            </div>

            {!isLast && (
              <div className="flex flex-col items-center text-gray-400 py-1">
                <ArrowDown className="w-5 h-5 animate-pulse text-indigo-400" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
