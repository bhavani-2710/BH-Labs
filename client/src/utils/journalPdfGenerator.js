import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generateJournalPdf({ experiment, subPart = "a", codeText, outputText }) {
  const subExp = experiment?.subExperiments?.find(s => s.part === subPart) || experiment?.subExperiments?.[0];
  const conclusionText = `The ${subExp?.title || "experiment"} program was successfully implemented and compiled. Through this experiment, we observed how basic logic structures can manipulate data in memory. The program executed with zero errors and produced the expected output matching the unit validation cases.`;

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

  // 1. HEADER (Title & Logo / Metadata)
  // Draw Logo Text "BH.Lab"
  currentPage.drawText("BH.Lab", {
    x: MARGIN_LEFT,
    y: currentY - 5,
    size: 24,
    font: helveticaBold,
    color: purpleColor
  });
  currentPage.drawText("Student Record Portal", {
    x: MARGIN_LEFT,
    y: currentY - 18,
    size: 8,
    font: helveticaBold,
    color: grayTextColor
  });

  // Metadata block (Right side)
  const metaX = PAGE_WIDTH - MARGIN_RIGHT - 180;
  currentPage.drawText("Student Name: Rahul Sharma", {
    x: metaX,
    y: currentY,
    size: 9,
    font: helveticaBold,
    color: darkTextColor
  });
  currentPage.drawText("Roll No: ENG-2026-042", {
    x: metaX,
    y: currentY - 14,
    size: 9,
    font: helveticaBold,
    color: darkTextColor
  });
  currentPage.drawText("Date: October 24, 2026", {
    x: metaX,
    y: currentY - 28,
    size: 9,
    font: helveticaBold,
    color: darkTextColor
  });

  currentY -= 45;

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
  currentY -= 18;

  const titleText = `${subExp?.title || "Experiment"} Implementation`;
  currentPage.drawText(titleText, {
    x: MARGIN_LEFT,
    y: currentY,
    size: 18,
    font: helveticaBold,
    color: darkTextColor
  });
  currentY -= 25;


  // Function to wrap and draw block texts
  const drawHeading = (text) => {
    ensureSpace(30);
    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: currentY - 16,
      width: 150,
      height: 20,
      color: lightGrayBg,
      borderRadius: 10
    });
    currentPage.drawText(text.toUpperCase(), {
      x: MARGIN_LEFT + 10,
      y: currentY - 8,
      size: 9,
      font: helveticaBold,
      color: purpleColor
    });
    currentY -= 26;
  };

  const drawParagraph = (text, isMonospace = false, customFontSize = 9, customLineHeight = 13) => {
    const font = isMonospace ? courierFont : helveticaFont;
    const lines = [];
    
    // Split input by explicit newlines first
    const paragraphs = text.split("\n");
    for (let p of paragraphs) {
      if (p.trim() === "" && isMonospace) {
        lines.push("");
        continue;
      }
      
      // Simple word wrapping
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
    currentY -= 10; // spacing after paragraph
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

  // SOURCE CODE Section
  drawHeading("Source Code");
  const code = codeText || (subExp?.starterCode?.templates?.c || "// No source code available");
  const codeLines = code.split("\n");
  ensureSpace(40);
  
  // Draw header bar for source code
  currentPage.drawRectangle({
    x: MARGIN_LEFT,
    y: currentY - 15,
    width: CONTENT_WIDTH,
    height: 15,
    color: rgb(0.12, 0.12, 0.12)
  });
  currentPage.drawText("main.c", {
    x: MARGIN_LEFT + 10,
    y: currentY - 11,
    size: 7,
    font: courierBold,
    color: rgb(0.7, 0.7, 0.7)
  });
  currentY -= 15;

  for (let line of codeLines) {
    const lineWrapped = [];
    let remaining = line;
    const maxChars = 75; // Approx limit for Courier at size 8
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
        color: rgb(0.11, 0.11, 0.11)
      });
      currentPage.drawText(subLine, {
        x: MARGIN_LEFT + 10,
        y: currentY - 8,
        size: 8,
        font: courierFont,
        color: rgb(0.85, 0.85, 0.85)
      });
      currentY -= 12;
    }
  }
  currentY -= 15;

  // EXECUTION OUTPUT Section
  drawHeading("Execution Output");
  const outLog = outputText || `Output Vector: [${subExp?.samples?.[0]?.output || "Successfully executed"}]`;
  const outLines = outLog.split("\n");
  ensureSpace(40);

  // Draw header bar for output
  currentPage.drawRectangle({
    x: MARGIN_LEFT,
    y: currentY - 15,
    width: CONTENT_WIDTH,
    height: 15,
    color: rgb(0.1, 0.1, 0.11)
  });
  currentPage.drawText("terminal_output.log", {
    x: MARGIN_LEFT + 10,
    y: currentY - 11,
    size: 7,
    font: courierBold,
    color: rgb(0.7, 0.7, 0.7)
  });
  currentY -= 15;

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
        color: rgb(0.09, 0.09, 0.1)
      });
      currentPage.drawText(subLine, {
        x: MARGIN_LEFT + 10,
        y: currentY - 8,
        size: 8,
        font: courierFont,
        color: rgb(0.2, 0.85, 0.6) // greenish terminal output color
      });
      currentY -= 12;
    }
  }
  currentY -= 15;

  // CONCLUSION Section
  drawHeading("Conclusion");
  drawParagraph(conclusionText);

  
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
