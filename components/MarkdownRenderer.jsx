"use client";
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

// Lightweight dark-themed syntax highlighter for code blocks using single-pass tokenization
const highlightCode = (code, language) => {
  if (!code) return "";

  // Escape HTML tags to prevent XSS
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const lang = (language || "").toLowerCase();

  if (
    lang === "c" ||
    lang === "cpp" ||
    lang === "java" ||
    lang === "javascript" ||
    lang === "js" ||
    lang === "csharp"
  ) {
    const patterns = [
      {
        name: "comment-multi",
        regex: /(\/\*[\s\S]*?\*\/)/g,
        color: "#94A3B8",
        italic: true,
      },
      {
        name: "comment-single",
        regex: /(\/\/.*)/g,
        color: "#94A3B8",
        italic: true,
      },
      {
        name: "string",
        regex: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
        color: "#FBBF24",
      },
      {
        name: "preprocessor",
        regex: /(#\w+\b(?:\s*&lt;[^&]*&gt;|\s*\w+)?)/g,
        color: "#34D399",
      },
      {
        name: "keyword",
        regex:
          /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|default|class|export|import|from|new|this|typeof|instanceof|void|int|char|float|double|struct|typedef|union|enum|unsigned|long|short|signed|sizeof|static|extern|auto|register|volatile|public|private|protected|interface|package|throws|throw|try|catch|finally|true|false|null)\b/g,
        color: "#F43F5E",
        bold: true,
      },
      {
        name: "function",
        regex:
          /\b(printf|scanf|getchar|putchar|gets|puts|fgets|strlen|strcmp|strcpy|malloc|calloc|realloc|free|exit|main)\b/g,
        color: "#60A5FA",
        bold: true,
      },
    ];

    const combinedRegex = new RegExp(
      patterns.map((p) => p.regex.source).join("|"),
      "g",
    );

    return escaped.replace(combinedRegex, (match) => {
      for (let i = 0; i < patterns.length; i++) {
        const p = patterns[i];
        p.regex.lastIndex = 0;
        if (p.regex.test(match)) {
          let classes = `text-[${p.color}]`;
          if (p.bold) classes += " font-bold";
          if (p.italic) classes += " italic";
          return `<span class="${classes}">${match}</span>`;
        }
      }
      return match;
    });
  } else if (lang === "python" || lang === "py") {
    const patterns = [
      { name: "comment", regex: /(#.*)/g, color: "#94A3B8", italic: true },
      {
        name: "string",
        regex: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
        color: "#FBBF24",
      },
      {
        name: "keyword",
        regex:
          /\b(def|class|return|if|elif|else|for|while|break|continue|import|from|as|in|is|not|and|or|try|except|finally|raise|assert|with|lambda|pass|global|nonlocal|True|False|None)\b/g,
        color: "#F43F5E",
        bold: true,
      },
      {
        name: "function",
        regex:
          /\b(print|input|len|range|str|int|float|list|dict|set|tuple|open|abs|max|min|sum|sorted|enumerate|zip)\b/g,
        color: "#60A5FA",
        bold: true,
      },
    ];

    const combinedRegex = new RegExp(
      patterns.map((p) => p.regex.source).join("|"),
      "g",
    );

    return escaped.replace(combinedRegex, (match) => {
      for (let i = 0; i < patterns.length; i++) {
        const p = patterns[i];
        p.regex.lastIndex = 0;
        if (p.regex.test(match)) {
          let classes = `text-[${p.color}]`;
          if (p.bold) classes += " font-bold";
          if (p.italic) classes += " italic";
          return `<span class="${classes}">${match}</span>`;
        }
      }
      return match;
    });
  }

  return escaped;
};

// Component to render a code block with copy button and medium-dark background
const CodeBlock = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedHtml = highlightCode(code, language);

  return (
    <div className="bg-[#1E293B] text-[#F8FAFC] rounded-lg px-3 py-1.5 overflow-y-clip font-mono text-[10px] overflow-x-auto leading-normal border border-[#334155] relative shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
      <div className="flex justify-between items-center mb-1.5 border-b border-[#334155] pb-1 text-[8.5px] text-[#94A3B8] font-bold select-none">
        <span>{language ? language.toUpperCase() : "CODE"}</span>
        <button
          onClick={handleCopy}
          className={`bg-none border-none ${copied ? "text-[#10B981]" : "text-[#94A3B8]"} cursor-pointer flex items-center gap-[3px] text-[8.5px] px-1 py-0.5 rounded transition-all duration-150`}
          title="Copy Code"
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="m-0 whitespace-pre-wrap break-all">
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </pre>
    </div>
  );
};

// Parser for inline formatting (bold, italic, code)
const renderTextWithInlineFormatting = (text) => {
  if (!text) return "";

  // Split by bold (**), code (`), and italic (*)
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-[#1E1B4B] dark:text-violet-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          className="font-mono bg-[#5521FF]/8 dark:bg-violet-950/40 px-1 py-[1px] rounded text-[9.5px] text-[#4F46E5] dark:text-violet-300 font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={idx} className="italic text-[#475569] dark:text-slate-400">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
};

// Render a parsed table block
const renderTable = (tableLines, key) => {
  if (tableLines.length === 0) return null;

  const parseRow = (rowText) => {
    let text = rowText.trim();
    if (text.startsWith("|")) text = text.slice(1);
    if (text.endsWith("|")) text = text.slice(0, -1);
    return text.split("|").map((cell) => cell.trim());
  };

  const headerCells = parseRow(tableLines[0]);
  let bodyStartIndex = 1;
  if (tableLines[1] && /^[\s|:-]+$/.test(tableLines[1].trim())) {
    bodyStartIndex = 2;
  }

  const bodyRows = tableLines
    .slice(bodyStartIndex)
    .map((line) => parseRow(line));

  return (
    <div key={`table-container-${key}`} className="overflow-x-auto my-2 w-full">
      <table className="w-full border-collapse text-[10px] leading-[1.4] border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[6px] overflow-hidden">
        <thead>
          <tr className="bg-[#F4F4F5] dark:bg-slate-950 border-b-2 border-b-[#E4E4E7] dark:border-b-slate-850">
            {headerCells.map((cell, idx) => (
              <th
                key={idx}
                className="px-2 py-1.5 text-left font-bold text-[#18181B] dark:text-slate-100 border-r border-[#E4E4E7] dark:border-slate-800"
              >
                {renderTextWithInlineFormatting(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={`border-b border-[#E4E4E7] dark:border-slate-800 ${rowIdx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-[#FAF9FF] dark:bg-slate-900/50"}`}
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-2 py-1.5 text-[#3F3F46] dark:text-slate-300 border-r border-[#E4E4E7] dark:border-slate-800"
                >
                  {renderTextWithInlineFormatting(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main MarkdownRenderer component
export default function MarkdownRenderer({ text }) {
  if (!text) return null;

  // Split content by code blocks
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)(?:```|$)/g;
  const blocks = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }
    blocks.push({
      type: "code",
      language: match[1] || "c",
      content: match[2],
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    blocks.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {blocks.map((block, idx) => {
        if (block.type === "code") {
          return (
            <CodeBlock
              key={idx}
              language={block.language}
              code={block.content}
            />
          );
        }

        // Split text block into lines
        const lines = block.content.split("\n");
        const renderedLines = [];
        let currentList = [];
        let listType = null; // "bullet" or "number"
        let currentTableLines = [];

        const flushList = (key) => {
          if (currentList.length === 0) return;
          if (listType === "bullet") {
            renderedLines.push(
              <ul
                key={`ul-${key}`}
                className="pl-4 my-1 list-disc flex flex-col gap-[3px]"
              >
                {currentList.map((item, i) => (
                  <li key={i} className="m-0">
                    {renderTextWithInlineFormatting(item)}
                  </li>
                ))}
              </ul>,
            );
          } else if (listType === "number") {
            renderedLines.push(
              <ol
                key={`ol-${key}`}
                className="pl-4 my-1 list-decimal flex flex-col gap-[3px]"
              >
                {currentList.map((item, i) => (
                  <li key={i} className="m-0">
                    {renderTextWithInlineFormatting(item)}
                  </li>
                ))}
              </ol>,
            );
          }
          currentList = [];
          listType = null;
        };

        const flushTable = (key) => {
          if (currentTableLines.length === 0) return;
          renderedLines.push(renderTable(currentTableLines, key));
          currentTableLines = [];
        };

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const trimmed = line.trim();

          // Check if line is a table row
          if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
            flushList(i);
            currentTableLines.push(line);
            continue;
          }

          // Check for empty lines while parsing tables
          if (trimmed === "") {
            // Check if next non-empty line is a table row to avoid splitting tables across double newlines
            let nextTableLineFound = false;
            for (let j = i + 1; j < lines.length; j++) {
              const nextTrimmed = lines[j].trim();
              if (nextTrimmed === "") continue;
              if (nextTrimmed.startsWith("|")) {
                nextTableLineFound = true;
              }
              break;
            }

            if (nextTableLineFound) {
              // Skip empty line inside a table and let table parser continue
              continue;
            }

            flushTable(i);
            flushList(i);
            renderedLines.push(<div key={`spacer-${i}`} className="h-1" />);
            continue;
          }

          // Flush any active table before parsing other elements
          flushTable(i);

          // Horizontal rule (---, ***, ___)
          if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
            flushTable(i);
            flushList(i);

            continue; //skip it
          }

          // Headers: # Header
          const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
          if (headerMatch) {
            flushList(i);
            const level = headerMatch[1].length;
            const content = headerMatch[2];
            const fontSizeClass =
              level === 1
                ? "text-[13px]"
                : level === 2
                  ? "text-[12px]"
                  : "text-[11px]";
            renderedLines.push(
              <div
                key={`h-${i}`}
                className={`font-bold text-[#1E1B4B] dark:text-violet-300 mt-2 mb-1 ${fontSizeClass} leading-[1.4]`}
              >
                {renderTextWithInlineFormatting(content)}
              </div>,
            );
            continue;
          }

          // Bullet point: - list item
          const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
          if (bulletMatch) {
            if (listType !== "bullet") {
              flushList(i);
              listType = "bullet";
            }
            currentList.push(bulletMatch[1]);
            continue;
          }

          // Numbered point: 1. list item
          const numberMatch = line.match(/^(\d+)\.\s+(.*)$/);
          if (numberMatch) {
            if (listType !== "number") {
              flushList(i);
              listType = "number";
            }
            currentList.push(numberMatch[2]);
            continue;
          }

          // Plain text line
          flushList(i);
          renderedLines.push(
            <p key={`p-${i}`} className="my-[3px] leading-[1.5]">
              {renderTextWithInlineFormatting(line)}
            </p>,
          );
        }

        // Flush remaining elements
        flushTable(lines.length);
        flushList(lines.length);

        return (
          <div key={idx} className="flex flex-col">
            {renderedLines}
          </div>
        );
      })}
    </div>
  );
}
