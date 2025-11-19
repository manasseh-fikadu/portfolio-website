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
      <span class="text-2xl font-black">Hello,</span>
      <span class="font-bold">I'm Minase Fikadu</span>
      <span class="text-neo-text pt-1 text-sm font-bold"> Software Developer | Data Scientist </span>
      <span class="text-neo-text pt-1 text-sm font-bold">
        email me at
        <CopyButton text="minasefikaduwm@proton.me">
          <span class="decoration-neo-primary hover:bg-neo-tertiary cursor-pointer select-all underline decoration-wavy"
            >minasefikaduwm@proton.me</span
          >
        </CopyButton>
      </span>
      <a
        href="/assets/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        class="neo-button text-neo-text mt-4 w-fit"
      >
        View Resume
      </a>
    </div>
    <div class="hidden p-1 py-5 md:block">
      <img
        src="1718288886416.jpg"
        alt="Minase Fikadu"
        class="border-neo-border shadow-neo hover:shadow-neo-lg aspect-square size-32 border-4 transition-all"
      />
    </div>
  </div>

  <div class="py-4">
    <Terminal>
      <Command>ssh minasefikadu.dev</Command>
      <CommandOutput>Welcome to Minase Fikadu!</CommandOutput>
      <CommandOutput>
        <span class="flex items-center gap-2">
          <span class="text-neo-primary"><Spinner interval={150} /></span>
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
              class="neo-box flex flex-col gap-1 p-3 transition-transform hover:-translate-y-1 hover:translate-x-1"
              href={project.url}
              target="_blank"
            >
              <span class="text-lg font-black">{project.title}</span>
              <span class="text-neo-text text-sm font-bold">{project.description}</span>
            </a>
          {/each}
        </div>
      </CommandOutput>
      <div class="py-3"></div>
      <Command>cat ~/Experiences</Command>
      <CommandOutput>
        <div class="flex flex-col gap-4">
          {#each data.experiences as experience}
            <div class="neo-box flex flex-col gap-1 p-4">
              <div class="border-neo-border mb-2 flex flex-wrap items-baseline justify-between gap-2 border-b-2 pb-2">
                <span class="text-lg font-black">{experience.role}</span>
                <span class="text-neo-primary text-sm font-bold">{experience.date}</span>
              </div>
              <div class="text-neo-text mb-2 flex items-center justify-between text-sm font-bold">
                <span>{experience.company}</span>
                <span class="text-neo-secondary italic">{experience.location}</span>
              </div>
              <ul class="list-inside list-disc space-y-1">
                {#each experience.description as desc}
                  <li class="text-neo-text/80 text-sm font-medium">{desc}</li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      </CommandOutput>
      <div class="py-3"></div>
      <Command>ls ~/Writings</Command>
      <CommandOutput>
        <div class="flex flex-col gap-3">
          {#each data.writings as writing}
            <a
              class="neo-box flex flex-col gap-1 p-3 transition-transform hover:-translate-y-1 hover:translate-x-1"
              href={writing.url}
              target="_blank"
            >
              <span class="text-lg font-black">{writing.title}</span>
              <span class="text-neo-text text-sm font-bold">{writing.description}</span>
            </a>
          {/each}
        </div>
      </CommandOutput>
      <div class="py-3"></div>
      <Command>cat ~/socials.json</Command>
      <CommandOutput>
        <div class="flex flex-wrap gap-2">
          <span class="neo-box p-2">
            <span class="text-neo-text text-sm font-black">[</span>
          </span>
          {#each Object.entries(socials) as [link, name], i}
            <a class="neo-button text-sm" href={`/${link}`} target="_blank">
              <span class="font-bold">"{name}"{i === Object.keys(socials).length - 1 ? "" : ","}</span>
            </a>
          {/each}
          <span class="neo-box p-2">
            <span class="text-neo-text text-sm font-black">]</span>
          </span>
        </div>
      </CommandOutput>
      <div class="py-3"></div>
      <Command>exit</Command>
    </Terminal>
  </div>

  <div class="py-4">
    <div class="flex w-full flex-wrap items-center justify-between gap-1 py-4">
      <div class="text-neo-text text-xs font-bold">
        <a href="/gh/www" class="hover:bg-neo-primary underline decoration-dotted hover:text-white" target="_blank">
          {new Date().getFullYear()}
        </a>
      </div>
    </div>
  </div>
</main>
