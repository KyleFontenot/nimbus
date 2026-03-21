<script lang="ts">
  interface Props {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
    size?: 'small' | 'medium' | 'large'
    pill?: boolean
    style?: string | undefined
    children?: import('svelte').Snippet
    [key: string]: unknown
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
    font-family: var(--font-sans, var(--font2, sans-serif));
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
    background-color: var(--gray-100, #f0f0f0);
    color: var(--gray-700, var(--black-2, #444));
    border-color: var(--gray-200, #ddd);
  }
  .success {
    background-color: var(--green-1, var(--secondary-3, #e8f5e9));
    color: var(--green-9, var(--secondary, #2e7d32));
    border-color: var(--green-3, var(--secondary, #a5d6a7));
  }
  .warning {
    background-color: var(--yellow-1, #fff8e1);
    color: var(--yellow-9, #f57f17);
    border-color: var(--yellow-3, #ffe082);
  }
  .error {
    background-color: var(--red-1, var(--secondray2, #ffebee));
    color: var(--red-9, var(--error, #c62828));
    border-color: var(--red-3, #ef9a9a);
  }
  .info {
    background-color: var(--blue-1, var(--primary-4, #e3f2fd));
    color: var(--blue-9, var(--primary, #1565c0));
    border-color: var(--blue-3, #90caf9);
  }
</style>
