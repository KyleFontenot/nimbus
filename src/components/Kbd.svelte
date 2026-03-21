<script lang="ts">
  interface Props {
    style?: string | undefined
    children?: import('svelte').Snippet
    [key: string]: unknown
  }

  let {
    style = undefined,
    children,
    ...rest
  }: Props = $props()
</script>

<kbd class="kbd {rest.class || ''}" {style} {...rest}>
  {@render children?.()}
</kbd>

<style>
  .kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5em;
    padding: 0.1em 0.35em;
    font-family: var(--font-mono, monospace);
    font-size: 0.85em;
    font-weight: var(--font-weight-5, 500);
    line-height: 1.4;
    color: var(--gray-700, var(--black-2, #444));
    background-color: var(--gray-50, #f9f9f9);
    border: var(--border-size-1, 1px) solid var(--gray-200, #ddd);
    border-bottom-width: 2px;
    border-radius: var(--radius-1, 3px);
    white-space: nowrap;
    vertical-align: baseline;
  }
</style>
