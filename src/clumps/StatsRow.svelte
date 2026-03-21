<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Stat {
    value: string
    label: string
  }

  interface Props extends HTMLAttributes<HTMLDivElement> {
    stats?: Stat[]
    children?: Snippet
  }

  let {
    stats = [],
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<section
  class="stats-row {rest.class || ''}"
  {style}
  {...rest}
>
  <div class="stats-row-inner">
    {#if children}
      {@render children()}
    {:else}
      {#each stats as stat, i}
        {#if i > 0}
          <div class="stats-divider" aria-hidden="true"></div>
        {/if}
        <div class="stats-item">
          <span class="stats-value">{stat.value}</span>
          <span class="stats-label">{stat.label}</span>
        </div>
      {/each}
    {/if}
  </div>
</section>

<style>
  .stats-row {
    width: 100%;
    padding: var(--size-6, 2.5rem) var(--size-5, 1.5rem);
  }

  .stats-row-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-6, 2.5rem);
    max-width: var(--content-width, 1200px);
    margin: 0 auto;
    flex-wrap: wrap;
  }

  .stats-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-1, 0.25rem);
    text-align: center;
    flex: 1;
    min-width: 120px;
  }

  .stats-value {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: clamp(1.75rem, 4vw, var(--font-size-7, 3rem));
    font-weight: 800;
    color: var(--text-1, var(--fore, currentColor));
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .stats-label {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    color: var(--gray-500, #888);
    font-weight: 500;
  }

  .stats-divider {
    width: 1px;
    height: 3rem;
    background-color: var(--gray-200, #e0e0e0);
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .stats-row {
      padding: var(--size-5, 1.5rem) var(--size-4, 1rem);
    }

    .stats-row-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--size-5, 1.5rem);
    }

    .stats-divider {
      display: none;
    }

    .stats-item {
      min-width: unset;
    }
  }
</style>
