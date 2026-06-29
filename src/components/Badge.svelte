<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
    size?: 'small' | 'medium' | 'large'
    pill?: boolean
    children?: import('svelte').Snippet
  }

  let {
    variant = 'default',
    size = 'medium',
    pill = false,
    style = undefined,
    children,
    ...rest
  }: Props = $props()
</script>

<span
  class="badge {variant} {size} {rest.class || ''}"
  class:pill
  {style}
  {...rest}
>
  {@render children?.()}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: var(--size-1, 0.25rem);
    font-family: var(--font-sans);
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    border-radius: var(--radius-2, 4px);
    border: var(--border-size-1, 1px) solid transparent;
  }

  .pill {
    border-radius: var(--radius-round, 999px);
  }

  /* Sizes */
  .small {
    font-size: var(--font-size-00, 0.7rem);
    padding: 0.15em 0.4em;
  }
  .medium {
    font-size: var(--font-size-0, 0.8rem);
    padding: 0.2em 0.55em;
  }
  .large {
    font-size: var(--font-size-1, 0.95rem);
    padding: 0.25em 0.65em;
  }

  /* Variants */
  .default {
    background-color: var(--gray-100);
    color: var(--gray-700);
    border-color: var(--gray-200);
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
  .info {
    background-color: var(--info-bg);
    color: var(--info);
    border-color: var(--info-border);
  }
</style>
