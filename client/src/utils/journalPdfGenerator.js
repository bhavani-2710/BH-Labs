import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { layoutGraph } from "../components/FlowchartRenderer.jsx";

// ─── Helpers ────────────────────────────────────────────────────────────────

function sanitizeText(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/\t/g, "    ")
    .replace(/\r/g, "")
    .replace(/[\u2018\u2019\u02BC\u2032]/g, "'")
    .replace(/[\u201C\u201D\u2033]/g, '"')
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, "-")
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u2192/g, "->")
    .replace(/\u2190/g, "<-")
    .replace(/\u00A0/g, " ");
}

async function loadImageAsPngBuffer(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width || 800;
        canvas.height = img.naturalHeight || img.height || 600;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
          if (!blob) { resolve(null); return; }
          resolve(await blob.arrayBuffer());
        }, "image/png");
      } catch (e) { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function loadImageAsDataUrl(url) {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("data:")) return url;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width || 800;
        canvas.height = img.naturalHeight || img.height || 600;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (e) { resolve(url); }
    };
    img.onerror = () => resolve(url);
    img.src = url;
  });
}

// ─── Flowchart → PNG DataURL (using Canvas) ────────────────────────

async function buildFlowchartDataUrl(subExp) {
  try {
    if (!subExp?.flowchart?.nodes?.length) return null;

    const nodes = subExp.flowchart.nodes;
    const edges = subExp.flowchart.edges || [];
    const { rfNodes, rfEdges } = layoutGraph(nodes, edges);

    // Calculate bounding box
    let maxCol = 0, maxLayer = 0;
    rfNodes.forEach((n) => {
      const col = Math.max(0, Math.round((n.position.x - 220) / 280));
      const ly  = Math.max(0, Math.round(n.position.y / 210));
      if (col > maxCol) maxCol = col;
      if (ly  > maxLayer) maxLayer = ly;
    });

    const SCALE = 2; // retina
    const rowH  = 80;
    const colW  = 160;
    const PAD   = 80;
    const W     = (maxCol * colW + 200 + PAD * 2) * SCALE;
    const H     = (maxLayer * rowH + 100 + PAD * 2) * SCALE;

    const canvas = document.createElement("canvas");
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.scale(SCALE, SCALE);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W / SCALE, H / SCALE);

    const baseX = PAD;
    const baseY = PAD + 40;

    const nodeCoords = {};
    rfNodes.forEach((n) => {
      const col = Math.max(0, Math.round((n.position.x - 220) / 280));
      const ly  = Math.max(0, Math.round(n.position.y / 210));
      nodeCoords[n.id] = {
        x: baseX + col * colW + 80,
        y: baseY + ly * rowH,
        type: (n.data?.nodeType || n.type || "process").toLowerCase(),
        label: n.data?.label || "",
        col, ly,
      };
    });

    const getHalf = (node) => {
      ctx.font = "11px sans-serif";
      const tw = ctx.measureText(node.label).width;
      if (node.type === "decision") return { hw: Math.max(50, tw / 2 + 14), hh: 20 };
      if (node.type === "start" || node.type === "end") return { hw: Math.max(55, tw / 2 + 14), hh: 14 };
      return { hw: Math.max(60, tw / 2 + 12), hh: 14 };
    };

    const drawArrow = (x1, y1, x2, y2, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      // arrowhead
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 8 * Math.cos(angle - 0.4), y2 - 8 * Math.sin(angle - 0.4));
      ctx.lineTo(x2 - 8 * Math.cos(angle + 0.4), y2 - 8 * Math.sin(angle + 0.4));
      ctx.closePath(); ctx.fillStyle = color; ctx.fill();
    };

    // Draw edges
    rfEdges.forEach((e) => {
      const src = nodeCoords[e.source];
      const tgt = nodeCoords[e.target];
      if (!src || !tgt) return;
      const srcH = getHalf(src);
      const tgtH = getHalf(tgt);
      const labelLC = (e.data?.label || "").toLowerCase();
      const color = labelLC === "yes" ? "#16a34a" : labelLC === "no" ? "#dc2626" : "#64748b";
      const isLoop = e.type === "loopEdge" || tgt.ly < src.ly;

      let labelX = src.x + srcH.hw + 4;
      let labelY = src.y - 4;

      ctx.strokeStyle = color; ctx.lineWidth = 1.5;
      if (isLoop) {
        const lx = Math.min(src.x, tgt.x) - 60;
        ctx.beginPath();
        ctx.moveTo(src.x - srcH.hw, src.y);
        ctx.lineTo(lx, src.y);
        ctx.lineTo(lx, tgt.y);
        ctx.lineTo(tgt.x - tgtH.hw, tgt.y);
        ctx.stroke();
        drawArrow(lx, tgt.y, tgt.x - tgtH.hw, tgt.y, color);

        labelX = src.x - srcH.hw - 12;
        labelY = src.y - 4;
      } else if (Math.abs(src.x - tgt.x) < 10) {
        drawArrow(src.x, src.y + srcH.hh, tgt.x, tgt.y - tgtH.hh, color);

        labelX = src.x + 6;
        labelY = src.y + srcH.hh + 12;
      } else if (tgt.x > src.x) {
        ctx.beginPath();
        ctx.moveTo(src.x + srcH.hw, src.y);
        ctx.lineTo(tgt.x, src.y);
        ctx.lineTo(tgt.x, tgt.y - tgtH.hh);
        ctx.stroke();
        drawArrow(tgt.x, src.y, tgt.x, tgt.y - tgtH.hh, color);

        labelX = src.x + srcH.hw + 6;
        labelY = src.y - 4;
      } else {
        drawArrow(src.x, src.y + srcH.hh, tgt.x, tgt.y - tgtH.hh, color);

        labelX = src.x + 6;
        labelY = src.y + srcH.hh + 12;
      }

      if (labelLC === "yes" || labelLC === "no") {
        ctx.fillStyle = color;
        ctx.font = "bold 10px sans-serif";
        ctx.fillText(labelLC === "yes" ? "Yes" : "No", labelX, labelY);
      }
    });

    // Draw nodes
    Object.values(nodeCoords).forEach((node) => {
      const { x, y, type } = node;
      const { hw, hh } = getHalf(node);

      ctx.font = "11px sans-serif";

      if (type === "start" || type === "end") {
        ctx.fillStyle = type === "start" ? "#22c55e" : "#ef4444";
        ctx.strokeStyle = type === "start" ? "#16a34a" : "#dc2626";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x - hw, y - hh, hw * 2, hh * 2, hh);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(node.label, x, y);
      } else if (type === "decision") {
        ctx.strokeStyle = "#0ea5e9"; ctx.fillStyle = "#f0f9ff"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y - hh); ctx.lineTo(x + hw, y);
        ctx.lineTo(x, y + hh); ctx.lineTo(x - hw, y); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#0369a1"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = "10px sans-serif";
        ctx.fillText(node.label, x, y);
      } else if (type === "output" || type === "input") {
        const sk = 8;
        ctx.strokeStyle = "#0ea5e9"; ctx.fillStyle = "#f0f9ff"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - hw + sk, y - hh); ctx.lineTo(x + hw + sk, y - hh);
        ctx.lineTo(x + hw - sk, y + hh); ctx.lineTo(x - hw - sk, y + hh); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#0369a1"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(node.label, x, y);
      } else {
        ctx.strokeStyle = "#0ea5e9"; ctx.fillStyle = "#f0f9ff"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(x - hw, y - hh, hw * 2, hh * 2, 4);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#0369a1"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(node.label, x, y);
      }
    });

    return canvas.toDataURL("image/png");
  } catch (e) {
    console.warn("Flowchart canvas render failed:", e);
    return null;
  }
}

