<script lang="ts">
  import type { Snippet } from "svelte";

  const { title, children }: { title: string; children: Snippet } = $props();
</script>

<section class="border-t border-line py-10">
  <h2 class="mb-6 text-xs font-medium tracking-[0.12em] text-muted uppercase">{title}</h2>
  {@render children()}
</section>
