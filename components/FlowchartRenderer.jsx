"use client";
import React, { useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  getSmoothStepPath,
  BaseEdge,
  EdgeLabelRenderer,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/* ═══════════════════════════════════════════════════════════
   Hidden Handle Styles
   ═══════════════════════════════════════════════════════════ */
const hiddenHandle = {
  background: "transparent",
  border: "none",
  width: 1,
  height: 1,
  minWidth: 1,
  minHeight: 1,
  opacity: 0,
};

const AllHandles = () => (
  <>
    <Handle type="target" position={Position.Top}    id="top"      style={hiddenHandle} />
    <Handle type="source" position={Position.Bottom} id="bottom"   style={hiddenHandle} />
    <Handle type="source" position={Position.Right}  id="right"    style={hiddenHandle} />
    <Handle type="source" position={Position.Left}   id="left-out" style={hiddenHandle} />
    <Handle type="target" position={Position.Left}   id="left-in"  style={hiddenHandle} />
  </>
);

/* ═══════════════════════════════════════════════════════════
   NODE COMPONENTS
   ═══════════════════════════════════════════════════════════ */
const NODE_W  = 160;  // process / io width
const START_W = 140;  // start / end width
const DEC_W   = 120;  // decision diamond bounding box width
const DEC_H   = 120;  // decision diamond bounding box height
const COL_W   = 280;   // wider columns → No-branch lines don't crowd
const ROW_H   = 210;   // taller rows → less overlap
const LEFT_PAD = 220;  // space reserved on the left for loop arrows (must be > margin + half-node-width)

const StartEndNode = ({ data }) => {
  const isEnd = data.nodeType === "end";
  return (
    <div style={{
      background: isEnd ? "#EF4444" : "#22C55E",
      color: "#fff",
      borderRadius: 24,
      padding: "8px 16px",
      fontSize: 12,
      fontWeight: "bold",
      textTransform: "uppercase",
      textAlign: "center",
      width: START_W,
      boxSizing: "border-box",
      border: `2px solid ${isEnd ? "#DC2626" : "#16A34A"}`,
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 40,
    }}>
      <AllHandles />
      {data.label}
    </div>
  );
};

const ProcessNode = ({ data }) => (
  <div style={{
    background: "#F0F9FF",
    border: "2px solid #0EA5E9",
    borderRadius: 4,
    padding: "10px 12px",
    fontSize: 11,
    fontWeight: 600,
    color: "#0369A1",
    textAlign: "center",
    width: NODE_W,
    boxSizing: "border-box",
    boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
    lineHeight: 1.4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  }}>
    <AllHandles />
    {data.label}
  </div>
);

const DecisionNode = ({ data }) => (
  <div style={{
    position: "relative",
    width: DEC_W,
    height: DEC_H,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  }}>
    <div style={{
      position: "absolute",
      width: "70%",
      height: "70%",
      background: "#F0F9FF",
      border: "2px solid #0EA5E9",
      borderRadius: 4,
      transform: "rotate(45deg)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
    }} />
    <div style={{
      position: "relative",
      zIndex: 1,
      fontSize: 10,
      fontWeight: 700,
      color: "#0369A1",
      textAlign: "center",
      maxWidth: 76,
      lineHeight: 1.3,
      wordBreak: "break-word",
    }}>
      {data.label}
    </div>
    <AllHandles />
  </div>
);

const IONode = ({ data }) => (
  <div style={{
    position: "relative",
    width: NODE_W,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  }}>
    <div style={{
      position: "absolute",
      inset: 0,
      background: "#F0F9FF",
      border: "2px solid #0EA5E9",
      borderRadius: 4,
      transform: "skewX(-15deg)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
    }} />
    <div style={{
      position: "relative",
      zIndex: 1,
      padding: "10px 20px",
      fontSize: 11,
      fontWeight: 600,
      color: "#0369A1",
      textAlign: "center",
      lineHeight: 1.4,
    }}>
      {data.label}
    </div>
    <AllHandles />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   LOOP EDGE  – clean left-side C-shape
   Goes: left-out → far-left GLOBAL margin (shared across all loop
   edges) → up/down to target row → right into left-in.

   FIX: previously the left corridor x-position was computed from
   *each edge's own* sourceX/targetX. That meant a loop edge whose
   endpoints happened to sit near an unrelated column (e.g. "Print
   result" / "STOP") would draw its vertical segment straight
   through that column instead of staying in the reserved LEFT_PAD
   margin. Now every loop edge routes relative to a single
   `leftBoundX` computed once from the whole layout (see
   `layoutGraph` step 5), guaranteeing the corridor sits to the
   left of every node in the diagram.
   ═══════════════════════════════════════════════════════════ */
const LoopEdge = ({ id, sourceX, sourceY, targetX, targetY, style, data }) => {
  // Each loop gets a unique horizontal offset within the shared
  // left corridor to prevent overlapping lines.
  const idx = data?.leftOffsetIndex ?? 0;
  const stagger = 45 + idx * 45;
  const fallback = Math.min(sourceX, targetX) - 80;
  const leftX = (data?.leftBoundX ?? fallback) - stagger;

  // When two (or more) loop edges share the same source AND target
  // node — e.g. a decision whose Yes and No branches both loop back
  // to the same node — sourceX/sourceY and targetX/targetY are
  // identical for every one of them. Without a large enough
  // adjustment their paths (and labels) sit too close to read as
  // separate, and end up looking like one merged line. A generous
  // jog right at each end fans the paths clearly apart so every
  // edge is unambiguously distinct, each with its own arrowhead
  // landing at a different point on the target node.
  const jog = 24 + idx * 34;
  const sourceJogY = sourceY + jog;
  const targetJogY = targetY - jog;

  const d = [
    `M ${sourceX} ${sourceY}`,
    `L ${sourceX} ${sourceJogY}`,
    `L ${leftX}   ${sourceJogY}`,
    `L ${leftX}   ${targetJogY}`,
    `L ${targetX} ${targetJogY}`,
    `L ${targetX} ${targetY}`,
  ].join(" ");

  const label = data?.label;
  const labelLC = (label || "").toLowerCase();
  const lineColor = labelLC === "yes" ? "#16A34A" : labelLC === "no" ? "#DC2626" : "#64748B";
  const markerId = labelLC === "yes" ? "fc-arrow-yes" : labelLC === "no" ? "fc-arrow-no" : "fc-arrow";

  // Place the label alongside its own jogged segment. Besides the
  // vertical offset already built into sourceJogY, also stagger the
  // label horizontally per index so two labels can never land on the
  // same spot even if the vertical gap looks small at low zoom.
  const lx = sourceX - 26 - idx * 34;
  const ly = sourceJogY;

  return (
    <>
      <path
        id={id}
        d={d}
        fill="none"
        markerEnd={`url(#${markerId})`}
        style={{ ...style, stroke: lineColor, strokeWidth: 2 }}
      />
      {label && (
        <EdgeLabelRenderer>
          <span
            style={{
              position: "absolute",
              transform: `translate(-50%,-50%) translate(${lx}px,${ly}px)`,
              color: lineColor,
              fontSize: 12,
              fontWeight: 800,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              textShadow: "0 0 4px #fff, 0 0 4px #fff",
              letterSpacing: "0.3px",
            }}
          >
            {label}
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   FLOWCHART EDGE – step path + floating label
   ═══════════════════════════════════════════════════════════ */
const FlowchartEdge = ({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, style, data,
}) => {
  const label = data?.label;
  const labelLC = (label || "").toLowerCase();

  let path = "";
  let lx = 0, ly = 0;

  if (labelLC === "no") {
    // Custom orthogonal path for No branch to avoid vertical and horizontal overlaps.
    // It routes around all active columns in the intermediate layers.
    const maxCol = data?.maxCol ?? 0;
    const maxColX = LEFT_PAD + maxCol * COL_W;
    const rightOffset = 35 + (data?.rightOffsetIndex ?? 0) * 35;
    const rightX = maxColX + NODE_W / 2 + rightOffset;

    // We want to route it cleanly down to targetY - 30
    const corridorY = targetY - 30;

    path = [
      `M ${sourceX} ${sourceY}`,
      `L ${rightX}   ${sourceY}`,
      `L ${rightX}   ${corridorY}`,
      `L ${targetX} ${corridorY}`,
      `L ${targetX} ${targetY}`
    ].join(" ");

    // Place label right near the exit port
    lx = sourceX + 22;
    ly = sourceY - 14;
  } else {
    // Standard step path
    const [stepPath, stepLx, stepLy] = getSmoothStepPath({
      sourceX, sourceY, sourcePosition,
      targetX, targetY, targetPosition,
      borderRadius: 6,
    });
    path = stepPath;

    if (labelLC === "yes") {
      lx = sourceX + 24;
      ly = sourceY + 22;
    } else {
      lx = stepLx;
      ly = stepLy;
    }
  }

  const lineColor = labelLC === "yes" ? "#16A34A" : labelLC === "no" ? "#DC2626" : "#64748B";
  const markerId = labelLC === "yes" ? "fc-arrow-yes" : labelLC === "no" ? "fc-arrow-no" : "fc-arrow";

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={`url(#${markerId})`} style={{ ...style, stroke: lineColor }} />
      {label && (
        <EdgeLabelRenderer>
          <span
            style={{
              position: "absolute",
              transform: `translate(-50%,-50%) translate(${lx}px,${ly}px)`,
              color: lineColor,
              fontSize: 12,
              fontWeight: 800,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              textShadow: "0 0 4px #fff, 0 0 4px #fff",
              letterSpacing: "0.3px",
            }}
          >
            {label}
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   NODE / EDGE TYPE MAPS
   ═══════════════════════════════════════════════════════════ */
const nodeTypes = { startEnd: StartEndNode, process: ProcessNode, decision: DecisionNode, io: IONode };
const edgeTypes = { loopEdge: LoopEdge, flowchartEdge: FlowchartEdge };

/* ═══════════════════════════════════════════════════════════
   LAYOUT – cycle detection → topo sort → longest-path layers
            → corridor-aware column assignment
   ═══════════════════════════════════════════════════════════ */
export function layoutGraph(rawNodes, rawEdges) {
  if (!rawNodes?.length) return { rfNodes: [], rfEdges: [] };

  /* helpers */
  const nm = {};
  rawNodes.forEach(n => (nm[n.id] = { ...n, tl: (n.type || "process").toLowerCase() }));

  const out = {};
  rawNodes.forEach(n => (out[n.id] = []));
  rawEdges.forEach((e, i) => { if (out[e.source]) out[e.source].push({ t: e.target, i }); });

  const start = rawNodes.find(n => n.type?.toLowerCase() === "start") ?? rawNodes[0];

  /* 1. cycle detection */
  const W = 0, G = 1, B = 2, col = {};
  rawNodes.forEach(n => (col[n.id] = W));
  const back = new Set();

  function dfs(u) {
    col[u] = G;
    for (const { t, i } of out[u]) {
      if (col[t] === G) back.add(i);
      else if (col[t] === W) dfs(t);
    }
    col[u] = B;
  }
  dfs(start.id);
  rawNodes.forEach(n => { if (col[n.id] === W) dfs(n.id); });

  /* 2. topological sort (DAG only) */
  const tmp = new Set(), done = new Set(), topo = [];
  function tv(u) {
    if (done.has(u) || tmp.has(u)) return;
    tmp.add(u);
    out[u].forEach(({ t, i }) => { if (!back.has(i)) tv(t); });
    tmp.delete(u); done.add(u); topo.unshift(u);
  }
  tv(start.id);
  rawNodes.forEach(n => { if (!done.has(n.id)) tv(n.id); });

  /* 3. longest-path layering */
  const layer = {};
  topo.forEach(u => {
    if (layer[u] === undefined) layer[u] = 0;
    out[u].forEach(({ t, i }) => {
      if (back.has(i)) return;
      const p = layer[u] + 1;
      if (layer[t] === undefined || p > layer[t]) layer[t] = p;
    });
  });
  let mx = Math.max(0, ...Object.values(layer));
  rawNodes.forEach(n => { if (layer[n.id] === undefined) layer[n.id] = ++mx; });

  /* 4. corridor-aware column assignment */
  const colMap = {}, grid = {}, placed = new Set();

  // Precompute, for every node, the size of its forward-only downstream
  // subtree (ignoring back-edges). Used below to break ties when a
  // decision's two branches are both "non-looping" from hasLoopBack's
  // point of view — without this, column choice fell back to whichever
  // branch happened to be listed first in the edges array, which could
  // shove a short terminal branch (e.g. "Print result → Stop") into the
  // same column the main iterative loop needed, forcing the loop's
  // left-side corridor to swing wide around unrelated nodes.
  const subtreeSize = {};
  for (let idx = topo.length - 1; idx >= 0; idx--) {
    const u = topo[idx];
    let s = 1;
    (out[u] || []).forEach(({ t, i }) => { if (!back.has(i)) s += (subtreeSize[t] ?? 1); });
    subtreeSize[u] = s;
  }

  function hasLoopBack(startNode, nodeId) {
    const limitLayer = layer[nodeId] ?? 0;
    const visited = new Set();
    const queue = [startNode];
    while (queue.length > 0) {
      const curr = queue.shift();
      if (visited.has(curr)) continue;
      visited.add(curr);

      const edges = out[curr] ?? [];
      for (const edge of edges) {
        if (back.has(edge.i)) {
          const targetLayer = layer[edge.t] ?? 0;
          if (targetLayer <= limitLayer) {
            return true;
          }
        } else {
          queue.push(edge.t);
        }
      }
    }
    return false;
  }

  function corridor(nodeId, want) {
    if (placed.has(nodeId)) return;
    const l = layer[nodeId];
    let kids = out[nodeId].filter(e => !back.has(e.i)).map(e => e.t);

    // Sort decision kids so that the loop body stays in the same column as the header,
    // and the exit path is pushed to the side column. When neither branch loops directly
    // back to this decision, keep the branch with the larger downstream subtree (the
    // real continuing algorithm) in the same column, and push the smaller/terminal
    // branch outward instead.
    const isDec = nm[nodeId].tl === "decision";
    if (isDec && kids.length >= 2) {
      kids.sort((a, b) => {
        const aLoop = hasLoopBack(a, nodeId);
        const bLoop = hasLoopBack(b, nodeId);
        if (aLoop && !bLoop) return -1;
        if (!aLoop && bLoop) return 1;
        return (subtreeSize[b] ?? 1) - (subtreeSize[a] ?? 1);
      });
    }

    const maxKL = kids.reduce((a, k) => Math.max(a, layer[k] ?? l), l);

    // Find first column free from l..maxKL
    let c = want;
    outer: while (true) {
      for (let y = l; y <= maxKL; y++) { if (grid[`${y},${c}`]) { c++; continue outer; } }
      break;
    }

    colMap[nodeId] = c; grid[`${l},${c}`] = nodeId; placed.add(nodeId);

    if (isDec && kids.length >= 2) {
      corridor(kids[0], c);
      corridor(kids[1], c + 1);
      for (let i = 2; i < kids.length; i++) corridor(kids[i], c + i);
    } else {
      kids.forEach(k => corridor(k, c));
    }
  }

  corridor(start.id, 0);
  rawNodes.forEach(n => { if (!placed.has(n.id)) corridor(n.id, 0); });

  /* 5. pixel positions */
  function nodeWidth(tl) {
    if (tl === "start" || tl === "end") return START_W;
    if (tl === "decision") return DEC_W;
    return NODE_W;
  }

  const pos = {};
  rawNodes.forEach(n => {
    const w  = nodeWidth(nm[n.id].tl);
    const cx = LEFT_PAD + (colMap[n.id] ?? 0) * COL_W;
    pos[n.id] = { x: cx - w / 2, y: (layer[n.id] ?? 0) * ROW_H };
  });

  // Global left boundary for ALL loop-back edges. Computed once from
  // the entire layout so every loop corridor is guaranteed to sit to
  // the left of every node column, instead of being derived per-edge
  // from that edge's own (possibly unrelated) source/target position.
  const globalLeftX = Math.min(...Object.values(pos).map(p => p.x));
  const LOOP_MARGIN = 60;
  const leftBoundX = globalLeftX - LOOP_MARGIN;

  /* 6. RF nodes */
  const rfNodes = rawNodes.map(n => {
    const tl = nm[n.id].tl;
    let type = "process";
    if (tl === "start" || tl === "end") type = "startEnd";
    else if (tl === "decision")          type = "decision";
    else if (tl === "input" || tl === "output") type = "io";

    return { id: n.id, type, position: pos[n.id], data: { label: n.label, nodeType: tl }, draggable: false };
  });

  /* 7. RF edges */
  // Assign Yes/No labels for decision nodes FIRST, in the original
  // Assign Yes/No labels for decision nodes. If the caller already
  // supplied a `label` on the edge (e.g. { source, target, label:
  // "No" }), that value is authoritative and is used as-is — this
  // fixes cases where two edges share the same source (or even the
  // same source AND target, as with duplicate loop-back edges) and
  // relying on order/count would assign the wrong label. Order-based
  // counting is kept only as a fallback for edges that omit a label.
  const decLabel = {};
  {
    const decCntAll = {};
    rawEdges.forEach((e, i) => {
      const isDec = nm[e.source]?.tl === "decision";
      if (!isDec) return;
      if (e.label) { decLabel[i] = e.label; return; }
      const cnt = decCntAll[e.source] ?? 0;
      decCntAll[e.source] = cnt + 1;
      decLabel[i] = cnt === 0 ? "Yes" : "No";
    });
  }

  const noEdgesByCol = {};
  const loopEdgesByCol = {};

  // First pass: identify all "No" edges and loop-back edges
  rawEdges.forEach((e, i) => {
    if (back.has(i)) {
      const col = colMap[e.target] ?? 0;
      if (!loopEdgesByCol[col]) loopEdgesByCol[col] = [];
      loopEdgesByCol[col].push({ edgeIdx: i, sourceId: e.source, targetId: e.target, span: (layer[e.source] ?? 0) - (layer[e.target] ?? 0) });
      return;
    }

    const isDec = nm[e.source]?.tl === "decision";
    if (isDec && (decLabel[i] ?? "").toLowerCase() === "no") {
      const col = colMap[e.source] ?? 0;
      if (!noEdgesByCol[col]) noEdgesByCol[col] = [];
      noEdgesByCol[col].push({ edgeIdx: i, sourceId: e.source, layer: layer[e.source] ?? 0 });
    }
  });

  // Calculate offsets for each "No" edge so they route in parallel corridors
  const edgeOffsets = {};
  Object.keys(noEdgesByCol).forEach(col => {
    const sorted = noEdgesByCol[col].sort((a, b) => a.layer - b.layer);
    sorted.forEach((item, index) => {
      // The decision node higher up (smaller layer) gets the larger offset index (outermost corridor)
      edgeOffsets[item.edgeIdx] = sorted.length - 1 - index;
    });
  });

  // Calculate offsets for loop edges so they route in parallel corridors
  // within the single shared left corridor (see leftBoundX above).
  const loopOffsets = {};
  Object.keys(loopEdgesByCol).forEach(col => {
    const sorted = loopEdgesByCol[col].sort((a, b) => a.span - b.span);
    sorted.forEach((item, index) => {
      // Shorter span gets smaller offset index (inner loop), longer span gets larger offset index (outer loop)
      loopOffsets[item.edgeIdx] = index;
    });
  });

  const rfEdges = rawEdges.map((e, i) => {
    if (back.has(i)) {
      return {
        id: `e${i}`,
        source: e.source, target: e.target,
        sourceHandle: "left-out", targetHandle: "left-in",
        type: "loopEdge",
        data: {
          label: decLabel[i] ?? "",
          leftOffsetIndex: loopOffsets[i] ?? 0,
          leftBoundX,
        },
        style: { stroke: "#64748B", strokeWidth: 2 },
      };
    }

    const isDec = nm[e.source]?.tl === "decision";
    let label = "", sh = "bottom", th = "top";

    if (isDec) {
      label = decLabel[i] ?? "";
      sh = label.toLowerCase() === "yes" ? "bottom" : "right";
    }

    // Determine maxCol (max column index occupied in the layers between source and target)
    let maxCol = Math.max(colMap[e.source] ?? 0, colMap[e.target] ?? 0);
    const sLayer = layer[e.source] ?? 0;
    const tLayer = layer[e.target] ?? 0;
    const minL = Math.min(sLayer, tLayer);
    const maxL = Math.max(sLayer, tLayer);

    rawNodes.forEach(n => {
      const ly = layer[n.id] ?? 0;
      // We check strictly intermediate layers to find the max column occupied
      if (ly > minL && ly < maxL) {
        const col = colMap[n.id] ?? 0;
        if (col > maxCol) {
          maxCol = col;
        }
      }
    });

    return {
      id: `e${i}`,
      source: e.source, target: e.target,
      sourceHandle: sh, targetHandle: th,
      type: "flowchartEdge",
      data: {
        label,
        rightOffsetIndex: edgeOffsets[i] ?? 0,
        maxCol,
      },
      style: { stroke: "#64748B", strokeWidth: 2 },
    };
  });

  return { rfNodes, rfEdges };
}

/* ═══════════════════════════════════════════════════════════
   INNER COMPONENT  (needs useReactFlow → must be inside Provider)
   ═══════════════════════════════════════════════════════════ */
function FlowchartInner({ nodes: raw, edges: rawE }) {
  const { rfNodes, rfEdges } = useMemo(() => layoutGraph(raw, rawE), [raw, rawE]);
  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);
  const { fitView, getViewport, setViewport } = useReactFlow();

  useEffect(() => {
    setNodes(rfNodes);
    setEdges(rfEdges);
    // Wait for React Flow to measure nodes, then fit and top-align
    const t = setTimeout(() => {
      fitView({ padding: 0.12, minZoom: 0.4, maxZoom: 0.48, duration: 0 });
      // After fitView, override y to pin START node near the top
      requestAnimationFrame(() => {
        const vp = getViewport();
        setViewport({ x: vp.x, y: 30, zoom: vp.zoom }, { duration: 0 });
      });
    }, 200);
    return () => clearTimeout(t);
  }, [rfNodes, rfEdges, setNodes, setEdges, fitView, getViewport, setViewport]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Inline SVG arrowhead markers — gray default plus green/red
          variants so Yes/No edges (including loop-backs) get an
          arrowhead that visually matches their line and label color. */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        <defs>
          <marker id="fc-arrow" viewBox="0 0 10 10" refX="7" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 2 L 8 5 L 0 8 z" fill="#64748B" />
          </marker>
          <marker id="fc-arrow-yes" viewBox="0 0 10 10" refX="7" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 2 L 8 5 L 0 8 z" fill="#16A34A" />
          </marker>
          <marker id="fc-arrow-no" viewBox="0 0 10 10" refX="7" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 2 L 8 5 L 0 8 z" fill="#DC2626" />
          </marker>
        </defs>
      </svg>

      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes} edgeTypes={edgeTypes}
        minZoom={0.4} maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
        panOnDrag zoomOnScroll
        defaultEdgeOptions={{ type: "flowchartEdge" }}
      >
        <Background color="#F1F5F9" gap={20} size={1} variant="dots" />
        <Controls showInteractive={false}
          style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #E2E8F0", bottom: 25, left: 15 }} />
      </ReactFlow>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PUBLIC EXPORT
   ═══════════════════════════════════════════════════════════ */
export default function FlowchartRenderer({ nodes = [], edges = [] }) {
  if (!nodes?.length) {
    return (
      <div style={{
        color: "#94A3B8", fontStyle: "italic", textAlign: "center",
        padding: "32px 16px", background: "#F8FAFC",
        borderRadius: 12, border: "1px dashed #CBD5E1",
      }}>
        No flowchart data available.
      </div>
    );
  }

  return (
    <div style={{
      width: "100%", height: 560,
      borderRadius: 12, overflow: "hidden",
      background: "#ffffff", border: "1px solid #E2E8F0",
    }}>
      <ReactFlowProvider>
        <FlowchartInner nodes={nodes} edges={edges} />
      </ReactFlowProvider>
    </div>
  );
}