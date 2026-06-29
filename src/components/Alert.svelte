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
    font-family: var(--font-sans);
    font-size: var(--font-size-1, 0.95rem);
    line-height: var(--font-lineheight-3, 1.6);
  }

  .alert-content {
    flex: 1;
  }

  .info {
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
