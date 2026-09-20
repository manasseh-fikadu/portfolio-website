<script lang="ts">
  import { onMount, tick } from "svelte";
  import { base } from "$app/paths";
  import { activityStats, calendarWeeks, type Contribution, type GitHubActivityData } from "$lib/github-activity";

  // Svelte adaptation of Rare UI's GitHub Activity: https://www.rareui.com/components/githubactivity
  let activity = $state<GitHubActivityData | null>(null);
  let loading = $state(true);
  let failed = $state(false);
  let selected = $state<Contribution | null>(null);
  let focusedDate = $state("");
  let calendarScroller = $state<HTMLDivElement>();
  let controller: AbortController | undefined;
  const dateFormat = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const monthFormat = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
  const weeks = $derived(calendarWeeks(activity?.contributions ?? []));
  const stats = $derived(activityStats(activity?.contributions ?? []));
  const monthLabels = $derived(
    weeks.map((week, index) => {
      const date = week.find(Boolean)?.date;
      const previous = weeks[index - 1]?.find(Boolean)?.date;
      return date && date.slice(0, 7) !== previous?.slice(0, 7) && index < weeks.length - 2
        ? monthFormat.format(new Date(`${date}T00:00:00Z`))
        : "";
    }),
  );

  function describe(day: Contribution) {
    return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${dateFormat.format(new Date(`${day.date}T00:00:00Z`))}`;
  }

  async function loadActivity() {
    controller?.abort();
    controller = new AbortController();
    loading = true;
    failed = false;
    try {
      const response = await fetch(`${base}/api/github-activity`, { signal: controller.signal });
      if (!response.ok) throw new Error("Activity unavailable");
      activity = await response.json();
      focusedDate = activity?.contributions.at(-1)?.date ?? "";
      loading = false;
      await tick();
      if (calendarScroller) calendarScroller.scrollLeft = calendarScroller.scrollWidth;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      failed = true;
      loading = false;
    }
  }

  function navigateDay(event: KeyboardEvent, date: string) {
    if (event.key === "Escape") {
      selected = null;
      return;
    }
    const steps: Record<string, number> = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 };
    if (!(event.key in steps) || !activity) return;
    event.preventDefault();
    const index = activity.contributions.findIndex((day) => day.date === date);
    const next =
      activity.contributions[Math.max(0, Math.min(activity.contributions.length - 1, index + steps[event.key]))];
    focusedDate = next.date;
    calendarScroller?.querySelector<HTMLButtonElement>(`[data-date="${next.date}"]`)?.focus();
  }

  onMount(() => {
    void loadActivity();
    return () => controller?.abort();
  });
</script>

{#snippet githubIcon()}
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path
      d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .94-.3 3.09 1.15a10.8 10.8 0 0 1 5.62 0c2.15-1.45 3.09-1.15 3.09-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.28-5.15 5.56.4.35.76 1.03.76 2.08v3.09c0 .3.2.65.77.54A11.25 11.25 0 0 0 12 .75Z"
    />
  </svg>
{/snippet}

<div class="activity-card" aria-busy={loading}>
  {#if loading}
    <div class="activity-loading" role="status">
      <span class="eyebrow">A YEAR IN CODE</span>
      <p>Gathering the little green squares…</p>
      <div class="skeleton-grid" aria-hidden="true"></div>
    </div>
  {:else if failed}
    <div class="activity-error" role="status">
      {@render githubIcon()}
      <p>GitHub activity is taking a breather.</p>
      <span>The latest contributions couldn't load.</span>
      <button type="button" onclick={loadActivity}>Try again <span aria-hidden="true">↻</span></button>
    </div>
  {:else if activity}
    <div class="activity-heading">
      <div>
        <div class="eyebrow"><span class="status-dot"></span> A YEAR IN CODE</div>
        <p class="contribution-total">
          <strong>{stats.total.toLocaleString("en-US")}</strong> <span>contributions</span>
        </p>
        <p class="period">in the last 12 months</p>
      </div>
      <div class="activity-stats">
        <div><strong>{stats.activeDays}</strong><span>active days</span></div>
        <div><strong>{stats.longestStreak}<small>d</small></strong><span>longest streak</span></div>
      </div>
    </div>

    <div class="calendar-scroll" bind:this={calendarScroller}>
      <div class="calendar" style={`--weeks: ${weeks.length}`}>
        <div class="month-labels" aria-hidden="true">
          {#each monthLabels as month, index (index)}<span>{month}</span>{/each}
        </div>
        <div
          class="contribution-grid"
          role="group"
          aria-label="Daily GitHub contributions. Use arrow keys to explore dates."
          onpointerleave={() => (selected = null)}
        >
          {#each weeks as week, weekIndex (weekIndex)}
            <div class="week" style={`--column: ${weekIndex}`}>
              {#each week as day, dayIndex (dayIndex)}
                {#if day}
                  <button
                    type="button"
                    class="day"
                    data-level={day.level}
                    data-date={day.date}
                    aria-label={describe(day)}
                    tabindex={focusedDate === day.date ? 0 : -1}
                    onpointerenter={() => (selected = day)}
                    onclick={() => {
                      selected = day;
                      focusedDate = day.date;
                    }}
                    onfocus={() => {
                      selected = day;
                      focusedDate = day.date;
                    }}
                    onblur={() => (selected = null)}
                    onkeydown={(event) => navigateDay(event, day.date)}
                  ></button>
                {:else}
                  <span class="day blank"></span>
                {/if}
              {/each}
            </div>
          {/each}
        </div>
      </div>
    </div>

    <div class="calendar-caption">
      <span class="day-detail" aria-live="polite"
        >{selected ? describe(selected) : "One square. One day. A little further."}</span
      >
      <div class="legend" aria-label="Contribution intensity from less to more">
        <span>Less</span>
        {#each [0, 1, 2, 3, 4] as level (level)}<i data-level={level}></i>{/each}
        <span>More</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .activity-card {
    --green: #28734c;
    --level-0: #e9eeea;
    --level-1: #c3dfcd;
    --level-2: #83bb98;
    --level-3: #4b9367;
    --level-4: #286441;
    position: relative;
    min-height: 270px;
    overflow: hidden;
    padding: 24px 22px;
    border: 1px solid var(--color-line);
    border-radius: 18px;
    background: linear-gradient(130deg, color-mix(in srgb, var(--level-1) 10%, var(--color-bg)), var(--color-bg) 65%);
  }
  :global(.dark) .activity-card {
    --green: #8bc9a0;
    --level-0: #202a24;
    --level-1: #294d37;
    --level-2: #3d7a51;
    --level-3: #69a77c;
    --level-4: #a0d6ac;
  }
  .activity-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 26px;
  }
  .eyebrow {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 9px;
    font-weight: 550;
    letter-spacing: 0.14em;
    color: var(--green);
  }
  .status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--green) 9%, transparent);
  }
  .contribution-total {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 9px;
  }
  .contribution-total strong {
    font-size: 32px;
    line-height: 1.15;
    font-weight: 550;
    letter-spacing: -0.06em;
    font-variant-numeric: tabular-nums;
  }
  .contribution-total > span {
    font-size: 12px;
    color: var(--color-muted);
  }
  .period {
    margin-top: 4px;
    font-size: 10px;
    color: var(--color-muted);
  }
  .activity-stats {
    display: flex;
    gap: 24px;
    padding-top: 13px;
  }
  .activity-stats > div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .activity-stats strong {
    font-size: 19px;
    line-height: 1;
    font-weight: 500;
    letter-spacing: -0.04em;
    font-variant-numeric: tabular-nums;
  }
  .activity-stats small {
    margin-left: 2px;
    font-size: 12px;
    color: var(--color-muted);
  }
  .activity-stats span {
    font-size: 10px;
    color: var(--color-muted);
  }
  .calendar-scroll {
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--color-line) transparent;
    padding: 3px;
    margin: -3px;
  }
  .calendar {
    min-width: 510px;
  }
  .month-labels,
  .contribution-grid {
    display: grid;
    grid-template-columns: repeat(var(--weeks), minmax(0, 1fr));
    gap: 3px;
  }
  .month-labels {
    margin-bottom: 8px;
    color: var(--color-muted);
    font-size: 9px;
    line-height: 12px;
  }
  .month-labels span {
    overflow: visible;
  }
  .week {
    display: grid;
    grid-template-rows: repeat(7, 1fr);
    gap: 3px;
    animation: reveal 450ms both;
    animation-delay: calc(var(--column) * 9ms);
  }
  .day {
    width: 100%;
    aspect-ratio: 1;
    border: 0;
    border-radius: 2px;
    cursor: pointer;
    transition: filter 150ms;
  }
  .day:hover {
    filter: brightness(1.13);
    outline: 1px solid var(--green);
    outline-offset: 1px;
  }
  .day.blank {
    visibility: hidden;
  }
  [data-level="0"] {
    background: var(--level-0);
  }
  [data-level="1"] {
    background: var(--level-1);
  }
  [data-level="2"] {
    background: var(--level-2);
  }
  [data-level="3"] {
    background: var(--level-3);
  }
  [data-level="4"] {
    background: var(--level-4);
  }
  .calendar-caption {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-top: 13px;
    min-height: 14px;
    color: var(--color-muted);
    font-size: 9px;
  }
  .legend {
    display: flex;
    align-items: center;
    gap: 3px;
    flex-shrink: 0;
  }
  .legend span:first-child {
    margin-right: 3px;
  }
  .legend span:last-child {
    margin-left: 3px;
  }
  .legend i {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 2px;
  }
  .activity-loading > p {
    margin-top: 20px;
    font-size: 14px;
    color: var(--color-muted);
  }
  .skeleton-grid {
    height: 86px;
    margin-top: 30px;
    opacity: 0.5;
    background-image: radial-gradient(circle, var(--level-1) 4px, transparent 4px);
    background-size: 13px 13px;
    animation: breathe 1.5s ease-in-out infinite alternate;
  }
  .activity-error {
    display: flex;
    min-height: 220px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  .activity-error > p {
    font-size: 14px;
  }
  .activity-error > span {
    font-size: 12px;
    color: var(--color-muted);
  }
  .activity-error button {
    margin-top: 5px;
    border: 1px solid var(--color-line);
    border-radius: 6px;
    padding: 7px 12px;
    font-size: 12px;
    cursor: pointer;
  }
  button:focus-visible {
    outline: 2px solid var(--green, var(--color-fg));
    outline-offset: 3px;
  }
  @keyframes reveal {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes breathe {
    to {
      opacity: 0.2;
    }
  }
  @media (max-width: 540px) {
    .activity-card {
      padding: 20px 16px;
      min-height: 284px;
    }
    .activity-stats {
      gap: 14px;
    }
    .activity-stats strong {
      font-size: 17px;
    }
    .activity-stats span {
      font-size: 9px;
    }
    .contribution-total {
      flex-direction: column;
      gap: 2px;
    }
    .contribution-total strong {
      font-size: 30px;
    }
    .contribution-total > span {
      font-size: 11px;
    }
    .activity-heading {
      margin-bottom: 22px;
    }
    .calendar-caption {
      flex-wrap: wrap;
      gap: 8px;
    }
    .day-detail {
      flex-basis: 100%;
    }
    .legend {
      margin-left: auto;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .week,
    .skeleton-grid {
      animation: none;
    }
    .day {
      transition: none;
    }
  }
</style>
