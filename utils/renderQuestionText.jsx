/**
 * renderQuestionText
 * Renders a question string that may contain inline code (backtick-wrapped)
 * or fenced code blocks (triple-backtick). Splits the text into plain and
 * code segments and returns an array of React elements styled appropriately.
 *
 * Supported formats:
 *  - Fenced block:  ```[lang]\n<code>\n```  → rendered as <pre><code>
 *  - Inline code:   `value`                 → rendered as <code>
 *  - Plain text:    everything else         → rendered as <span>
 *
 * @param {string} text - The raw question text string.
 * @returns {Array<React.ReactElement>|null} Array of JSX elements, or null if text is falsy.
 */
export function renderQuestionText(text) {
  if (!text) return null;

  // Split on fenced code blocks first
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, idx) => {
    // Fenced code block
    if (part.startsWith("```")) {
      const content = part
        .replace(/^```[a-zA-Z]*\n?/, "")
        .replace(/```$/, "")
        .trim();
      return (
        <pre
          key={idx}
          className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto text-xs font-mono text-violet-800 leading-relaxed max-w-full text-left"
        >
          <code>{content}</code>
        </pre>
      );
    }

    // Inline code segments within plain text
    const inlineParts = part.split(/(`[^`\n]+`)/g);
    return (
      <span key={idx} className="whitespace-pre-line">
        {inlineParts.map((subPart, sIdx) => {
          if (subPart.startsWith("`") && subPart.endsWith("`")) {
            return (
              <code
                key={sIdx}
                className="px-1.5 py-0.5 mx-0.5 bg-slate-100 border border-slate-200 text-violet-700 rounded font-mono text-xs"
              >
                {subPart.slice(1, -1)}
              </code>
            );
          }
          return subPart;
        })}
      </span>
    );
  });
}