const today = new Date();
const formattedDate = today.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

// ─── HTML Template Builder ───────────────────────────────────────────────────

function buildJournalHtml({ subExp, experiment, codeText, outputText, referenceSolutionCode, flowchartDataUrl }) {
  const expNum = experiment?.experimentNumber || 1;
  const aimTitle = sanitizeText(subExp?.title) || "Study and formulate problem statement.";
  const theory   = sanitizeText(subExp?.theory) ||
    `Experimentation and structured analysis of computational algorithms are foundational to computer science and engineering. This practical investigation explores the underlying algorithmic logic, sequential flow, and functional execution of ${sanitizeText(subExp?.title) || "the specified module"}.`;
  const conclusion = sanitizeText(
    `The ${subExp?.title || "experiment"} program was successfully implemented and compiled. Through this experiment, we observed how basic logic structures can manipulate data in memory. The program executed with zero errors and produced the expected output matching the unit validation cases.`
  );

  const isNonExec = subExp?.mode === "nonExecutableCode" ||
    (subExp?.isExecutable === false && subExp?.mode !== "executableCode");
  const isGuided  = subExp?.mode === "guidedSteps";

  // ── 1. Header Block ────────────────────────────────────────────────────────
  const headerBlock = `
    <div class="section-block header-block">
      <!-- Journal Banner -->
      <div class="journal-header">
        <div class="journal-logo-wrap">
          <img src="/logo.png" alt="BrainHeaters Logo"/>
        </div>
        <span class="journal-header-title">BRAINHEATERS LABORATORY PRACTICAL JOURNAL</span>
        <div class="section-divider" style="margin-top:0;margin-bottom:20px;"></div>
      </div>

      <!-- Student Record Table -->
      <table class="student-table">
        
        <tr>
          <td>University: Mumbai University</td>
          <td>Branch: Computer Engineering</td>
        </tr>
        <tr>
          <td>Sem/Year: VII BE</td>
          <td>Date: ${formattedDate}</td>
        </tr>
      </table>

      <!-- Experiment Number -->
      <div class="exp-number">EXPERIMENT NO. ${expNum}</div>

      <!-- AIM -->
      <div class="aim-row">
        <span class="aim-label">AIM:</span>
        <span class="aim-text">${sanitizeText(aimTitle)}</span>
      </div>
    </div>`;

  // ── 2. Theory Block ────────────────────────────────────────────────────────
  const theoryBlock = `
    <div class="section-block theory-block">
      <div class="section-heading">Theory:</div>
      <div class="section-divider"></div>
      <div class="theory-box">${theory.replace(/\n/g, "<br>")}</div>
    </div>`;

  // ── 3. Algorithm Block ─────────────────────────────────────────────────────
  let algorithmBlock = "";
  if (!isGuided) {
    const algoText  = sanitizeText(subExp?.algorithm || "No algorithm details provided.");
    const algoLines = algoText.split("\n").filter(l => l.trim());
    algorithmBlock = `
      <div class="section-block algorithm-block">
        <div class="section-heading">Algorithm</div>
        <div class="section-divider"></div>
        <ol class="algo-list">
          ${algoLines.map((l, i) => {
            const clean = l.trim().replace(/^(?:Step\s*)?(?:\d+[.:)]\s*)+/i, "");
            return `<li>Step ${i + 1}: ${sanitizeText(clean)}</li>`;
          }).join("")}
        </ol>
      </div>`;
  }

  // ── 4. Flowchart Block ─────────────────────────────────────────────────────
  let flowchartBlock = "";
  if (flowchartDataUrl) {
    flowchartBlock = `
      <div class="section-block flowchart-block">
        <div class="section-heading">Flowchart</div>
        <div class="section-divider"></div>
        <div class="flowchart-wrap">
          <img src="${flowchartDataUrl}" alt="Flowchart" class="flowchart-img" />
        </div>
      </div>`;
  }

  // ── 5. Code / Steps Blocks ─────────────────────────────────────────────────
  let guidedHeadingBlock = "";
  let guidedStepsBlocks = [];
  let sourceCodeBlock = "";
  let executionOutputBlock = "";

  if (isGuided) {
    guidedHeadingBlock = `
      <div class="section-block guided-heading-block">
        <div class="section-heading">Guided Steps Procedure</div>
        <div class="section-divider"></div>
      </div>`;

    const steps = subExp?.steps || [];
    guidedStepsBlocks = steps.map((st, i) => {
      const stepNum    = st.order || i + 1;
      const instrSanitized = sanitizeText(st.instruction || "");
      let instrContent = "";
      if (instrSanitized.includes("```")) {
        const parts = instrSanitized.split("```");
        instrContent = parts.map((chunk, idx) => {
          if (!chunk.trim()) return "";
          if (idx % 2 === 0) return `<p class="step-text">${chunk.replace(/\n/g, "<br>")}</p>`;
          const codeLines = chunk.split("\n");
          const langs = ["bash","sh","java","python","javascript","js","c","cpp","sql","html","css","cmd","powershell"];
          const firstWord = codeLines[0]?.trim().toLowerCase();
          const code = langs.includes(firstWord) ? codeLines.slice(1).join("\n") : chunk;
          return `<pre class="code-block">${escapeHtml(code)}</pre>`;
        }).join("");
      } else {
        instrContent = `<p class="step-text">${instrSanitized.replace(/\n/g, "<br>")}</p>`;
      }
      const cmdHtml = st.command && st.command.trim()
        ? `<div class="cmd-box"><span class="cmd-prompt">$ </span>${escapeHtml(st.command.trim())}</div>`
        : "";
      const stepImgUrl = st._resolvedImageUrl || st.imageUrl || st.image || st.screenshot || st.imgUrl || st.url;
      const imgHtml = stepImgUrl
        ? `<img src="${stepImgUrl}" alt="Step ${stepNum} screenshot" class="step-img" crossorigin="anonymous" />`
        : "";
      const captionHtml = (st.imageCaption || st.caption)
        ? `<p class="caption">Figure: ${sanitizeText(st.imageCaption || st.caption)}</p>`
        : "";
      return `
        <div class="section-block step-card-block">
          <div class="step-card">
            <table class="step-badge-table" cellpadding="0" cellspacing="0">
              <tr><td class="step-badge-td">${stepNum}</td></tr>
            </table>
            <div class="step-body">
              <div class="step-title">Step ${stepNum}</div>
              ${instrContent}
              ${cmdHtml}
              ${imgHtml}
              ${captionHtml}
            </div>
          </div>
        </div>`;
    });
  } else {
    let filesToPrint = [];
    if (isNonExec && subExp?.files?.length) {
      filesToPrint = subExp.files;
    } else {
      let filename = "main.c";
      if (subExp?.referenceSolution) {
        const sols = subExp.referenceSolution;
        const keys = typeof sols.keys === "function" ? Array.from(sols.keys()) : Object.keys(sols);
        if (keys.length) {
          const ext = keys[0];
          if (ext === "python") filename = "main.py";
          else if (ext === "javascript") filename = "main.js";
          else if (ext === "sql") filename = "query.sql";
          else if (ext === "java") filename = "Main.java";
          else filename = `main.${ext}`;
        }
      }
      filesToPrint = [{
        filename,
        content: referenceSolutionCode || codeText || "// No source code available",
      }];
    }

    const filesHtml = filesToPrint.map((f) => `
      <div class="filename-label">${sanitizeText(f.filename)}</div>
      <div class="code-accent-bar"></div>
      <pre class="code-block">${escapeHtml(sanitizeText(f.content || ""))}</pre>`).join("");

    sourceCodeBlock = `
      <div class="section-block source-code-block">
        <div class="section-heading">Source Code</div>
        <div class="section-divider"></div>
        ${filesHtml}
      </div>`;

    let outLog = outputText;
    if (!outLog) {
      if (isNonExec) {
        outLog = subExp?.samples?.length
          ? subExp.samples.map(s => s.output).filter(Boolean).join("\n---\n")
          : "Page layout / non-executable code verified successfully.";
      } else {
        outLog = `Output Vector: [${subExp?.samples?.[0]?.output || "Successfully executed"}]`;
      }
    }

    executionOutputBlock = `
      <div class="section-block execution-output-block">
        <div class="section-heading">Execution Output</div>
        <div class="section-divider"></div>
        <div class="filename-label">terminal_output.log</div>
        <div class="code-accent-bar output-bar"></div>
        <pre class="code-block output-block">${escapeHtml(sanitizeText(outLog))}</pre>
      </div>`;
  }

  // ── 6. Conclusion Block ────────────────────────────────────────────────────
  const conclusionBlock = `
    <div class="section-block conclusion-block">
      <div class="section-heading" style="margin-top:24px;">Conclusion</div>
      <div class="section-divider"></div>
      <div class="conclusion-text">${conclusion}</div>
    </div>`;

  const styleHtml = `
<style id="__journal_pdf_styles__">
  .journal-page-root *, .journal-page-root *::before, .journal-page-root *::after,
  .page *, .page *::before, .page *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .journal-page-root {
    font-family: 'Google Sans', Arial, sans-serif;
    font-size: 10pt;
    color: #1a1a1a;
    background: #fff;
    width: 794px;
  }

  .page {
    width: 794px;
    height: 1123px;
    padding: 86px 54px 70px 54px; /* top/right/bottom/left — top makes room for running header */
    background: #fff;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
  }

  .section-block {
    width: 100%;
    margin-bottom: 20px;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* ── Outer border frame ─────────────────────────── */
  .page::before {
    content: '';
    position: absolute;
    inset: 28px;
    pointer-events: none;
  }

  /* ── Section heading ────────────────────────────── */
  .section-heading {
    font-size: 15pt;
    font-weight: 700;
    color: #4f46e5;
    margin-top: 24px;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }
  .section-divider {
    height: 1px;
    background: #e2e8f0;
    margin-bottom: 14px;
  }

  /* ── Journal header banner ──────────────────────── */
  .journal-header {
    margin-bottom: 18px;
    padding-top: 8px;
  }
  .journal-logo-wrap {
    margin-bottom: 18px;
  }
  .journal-logo-wrap img {
    width: 44px;
    height: 44px;
    object-fit: contain;
    display: block;
  }
  .journal-header-title {
    font-size: 16pt;
    font-weight: 700;
    color: #4f46e5;
    letter-spacing: -0.02em;
    line-height: 1.15;
    display: block;
    margin-bottom: 16px;
  }

  /* ── Student record table ───────────────────────── */
  .student-table {
    width: 100%;
    border-collapse: collapse;
    border: 0.8px solid #000;
    margin-bottom: 24px;
    font-size: 10.5pt;
  }
  .student-table td {
    border: 0.8px solid #000;
    padding: 2px 8px 10px 8px;;
  }

  /* ── Experiment metadata ────────────────────────── */
  .exp-number {
    font-size: 11.5pt;
    font-weight: 700;
    margin-bottom: 10px;
    margin-top: 6px;
  }
  .aim-row {
    display: flex;
    gap: 6px;
    margin-bottom: 14px;
    font-size: 10.5pt;
    line-height: 1.5;
  }
  .aim-label { font-weight: 700; flex-shrink: 0; font-size: 11.5pt; }
  .aim-text { flex: 1; }

  /* ── Theory box ─────────────────────────────────── */
  .theory-box {
    background: #FFF8E3;
    border-left: 6px solid #E8A317;
    border-radius: 10px;
    padding: 18px 22px;
    margin: 16px 0 22px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    font-size: 10.5pt;
    line-height: 1.6;
  }

  /* ── Algorithm list ─────────────────────────────── */
  .algo-list {
    list-style: none;
    padding-left: 0;
    font-size: 10.5pt;
    line-height: 1.7;
    margin-bottom: 10px;
  }
  .algo-list li { margin-bottom: 4px; }

  /* ── Flowchart ───────────────────────────────────── */
  .flowchart-wrap {
    display: flex;
    justify-content: center;
    margin: 10px 0 16px;
  }
  .flowchart-img {
    max-width: 100%;
    max-height: 420px;
    object-fit: contain;
  }

  /* ── Code blocks ─────────────────────────────────── */
  .filename-label {
    font-size: 9.5pt;
    font-weight: 700;
    margin-bottom: 4px;
    margin-top: 12px;
    font-family: 'Google Sans', sans-serif;
  }
  .code-accent-bar {
    height: 3px;
    background: #000;
    margin-bottom: 0;
  }
  .output-bar { background: #1ad89a; }
  .code-block {
    font-family: 'Roboto Mono', 'Courier New', monospace;
    font-size: 8pt;
    background: #111114;
    color: #d9d9e6;
    padding: 10px 12px;
    white-space: pre-wrap;
    word-break: break-all;
    line-height: 1.55;
    margin-bottom: 14px;
    tab-size: 4;
  }
  .output-block { color: #1ad89a; }

  /* ── Guided steps ────────────────────────────────── */
  .step-card {
    display: flex;
    gap: 12px;
    margin-bottom: 18px;
  }
  .step-badge-table {
    width: 25px;
    height: 25px;
    border-collapse: separate;
    border-radius: 50%;
    background: #000000;
    flex-shrink: 0;
    margin-top: 2px;
    overflow: hidden;
  }
  .step-badge-td {
    width: 25px;
    height: 25px;
    vertical-align: middle;
    text-align: center;
    color: #ffffff;
    font-family: Arial, sans-serif;
    font-size: 9.5pt;
    font-weight: 700;
    line-height: normal;
    padding: 0;
  }
  .step-body { flex: 1; }
  .step-title { font-size: 10.5pt; font-weight: 700; margin-bottom: 4px; }
  .step-text  { font-size: 10pt; line-height: 1.6; margin-bottom: 6px; }
  .step-img   { max-width: 100%; margin: 8px 0; border: 1px solid #ddd; border-radius: 4px; }
  .caption    { font-size: 9pt; color: #555; font-style: italic; margin-bottom: 6px; }
  .cmd-box    {
    background: #090e0b;
    color: #34d399;
    font-family: monospace;
    font-size: 10.5pt;
    font-weight: 800;
    padding: 12px 16px;
    border-radius: 8px;
    border: 2px solid #10b981;
    margin: 8px 0 12px 0;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .cmd-prompt {
    color: #34d399;
    font-weight: 900;
  }

  /* ── Conclusion ──────────────────────────────────── */
  .conclusion-text {
    font-size: 10.5pt;
    line-height: 1.7;
    margin-bottom: 20px;
  }
</style>`;

  const contentHtml = `
<div class="journal-page-root">
  ${headerBlock}
  ${theoryBlock}
  ${algorithmBlock}
  ${flowchartBlock}
  ${isGuided ? `
    ${guidedHeadingBlock}
    ${guidedStepsBlocks.join("")}
  ` : `
    ${sourceCodeBlock}
    ${executionOutputBlock}
  `}
  ${conclusionBlock}
</div>`;

  return { styleHtml, contentHtml };
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export async function generateJournalPdf({ experiment, subPart = "a", codeText, outputText }) {
  const subExp = experiment?.subExperiments?.find(s => s.part === subPart)
    || experiment?.subExperiments?.[0];

  // Extract reference solution
  let referenceSolutionCode = "";
  if (subExp?.referenceSolution) {
    const sols = subExp.referenceSolution;
    const keys = typeof sols.keys === "function" ? Array.from(sols.keys()) : Object.keys(sols);
    if (keys.length) {
      const lang = keys[0];
      referenceSolutionCode = (typeof sols.get === "function" ? sols.get(lang) : sols[lang]) || "";
    }
  }

  // 1. Render flowchart to PNG DataURL
  const flowchartDataUrl = await buildFlowchartDataUrl(subExp);

  // 1.5 Preload step images to DataURLs so cross-origin screenshots render cleanly in html2canvas
  if (subExp?.steps && subExp.steps.length > 0) {
    for (let st of subExp.steps) {
      const sUrl = st.imageUrl || st.image || st.screenshot || st.imgUrl || st.url;
      if (sUrl) {
        st._resolvedImageUrl = await loadImageAsDataUrl(sUrl);
      }
    }
  }

  // 2. Build HTML fragments
  const { styleHtml, contentHtml } = buildJournalHtml({
    subExp, experiment, codeText, outputText,
    referenceSolutionCode, flowchartDataUrl,
  });

  // 3. Load logo DataURL early (needed for jsPDF header/watermark)
  let logoDataUrl = null;
  try {
    const logoBuf = await loadImageAsPngBuffer("/logo.png");
    if (logoBuf) {
      const blob = new Blob([logoBuf], { type: "image/png" });
      logoDataUrl = await new Promise((res) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.readAsDataURL(blob);
      });
    }
  } catch (e) {
    console.warn("Could not load logo for jsPDF header:", e);
  }

  // 4. Ensure Inter font is loaded in the main document
  const FONT_ID = "__journal_inter_font__";
  if (!document.getElementById(FONT_ID)) {
    const link = document.createElement("link");
    link.id   = FONT_ID;
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,700;1,400&family=Roboto+Mono&display=swap";
    document.head.appendChild(link);
    await new Promise(r => setTimeout(r, 600));
  }

  // 5. Mount hidden container div directly in document body
  //    Inject style then content in a scratchpad with exact width and padding.
  const container = document.createElement("div");
  container.style.cssText = [
    "position:fixed",
    "left:-9999px",
    "top:-9999px",
    "width:794px",
    "z-index:-1",
    "pointer-events:none",
    "overflow:visible",
    "background:#fff",
  ].join(";");
  container.innerHTML = styleHtml + `<div class="scratchpad" style="width:794px; padding: 86px 54px 70px 54px; box-sizing: border-box;">${contentHtml}</div>`;
  document.body.appendChild(container);

  // Allow fonts/images to settle
  await new Promise(r => setTimeout(r, 1000));

  // 6. Pagination Algorithm
  const scratchpad = container.querySelector(".scratchpad");
  const blocks = Array.from(scratchpad.querySelectorAll(".section-block"));

  const A4_HEIGHT = 1123;
  const PAGE_PADDING_T = 86;
  const PAGE_PADDING_B = 115;
  const BUDGET = A4_HEIGHT - PAGE_PADDING_T - PAGE_PADDING_B; // 922px

  const pages = [];
  let currentPageBlocks = [];
  let currentHeight = 0;

  blocks.forEach((block) => {
    const h = block.offsetHeight + 24; // include section-block bottom margin
    if (block.classList.contains("header-block")) {
      currentPageBlocks.push(block);
      currentHeight += h;
      return;
    }

    if (currentHeight + h > BUDGET) {
      if (currentPageBlocks.length > 0) {
        pages.push(currentPageBlocks);
        currentPageBlocks = [block];
        currentHeight = h;
      } else {
        currentPageBlocks = [block];
        currentHeight = h;
        pages.push(currentPageBlocks);
        currentPageBlocks = [];
        currentHeight = 0;
      }
    } else {
      currentPageBlocks.push(block);
      currentHeight += h;
    }
  });
  if (currentPageBlocks.length > 0) {
    pages.push(currentPageBlocks);
  }

  // Re-build container with actual page divs
  const styleEl = container.querySelector("#__journal_pdf_styles__");
  container.innerHTML = "";
  container.appendChild(styleEl);

  const rootDiv = document.createElement("div");
  rootDiv.className = "journal-page-root";

  pages.forEach((pageBlocks, index) => {
    const pageDiv = document.createElement("div");
    pageDiv.className = "page";
    pageDiv.id = `page-${index + 1}`;
    pageDiv.style.cssText = "width:794px; height:1123px; padding: 86px 54px 70px 54px; background:#fff; position:relative; box-sizing:border-box; overflow:hidden;";
    pageBlocks.forEach((block) => {
      pageDiv.appendChild(block.cloneNode(true));
    });
    rootDiv.appendChild(pageDiv);
  });
  container.appendChild(rootDiv);

  // Wait a small frame for browser to re-layout the paginated elements
  await new Promise(r => setTimeout(r, 400));

  const pageElements = Array.from(rootDiv.querySelectorAll(".page"));
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const A4_MM_W  = 210;
  const A4_MM_H  = 297;

  for (let i = 0; i < pageElements.length; i++) {
    if (i > 0) pdf.addPage();
    const pageEl = pageElements[i];

    const canvas = await html2canvas(pageEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width:  794,
      height: 1123,
      windowWidth:  794,
      windowHeight: 1123,
      logging: false,
    });

    const sliceDataUrl = canvas.toDataURL("image/jpeg", 0.97);
    pdf.addImage(sliceDataUrl, "JPEG", 0, 0, A4_MM_W, A4_MM_H, undefined, "FAST");

    // ── Watermark ──────────────────────────────────────────────────────
    if (logoDataUrl) {
      pdf.saveGraphicsState();
      pdf.setGState(new pdf.GState({ opacity: 0.07 }));
      pdf.addImage(logoDataUrl, "PNG", (A4_MM_W - 160) / 2, (A4_MM_H - 160) / 2, 160, 160, undefined, "FAST");
      pdf.restoreGraphicsState();
    }

    // ── Header: Logo (skip page 1 — HTML banner already has it) ───────
    if (logoDataUrl && i > 0) {
      pdf.addImage(logoDataUrl, "PNG", 12.7, 8, 10, 10, undefined, "FAST");
    }

    // ── Header: Right text (skip page 1 — HTML banner already shows title) ──
    if (i > 0) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(113, 113, 122);
      pdf.text("Brainheaters Laboratory Practical Journal", 197.3, 13.5, { align: "right" });
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.35);
      pdf.line(12.7, 19.5, 197.3, 19.5);
    }

    // ── Footer: Page number ────────────────────────────────────────────
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(113, 113, 122);
    pdf.text(`Page no - ${i + 1}`, 12.7, 287);

    // ── Footer: Brand ──────────────────────────────────────────────────
    pdf.setFont("helvetica", "bold");
    pdf.text("Handcrafted by Engineers", 197.3, 287, { align: "right" });
  }

  document.body.removeChild(container);

  const pdfArrayBuffer = pdf.output("arraybuffer");
  return new Uint8Array(pdfArrayBuffer);
}
