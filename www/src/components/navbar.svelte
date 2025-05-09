<script lang="ts">
  import SimpleMarkdown from "./SimpleMarkdown.svelte";

  let userInput = "";
  let inputElement: HTMLInputElement;
  let cursorPosition = 0;
  const geminiApiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
  let isLoading = false;
  let aiResponse = ""; // Store the AI response
  let cooldownMessage = "";

  // Rate limiting variables
  const COOLDOWN_PERIOD = 3000; // 3 seconds cooldown between requests
  let lastRequestTime = 0;

  function updateCursorPosition() {
    cursorPosition = inputElement?.selectionStart ?? 0;
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    userInput = target.value;
    updateCursorPosition();
  }

  async function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && userInput.trim()) {
      event.preventDefault();

      // Check if we're in the cooldown period
      const now = Date.now();
      const timeElapsed = now - lastRequestTime;

      if (timeElapsed < COOLDOWN_PERIOD && lastRequestTime !== 0) {
        const remainingTime = Math.ceil((COOLDOWN_PERIOD - timeElapsed) / 1000);
        cooldownMessage = `Please wait ${remainingTime} seconds before making another request.`;
        setTimeout(() => {
          cooldownMessage = "";
        }, 2000);
        return;
      }

      // Reset cooldown message
      cooldownMessage = "";
      isLoading = true;
      aiResponse = "";

      try {
        // Update last request time
        lastRequestTime = Date.now();

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: userInput + ". Keep the response concise and brief. Format in markdown.",
                    },
                  ],
                },
              ],
            }),
          },
        );

        const data = await response.json();
        aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
        userInput = "";
      } catch (error) {
        console.error("Error calling Gemini API:", error);
        aiResponse = "Sorry, there was an error processing your request.";
      } finally {
        isLoading = false;
      }
    }
    setTimeout(updateCursorPosition, 0);
  }

  function handleClick() {
    updateCursorPosition();
  }

  function handleSelect() {
    updateCursorPosition();
  }

  function clearResponse() {
    aiResponse = "";
  }
</script>

<header class="flex w-full flex-col">
  <nav class="w-full py-4 md:py-6">
    <div class="flex items-center text-lg font-bold text-fuchsia-400/90 smooth">
      <span
        class="underline decoration-fuchsia-300/50 decoration-dotted underline-offset-2 smooth hover:decoration-fuchsia-500"
      >
        web@minasefikadu.com
      </span>
      <span class="mx-1">~</span>
      <div class="relative flex-1">
        <input
          bind:this={inputElement}
          type="text"
          class="w-full bg-transparent text-fuchsia-400/90 placeholder-fuchsia-400/20 caret-transparent outline-none"
          placeholder={isLoading ? "Thinking..." : "Ask AI"}
          spellcheck="false"
          bind:value={userInput}
          on:input={handleInput}
          on:keydown={handleKeydown}
          on:click={handleClick}
          on:select={handleSelect}
          disabled={isLoading}
        />
        <div class="pointer-events-none absolute inset-0">
          <span class="relative">
            <span
              class="absolute top-0 mx-[2px] inline-block h-[1.2em] w-[0.5px] animate-blink bg-current"
              style="left: {cursorPosition * 0.61}em"
            ></span>
          </span>
        </div>
      </div>
    </div>
    {#if cooldownMessage}
      <div class="mt-1 text-xs text-amber-400">{cooldownMessage}</div>
    {/if}
  </nav>

  {#if aiResponse}
    <div class="mt-4 rounded-lg bg-zinc-800/50 p-4 text-fuchsia-50/90">
      <div class="mb-2 flex items-center justify-between gap-2 text-sm text-fuchsia-400/70">
        <div class="flex items-center gap-2">
          <span class="font-bold">AI</span>
          <span class="text-zinc-500">~</span>
        </div>
        <button
          on:click={clearResponse}
          class="rounded bg-fuchsia-600/50 px-2 py-1 text-xs font-bold text-fuchsia-100/70 smooth hover:bg-fuchsia-700/50"
        >
          Clear
        </button>
      </div>
      <SimpleMarkdown value={aiResponse} />
    </div>
  {/if}
</header>

<style>
  input::placeholder {
    backdrop-filter: blur(4px);
  }
  /* Add any necessary global styles for carta-md if not already handled by default.css */
  :global(.carta-font-code) {
    font-family:
      "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace; /* Ensure this matches your project's monospace font */
    font-size: 0.9em; /* Adjust as needed */
    line-height: 1.2em; /* Adjust as needed */
  }
</style>
