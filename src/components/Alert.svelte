<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    variant?: 'info' | 'success' | 'warning' | 'error'
    dismissible?: boolean
    children?: import('svelte').Snippet
  }

  let {
    variant = 'info',
    dismissible = false,
    style = undefined,
    children,
    ...rest
  }: Props = $props()

  let visible = $state(true)
</script>

{#if visible}
  <div
    class="alert {variant} {rest.class || ''}"
    role="alert"
    {style}
    {...rest}
  >
    <div class="alert-content">
      {@render children?.()}
    </div>
    {#if dismissible}
      <button
        class="alert-dismiss"
        type="button"
        aria-label="Dismiss"
        onclick={() => (visible = false)}
      >&times;</button>
    {/if}
  </div>
{/if}

<style>
  .alert {
    display: flex;
    align-items: flex-start;
    gap: var(--size-3, 0.75rem);
    padding: var(--size-3, 0.75rem) var(--size-4, 1rem);
    border-radius: var(--radius-2, 4px);
    border: var(--border-size-1, 1px) solid transparent;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    line-height: var(--font-lineheight-3, 1.6);
  }

  .alert-content {
    flex: 1;
  }

  .info {
    background-color: var(--blue-1, var(--primary-4, #e3f2fd));
    color: var(--blue-9, var(--primary, #1565c0));
    border-color: var(--blue-3, #90caf9);
  }
  .success {
    background-color: var(--green-1, var(--secondary-3, #e8f5e9));
    color: var(--green-9, var(--secondary, #2e7d32));
    border-color: var(--green-3, #a5d6a7);
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

  .alert-dismiss {
    background: none;
    border: none;
    font-size: var(--font-size-3, 1.25rem);
    cursor: pointer;
    color: inherit;
    opacity: 0.6;
    line-height: 1;
    padding: 0 var(--size-1, 0.25rem);
    flex-shrink: 0;
  }

  .alert-dismiss:hover {
    opacity: 1;
  }
</style>
