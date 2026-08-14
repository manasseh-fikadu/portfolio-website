<script lang="ts">
  import { onMount } from "svelte";
  import Moon from "../icons/moon.svelte";
  import Sun from "../icons/sun.svelte";

  // The inline script in app.html sets the class before first paint; read it back on mount.
  let dark = $state(false);

  onMount(() => {
    dark = document.documentElement.classList.contains("dark");
  });

  function toggle() {
    dark = !dark;
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this session.
    }
  }
</script>

<button
  type="button"
  onclick={toggle}
  class="-m-2 p-2 text-base text-muted transition-colors hover:text-fg"
  aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
  title={dark ? "Light theme" : "Dark theme"}
>
  {#if dark}
    <Sun />
  {:else}
    <Moon />
  {/if}
</button>
