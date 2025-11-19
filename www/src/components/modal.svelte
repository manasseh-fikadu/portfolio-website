<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Snippet } from "svelte";

  const { children, title }: { children: Snippet; title?: string } = $props();
  const dispatch = createEventDispatcher();

  function close() {
    dispatch("close");
  }
</script>

<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
  onclick={close}
  role="button"
  tabindex="0"
  onkeydown={(e) => e.key === "Escape" && close()}
>
  <div
    class="neo-box relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden"
    onclick={(e) => e.stopPropagation()}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === "Escape" && close()}
  >
    <div class="border-neo-border bg-neo-tertiary flex items-center justify-between border-b-2 p-2">
      <h2 class="text-lg font-black">{title || "Modal"}</h2>
      <button
        onclick={close}
        class="border-neo-border bg-neo-primary shadow-neo-hover flex size-6 items-center justify-center border-2 font-bold text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
      >
        X
      </button>
    </div>
    <div class="overflow-y-auto p-4">
      {@render children()}
    </div>
  </div>
</div>
