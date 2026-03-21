<script lang="ts">
  interface Props {
    style?: string | undefined
    status?: 'success' | 'failure' | null
    padding?: string | undefined
    header?: import('svelte').Snippet
    footer?: import('svelte').Snippet
    children?: import('svelte').Snippet
    [key: string]: unknown
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
  style:--card-padding={padding}
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
    border-radius: var(--radius-3, 8px);
    box-shadow: var(--shadow-2, 0 2px 7px -2px rgba(0, 0, 0, 0.15));
    background-color: var(--surface-1, var(--white, #fff));
    color: var(--text-1, var(--fore, currentColor));
    overflow: hidden;
  }

  .card-header {
    padding: var(--card-padding, var(--size-3, 0.75rem)) var(--card-padding, var(--size-4, 1rem));
    border-bottom: var(--border-size-1, 1px) solid var(--gray-100, #f0f0f0);
    font-weight: var(--font-weight-6, 600);
  }

  .card-body {
    padding: var(--card-padding, var(--size-3, 0.75rem)) var(--card-padding, var(--size-4, 1rem));
  }

  .card-footer {
    padding: var(--card-padding, var(--size-3, 0.75rem)) var(--card-padding, var(--size-4, 1rem));
    border-top: var(--border-size-1, 1px) solid var(--gray-100, #f0f0f0);
  }

  .success {
    color: var(--green-9, var(--secondary, #2e7d32));
    background-color: var(--green-1, var(--secondary-3, #e8f5e9));
    border: var(--border-size-1, 1px) solid var(--green-3, #a5d6a7);
  }

  .failure {
    color: var(--red-9, var(--error, #c62828));
    background-color: var(--red-1, #ffebee);
    border: var(--border-size-1, 1px) solid var(--red-3, #ef9a9a);
  }
</style>
