<script lang="ts">
  import type { HTMLDetailsAttributes } from 'svelte/elements'

  interface Props extends HTMLDetailsAttributes {
    open?: boolean
    summary?: string | null
    disabled?: boolean
    summarySnippet?: import('svelte').Snippet
    children?: import('svelte').Snippet
  }

  let {
    open = $bindable(false),
    summary = null,
    name = undefined,
    disabled = false,
    style = undefined,
    summarySnippet,
    children,
    ...rest
  }: Props = $props()
</script>

<details
  class="details {rest.class || ''}"
  class:disabled
  bind:open
  {name}
  {style}
  {...rest}
>
  <summary class="details-summary">
    {#if summarySnippet}
      {@render summarySnippet()}
    {:else}
      {summary ?? ''}
    {/if}
    <span class="details-marker" aria-hidden="true"></span>
  </summary>
  <div class="details-content">
    {@render children?.()}
  </div>
</details>

<style>
  .details {
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    border-radius: var(--radius-2, 4px);
    background-color: var(--surface-1, var(--white, #fff));
    color: var(--text-1, var(--fore, currentColor));
  }

  .details.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .details-summary {
    padding: var(--size-3, 0.75rem) var(--size-4, 1rem);
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-2, 0.5rem);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-weight: 500;
    user-select: none;
  }

  .details-summary::-webkit-details-marker {
    display: none;
  }

  .details-summary::marker {
    content: '';
  }

  .details-marker {
    display: inline-block;
    width: 0.5em;
    height: 0.5em;
    border-right: var(--border-size-2, 2px) solid currentColor;
    border-bottom: var(--border-size-2, 2px) solid currentColor;
    transform: rotate(-45deg);
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .details[open] > .details-summary .details-marker {
    transform: rotate(45deg);
  }

  .details-summary:hover {
    background-color: var(--gray-100, #f5f5f5);
  }

  .details-content {
    padding: var(--size-3, 0.75rem) var(--size-4, 1rem);
    border-top: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
  }
</style>
