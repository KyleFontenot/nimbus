<script lang="ts">
  interface Props {
    name?: string | null
    id?: string | null
    label?: string | null
    options?: Array<{ value: string; text?: string; disabled?: boolean }> | null
    value?: string | null
    blankDefault?: boolean
    blankLabel?: string
    disabled?: boolean
    required?: boolean
    multiple?: boolean
    form?: string | undefined
    style?: string | undefined
    children?: import('svelte').Snippet
    [key: string]: unknown
  }

  let {
    name = null,
    id = null,
    label = null,
    options = null,
    value = $bindable(null),
    blankDefault = false,
    blankLabel = '---',
    disabled = false,
    required = false,
    multiple = false,
    form = undefined,
    style = undefined,
    children,
    ...rest
  }: Props = $props()
</script>

{#if label}
  <label class="select-label" for={id}>
    {label}
  </label>
{/if}
<select
  class="select {rest.class || ''}"
  {name}
  {id}
  {disabled}
  {required}
  {multiple}
  {form}
  {style}
  bind:value
  {...rest}
>
  {#if blankDefault}
    <option value="">{blankLabel}</option>
  {/if}
  {#if options}
    {#each options as option}
      <option value={option.value} disabled={option.disabled}>{option.text ?? option.value}</option>
    {/each}
  {/if}
  {@render children?.()}
</select>

<style>
  .select-label {
    display: block;
    font-weight: 400;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.9rem);
    margin-bottom: var(--size-1, 0.25rem);
    color: var(--text-1, var(--fore, currentColor));
  }

  .select {
    display: block;
    width: 100%;
    padding: var(--size-2, 0.5rem) var(--size-3, 0.75rem);
    padding-right: var(--size-6, 2rem);
    border: var(--border-size-1, 1px) solid var(--gray-400, #999);
    border-radius: var(--radius-2, 4px);
    background-color: var(--surface-1, var(--white, #fff));
    color: var(--text-1, var(--fore, currentColor));
    font-family: inherit;
    font-size: var(--font-size-1, 1rem);
    line-height: var(--font-lineheight-3, 1.6);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    cursor: pointer;
  }

  .select:focus-visible {
    outline: var(--focus-size, 2px) solid var(--accent, var(--link, royalblue));
    outline-offset: var(--focus-offset, 1px);
  }

  .select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select[multiple] {
    padding-right: var(--size-3, 0.75rem);
    background-image: none;
    height: auto;
  }
</style>
