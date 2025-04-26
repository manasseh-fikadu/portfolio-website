<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

{@render children()}

<svelte:head>
  <title>Minase Fikadu - Portfolio</title>
  <meta name="description" content="Hello, I am Minase Fikadu, a software developer and a data scientist." />
  <meta property="og:title" content="Minase Fikadu - Portfolio" />
  <meta property="og:site_name" content="Minase Fikadu - Portfolio" />
  <meta property="og:url" content="https://minasefikadu.com" />
  <meta property="og:description" content="Hello, I am Minase Fikadu, a software developer and a data scientist." />
  <meta property="og:type" content="website" />
</svelte:head>
