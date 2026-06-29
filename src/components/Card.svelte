<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    status?: 'success' | 'failure' | null
    padding?: string | undefined
    header?: import('svelte').Snippet
    footer?: import('svelte').Snippet
    children?: import('svelte').Snippet
  }

  let {
    style = undefined,
    status = null,
    padding = undefined,
    header,
    footer,
    children,
    ...rest
  }: Props = $props()
</script>

<div
  class="card {rest.class || ''}"
  class:success={status === 'success'}
  class:failure={status === 'failure'}
  style:--padding={padding}
  {style}
  {...rest}
>
  {#if header}
    <div class="card-header">
      {@render header()}
    </div>
  {/if}
  <div class="card-body">
    {@render children?.()}
  </div>
  {#if footer}
    <div class="card-footer">
      {@render footer()}
    </div>
  {/if}
</div>

<style>
  .card {
    border-radius: var(--radius, var(--radius-3));
    box-shadow: var(--shadow, var(--shadow-2));
    background-color: var(--surface-1);
    color: var(--text-1);
    overflow: hidden;
  }

  .card-header {
    padding: var(--padding, var(--size-4));
    border-bottom: var(--border);
    font-weight: var(--font-weight-6);
  }

  .card-body {
    padding: var(--padding, var(--size-4));
  }

  .card-footer {
    padding: var(--padding, var(--size-4));
    border-top: var(--border);
  }

  .success {
    color: var(--success);
    background-color: var(--success-bg);
    border: var(--border-size-1) solid var(--success-border);
  }

  .failure {
    color: var(--error);
    background-color: var(--error-bg);
    border: var(--border-size-1) solid var(--error-border);
  }
</style>
