<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLElement> {
    label?: string
    removable?: boolean
    onremove?: () => void
    href?: string | null
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
    size?: 'small' | 'medium'
    children?: Snippet
  }

  let {
    label = '',
    removable = false,
    onremove,
    href = null,
    variant = 'default',
    size = 'medium',
    children,
    style = undefined,
    ...rest
  }: Props = $props()

  function handleRemove(e: Event) {
    e.preventDefault()
    e.stopPropagation()
    onremove?.()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (removable) {
        e.preventDefault()
        onremove?.()
      }
    }
  }
</script>

{#if href}
  <a
    {href}
    class="tag {variant} {size} {rest.class || ''}"
    {style}
    onkeydown={handleKeydown}
    {...rest}
  >
    <span class="tag-content">
      {#if children}
        {@render children()}
      {:else}
        {label}
      {/if}
    </span>
    {#if removable}
      <button
        type="button"
        class="remove-btn"
        aria-label="Remove {label}"
        onclick={handleRemove}
      >×</button>
    {/if}
  </a>
{:else}
  <span
    class="tag {variant} {size} {rest.class || ''}"
    role={removable ? 'group' : undefined}
    {style}
    onkeydown={handleKeydown}
    {...rest}
  >
    <span class="tag-content">
      {#if children}
        {@render children()}
      {:else}
        {label}
      {/if}
    </span>
    {#if removable}
      <button
        type="button"
        class="remove-btn"
        aria-label="Remove {label}"
        onclick={handleRemove}
      >×</button>
    {/if}
  </span>
{/if}

<style>
  .tag {
    display: inline-flex;
    align-items: center;
    gap: var(--size-1, 0.25rem);
    font-family: var(--font-sans);
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    border-radius: var(--radius-round, 999px);
    border: var(--border-size-1, 1px) solid transparent;
    text-decoration: none;
    cursor: default;
    transition: background-color 0.15s ease, box-shadow 0.15s ease;
  }

  a.tag {
    cursor: pointer;
  }

  a.tag:hover {
    filter: brightness(0.95);
  }

  a.tag:focus-visible,
  .tag:focus-visible {
    outline: var(--focus-size, 2px) solid var(--accent);
    outline-offset: 1px;
  }

  /* Sizes */
  .small {
    font-size: var(--font-size-00, 0.7rem);
    padding: 0.15em 0.5em;
  }
  .medium {
    font-size: var(--font-size-0, 0.8rem);
    padding: 0.25em 0.65em;
  }

  /* Variants */
  .default {
    background-color: var(--gray-100, #f0f0f0);
    color: var(--gray-700);
    border-color: var(--gray-200, #e0e0e0);
  }
  .primary {
    background-color: var(--info-bg);
    color: var(--info);
    border-color: var(--info-border);
  }
  .success {
    background-color: var(--success-bg);
    color: var(--success);
    border-color: var(--success-border);
  }
  .warning {
    background-color: var(--warning-bg);
    color: var(--warning);
    border-color: var(--warning-border);
  }
  .error {
    background-color: var(--error-bg);
    color: var(--error);
    border-color: var(--error-border);
  }

  .tag-content {
    display: inline-flex;
    align-items: center;
  }

  .remove-btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.1em;
    line-height: 1;
    width: 1.1em;
    height: 1.1em;
    border-radius: var(--radius-round, 999px);
    opacity: 0.7;
    transition: opacity 0.15s ease, background-color 0.15s ease;
  }

  .remove-btn:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .remove-btn:focus-visible {
    outline: var(--focus-size, 2px) solid var(--accent);
    opacity: 1;
  }
</style>
