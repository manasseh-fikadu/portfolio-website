<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<div class="flex flex-col neo-box">
  <div class="flex w-full items-center justify-between border-b-2 border-neo-border bg-neo-tertiary p-2">
    <div class="flex items-center gap-2">
      <div
        class="size-3 rounded-full border-2 border-neo-border bg-neo-primary"
      ></div>
      <div
        class="size-3 rounded-full border-2 border-neo-border bg-neo-secondary"
      ></div>
      <div
        class="size-3 rounded-full border-2 border-neo-border bg-white"
      ></div>
    </div>
  </div>
  <div class="px-3 py-2 bg-white">
    {@render children()}
  </div>
</div>
