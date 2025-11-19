<script lang="ts">
  import SimpleMarkdown from "./SimpleMarkdown.svelte";
  import Modal from "./modal.svelte";
  import GameHub from "./game-hub.svelte";

  let userInput = "";
  let showGame = false;
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
    <div class="text-neo-text smooth flex items-center text-lg font-bold">
      <span
        class="decoration-neo-primary smooth hover:decoration-neo-secondary underline decoration-wavy underline-offset-4"
      >
        web@minasefikadu.com
      </span>
      <span class="mx-2 font-black">~</span>
      <div class="relative flex flex-1 gap-2">
        <div class="relative flex-1">
          <input
            bind:this={inputElement}
            type="text"
            class="neo-input placeholder-gray-400"
            placeholder={isLoading ? "Thinking..." : "Ask AI"}
            spellcheck="false"
            bind:value={userInput}
            on:input={handleInput}
            on:keydown={handleKeydown}
            on:click={handleClick}
            on:select={handleSelect}
            disabled={isLoading}
          />
        </div>
        <button
          class="neo-button flex items-center justify-center px-3"
          on:click={() => (showGame = true)}
          title="Play Snake"
        >
          🎮
        </button>
      </div>
    </div>
    {#if cooldownMessage}
      <div
        class="text-neo-primary bg-neo-tertiary border-neo-border shadow-neo-hover mt-1 inline-block border p-1 text-xs font-bold"
      >
        {cooldownMessage}
      </div>
    {/if}
  </nav>

  {#if aiResponse}
    <div class="neo-box text-neo-text mt-4 p-4">
      <div class="border-neo-border mb-2 flex items-center justify-between gap-2 border-b-2 pb-2">
        <div class="flex items-center gap-2">
          <span class="bg-neo-primary border-neo-border shadow-neo-hover border-2 px-2 py-0.5 font-black text-white"
            >AI</span
          >
          <span class="text-neo-text font-bold">says:</span>
        </div>
        <button on:click={clearResponse} class="neo-button text-xs"> Clear </button>
      </div>
      <SimpleMarkdown value={aiResponse} />
    </div>
  {/if}

  {#if showGame}
    <Modal title="Arcade" on:close={() => (showGame = false)}>
      <GameHub />
    </Modal>
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
