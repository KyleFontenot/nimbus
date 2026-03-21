<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  interface Props extends HTMLInputAttributes {
    type?: 'date' | 'datetime-local' | 'time' | 'month' | 'week'
    label?: string | null
    value?: string
    minimal?: boolean
    children?: import('svelte').Snippet
  }

  let {
    type = 'date',
    label = null,
    name = null,
    id = undefined,
    value = $bindable(''),
    min = undefined,
    max = undefined,
    step = undefined,
    disabled = false,
    required = false,
    readonly = false,
    placeholder = undefined,
    form = undefined,
    style = undefined,
    minimal = false,
    children,
    ...rest
  }: Props = $props()
</script>

{#if label}
  <label class="dateinput-label">
    {label}
    <input
      class="dateinput {rest.class || ''}"
      class:minimal
      {type}
      {name}
      {id}
      bind:value
      {min}
      {max}
      {step}
      {disabled}
      {required}
      {readonly}
      {placeholder}
      {form}
      {style}
      {...rest}
    />
    {#if children}
      {@render children()}
    {/if}
  </label>
{:else}
  <input
    class="dateinput {rest.class || ''}"
    class:minimal
    {type}
    {name}
    {id}
    bind:value
    {min}
    {max}
    {step}
    {disabled}
    {required}
    {readonly}
    {placeholder}
    {form}
    {style}
    {...rest}
  />
{/if}

<style>
  .dateinput-label {
    display: inline-block;
    font-weight: 400;
    font-family: var(--font-sans, var(--font2, sans-serif));
    line-height: var(--font-lineheight-3, 1.6);
  }

  .dateinput {
    padding: var(--size-2, 0.5rem) var(--size-3, 0.75rem);
    border: var(--border-size-1, 1px) solid var(--gray-400, #999);
    border-radius: var(--radius-2, 4px);
    background-color: var(--surface-1, var(--white, #fff));
    color: var(--text-1, var(--fore, currentColor));
    font-family: inherit;
    font-size: var(--font-size-1, 1rem);
    line-height: var(--font-lineheight-3, 1.6);
    display: block;
    width: 100%;
  }

  .dateinput:focus-visible {
    outline: var(--focus-size, 2px) solid var(--accent, var(--link, royalblue));
    outline-offset: var(--focus-offset, 1px);
  }

  .dateinput:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .minimal {
    border-color: var(--gray-200, #ccc9);
  }

  .dateinput::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
</style>
