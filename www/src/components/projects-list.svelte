<script lang="ts">
  import { featured, more, type Project, type ProjectLink as Link } from "$lib/projects";
  import ProjectLink from "./project-link.svelte";
  import Section from "./section.svelte";

  // The live arrow always sits in the right-hand slot, so arrows line up down the page.
  const order: Record<Link["kind"], number> = { code: 0, ios: 1, android: 2, live: 3 };
  const sorted = (links: Link[]) => [...links].sort((a, b) => order[a.kind] - order[b.kind]);
</script>

{#snippet links(items: Link[])}
  <span class="-my-1 -mr-1.5 flex w-14 shrink-0 justify-end">
    {#each sorted(items) as link (link.href)}
      <ProjectLink {link} />
    {/each}
  </span>
{/snippet}

{#snippet row(project: Project)}
  <li class="flex flex-col gap-3 border-b border-line py-4 first:pt-0 last:border-b-0 last:pb-0">
    <div class="flex flex-col gap-1">
      <div class="flex items-start justify-between gap-4">
        <span class="text-sm font-medium">{project.title}</span>
        {@render links(project.links)}
      </div>
      <p class="text-sm leading-relaxed text-muted sm:pr-[4.125rem]">{project.description}</p>
    </div>

    {#if project.products}
      <ul class="flex flex-col gap-3 border-l border-line pl-4">
        {#each project.products as product (product.name)}
          <li class="flex items-start justify-between gap-4">
            <span class="text-sm">
              <span class="font-medium">{product.name}</span>
              <span class="text-muted"> · {product.description}</span>
            </span>
            {@render links(product.links)}
          </li>
        {/each}
      </ul>
    {/if}
  </li>
{/snippet}

<Section title="Projects">
  <ul class="flex flex-col">
    {#each featured as project (project.title)}
      {@render row(project)}
    {/each}
  </ul>

  <details class="group mt-4 border-t border-line pt-4">
    <summary
      class="flex cursor-pointer list-none items-center justify-between text-sm text-muted transition-colors select-none hover:text-fg [&::-webkit-details-marker]:hidden"
    >
      <span>{more.length} more projects</span>
      <span class="-my-1 -mr-1.5 flex size-7 items-center justify-center text-base leading-none" aria-hidden="true">
        <span class="transition-transform group-open:rotate-45">+</span>
      </span>
    </summary>
    <ul class="mt-4 flex flex-col">
      {#each more as project (project.title)}
        {@render row(project)}
      {/each}
    </ul>
  </details>
</Section>
