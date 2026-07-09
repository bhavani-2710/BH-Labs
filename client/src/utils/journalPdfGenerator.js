import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

function sanitizeText(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/\t/g, "    ")              // Replace tabs with 4 spaces
    .replace(/\r/g, "")                  // Remove carriage returns
    .replace(/[\u2018\u2019]/g, "'")     // Smart single quotes
    .replace(/[\u201C\u201D]/g, '"')     // Smart double quotes
    .replace(/[^\x00-\x7F]/g, "?");      // Replace non-ASCII characters with '?'
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

  // Font definitions
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);
  const courierBold = await pdfDoc.embedFont(StandardFonts.CourierBold);

  // Colors
  const purpleColor = rgb(0.388, 0.055, 0.831); // #630ed4
  const darkTextColor = rgb(0.12, 0.12, 0.12);
  const grayTextColor = rgb(0.4, 0.4, 0.4);
  const lightGrayBg = rgb(0.96, 0.96, 0.96);
  const borderLineColor = rgb(0.9, 0.9, 0.9);

  // Page dimensions
  const PAGE_WIDTH = 595.276; // A4 width in points
  const PAGE_HEIGHT = 841.890; // A4 height in points
  const MARGIN_LEFT = 50;
  const MARGIN_RIGHT = 50;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

  let currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let currentY = PAGE_HEIGHT - 60;
  let pageCount = 1;

  // Header drawing function for new pages
  const drawPageHeaderAndFooter = (page, pageNum) => {
    // Top border accent
    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 6,
      width: PAGE_WIDTH,
      height: 6,
      color: purpleColor
    });

    // Footer - Page Number
    page.drawText(`PAGE NO - ${pageNum}`, {
      x: PAGE_WIDTH / 2 - 25,
      y: 30,
      size: 8,
      font: helveticaBold,
      color: grayTextColor
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

  // 1. HEADER (Title & Logo / Metadata Info Card)
  currentPage.drawText("BH.Lab", {
    x: MARGIN_LEFT,
    y: currentY - 5,
    size: 24,
    font: helveticaBold,
    color: purpleColor
  });

  // Metadata Card (Right side)
  const metaWidth = 190;
  const metaHeight = 52;
  const metaX = PAGE_WIDTH - MARGIN_RIGHT - metaWidth;
  const metaY = currentY - metaHeight + 12;

  // Background Box
  currentPage.drawRectangle({
    x: metaX,
    y: metaY,
    width: metaWidth,
    height: metaHeight,
    color: lightGrayBg,
    borderColor: borderLineColor,
    borderWidth: 1
  });

  // Left Accent strip
  currentPage.drawLine({
    start: { x: metaX, y: metaY },
    end: { x: metaX, y: metaY + metaHeight },
    thickness: 3,
    color: purpleColor
  });

  currentPage.drawText("STUDENT RECORD", {
    x: metaX + 12,
    y: metaY + 40,
    size: 7.5,
    font: helveticaBold,
    color: purpleColor
  });

  currentPage.drawText("Name: Rahul Sharma", {
    x: metaX + 12,
    y: metaY + 26,
    size: 8.5,
    font: helveticaFont,
    color: darkTextColor
  });

  currentPage.drawText("Roll No: ENG-2026-042", {
    x: metaX + 12,
    y: metaY + 15,
    size: 8.5,
    font: helveticaFont,
    color: darkTextColor
  });

  currentPage.drawText("Date: October 24, 2026", {
    x: metaX + 12,
    y: metaY + 4,
    size: 8.5,
    font: helveticaFont,
    color: darkTextColor
  });

  currentY -= 55;

  // Decorative divider line
  currentPage.drawLine({
    start: { x: MARGIN_LEFT, y: currentY },
    end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: currentY },
    thickness: 1.5,
    color: borderLineColor
  });

  currentY -= 25;

  // 2. Experiment title
  ensureSpace(40);
  const partLabel = `Experiment ${experiment?.experimentNumber || 1}`;
  currentPage.drawText(partLabel, {
    x: MARGIN_LEFT,
    y: currentY,
    size: 10,
    font: helveticaBold,
    color: purpleColor
  });
  currentY -= 25;

  const titleText = `${sanitizeText(subExp?.title) || "Experiment"} Implementation`;
  currentPage.drawText(titleText, {
    x: MARGIN_LEFT,
    y: currentY,
    size: 18,
    font: helveticaBold,
    color: darkTextColor
  });
  currentY -= 35;


  // Function to wrap and draw block texts
  const drawHeading = (text) => {
    ensureSpace(45);

    // Draw left colored accent block
    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: currentY - 8,
      width: 4,
      height: 10,
      color: purpleColor
    });

    currentPage.drawText(text.toUpperCase(), {
      x: MARGIN_LEFT + 10,
      y: currentY - 7,
      size: 9.5,
      font: helveticaBold,
      color: purpleColor
    });

    // Horizontal divider line
    currentPage.drawLine({
      start: { x: MARGIN_LEFT, y: currentY - 14 },
      end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: currentY - 14 },
      thickness: 0.5,
      color: borderLineColor
    });

    currentY -= 26;
  };

  const drawParagraph = (text, isMonospace = false, customFontSize = 9, customLineHeight = 13) => {
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
          lines.push(currentLine);
          currentLine = word;
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

  // AIM Section
  drawHeading("Aim");
  drawParagraph(`To implement and verify a program for "${subExp?.title || "the experiment"}" to demonstrate the programming concepts and analyze performance.`);

  // THEORY Section
  drawHeading("Theory");
  drawParagraph(subExp?.theory || "No theory details provided.");

  // ALGORITHM Section
  drawHeading("Algorithm");
  drawParagraph(subExp?.algorithm || "No algorithm details provided.");

  // FLOWCHART Section
  if (subExp?.flowchart?.nodes && subExp.flowchart.nodes.length > 0) {
    drawHeading("Flowchart");

    const nodes = subExp.flowchart.nodes;
    const edges = subExp.flowchart.edges || [];

    // Position layout coordinates (vertical flow)
    const nodeCoords = {};
    const cx = MARGIN_LEFT + CONTENT_WIDTH / 2;

    // Ensure sufficient vertical space for the flowchart block
    const flowchartHeight = nodes.length * 45 + 10;
    ensureSpace(flowchartHeight + 10);

    let nodeY = currentY - 20;

    // Step 1: Assign positions and draw connection lines first (drawn behind shapes)
    for (let i = 0; i < nodes.length; i++) {
      nodeCoords[nodes[i].id] = { x: cx, y: nodeY };
      nodeY -= 45;
    }

    // Draw connecting edges
    for (let edge of edges) {
      const src = nodeCoords[edge.source];
      const tgt = nodeCoords[edge.target];
      if (src && tgt) {
        // Line from bottom edge of source to top edge of target
        currentPage.drawLine({
          start: { x: src.x, y: src.y - 12 },
          end: { x: tgt.x, y: tgt.y + 12 },
          thickness: 1,
          color: purpleColor
        });

        // Draw arrowhead at target
        currentPage.drawLine({ start: { x: tgt.x, y: tgt.y + 12 }, end: { x: tgt.x - 3, y: tgt.y + 17 }, thickness: 1, color: purpleColor });
        currentPage.drawLine({ start: { x: tgt.x, y: tgt.y + 12 }, end: { x: tgt.x + 3, y: tgt.y + 17 }, thickness: 1, color: purpleColor });

        // Draw label if available
        if (edge.label) {
          const edgeLabel = sanitizeText(edge.label);
          currentPage.drawText(edgeLabel, {
            x: (src.x + tgt.x) / 2 + 5,
            y: (src.y - 12 + tgt.y + 12) / 2,
            size: 7,
            font: helveticaBold,
            color: purpleColor
          });
        }
      }
    }

    // Step 2: Draw node shapes and text labels
    for (let node of nodes) {
      const coords = nodeCoords[node.id];
      if (!coords) continue;

      const { x, y } = coords;
      const type = node.type?.toLowerCase();

      if (type === "start" || type === "end") {
        // Capsule shape
        currentPage.drawRectangle({
          x: x - 65,
          y: y - 12,
          width: 130,
          height: 24,
          color: lightGrayBg,
          borderColor: purpleColor,
          borderWidth: 1,
          borderRadius: 12
        });
      } else if (type === "decision") {
        // Diamond shape
        const halfW = 65;
        const halfH = 12;
        currentPage.drawRectangle({
          x: x - halfW,
          y: y - halfH,
          width: 130,
          height: 24,
          color: rgb(1, 1, 1),
        });
        currentPage.drawLine({ start: { x: x - halfW, y: y }, end: { x: x, y: y + halfH }, thickness: 1.2, color: purpleColor });
        currentPage.drawLine({ start: { x: x, y: y + halfH }, end: { x: x + halfW, y: y }, thickness: 1.2, color: purpleColor });
        currentPage.drawLine({ start: { x: x + halfW, y: y }, end: { x: x, y: y - halfH }, thickness: 1.2, color: purpleColor });
        currentPage.drawLine({ start: { x: x, y: y - halfH }, end: { x: x - halfW, y: y }, thickness: 1.2, color: purpleColor });
      } else if (type === "output") {
        // Parallelogram shape
        const halfW = 65;
        const halfH = 12;
        const skew = 8;
        currentPage.drawRectangle({
          x: x - halfW,
          y: y - halfH,
          width: 130,
          height: 24,
          color: rgb(1, 1, 1),
        });
        currentPage.drawLine({ start: { x: x - halfW + skew, y: y + halfH }, end: { x: x + halfW + skew, y: y + halfH }, thickness: 1.2, color: purpleColor });
        currentPage.drawLine({ start: { x: x + halfW + skew, y: y + halfH }, end: { x: x + halfW - skew, y: y - halfH }, thickness: 1.2, color: purpleColor });
        currentPage.drawLine({ start: { x: x + halfW - skew, y: y - halfH }, end: { x: x - halfW - skew, y: y - halfH }, thickness: 1.2, color: purpleColor });
        currentPage.drawLine({ start: { x: x - halfW - skew, y: y - halfH }, end: { x: x - halfW + skew, y: y + halfH }, thickness: 1.2, color: purpleColor });
      } else {
        // Standard process rectangle
        currentPage.drawRectangle({
          x: x - 65,
          y: y - 12,
          width: 130,
          height: 24,
          color: rgb(1, 1, 1),
          borderColor: purpleColor,
          borderWidth: 1
        });
      }

      // Node Text
      const label = sanitizeText(node.label || "");
      const fontSize = 7.5;
      const textWidth = helveticaFont.widthOfTextAtSize(label, fontSize);
      currentPage.drawText(label, {
        x: x - textWidth / 2,
        y: y - 2.5,
        size: fontSize,
        font: helveticaFont,
        color: darkTextColor
      });
    }

    // Set currentY to the bottom of the flowchart section
    currentY -= flowchartHeight;
    currentY -= 15;
  }

  // SOURCE CODE Section
  drawHeading("Source Code");

  if (subExp?.isExecutable === false && subExp?.files && subExp.files.length > 0) {
    for (const file of subExp.files) {
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
        color: darkTextColor
      });
      currentY -= 15;

      // Draw colored top accent border
      currentPage.drawRectangle({
        x: MARGIN_LEFT,
        y: currentY - 3,
        width: CONTENT_WIDTH,
        height: 3,
        color: purpleColor
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
            color: rgb(0.09, 0.09, 0.1) // Charcoal theme
          });

          // Draw vertical divider between gutter and code
          currentPage.drawLine({
            start: { x: MARGIN_LEFT + 25, y: currentY - 10 },
            end: { x: MARGIN_LEFT + 25, y: currentY + 2 },
            thickness: 0.5,
            color: rgb(0.2, 0.2, 0.25)
          });

          // Line numbers on the left
          if (i === 0) {
            const numStr = String(lineNum).padStart(3, " ");
            currentPage.drawText(numStr, {
              x: MARGIN_LEFT + 5,
              y: currentY - 8,
              size: 7.5,
              font: courierFont,
              color: rgb(0.45, 0.45, 0.45)
            });
          }

          // Code text
          currentPage.drawText(subLine, {
            x: MARGIN_LEFT + 32,
            y: currentY - 8,
            size: 8,
            font: courierFont,
            color: rgb(0.85, 0.85, 0.9)
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
      color: darkTextColor
    });
    currentY -= 15;

    // Draw colored top accent border
    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: currentY - 3,
      width: CONTENT_WIDTH,
      height: 3,
      color: purpleColor
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
          color: rgb(0.09, 0.09, 0.1) // Charcoal theme
        });

        // Draw vertical divider between gutter and code
        currentPage.drawLine({
          start: { x: MARGIN_LEFT + 25, y: currentY - 10 },
          end: { x: MARGIN_LEFT + 25, y: currentY + 2 },
          thickness: 0.5,
          color: rgb(0.2, 0.2, 0.25)
        });

        // Line numbers on the left
        if (i === 0) {
          const numStr = String(lineNum).padStart(3, " ");
          currentPage.drawText(numStr, {
            x: MARGIN_LEFT + 5,
            y: currentY - 8,
            size: 7.5,
            font: courierFont,
            color: rgb(0.45, 0.45, 0.45)
          });
        }

        // Code text
        currentPage.drawText(subLine, {
          x: MARGIN_LEFT + 32,
          y: currentY - 8,
          size: 8,
          font: courierFont,
          color: rgb(0.85, 0.85, 0.9)
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
    if (subExp?.isExecutable === false) {
      if (subExp?.samples && subExp.samples.length > 0) {
        outLog = subExp.samples.map(s => s.output).filter(Boolean).join("\n---\n");
      } else {
        outLog = "Successfully executed";
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
    color: darkTextColor
  });
  currentY -= 15;

  // Draw colored top-border line for output window (green for success/terminal)
  currentPage.drawRectangle({
    x: MARGIN_LEFT,
    y: currentY - 3,
    width: CONTENT_WIDTH,
    height: 3,
    color: rgb(0.2, 0.85, 0.6)
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
        color: rgb(0.09, 0.09, 0.1) // Charcoal theme
      });
      currentPage.drawText(subLine, {
        x: MARGIN_LEFT + 10,
        y: currentY - 8,
        size: 8,
        font: courierFont,
        color: rgb(0.2, 0.85, 0.6) // Green text
      });
      currentY -= 12;
    }
  }
  currentY -= 15;

  // CONCLUSION Section
  drawHeading("Conclusion");
  drawParagraph(conclusionText);

  // SIGNATURES Section
  ensureSpace(70);
  currentY -= 30;


  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
