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

  if (lang === "c" || lang === "cpp" || lang === "java" || lang === "javascript" || lang === "js" || lang === "csharp") {
    const patterns = [
      { name: "comment-multi", regex: /(\/\*[\s\S]*?\*\/)/g, color: "#94A3B8", italic: true },
      { name: "comment-single", regex: /(\/\/.*)/g, color: "#94A3B8", italic: true },
      { name: "string", regex: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, color: "#FBBF24" },
      { name: "preprocessor", regex: /(#\w+\b(?:\s*&lt;[^&]*&gt;|\s*\w+)?)/g, color: "#34D399" },
      { name: "keyword", regex: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|default|class|export|import|from|new|this|typeof|instanceof|void|int|char|float|double|struct|typedef|union|enum|unsigned|long|short|signed|sizeof|static|extern|auto|register|volatile|public|private|protected|interface|package|throws|throw|try|catch|finally|true|false|null)\b/g, color: "#F43F5E", bold: true },
      { name: "function", regex: /\b(printf|scanf|getchar|putchar|gets|puts|fgets|strlen|strcmp|strcpy|malloc|calloc|realloc|free|exit|main)\b/g, color: "#60A5FA", bold: true }
    ];

    const combinedRegex = new RegExp(
      patterns.map(p => p.regex.source).join("|"),
      "g"
    );

    return escaped.replace(combinedRegex, (match) => {
      for (let i = 0; i < patterns.length; i++) {
        const p = patterns[i];
        p.regex.lastIndex = 0;
        if (p.regex.test(match)) {
          let style = `color: ${p.color};`;
          if (p.bold) style += " font-weight: 700;";
          if (p.italic) style += " font-style: italic;";
          return `<span style="${style}">${match}</span>`;
        }
      }
      return match;
    });
  } else if (lang === "python" || lang === "py") {
    const patterns = [
      { name: "comment", regex: /(#.*)/g, color: "#94A3B8", italic: true },
      { name: "string", regex: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, color: "#FBBF24" },
      { name: "keyword", regex: /\b(def|class|return|if|elif|else|for|while|break|continue|import|from|as|in|is|not|and|or|try|except|finally|raise|assert|with|lambda|pass|global|nonlocal|True|False|None)\b/g, color: "#F43F5E", bold: true },
      { name: "function", regex: /\b(print|input|len|range|str|int|float|list|dict|set|tuple|open|abs|max|min|sum|sorted|enumerate|zip)\b/g, color: "#60A5FA", bold: true }
    ];

    const combinedRegex = new RegExp(
      patterns.map(p => p.regex.source).join("|"),
      "g"
    );

    return escaped.replace(combinedRegex, (match) => {
      for (let i = 0; i < patterns.length; i++) {
        const p = patterns[i];
        p.regex.lastIndex = 0;
        if (p.regex.test(match)) {
          let style = `color: ${p.color};`;
          if (p.bold) style += " font-weight: 700;";
          if (p.italic) style += " font-style: italic;";
          return `<span style="${style}">${match}</span>`;
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
    <div 
      style={{
        background: "#1E293B",
        color: "#F8FAFC",
        borderRadius: "8px",
        padding: "10px 12px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "10px",
        overflowX: "auto",
        margin: "8px 0",
        lineHeight: "1.5",
        border: "1px solid #334155",
        position: "relative",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
    >
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "6px",
          borderBottom: "1px solid #334155",
          paddingBottom: "4px",
          fontSize: "8.5px",
          color: "#94A3B8",
          fontWeight: "bold",
          userSelect: "none"
        }}
      >
        <span>{language ? language.toUpperCase() : "CODE"}</span>
        <button
          onClick={handleCopy}
          style={{
            background: "none",
            border: "none",
            color: copied ? "#10B981" : "#94A3B8",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "3px",
            fontSize: "8.5px",
            padding: "2px 4px",
            borderRadius: "4px",
            transition: "all 0.15s"
          }}
          title="Copy Code"
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
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
        <strong key={idx} style={{ fontWeight: 700, color: "#1E1B4B" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            background: "rgba(85, 33, 255, 0.08)",
            padding: "1px 4px",
            borderRadius: "4px",
            fontSize: "9.5px",
            color: "#4F46E5",
            fontWeight: 600,
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={idx} style={{ fontStyle: "italic", color: "#475569" }}>
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
    return text.split("|").map(cell => cell.trim());
  };

  const headerCells = parseRow(tableLines[0]);
  let bodyStartIndex = 1;
  if (tableLines[1] && /^[\s|:-]+$/.test(tableLines[1].trim())) {
    bodyStartIndex = 2;
  }

  const bodyRows = tableLines.slice(bodyStartIndex).map(line => parseRow(line));

  return (
    <div key={`table-container-${key}`} style={{ overflowX: "auto", margin: "8px 0", width: "100%" }}>
      <table 
        style={{ 
          width: "100%", 
          borderCollapse: "collapse", 
          fontSize: "10px", 
          lineHeight: "1.4", 
          border: "1px solid #E4E4E7",
          background: "#FFFFFF",
          borderRadius: "6px",
          overflow: "hidden"
        }}
      >
        <thead>
          <tr style={{ background: "#F4F4F5", borderBottom: "2px solid #E4E4E7" }}>
            {headerCells.map((cell, idx) => (
              <th 
                key={idx} 
                style={{ 
                  padding: "6px 8px", 
                  textAlign: "left", 
                  fontWeight: "700", 
                  color: "#18181B",
                  borderRight: "1px solid #E4E4E7"
                }}
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
              style={{ 
                borderBottom: "1px solid #E4E4E7",
                background: rowIdx % 2 === 0 ? "#FFFFFF" : "#FAF9FF"
              }}
            >
              {row.map((cell, cellIdx) => (
                <td 
                  key={cellIdx} 
                  style={{ 
                    padding: "6px 8px", 
                    color: "#3F3F46",
                    borderRight: "1px solid #E4E4E7"
                  }}
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
        content: text.slice(lastIndex, match.index)
      });
    }
    blocks.push({
      type: "code",
      language: match[1] || "c",
      content: match[2]
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    blocks.push({
      type: "text",
      content: text.slice(lastIndex)
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
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
              <ul key={`ul-${key}`} style={{ paddingLeft: "16px", margin: "4px 0", listStyleType: "disc", display: "flex", flexDirection: "column", gap: "3px" }}>
                {currentList.map((item, i) => (
                  <li key={i} style={{ margin: 0 }}>
                    {renderTextWithInlineFormatting(item)}
                  </li>
                ))}
              </ul>
            );
          } else if (listType === "number") {
            renderedLines.push(
              <ol key={`ol-${key}`} style={{ paddingLeft: "16px", margin: "4px 0", listStyleType: "decimal", display: "flex", flexDirection: "column", gap: "3px" }}>
                {currentList.map((item, i) => (
                  <li key={i} style={{ margin: 0 }}>
                    {renderTextWithInlineFormatting(item)}
                  </li>
                ))}
              </ol>
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
            renderedLines.push(<div key={`spacer-${i}`} style={{ height: "4px" }} />);
            continue;
          }

          // Flush any active table before parsing other elements
          flushTable(i);

          // Headers: # Header
          const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
          if (headerMatch) {
            flushList(i);
            const level = headerMatch[1].length;
            const content = headerMatch[2];
            const fontSize = level === 1 ? "13px" : level === 2 ? "12px" : "11px";
            renderedLines.push(
              <div 
                key={`h-${i}`} 
                style={{ 
                  fontWeight: 800, 
                  color: "#1E1B4B", 
                  marginTop: "8px", 
                  marginBottom: "4px",
                  fontSize,
                  lineHeight: "1.4"
                }}
              >
                {renderTextWithInlineFormatting(content)}
              </div>
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
            <p key={`p-${i}`} style={{ margin: "3px 0", lineHeight: "1.5" }}>
              {renderTextWithInlineFormatting(line)}
            </p>
          );
        }

        // Flush remaining elements
        flushTable(lines.length);
        flushList(lines.length);

        return (
          <div key={idx} style={{ display: "flex", flexDirection: "column" }}>
            {renderedLines}
          </div>
        );
      })}
    </div>
  );
}
