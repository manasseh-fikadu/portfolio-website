<script lang="ts">
  import CopyButton from "../components/copy-button.svelte";
  import LiveTime from "../components/live-time.svelte";
  import Section from "../components/section.svelte";
  import SiteHeader from "../components/site-header.svelte";
  import { socials } from "../lib/socials";

  const { data } = $props();
  const email = "sw.minasefikadu@gmail.com";
</script>

<div class="mx-auto w-full max-w-2xl px-6">
  <SiteHeader />

  <div class="flex flex-col-reverse items-start gap-8 pb-10 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex flex-col gap-3">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Minase Fikadu</h1>
        <p class="mt-1 text-sm text-muted">Software Developer · Data Scientist</p>
      </div>

      <p class="text-sm text-muted">
        <CopyButton text={email}>
          <a href="mailto:{email}" class="underline decoration-line transition-colors hover:text-fg">{email}</a>
        </CopyButton>
      </p>

      <a
        href="/assets/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-2 w-fit rounded-md border border-line px-3 py-1.5 text-sm no-underline transition-colors hover:border-fg"
      >
        View résumé
      </a>
    </div>

    <img
      src="1718288886416.jpg"
      alt="Minase Fikadu"
      width="96"
      height="96"
      class="size-24 shrink-0 rounded-full border border-line object-cover"
    />
  </div>

  <Section title="Projects">
    <div class="grid gap-3 sm:grid-cols-2">
      {#each data.projects as project (project.url)}
        <a
          class="flex flex-col gap-1.5 card p-4 no-underline transition-colors hover:border-fg/30"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="text-sm font-medium">{project.title}</span>
          <span class="text-sm leading-relaxed text-muted">{project.description}</span>
        </a>
      {/each}
    </div>
  </Section>

  <Section title="Experience">
    <div class="flex flex-col gap-8">
      {#each data.experiences as experience (experience.role + experience.company)}
        <div class="flex flex-col gap-2">
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 class="text-sm font-medium">{experience.role}</h3>
            <span class="text-xs text-muted tabular-nums">{experience.date}</span>
          </div>
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 text-sm text-muted">
            <span>{experience.company}</span>
            <span class="text-xs">{experience.location}</span>
          </div>
          <ul class="mt-1 flex flex-col gap-1.5 text-sm leading-relaxed text-muted">
            {#each experience.description as desc (desc)}
              <li class="relative pl-4 before:absolute before:left-0 before:text-line before:content-['—']">{desc}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </Section>

  {#if data.writings.length}
    <Section title="Writing">
      <div class="flex flex-col">
        {#each data.writings as writing (writing.url)}
          <a
            class="group flex flex-col gap-1 border-b border-line py-4 no-underline first:pt-0 last:border-b-0 last:pb-0"
            href={writing.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="text-sm font-medium decoration-line group-hover:underline">{writing.title}</span>
            <span class="text-sm leading-relaxed text-muted">{writing.description}</span>
          </a>
        {/each}
      </div>
    </Section>
  {/if}

  <Section title="Elsewhere">
    <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
      {#each Object.entries(socials) as [link, name] (link)}
        <a
          href={`/${link}`}
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted no-underline transition-colors hover:text-fg"
        >
          {name}
        </a>
      {/each}
    </div>
  </Section>

  <footer class="flex items-center justify-between border-t border-line py-8 text-xs text-muted">
    <a href="/gh/www" target="_blank" rel="noopener noreferrer" class="no-underline transition-colors hover:text-fg">
      © {new Date().getFullYear()}
    </a>
    <span>Addis Ababa · <LiveTime /></span>
  </footer>
</div>
