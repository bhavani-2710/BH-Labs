import React, { useMemo } from "react";

export default function FlowchartRenderer({ nodes = [], edges = [] }) {
  // Simple check
  if (!nodes || nodes.length === 0) {
    return (
      <div className="text-slate-400 italic text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        No flowchart data available.
      </div>
    );
  }

  // Calculate coordinates dynamically
  const layoutData = useMemo(() => {
    const adj = {};
    const parentOf = {};
    edges.forEach(e => {
      if (!adj[e.source]) adj[e.source] = [];
      adj[e.source].push(e.target);
      parentOf[e.target] = e.source;
    });

    const startNode = nodes.find(n => n.type?.toLowerCase() === "start") || nodes[0];
    const coords = {};
    const visited = new Set();
    const grid = {}; // Track occupied grid cells

    function getNextAvailableCol(row, startCol) {
      let col = startCol;
      while (grid[`${row},${col}`]) {
        col++;
      }
      return col;
    }

    function assignPos(nodeId, row, col) {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const finalCol = getNextAvailableCol(row, col);
      coords[nodeId] = { row, col: finalCol };
      grid[`${row},${finalCol}`] = nodeId;

      const children = adj[nodeId] || [];
      if (children.length === 1) {
        assignPos(children[0], row + 1, finalCol);
      } else if (children.length >= 2) {
        // Decision node: Yes goes down, No goes to the right
        assignPos(children[0], row + 1, finalCol);
        assignPos(children[1], row, finalCol + 1);
        // Any extra children
        for (let i = 2; i < children.length; i++) {
          assignPos(children[i], row + 1, finalCol + i - 1);
        }
      }
    }

    assignPos(startNode.id, 0, 0);

    // Fallback: assign remaining unvisited nodes linearly
    let maxRow = Object.values(coords).reduce((max, c) => Math.max(max, c.row), -1);
    nodes.forEach(n => {
      if (!coords[n.id]) {
        maxRow += 1;
        coords[n.id] = { row: maxRow, col: 0 };
      }
    });

    // Determine grid bounds
    let minCol = 0, maxCol = 0, minRow = 0, maxRowFinal = 0;
    Object.values(coords).forEach(c => {
      if (c.col < minCol) minCol = c.col;
      if (c.col > maxCol) maxCol = c.col;
      if (c.row > maxRowFinal) maxRowFinal = c.row;
    });

    return { coords, minCol, maxCol, maxRow: maxRowFinal };
  }, [nodes, edges]);

  const { coords, minCol, maxCol, maxRow } = layoutData;

  // Grid scaling configuration
  const colWidth = 140;
  const rowHeight = 85;
  const paddingX = 25;
  const paddingY = 25;

  // Total container size
  const totalCols = maxCol - minCol + 1;
  const width = totalCols * colWidth + paddingX * 2;
  const height = (maxRow + 1) * rowHeight + paddingY * 2;

  // Helper to get pixel coordinates of a node center
  const getNodePos = (nodeId) => {
    const c = coords[nodeId] || { row: 0, col: 0 };
    const x = paddingX + (c.col - minCol) * colWidth + colWidth / 2;
    const y = paddingY + c.row * rowHeight + 25; // 25 is half of process node height approximation
    return { x, y };
  };

  // Helper to get boundary intersection point on a node
  const getNodeBoundary = (node, direction) => {
    const pos = getNodePos(node.id);
    const type = node.type?.toLowerCase();

    let hw = 50; 
    let hh = 15; 

    if (type === "start" || type === "end") {
      hw = 45;
      hh = 12;
    } else if (type === "decision") {
      // 56px diagonal diamond shape: top tip is y - 28, left is x - 28
      hw = 28;
      hh = 28;
    } else if (type === "process") {
      hw = 50;
      hh = 15;
    } else if (type === "input" || type === "output") {
      hw = 50;
      hh = 15;
    }

    // Offset arrow slightly so it points to the edge, not inside
    const arrowClearance = 0.5;

    if (direction === "top") return { x: pos.x, y: pos.y - hh - arrowClearance };
    if (direction === "bottom") return { x: pos.x, y: pos.y + hh + arrowClearance };
    if (direction === "left") return { x: pos.x - hw - arrowClearance, y: pos.y };
    if (direction === "right") return { x: pos.x + hw + arrowClearance, y: pos.y };
    return pos;
  };

  const getNodeStyles = (type) => {
    switch (type?.toLowerCase()) {
      case "start":
      case "end":
        return {
          bg: "bg-gradient-to-r from-violet-500 to-indigo-600 shadow-indigo-100",
          border: "border-indigo-600",
          text: "text-white font-bold",
          shape: "rounded-full px-4 py-1 text-[9px] uppercase tracking-wider",
        };
      case "input":
      case "output":
        return {
          bg: "bg-emerald-50 hover:bg-emerald-100/80 shadow-emerald-50/50",
          border: "border-emerald-400",
          text: "text-emerald-800 font-semibold",
          shape: "border px-3 py-1.5 transform -skew-x-12 rounded-md text-[9px]",
        };
      case "decision":
        return {
          bg: "bg-amber-50 hover:bg-amber-100/80 shadow-amber-50/50",
          border: "border-amber-400",
          text: "text-amber-800 font-semibold",
          shape: "border w-14 h-14 rotate-45 flex items-center justify-center rounded-lg",
        };
      case "process":
      default:
        return {
          bg: "bg-blue-50 hover:bg-blue-100/80 shadow-blue-50/50",
          border: "border-blue-400",
          text: "text-blue-800 font-medium",
          shape: "rounded-lg border px-3 py-1.5 text-[9px]",
        };
    }
  };

  // Generate paths for edges
  const edgePaths = useMemo(() => {
    return edges.map((edge, index) => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) return null;

      const isDecision = sourceNode?.type?.toLowerCase() === "decision";
      const startPos = getNodePos(edge.source);
      const endPos = getNodePos(edge.target);

      let start, end;
      let pathD = "";

      if (startPos.x === endPos.x) {
        // Straight line down
        start = getNodeBoundary(sourceNode, "bottom");
        end = getNodeBoundary(targetNode, "top");
        pathD = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      } else if (startPos.y === endPos.y) {
        // Straight line right
        start = getNodeBoundary(sourceNode, "right");
        end = getNodeBoundary(targetNode, "left");
        pathD = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      } else {
        // Step orthogonal connection (L shape step)
        start = getNodeBoundary(sourceNode, "bottom");
        end = getNodeBoundary(targetNode, "top");
        const midY = start.y + (end.y - start.y) / 2;
        pathD = `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
      }

      return {
        key: `${edge.source}-${edge.target}-${index}`,
        d: pathD,
        label: isDecision ? (startPos.x === endPos.x ? "YES" : "NO") : null,
        labelPos: isDecision
          ? (startPos.x === endPos.x
              ? { x: start.x + 8, y: start.y + 15 }
              : { x: start.x + 12, y: start.y - 6 })
          : null,
      };
    });
  }, [edges, nodes, layoutData]);

  return (
    <div className="relative w-full overflow-auto bg-slate-50/50 rounded-2xl border border-slate-100 p-4 min-h-[300px] custom-scrollbar">
      <div style={{ width, height, position: "relative" }} className="shrink-0 select-none">
        
        {/* SVG Path Layer */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94A3B8" />
            </marker>
          </defs>
          
          {edgePaths.map((p) => {
            if (!p) return null;
            return (
              <g key={p.key}>
                <path
                  d={p.d}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d={p.d}
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  markerEnd="url(#arrow)"
                />
                {p.label && (
                  <text
                    x={p.labelPos.x}
                    y={p.labelPos.y}
                    className="text-[9px] font-extrabold fill-slate-400 tracking-wider"
                  >
                    {p.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => {
          const style = getNodeStyles(node.type);
          const pos = getNodePos(node.id);

          return (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
              className="group"
            >
              {node.type?.toLowerCase() === "decision" ? (
                <div className="relative flex items-center justify-center w-14 h-14">
                  <div
                    className={`${style.bg} ${style.border} ${style.shape} transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-105`}
                  />
                  <div className="absolute text-[8px] font-bold leading-tight text-center max-w-[36px] select-none pointer-events-none text-amber-900">
                    {node.label}
                  </div>
                </div>
              ) : (
                <div
                  className={`${style.bg} ${style.border} ${style.shape} ${style.text} transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-105 border text-center flex items-center justify-center min-w-[80px] max-w-[120px] min-h-[30px]`}
                >
                  <div
                    className={
                      node.type?.toLowerCase() === "input" || node.type?.toLowerCase() === "output"
                        ? "transform skew-x-12 select-none pointer-events-none"
                        : "select-none pointer-events-none"
                    }
                  >
                    {node.label}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
