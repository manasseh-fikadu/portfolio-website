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
      return html
        .split(/\n\s*\n/)
        .map((paragraph) => {
          const trimmedParagraph = paragraph.trim();
          if (trimmedParagraph) {
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
      font-weight: bold;
    }
    .custom-markdown-content :global(em) {
      font-style: italic;
    }
    .custom-markdown-content :global(p) {
      margin-bottom: 0.5em; /* Add some space between paragraphs */
    }
    .custom-markdown-content :global(p:last-child) {
      margin-bottom: 0;
    }
    .custom-markdown-content :global(a) {
      color: var(--link-color, #fb7185); /* fuchsia-500, or use a CSS variable */
      text-decoration: underline;
    }
    .custom-markdown-content :global(a:hover) {
      color: var(--link-hover-color, #f472b6); /* fuchsia-400 */
    }
    .custom-markdown-content :global(code.inline-code) {
      background-color: var(--code-bg-color, rgba(113, 63, 18, 0.2)); /* Adjust to your theme, e.g., zinc-700/50 */
      padding: 0.1em 0.3em;
      border-radius: 0.2em;
      font-family:
        "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
        "Courier New", monospace;
      font-size: 0.9em;
    }
  </style>
  