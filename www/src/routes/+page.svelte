<script>
  import CommandOutput from "../components/command-output.svelte";
  import Command from "../components/command.svelte";
  import CopyButton from "../components/copy-button.svelte";
  import LiveTime from "../components/live-time.svelte";
  import Navbar from "../components/navbar.svelte";
  import Spinner from "../components/spinner.svelte";
  import Terminal from "../components/terminal.svelte";
  import { socials } from "../lib/socials";
  const { data } = $props();
</script>

<main class="mx-auto max-w-screen-md p-2">
  <Navbar />
  <Command>cat about-me.md</Command>

  <div class="flex w-full items-center justify-between gap-1">
    <div class="flex flex-col text-xl">
      <span class="font-semibold">Hello,</span>
      <span>I'm Minase Fikadu</span>
      <span class="pt-1 text-sm font-semibold text-pretty text-fuchsia-100/50">
        Software Developer | Data Scientist
      </span>
      <span class="pt-1 text-sm font-semibold text-pretty text-fuchsia-100/80">
        email me at
        <CopyButton text="minasefikaduwm@proton.me">
          <span class="cursor-pointer underline decoration-dotted select-all">minasefikaduwm@proton.me</span>
        </CopyButton>
      </span>
      <a
        href="/assets/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-2 w-fit rounded bg-fuchsia-600 px-4 py-2 text-sm font-bold text-white shadow smooth hover:bg-fuchsia-700"
        style="margin-top: 0.75rem;"
      >
        View Resume
      </a>
    </div>
    <div class="hidden p-1 py-5 md:block">
      <img
        src="1718288886416.jpg"
        alt="Minase Fikadu"
        class="aspect-square size-32 drama-fuchsia-600/80 spring-duration-500 spring-bounce-40 drama-28 select-none hover:rotate-0 hover:drama-5"
      />
    </div>
  </div>

  <div class="py-4">
    <Terminal>
      <Command>ssh minasefikadu.dev</Command>
      <CommandOutput>Welcome to Minase Fikadu!</CommandOutput>
      <CommandOutput>
        <span class="flex items-center gap-2">
          <span class="text-fuchsia-500 text-glow-fuchsia-500"><Spinner interval={150} /></span>
          Time: <LiveTime /> (GMT+3)
        </span>
      </CommandOutput>
      <CommandOutput>Hope you had a nice day!</CommandOutput>
      <div class="py-3"></div>
      <Command>ls ~/Projects</Command>
      <CommandOutput>
        <div class="flex flex-col gap-3">
          {#each data.projects as project}
            <a
              class="flex flex-col gap-1 rounded-lg border border-slate-800 p-3 smooth hover:border-glow-fuchsia-600 hover:border-fuchsia-500"
              href={project.url}
              target="_blank"
            >
              <span class="font-bold">{project.title}</span>
              <span class="text-sm font-semibold text-pretty text-fuchsia-400">{project.description}</span>
            </a>
          {/each}
        </div>
      </CommandOutput>
      <div class="py-3"></div>
      <Command>ls ~/Writings</Command>
      <CommandOutput>
        <div class="flex flex-col gap-3">
          {#each data.writings as writing}
            <a
              class="flex flex-col gap-1 rounded-lg border border-slate-800 p-3 smooth hover:border-glow-fuchsia-600 hover:border-fuchsia-500"
              href={writing.url}
              target="_blank"
            >
              <span class="font-bold">{writing.title}</span>
              <span class="text-sm font-semibold text-pretty text-fuchsia-400">{writing.description}</span>
            </a>
          {/each}
        </div>
      </CommandOutput>
      <div class="py-3"></div>
      <Command>cat ~/socials.json</Command>
      <CommandOutput>
        <div class="flex flex-wrap gap-2">
          <span class="rounded-lg border border-slate-800 p-2 smooth">
            <span class="text-sm font-bold text-fuchsia-400">[</span>
          </span>
          {#each Object.entries(socials) as [link, name], i}
            <a
              class="rounded-lg border border-slate-800 p-2 smooth hover:border-glow-fuchsia-600 hover:border-fuchsia-500"
              href={`/${link}`}
              target="_blank"
            >
              <span class="text-sm font-bold text-fuchsia-400"
                >"{name}"{i === Object.keys(socials).length - 1 ? "" : ","}</span
              >
            </a>
          {/each}
          <span class="rounded-lg border border-slate-800 p-2 smooth">
            <span class="text-sm font-bold text-fuchsia-400">]</span>
          </span>
        </div>
      </CommandOutput>
      <div class="py-3"></div>
      <Command>exit</Command>
    </Terminal>
  </div>

  <div class="py-4">
    <div class="flex w-full flex-wrap items-center justify-between gap-1 py-4">
      <div class="text-xs font-bold text-fuchsia-100/50">
        <a
          href="/gh/www"
          class="underline decoration-dotted smooth hover:text-fuchsia-500/90 hover:text-glow-fuchsia-700"
          target="_blank"
        >
          {new Date().getFullYear()}
        </a>
      </div>
    </div>
  </div>
</main>
