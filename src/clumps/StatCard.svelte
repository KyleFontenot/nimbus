<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    label: string
    value: string | number
    trend?: 'up' | 'down' | 'neutral' | undefined
    trendValue?: string | undefined
    icon?: Snippet
    children?: Snippet
  }

  let {
    label,
    value,
    trend = undefined,
    trendValue = undefined,
    icon,
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<div
  class="stat-card {rest.class || ''}"
  {style}
  {...rest}
>
  <div class="stat-card-header">
    <span class="stat-card-label">{label}</span>
    {#if icon}
      <span class="stat-card-icon" aria-hidden="true">
        {@render icon()}
      </span>
    {/if}
  </div>

  <div class="stat-card-value">{value}</div>

  {#if trend || trendValue || children}
    <div class="stat-card-footer">
      {#if trend || trendValue}
        <span
          class="stat-card-trend"
          class:trend-up={trend === 'up'}
          class:trend-down={trend === 'down'}
          class:trend-neutral={trend === 'neutral'}
        >
          {#if trend === 'up'}
            <svg class="trend-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 2L10 7H2L6 2Z" fill="currentColor" />
            </svg>
          {:else if trend === 'down'}
            <svg class="trend-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 10L2 5H10L6 10Z" fill="currentColor" />
            </svg>
          {:else if trend === 'neutral'}
            <svg class="trend-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6H10" stroke="currentColor" stroke-width="2" />
            </svg>
          {/if}
          {#if trendValue}
            <span>{trendValue}</span>
          {/if}
        </span>
      {/if}
      {#if children}
        {@render children()}
      {/if}
    </div>
  {/if}
</div>

<style>
  .stat-card {
    display: flex;
    flex-direction: column;
    gap: var(--size-2, 0.5rem);
    padding: var(--size-3, 1rem) var(--size-4, 1.25rem);
    border-radius: var(--radius-2, 8px);
    background-color: var(--surface-1, var(--white-2, #fff));
    box-shadow: var(--shadow-2, 0 2px 7px -2px #88888888);
  }

  .stat-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-2, 0.5rem);
  }

  .stat-card-label {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-0, 0.85rem);
    font-weight: 500;
    color: var(--gray-500, #888);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    line-height: 1;
  }

  .stat-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-400, #bbb);
    flex-shrink: 0;
  }

  .stat-card-icon :global(svg) {
    width: 1.25rem;
    height: 1.25rem;
  }

  .stat-card-value {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-5, 2rem);
    font-weight: 700;
    color: var(--gray-900, var(--black, #222));
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .stat-card-footer {
    display: flex;
    align-items: center;
    gap: var(--size-2, 0.5rem);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-0, 0.85rem);
    color: var(--gray-500, #888);
  }

  .stat-card-trend {
    display: inline-flex;
    align-items: center;
    gap: 0.2em;
    font-weight: 600;
  }

  .trend-arrow {
    width: 0.75em;
    height: 0.75em;
    flex-shrink: 0;
  }

  .trend-up {
    color: var(--green-7, var(--secondary, #2e7d32));
  }

  .trend-down {
    color: var(--red-7, var(--error, #d32f2f));
  }

  .trend-neutral {
    color: var(--gray-500, #888);
  }
</style>
