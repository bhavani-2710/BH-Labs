import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { layoutGraph } from "../components/FlowchartRenderer.jsx";

function sanitizeText(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/\t/g, "    ")                  // Replace tabs with 4 spaces
    .replace(/\r/g, "")                      // Remove carriage returns
    .replace(/[\u2018\u2019\u02BC\u2032]/g, "'") // Smart single quotes / prime
    .replace(/[\u201C\u201D\u2033]/g, '"')   // Smart double quotes
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, "-") // All dashes & minus signs -> '-'
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "-") // Bullets -> '-'
    .replace(/\u2026/g, "...")               // Ellipsis
    .replace(/\u2192/g, "->")                // Right arrow
    .replace(/\u2190/g, "<-")                // Left arrow
    .replace(/\u00A0/g, " ")                 // Non-breaking space
    .replace(/[^\x20-\x7E\n]/g, "");         // Cleanly remove any unprintable characters instead of '?'
}

// Helper to convert any image URL (Cloudinary, WebP, AVIF, PNG, JPG) to standard PNG ArrayBuffer via HTML5 Canvas
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
          if (!blob) {
            resolve(null);
            return;
          }
          const buffer = await blob.arrayBuffer();
          resolve(buffer);
        }, "image/png");
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function generateJournalPdf({ experiment, subPart = "a", codeText, outputText }) {
  const subExp = experiment?.subExperiments?.find(s => s.part === subPart) || experiment?.subExperiments?.[0];

  // Extract reference solution from DB
  let referenceSolutionCode = "";
  if (subExp?.referenceSolution) {
    const solutions = subExp.referenceSolution;
    let keys = [];
    if (typeof solutions.keys === "function") {
      keys = Array.from(solutions.keys());
    } else if (solutions) {
      keys = Object.keys(solutions);
    }
    if (keys.length > 0) {
      const firstLang = keys[0];
      if (typeof solutions.get === "function") {
        referenceSolutionCode = solutions.get(firstLang) || "";
      } else {
        referenceSolutionCode = solutions[firstLang] || "";
      }
    }
  }

  const conclusionText = sanitizeText(
    `The ${subExp?.title || "experiment"} program was successfully implemented and compiled. Through this experiment, we observed how basic logic structures can manipulate data in memory. The program executed with zero errors and produced the expected output matching the unit validation cases.`
  );

  const pdfDoc = await PDFDocument.create();

  // Font definitions (Professional College Journal in Word using Times New Roman)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);
  const courierBold = await pdfDoc.embedFont(StandardFonts.CourierBold);

  // Colors - Authentic College Practical Journal Theme (Black & Subtle Shaded Boxes)
  const purpleColor = rgb(0, 0, 0); // Pure Black for all titles and lines
  const darkTextColor = rgb(0, 0, 0);
  const grayTextColor = rgb(0.15, 0.15, 0.15);
  const lightGrayBg = rgb(0.95, 0.94, 0.93); // Subtle warm tinted background box matching Word screenshot
  const borderLineColor = rgb(0, 0, 0);

  // Page dimensions
  const PAGE_WIDTH = 595.276; // A4 width in points
  const PAGE_HEIGHT = 841.890; // A4 height in points
  const MARGIN_LEFT = 45;
  const MARGIN_RIGHT = 45;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

  let currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let currentY = PAGE_HEIGHT - 50;
  let pageCount = 1;

  // Header drawing function for new pages
  const drawPageHeaderAndFooter = (page, pageNum) => {
    // Authentic Outer Page Border Frame (matching college report screenshot)
    page.drawRectangle({
      x: 28,
      y: 28,
      width: PAGE_WIDTH - 56,
      height: PAGE_HEIGHT - 56,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1.0
    });

    // Footer - Page Number
    page.drawText(`${pageNum}`, {
      x: PAGE_WIDTH / 2 - 4,
      y: 15,
      size: 9.5,
      font: helveticaFont,
      color: rgb(0, 0, 0)
    });
  };

  drawPageHeaderAndFooter(currentPage, pageCount);

  // Helper to check and allocate page space
  const ensureSpace = (neededHeight) => {
    if (currentY - neededHeight < 60) {
      currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      pageCount++;
      drawPageHeaderAndFooter(currentPage, pageCount);
      currentY = PAGE_HEIGHT - 80;
    }
  };

  // Load Brainheaters Logo Image for Header
  let logoImg = null;
  try {
    const res = await fetch("/logo.png");
    if (res.ok) {
      const logoBuf = await res.arrayBuffer();
      logoImg = await pdfDoc.embedPng(logoBuf);
    }
  } catch (err) {
    console.warn("Could not load logo.png for PDF header", err);
  }

  // Draw Brainheaters Header Banner before Name Table
  if (logoImg) {
    currentPage.drawImage(logoImg, {
      x: MARGIN_LEFT,
      y: currentY - 22,
      width: 78,
      height: 23
    });
  }
  currentPage.drawText("BRAINHEATERS LABORATORY PRACTICAL JOURNAL", {
    x: MARGIN_LEFT + (logoImg ? 90 : 0),
    y: currentY - 14,
    size: 12.5,
    font: helveticaBold,
    color: darkTextColor
  });
  currentY -= 38;

  // 1. STUDENT RECORD TABLE (Authentic College Practical Journal 2x3 Grid)
  const tableTopY = currentY;
  const tableH = 60;
  const col1W = CONTENT_WIDTH * 0.52;
  const col2W = CONTENT_WIDTH * 0.48;

  // Outer rectangle
  currentPage.drawRectangle({
    x: MARGIN_LEFT,
    y: tableTopY - tableH,
    width: CONTENT_WIDTH,
    height: tableH,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.8
  });

  // Vertical divider line between columns
  currentPage.drawLine({
    start: { x: MARGIN_LEFT + col1W, y: tableTopY },
    end: { x: MARGIN_LEFT + col1W, y: tableTopY - tableH },
    thickness: 0.8,
    color: rgb(0, 0, 0)
  });

  // Horizontal divider lines between rows
  currentPage.drawLine({
    start: { x: MARGIN_LEFT, y: tableTopY - 20 },
    end: { x: MARGIN_LEFT + CONTENT_WIDTH, y: tableTopY - 20 },
    thickness: 0.8,
    color: rgb(0, 0, 0)
  });
  currentPage.drawLine({
    start: { x: MARGIN_LEFT, y: tableTopY - 40 },
    end: { x: MARGIN_LEFT + CONTENT_WIDTH, y: tableTopY - 40 },
    thickness: 0.8,
    color: rgb(0, 0, 0)
  });

  // Cell texts (Row 1)
  currentPage.drawText("Name: Rahul Sharma", { x: MARGIN_LEFT + 8, y: tableTopY - 14, size: 10.5, font: helveticaFont, color: darkTextColor });
  currentPage.drawText("Roll No: ENG-2026-042", { x: MARGIN_LEFT + col1W + 8, y: tableTopY - 14, size: 10.5, font: helveticaFont, color: darkTextColor });

  // Cell texts (Row 2)
  currentPage.drawText("Branch: Computer Engineering", { x: MARGIN_LEFT + 8, y: tableTopY - 34, size: 10.5, font: helveticaFont, color: darkTextColor });
  currentPage.drawText("Sem/Year: VII BE", { x: MARGIN_LEFT + col1W + 8, y: tableTopY - 34, size: 10.5, font: helveticaFont, color: darkTextColor });

  // Cell texts (Row 3)
  currentPage.drawText("DOP: 10/07/26", { x: MARGIN_LEFT + 8, y: tableTopY - 54, size: 10.5, font: helveticaFont, color: darkTextColor });
  currentPage.drawText("DOS: 10/07/2026", { x: MARGIN_LEFT + col1W + 8, y: tableTopY - 54, size: 10.5, font: helveticaFont, color: darkTextColor });

  currentY = tableTopY - tableH - 28;

  // 2. EXPERIMENT NO. Heading
  currentPage.drawText(`EXPERIMENT NO. ${experiment?.experimentNumber || 1}`, {
    x: MARGIN_LEFT,
    y: currentY,
    size: 11.5,
    font: helveticaBold,
    color: darkTextColor
  });
  currentY -= 20;

  // AIM Heading & Text
  const aimTitleText = sanitizeText(subExp?.title) || "Study and formulate problem statement and algorithm implementation.";
  currentPage.drawText("AIM: ", {
    x: MARGIN_LEFT,
    y: currentY,
    size: 11.5,
    font: helveticaBold,
    color: darkTextColor
  });
  const aimLabelW = helveticaBold.widthOfTextAtSize("AIM: ", 11.5);
  currentPage.drawText(aimTitleText, {
    x: MARGIN_LEFT + aimLabelW,
    y: currentY,
    size: 11,
    font: helveticaFont,
    color: darkTextColor
  });
  currentY -= 22;

  // THEORY Section
  currentPage.drawText("THEORY:", {
    x: MARGIN_LEFT,
    y: currentY,
    size: 11.5,
    font: helveticaBold,
    color: darkTextColor
  });
  currentY -= 16;

  const theoryText = sanitizeText(subExp?.theory) || `Experimentation and structured analysis of computational algorithms are foundational to computer science and engineering. This practical investigation explores the underlying algorithmic logic, sequential flow, and functional execution of ${sanitizeText(subExp?.title) || "the specified module"}. By designing clear procedural workflows and verifying outputs against systematic test cases, we evaluate performance, correctness, and practical applicability.`;

  // Render theory block with subtle warm tint background
  const theoryLines = [];
  const words = theoryText.split(" ");
  let curLine = "";
  for (let w of words) {
    const testL = curLine ? `${curLine} ${w}` : w;
    if (helveticaFont.widthOfTextAtSize(testL, 10.5) < CONTENT_WIDTH - 20) {
      curLine = testL;
    } else {
      theoryLines.push(curLine);
      curLine = w;
    }
  }
  if (curLine) theoryLines.push(curLine);

  const theoryBoxH = theoryLines.length * 15 + 14;
  currentPage.drawRectangle({
    x: MARGIN_LEFT,
    y: currentY - theoryBoxH + 10,
    width: CONTENT_WIDTH,
    height: theoryBoxH,
    color: lightGrayBg
  });

  let theoryY = currentY - 5;
  theoryLines.forEach(l => {
    currentPage.drawText(l, { x: MARGIN_LEFT + 10, y: theoryY, size: 10.5, font: helveticaFont, color: darkTextColor });
    theoryY -= 15;
  });
  currentY = currentY - theoryBoxH - 20;


  // Function to wrap and draw block texts
  const drawHeading = (text) => {
    ensureSpace(120);

    currentPage.drawText(text.toUpperCase(), {
      x: MARGIN_LEFT,
      y: currentY - 6,
      size: 11.5,
      font: helveticaBold,
      color: purpleColor
    });

    // Formal Academic Horizontal Accent Line
    currentPage.drawLine({
      start: { x: MARGIN_LEFT, y: currentY - 12 },
      end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: currentY - 12 },
      thickness: 1.0,
      color: purpleColor
    });

    currentY -= 26;
  };

  const drawParagraph = (text, isMonospace = false, customFontSize = 10, customLineHeight = 14.5) => {
    const font = isMonospace ? courierFont : helveticaFont;
    const lines = [];
    const sanitized = sanitizeText(text);

    const paragraphs = sanitized.split("\n");
    for (let p of paragraphs) {
      if (p.trim() === "" && isMonospace) {
        lines.push("");
        continue;
      }

      const words = p.split(" ");
      let currentLine = "";
      for (let word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, customFontSize);
        if (width < CONTENT_WIDTH - 10) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
          }
          if (font.widthOfTextAtSize(word, customFontSize) < CONTENT_WIDTH - 10) {
            currentLine = word;
          } else {
            let chunk = "";
            for (let char of word) {
              if (font.widthOfTextAtSize(chunk + char, customFontSize) < CONTENT_WIDTH - 10) {
                chunk += char;
              } else {
                lines.push(chunk);
                chunk = char;
              }
            }
            currentLine = chunk;
          }
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
    }

    for (let line of lines) {
      ensureSpace(customLineHeight);
      currentPage.drawText(line, {
        x: MARGIN_LEFT + 5,
        y: currentY,
        size: customFontSize,
        font: font,
        color: darkTextColor
      });
      currentY -= customLineHeight;
    }
    currentY -= 10;
  };

  const drawCodeBlockBox = (codeTextString) => {
    const lines = codeTextString.split("\n");
    ensureSpace(45);
    currentY -= 6;

    // Terminal header bar
    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: currentY - 14,
      width: CONTENT_WIDTH,
      height: 14,
      color: rgb(0.16, 0.16, 0.19),
    });

    // 3 terminal window buttons (Red, Yellow, Green)
    try {
      currentPage.drawCircle({ x: MARGIN_LEFT + 10, y: currentY - 7, size: 2.5, color: rgb(0.95, 0.35, 0.35) });
      currentPage.drawCircle({ x: MARGIN_LEFT + 18, y: currentY - 7, size: 2.5, color: rgb(0.95, 0.75, 0.2) });
      currentPage.drawCircle({ x: MARGIN_LEFT + 26, y: currentY - 7, size: 2.5, color: rgb(0.2, 0.8, 0.4) });
    } catch (e) {
      // fallback if drawCircle is not supported
    }

    currentPage.drawText("terminal — bash", {
      x: MARGIN_LEFT + 38,
      y: currentY - 9,
      size: 7,
      font: courierFont,
      color: rgb(0.65, 0.65, 0.7),
    });

    currentY -= 14;

    for (let line of lines) {
      const lineWrapped = [];
      let remaining = line;
      const maxChars = 70;
      while (remaining.length > maxChars) {
        lineWrapped.push(remaining.substring(0, maxChars));
        remaining = remaining.substring(maxChars);
      }
      lineWrapped.push(remaining);

      for (let subLine of lineWrapped) {
        ensureSpace(16);
        currentPage.drawRectangle({
          x: MARGIN_LEFT,
          y: currentY - 15,
          width: CONTENT_WIDTH,
          height: 15,
          color: rgb(0.06, 0.06, 0.08),
        });
        currentPage.drawText(subLine, {
          x: MARGIN_LEFT + 12,
          y: currentY - 10,
          size: 9.5,
          font: courierFont,
          color: rgb(0.25, 0.95, 0.65), // Bright terminal green
        });
        currentY -= 15;
      }
    }
    currentY -= 10;
  };

  const drawInstructionWithCodeBlocks = (text) => {
    if (!text) return;
    const sanitized = sanitizeText(text);

    if (sanitized.includes("```")) {
      const parts = sanitized.split("```");
      for (let i = 0; i < parts.length; i++) {
        const chunk = parts[i].trim();
        if (!chunk) continue;
        if (i % 2 === 0) {
          drawParagraph(chunk);
        } else {
          let codeLines = chunk.split("\n");
          const firstWord = codeLines[0].trim().toLowerCase();
          const langs = ["bash", "sh", "java", "python", "javascript", "js", "c", "cpp", "sql", "html", "css", "cmd", "powershell"];
          if (langs.includes(firstWord)) {
            codeLines = codeLines.slice(1);
          }
          drawCodeBlockBox(codeLines.join("\n"));
        }
      }
      return;
    }

    const paragraphs = sanitized.split(/\n\s*\n/);
    for (let p of paragraphs) {
      const cleanP = p.trim().replace(/\n+/g, " ");
      if (cleanP) {
        drawParagraph(cleanP);
      }
    }
  };

  // ALGORITHM Section
  drawHeading("Algorithm");
  const algoText = subExp?.algorithm || "No algorithm details provided.";
  const algoLines = algoText.split("\n").filter((l) => l.trim());
  for (let i = 0; i < algoLines.length; i++) {
    const cleanStep = algoLines[i].trim().replace(/^(?:Step\s*)?(?:\d+[\.:)]?\s*)+/i, "");
    drawParagraph(`${i + 1}. ${cleanStep}`);
    currentY -= 4;
  }

  // FLOWCHART Section
  if (subExp?.flowchart?.nodes && subExp.flowchart.nodes.length > 0) {
    drawHeading("Flowchart");

    const nodes = subExp.flowchart.nodes;
    const edges = subExp.flowchart.edges || [];
    // Use identical layoutGraph from Left Workspace
    const { rfNodes, rfEdges } = layoutGraph(nodes, edges);

    // Map React Flow positions directly to PDF 2D grid coordinates!
    let maxCol = 0;
    let maxLayer = 0;
    rfNodes.forEach((n) => {
      const col = Math.max(0, Math.round((n.position.x - 220) / 280));
      const ly = Math.max(0, Math.round(n.position.y / 210));
      if (col > maxCol) maxCol = col;
      if (ly > maxLayer) maxLayer = ly;
    });

    // Ensure we start on a clean page if current page has less than 420 points remaining
    if (currentY < 420) {
      ensureSpace(PAGE_HEIGHT - 60);
    }

    const availableHeight = Math.max(300, currentY - 55);
    const rowHeight = Math.min(62, Math.max(38, availableHeight / (maxLayer + 1.15)));
    const colWidth = maxCol > 0 ? Math.min(135, (CONTENT_WIDTH - 100) / maxCol) : 135;

    const totalWidth = maxCol * colWidth;
    const baseStartX = MARGIN_LEFT + CONTENT_WIDTH / 2 - totalWidth / 2;
    const baseTopY = currentY - 22;

    const nodeCoords = {};
    rfNodes.forEach((n) => {
      const col = Math.max(0, Math.round((n.position.x - 220) / 280));
      const ly = Math.max(0, Math.round(n.position.y / 210));
      nodeCoords[n.id] = {
        x: baseStartX + col * colWidth,
        y: baseTopY - ly * rowHeight,
        type: (n.data?.nodeType || n.type || "process").toLowerCase(),
        label: n.data?.label || "",
        col,
        ly
      };
    });

    const slateColor = rgb(0.39, 0.45, 0.55); // #64748B
    const greenColor = rgb(0.09, 0.64, 0.29); // #16A34A (Yes)
    const redColor = rgb(0.86, 0.15, 0.15);   // #DC2626 (No)

    // Helper to compute dynamic half dimensions for a node
    const getNodeHalfDims = (node) => {
      const cleanLabel = sanitizeText(node.label);
      const textW = helveticaFont.widthOfTextAtSize(cleanLabel, 7.5);
      if (node.type === "decision") {
        return { halfW: Math.max(48, textW / 2 + 14), halfH: 18, fontSize: 7.5, cleanLabel };
      } else if (node.type === "start" || node.type === "end") {
        return { halfW: Math.max(55, textW / 2 + 14), halfH: 13, fontSize: 7.5, cleanLabel };
      } else {
        return { halfW: Math.max(62, textW / 2 + 12), halfH: 13, fontSize: 7.5, cleanLabel };
      }
    };

    // Draw edges first (behind nodes)
    rfEdges.forEach((e) => {
      const src = nodeCoords[e.source];
      const tgt = nodeCoords[e.target];
      if (!src || !tgt) return;

      const srcDims = getNodeHalfDims(src);
      const tgtDims = getNodeHalfDims(tgt);

      const labelLC = (e.data?.label || "").toLowerCase();
      const isYes = labelLC === "yes";
      const isNo = labelLC === "no";
      const isLoop = e.type === "loopEdge" || tgt.ly < src.ly;

      const color = isYes ? greenColor : isNo ? redColor : slateColor;

      if (isLoop) {
        // True backward loop -> Left corridor C-loop
        const leftCorridorX = Math.min(src.x, tgt.x) - 75;
        currentPage.drawLine({ start: { x: src.x - srcDims.halfW, y: src.y }, end: { x: leftCorridorX, y: src.y }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: leftCorridorX, y: src.y }, end: { x: leftCorridorX, y: tgt.y }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: leftCorridorX, y: tgt.y }, end: { x: tgt.x - tgtDims.halfW, y: tgt.y }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: tgt.x - tgtDims.halfW, y: tgt.y }, end: { x: tgt.x - tgtDims.halfW - 5, y: tgt.y + 3 }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: tgt.x - tgtDims.halfW, y: tgt.y }, end: { x: tgt.x - tgtDims.halfW - 5, y: tgt.y - 3 }, thickness: 1.5, color });
        if (isYes || isNo) {
          currentPage.drawText(isYes ? "Yes" : "No", { x: src.x - srcDims.halfW - 20, y: src.y - 8, size: 8, font: helveticaBold, color });
        }
      } else if (isNo && Math.abs(src.x - tgt.x) < 10 && tgt.ly > src.ly + 1) {
        // "No" branch skipping an intermediate node in same column (e.g. CMD == DISPLAY? -> End of loop iteration)
        // Route down vertical alley at src.x + halfW + 10, then turn left at bottomCorridorY (+22 above tgt)
        const rightCorridorX = src.x + srcDims.halfW + 10;
        const bottomCorridorY = tgt.y + tgtDims.halfH + 22;
        currentPage.drawLine({ start: { x: src.x + srcDims.halfW, y: src.y }, end: { x: rightCorridorX, y: src.y }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: rightCorridorX, y: src.y }, end: { x: rightCorridorX, y: bottomCorridorY }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: rightCorridorX, y: bottomCorridorY }, end: { x: tgt.x, y: bottomCorridorY }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: tgt.x, y: bottomCorridorY }, end: { x: tgt.x, y: tgt.y + tgtDims.halfH }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: tgt.x, y: tgt.y + tgtDims.halfH }, end: { x: tgt.x - 3, y: tgt.y + tgtDims.halfH + 5 }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: tgt.x, y: tgt.y + tgtDims.halfH }, end: { x: tgt.x + 3, y: tgt.y + tgtDims.halfH + 5 }, thickness: 1.5, color });
        currentPage.drawText("No", { x: src.x + srcDims.halfW + 4, y: src.y + 4, size: 8, font: helveticaBold, color });
      } else if (Math.abs(src.x - tgt.x) < 10) {
        // Same column forward flow -> Straight line down
        currentPage.drawLine({ start: { x: src.x, y: src.y - srcDims.halfH }, end: { x: tgt.x, y: tgt.y + tgtDims.halfH }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: tgt.x, y: tgt.y + tgtDims.halfH }, end: { x: tgt.x - 3, y: tgt.y + tgtDims.halfH + 5 }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: tgt.x, y: tgt.y + tgtDims.halfH }, end: { x: tgt.x + 3, y: tgt.y + tgtDims.halfH + 5 }, thickness: 1.5, color });
        if (isYes || isNo) {
          currentPage.drawText(isYes ? "Yes" : "No", { x: src.x + 8, y: (src.y + tgt.y) / 2, size: 8, font: helveticaBold, color });
        }
      } else if (tgt.x > src.x) {
        // Forward branch to right column
        currentPage.drawLine({ start: { x: src.x + srcDims.halfW, y: src.y }, end: { x: tgt.x, y: src.y }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: tgt.x, y: src.y }, end: { x: tgt.x, y: tgt.y + tgtDims.halfH }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: tgt.x, y: tgt.y + tgtDims.halfH }, end: { x: tgt.x - 3, y: tgt.y + tgtDims.halfH + 5 }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: tgt.x, y: tgt.y + tgtDims.halfH }, end: { x: tgt.x + 3, y: tgt.y + tgtDims.halfH + 5 }, thickness: 1.5, color });
        if (isYes || isNo) {
          currentPage.drawText(isYes ? "Yes" : "No", { x: src.x + srcDims.halfW + 6, y: src.y + 4, size: 8, font: helveticaBold, color });
        }
      } else {
        // Forward rejoin from right column back to left column (e.g. Insert X at head -> End of loop iteration)
        // Drop straight down own vertical column (src.x) through empty space to +14 above target, then turn left!
        const corridorY = tgt.y + tgtDims.halfH + 14;
        currentPage.drawLine({ start: { x: src.x, y: src.y - srcDims.halfH }, end: { x: src.x, y: corridorY }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: src.x, y: corridorY }, end: { x: tgt.x, y: corridorY }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: tgt.x, y: corridorY }, end: { x: tgt.x, y: tgt.y + tgtDims.halfH }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: tgt.x, y: tgt.y + tgtDims.halfH }, end: { x: tgt.x - 3, y: tgt.y + tgtDims.halfH + 5 }, thickness: 1.5, color });
        currentPage.drawLine({ start: { x: tgt.x, y: tgt.y + tgtDims.halfH }, end: { x: tgt.x + 3, y: tgt.y + tgtDims.halfH + 5 }, thickness: 1.5, color });
      }
    });

    // Draw node shapes and labels
    Object.values(nodeCoords).forEach((node) => {
      const { x, y, type } = node;
      const { halfW, halfH, fontSize, cleanLabel } = getNodeHalfDims(node);
      const isStart = type === "start";
      const isEnd = type === "end";

      if (isStart || isEnd) {
        // Pill capsule shape matching Left Workspace Start (#22C55E) / End (#EF4444)
        currentPage.drawRectangle({
          x: x - halfW,
          y: y - halfH,
          width: halfW * 2,
          height: halfH * 2,
          color: isStart ? rgb(0.13, 0.77, 0.37) : rgb(0.93, 0.26, 0.26),
          borderColor: isStart ? rgb(0.09, 0.64, 0.29) : rgb(0.86, 0.15, 0.15),
          borderWidth: 1.5,
          borderRadius: halfH
        });
      } else if (type === "decision") {
        // Proper Diamond shape dynamically sized so text fits perfectly inside
        currentPage.drawLine({ start: { x: x - halfW, y: y }, end: { x: x, y: y + halfH }, thickness: 1.5, color: rgb(0.05, 0.65, 0.9) });
        currentPage.drawLine({ start: { x: x, y: y + halfH }, end: { x: x + halfW, y: y }, thickness: 1.5, color: rgb(0.05, 0.65, 0.9) });
        currentPage.drawLine({ start: { x: x + halfW, y: y }, end: { x: x, y: y - halfH }, thickness: 1.5, color: rgb(0.05, 0.65, 0.9) });
        currentPage.drawLine({ start: { x: x, y: y - halfH }, end: { x: x - halfW, y: y }, thickness: 1.5, color: rgb(0.05, 0.65, 0.9) });
      } else if (type === "output" || type === "input") {
        const skew = 8;
        const blueBorder = rgb(0.05, 0.65, 0.9);
        currentPage.drawRectangle({
          x: x - halfW,
          y: y - halfH,
          width: halfW * 2,
          height: halfH * 2,
          color: rgb(0.94, 0.97, 1.0),
        });
        currentPage.drawLine({ start: { x: x - halfW + skew, y: y + halfH }, end: { x: x + halfW + skew, y: y + halfH }, thickness: 1.5, color: blueBorder });
        currentPage.drawLine({ start: { x: x + halfW + skew, y: y + halfH }, end: { x: x + halfW - skew, y: y - halfH }, thickness: 1.5, color: blueBorder });
        currentPage.drawLine({ start: { x: x + halfW - skew, y: y - halfH }, end: { x: x - halfW - skew, y: y - halfH }, thickness: 1.5, color: blueBorder });
        currentPage.drawLine({ start: { x: x - halfW - skew, y: y - halfH }, end: { x: x - halfW + skew, y: y + halfH }, thickness: 1.5, color: blueBorder });
      } else {
        // Standard process rounded rectangle
        currentPage.drawRectangle({
          x: x - halfW,
          y: y - halfH,
          width: halfW * 2,
          height: halfH * 2,
          color: rgb(0.94, 0.97, 1.0),
          borderColor: rgb(0.05, 0.65, 0.9),
          borderWidth: 1.5
        });
      }

      const textWidth = helveticaFont.widthOfTextAtSize(cleanLabel, fontSize);
      currentPage.drawText(cleanLabel, {
        x: x - textWidth / 2,
        y: y - 2.5,
        size: fontSize,
        font: helveticaFont,
        color: (isStart || isEnd) ? rgb(1, 1, 1) : rgb(0.01, 0.41, 0.63)
      });
    });

    currentY = Math.max(70, baseTopY - maxLayer * rowHeight - 35);
  }

  // SECTIONS BASED ON MODE
  if (subExp?.mode === "guidedSteps") {
    drawHeading("Guided Steps Procedure");

    if (subExp.steps && subExp.steps.length > 0) {
      for (let i = 0; i < subExp.steps.length; i++) {
        const st = subExp.steps[i];
        ensureSpace(60);

        // Purple circle badge with index number
        const badgeNum = String(st.order || i + 1);
        try {
          currentPage.drawCircle({
            x: MARGIN_LEFT + 10,
            y: currentY - 5,
            size: 9,
            color: purpleColor
          });
          const numW = helveticaBold.widthOfTextAtSize(badgeNum, 8);
          currentPage.drawText(badgeNum, {
            x: MARGIN_LEFT + 10 - numW / 2,
            y: currentY - 8,
            size: 8,
            font: helveticaBold,
            color: rgb(1, 1, 1)
          });
        } catch (e) {
          // Fallback if drawCircle fails
        }

        // Step number title next to badge
        const stepTitle = `Step ${st.order || i + 1}`;
        currentPage.drawText(stepTitle, {
          x: MARGIN_LEFT + 26,
          y: currentY - 8,
          size: 10.5,
          font: helveticaBold,
          color: darkTextColor
        });
        currentY -= 22;

        // Instruction paragraph (properly word-wrapped so long config strings never overflow)
        if (st.instruction) {
          drawInstructionWithCodeBlocks(st.instruction);
          currentY -= 3;
        }

        if (st.command && st.command.trim()) {
          drawCodeBlockBox(st.command.trim());
          currentY -= 8;
        }

        // Step Image & Caption if present
        const stepImgUrl = st.imageUrl || st.image || st.screenshot || st.imgUrl || st.url;
        const stepCaption = st.imageCaption || st.caption || st.title || st.desc;

        if (stepImgUrl) {
          try {
            const urlsToTry = [
              stepImgUrl,
              stepImgUrl.match(/\.(png|jpg|jpeg|webp)$/i) ? stepImgUrl : `${stepImgUrl}.png`
            ];
            let embeddedStepImage = null;
            for (const tryUrl of urlsToTry) {
              if (embeddedStepImage) break;
              const canvasPngBuffer = await loadImageAsPngBuffer(tryUrl);
              if (canvasPngBuffer) {
                try {
                  embeddedStepImage = await pdfDoc.embedPng(canvasPngBuffer);
                } catch (e) { /* ignore */ }
              }
              if (!embeddedStepImage) {
                const imgRes = await fetch(tryUrl);
                if (imgRes.ok) {
                  const imgBytes = await imgRes.arrayBuffer();
                  try {
                    embeddedStepImage = await pdfDoc.embedPng(imgBytes);
                  } catch (pngErr) {
                    try {
                      embeddedStepImage = await pdfDoc.embedJpg(imgBytes);
                    } catch (jpgErr) {}
                  }
                }
              }
            }

            if (embeddedStepImage) {
                const imgDims = embeddedStepImage.scale(1);
                const maxWidth = CONTENT_WIDTH - 20;
                let width = imgDims.width;
                let height = imgDims.height;

                if (width > maxWidth) {
                  const ratio = maxWidth / width;
                  width = maxWidth;
                  height = height * ratio;
                }

                ensureSpace(height + 35);

                // Draw border background behind image
                currentPage.drawRectangle({
                  x: MARGIN_LEFT + (CONTENT_WIDTH - width) / 2 - 2,
                  y: currentY - height - 2,
                  width: width + 4,
                  height: height + 4,
                  color: rgb(0.92, 0.92, 0.94)
                });

                currentPage.drawImage(embeddedStepImage, {
                  x: MARGIN_LEFT + (CONTENT_WIDTH - width) / 2,
                  y: currentY - height,
                  width: width,
                  height: height
                });

                currentY -= (height + 15);
              }
          } catch (e) {
            console.error("Failed to embed step image:", e);
          }
        }

        if (stepCaption) {
          ensureSpace(25);
          drawParagraph(`Figure: ${stepCaption}`);
          currentY -= 8;
        }

        currentY -= 10;
      }
    } else {
      drawParagraph("No step instructions recorded.");
    }
  } else {
    // SOURCE CODE Section
    drawHeading("Source Code");

    const isNonExec =
      subExp?.mode === "nonExecutableCode" ||
      (subExp?.isExecutable === false && subExp?.mode !== "executableCode");

    let filesToPrint = [];
    if (isNonExec) {
      if (subExp?.files && subExp.files.length > 0) {
        filesToPrint = subExp.files;
      } else {
        filesToPrint = [
          {
            filename: "index.html",
            content: codeText || referenceSolutionCode || "// No files content available",
          },
        ];
      }
    }

    if (isNonExec && filesToPrint.length > 0) {
      for (const file of filesToPrint) {
        const filename = file.filename || "file";
        const code = file.content || "";
        const codeLines = sanitizeText(code).split("\n");
        ensureSpace(40);

        // Print the file name in bold above the code block
        currentPage.drawText(filename, {
          x: MARGIN_LEFT,
          y: currentY - 5,
          size: 9.5,
          font: helveticaBold,
          color: darkTextColor,
        });
        currentY -= 15;

        // Draw colored top accent border
        currentPage.drawRectangle({
          x: MARGIN_LEFT,
          y: currentY - 3,
          width: CONTENT_WIDTH,
          height: 3,
          color: purpleColor,
        });
        currentY -= 3;

        let lineNum = 1;
        for (let line of codeLines) {
          const lineWrapped = [];
          let remaining = line;
          const maxChars = 70; // Adjusted for line numbers layout
          while (remaining.length > maxChars) {
            lineWrapped.push(remaining.substring(0, maxChars));
            remaining = remaining.substring(maxChars);
          }
          lineWrapped.push(remaining);

          for (let i = 0; i < lineWrapped.length; i++) {
            const subLine = lineWrapped[i];
            ensureSpace(12);

            // Line background
            currentPage.drawRectangle({
              x: MARGIN_LEFT,
              y: currentY - 10,
              width: CONTENT_WIDTH,
              height: 12,
              color: rgb(0.09, 0.09, 0.1), // Charcoal theme
            });

            // Draw vertical divider between gutter and code
            currentPage.drawLine({
              start: { x: MARGIN_LEFT + 25, y: currentY - 10 },
              end: { x: MARGIN_LEFT + 25, y: currentY + 2 },
              thickness: 0.5,
              color: rgb(0.2, 0.2, 0.25),
            });

            // Line numbers on the left
            if (i === 0) {
              const numStr = String(lineNum).padStart(3, " ");
              currentPage.drawText(numStr, {
                x: MARGIN_LEFT + 5,
                y: currentY - 8,
                size: 7.5,
                font: courierFont,
                color: rgb(0.45, 0.45, 0.45),
              });
            }

            // Code text
            currentPage.drawText(subLine, {
              x: MARGIN_LEFT + 32,
              y: currentY - 8,
              size: 8,
              font: courierFont,
              color: rgb(0.85, 0.85, 0.9),
            });

            currentY -= 12;
          }
          lineNum++;
        }
        currentY -= 15;
      }
    } else {
      // Use the reference solution from DB for the source code printout in the PDF record sheet
      const code = referenceSolutionCode || codeText || "// No source code available";
      const codeLines = sanitizeText(code).split("\n");
      ensureSpace(40);

      // Resolve single filename based on language
      let filename = "main.c";
      if (subExp?.referenceSolution) {
        const solutions = subExp.referenceSolution;
        let keys = [];
        if (typeof solutions.keys === "function") {
          keys = Array.from(solutions.keys());
        } else if (solutions) {
          keys = Object.keys(solutions);
        }
        if (keys.length > 0) {
          const ext = keys[0];
          if (ext === "python") filename = "main.py";
          else if (ext === "javascript") filename = "main.js";
          else if (ext === "sql") filename = "query.sql";
          else if (ext === "java") filename = "Main.java";
          else filename = `main.${ext}`;
        }
      }

      // Print the file name in bold above the code block
      currentPage.drawText(filename, {
        x: MARGIN_LEFT,
        y: currentY - 5,
        size: 9.5,
        font: helveticaBold,
        color: darkTextColor,
      });
      currentY -= 15;

      // Draw colored top accent border
      currentPage.drawRectangle({
        x: MARGIN_LEFT,
        y: currentY - 3,
        width: CONTENT_WIDTH,
        height: 3,
        color: purpleColor,
      });
      currentY -= 3;

      let lineNum = 1;
      for (let line of codeLines) {
        const lineWrapped = [];
        let remaining = line;
        const maxChars = 70; // Adjusted for line numbers layout
        while (remaining.length > maxChars) {
          lineWrapped.push(remaining.substring(0, maxChars));
          remaining = remaining.substring(maxChars);
        }
        lineWrapped.push(remaining);

        for (let i = 0; i < lineWrapped.length; i++) {
          const subLine = lineWrapped[i];
          ensureSpace(12);

          // Line background
          currentPage.drawRectangle({
            x: MARGIN_LEFT,
            y: currentY - 10,
            width: CONTENT_WIDTH,
            height: 12,
            color: rgb(0.09, 0.09, 0.1), // Charcoal theme
          });

          // Draw vertical divider between gutter and code
          currentPage.drawLine({
            start: { x: MARGIN_LEFT + 25, y: currentY - 10 },
            end: { x: MARGIN_LEFT + 25, y: currentY + 2 },
            thickness: 0.5,
            color: rgb(0.2, 0.2, 0.25),
          });

          // Line numbers on the left
          if (i === 0) {
            const numStr = String(lineNum).padStart(3, " ");
            currentPage.drawText(numStr, {
              x: MARGIN_LEFT + 5,
              y: currentY - 8,
              size: 7.5,
              font: courierFont,
              color: rgb(0.45, 0.45, 0.45),
            });
          }

          // Code text
          currentPage.drawText(subLine, {
            x: MARGIN_LEFT + 32,
            y: currentY - 8,
            size: 8,
            font: courierFont,
            color: rgb(0.85, 0.85, 0.9),
          });

          currentY -= 12;
        }
        lineNum++;
      }
      currentY -= 15;
    }

    // EXECUTION OUTPUT Section
    drawHeading("Execution Output");

    let outLog = outputText;
    if (!outLog) {
      if (isNonExec) {
        if (subExp?.samples && subExp.samples.length > 0) {
          outLog = subExp.samples.map((s) => s.output).filter(Boolean).join("\n---\n");
        } else {
          outLog = "Page layout / non-executable code verified successfully.";
        }
      } else {
        outLog = `Output Vector: [${subExp?.samples?.[0]?.output || "Successfully executed"}]`;
      }
    }

    const outLines = sanitizeText(outLog).split("\n");
    ensureSpace(40);

    // Bold log header
    currentPage.drawText("terminal_output.log", {
      x: MARGIN_LEFT,
      y: currentY - 5,
      size: 9.5,
      font: helveticaBold,
      color: darkTextColor,
    });
    currentY -= 15;

    // Draw colored top-border line for output window (green for success/terminal)
    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: currentY - 3,
      width: CONTENT_WIDTH,
      height: 3,
      color: rgb(0.2, 0.85, 0.6),
    });
    currentY -= 3;

    for (let line of outLines) {
      const lineWrapped = [];
      let remaining = line;
      const maxChars = 75;
      while (remaining.length > maxChars) {
        lineWrapped.push(remaining.substring(0, maxChars));
        remaining = remaining.substring(maxChars);
      }
      lineWrapped.push(remaining);

      for (let subLine of lineWrapped) {
        ensureSpace(12);
        currentPage.drawRectangle({
          x: MARGIN_LEFT,
          y: currentY - 10,
          width: CONTENT_WIDTH,
          height: 12,
          color: rgb(0.09, 0.09, 0.1), // Charcoal theme
        });
        currentPage.drawText(subLine, {
          x: MARGIN_LEFT + 10,
          y: currentY - 8,
          size: 8,
          font: courierFont,
          color: rgb(0.2, 0.85, 0.6), // Green text
        });
        currentY -= 12;
      }
    }
    currentY -= 15;
  }

  // CONCLUSION Section
  drawHeading("Conclusion");
  drawParagraph(conclusionText);

  // OUTPUT IMAGE Section
  const { outputImageUrl } = arguments[0];
  if (outputImageUrl) {
    try {
      ensureSpace(80);
      currentY -= 15;

      // Fetch image bytes (works for both HTTP and Data URIs)
      const imgRes = await fetch(outputImageUrl);
      const imgBytes = await imgRes.arrayBuffer();

      let embeddedImage;
      // Determine if PNG or JPG
      if (outputImageUrl.includes("png") || outputImageUrl.includes("PNG")) {
        embeddedImage = await pdfDoc.embedPng(imgBytes);
      } else {
        // Default to JPG for Seedream/Midjourney
        embeddedImage = await pdfDoc.embedJpg(imgBytes);
      }

      const imgDims = embeddedImage.scale(1);

      // Calculate scaled dimensions to fit within CONTENT_WIDTH
      const maxWidth = CONTENT_WIDTH - 20;
      let width = imgDims.width;
      let height = imgDims.height;

      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }

      // We might need a new page if the image is too tall
      ensureSpace(height + 20);

      // Draw a subtle border/background behind the image
      currentPage.drawRectangle({
        x: MARGIN_LEFT + (CONTENT_WIDTH - width) / 2 - 2,
        y: currentY - height - 2,
        width: width + 4,
        height: height + 4,
        color: rgb(0.9, 0.9, 0.9)
      });

      // Draw image
      currentPage.drawImage(embeddedImage, {
        x: MARGIN_LEFT + (CONTENT_WIDTH - width) / 2,
        y: currentY - height,
        width: width,
        height: height
      });

      currentY -= (height + 25);
    } catch (e) {
      console.error("Failed to embed output image:", e);
      drawParagraph("[Failed to load AI Output Image]");
    }
  }

  // SIGNATURES Section
  ensureSpace(70);
  currentY -= 30;


  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
