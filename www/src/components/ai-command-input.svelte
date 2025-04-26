<script lang="ts">
  import { onMount } from "svelte";
  let inputValue = "";
  let isFocused = false;
  let inputRef: HTMLInputElement | null = null;

  // Focus input on mount for better UX
  onMount(() => {
    inputRef?.focus();
  });
</script>

<div class="flex items-center py-1 font-mono text-base text-fuchsia-100">
  <span class="font-bold text-lime-400">web@minasefikadu.com</span>
  <span class="mx-1">~</span>
  <span class="mr-1">$</span>
  <div class="relative flex-1">
    <input
      bind:this={inputRef}
      bind:value={inputValue}
      on:focus={() => (isFocused = true)}
      on:blur={() => (isFocused = false)}
      class="w-full border-none bg-transparent text-fuchsia-100 caret-fuchsia-400 outline-none"
      autocomplete="off"
      spellcheck="false"
      placeholder=""
      style="min-width: 10ch;"
    />
    {#if !inputValue && !isFocused}
      <span
        class="pointer-events-none absolute left-0 top-0 select-none pl-1 text-xs text-fuchsia-400/60"
        style="line-height: 2.1;"
      >
        Ask AI
      </span>
    {/if}
  </div>
</div>
