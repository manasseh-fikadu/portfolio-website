<script lang="ts">
    export let value: string = "";
  
    function escapeHtml(unsafe: string): string {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  
    $: formattedContent = (() => {
      if (!value) return "";
  
      let html = escapeHtml(value);
  
      // Blockquotes: > text
      html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

      // Unordered Lists: - text or * text (simple implementation, doesn't handle nested)
      html = html.replace(/^\s*[-*]\s+(.+)$/gm, "<li>$1</li>");
      // Wrap consecutive lis in ul (very basic)
      html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>"); 
      // Note: The above list regex is too simple for global replacement of multiple lists, 
      // but sufficient for simple AI responses. A better approach would be a real parser, 
      // but for "SimpleMarkdown" we'll stick to basic inline styles or just let paragraphs handle it if complex.
      // Let's actually stick to the existing simple logic but add Blockquote support which is easier.
      
      // Bold: **text** or __text__
      html = html.replace(/\*\*([^\*\*]+)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/__([^__]+)__/g, "<strong>$1</strong>");
  
      // Italics: *text* or _text_
      html = html.replace(/\*([^\*]+)\*/g, "<em>$1</em>");
      html = html.replace(/_([^_]+)_/g, "<em>$1</em>");
  
      // Inline code: `code`
      html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  
      // Links: [text](url)
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
      // Paragraphs (split by double newlines, then wrap non-empty lines)
      // We need to be careful not to wrap blockquotes in p tags if possible, or just let them be.
      return html
        .split(/\n\s*\n/)
        .map((paragraph) => {
          const trimmedParagraph = paragraph.trim();
          if (trimmedParagraph) {
            if (trimmedParagraph.startsWith("<blockquote>")) return trimmedParagraph;
            // Process line breaks within a paragraph as <br>
            const lines = trimmedParagraph.split(/\n/).join("<br>");
            return `<p>${lines}</p>`;
          }
          return "";
        })
        .join("");
    })();
  </script>
  
  <div class="custom-markdown-content">
    {@html formattedContent}
  </div>
  
  <style>
    .custom-markdown-content :global(strong) {
      font-weight: 900; /* Extra bold */
    }
    .custom-markdown-content :global(em) {
      font-style: italic;
      background-color: var(--color-neo-tertiary, #FFE66D); /* Highlight effect */
      padding: 0 2px;
    }
    .custom-markdown-content :global(p) {
      margin-bottom: 0.5em;
    }
    .custom-markdown-content :global(p:last-child) {
      margin-bottom: 0;
    }
    .custom-markdown-content :global(a) {
      color: var(--color-neo-text, #000000);
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-decoration-color: var(--color-neo-primary, #FF6B6B);
      font-weight: bold;
    }
    .custom-markdown-content :global(a:hover) {
      background-color: var(--color-neo-primary, #FF6B6B);
      color: white;
      text-decoration: none;
    }
    .custom-markdown-content :global(code.inline-code) {
      background-color: #f3f4f6; /* gray-100 */
      border: 1px solid var(--color-neo-border, #000000);
      color: var(--color-neo-text, #000000);
      padding: 0.1em 0.3em;
      border-radius: 0; /* Sharp corners */
      font-family:
        "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
        "Courier New", monospace;
      font-size: 0.9em;
      font-weight: bold;
    }
    .custom-markdown-content :global(blockquote) {
      border-left: 4px solid var(--color-neo-border, #000000);
      background-color: var(--color-neo-bg, #FFFDF5);
      margin: 1em 0;
      padding: 0.5em 1em;
      font-style: italic;
      border: 2px solid var(--color-neo-border, #000000);
      box-shadow: 4px 4px 0px 0px var(--color-neo-border, #000000);
    }
  </style>
  