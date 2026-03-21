<script lang="ts">
  interface Props {
    legend?: string | null
    disabled?: boolean
    form?: string | undefined
    name?: string | undefined
    style?: string | undefined
    children?: import('svelte').Snippet
    [key: string]: unknown
  }

  let {
    legend = null,
    disabled = false,
    form = undefined,
    name = undefined,
    style = undefined,
    children,
    ...rest
  }: Props = $props()
</script>

<fieldset
  class="fieldset {rest.class || ''}"
  {disabled}
  {form}
  {name}
  {style}
  {...rest}
>
  {#if legend}
    <legend class="fieldset-legend">{legend}</legend>
  {/if}
  {@render children?.()}
</fieldset>

<style>
  .fieldset {
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    border-radius: var(--radius-2, 6px);
    padding: var(--size-4, 1rem);
    margin: 0;
    background: transparent;
  }

  .fieldset:disabled {
    opacity: 0.5;
  }

  .fieldset-legend {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    font-weight: var(--font-weight-6, 600);
    color: var(--text-1, var(--fore, currentColor));
    padding-inline: var(--size-2, 0.5rem);
  }
</style>
