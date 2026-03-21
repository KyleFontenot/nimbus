<script lang="ts">
  import type { HTMLFieldsetAttributes } from 'svelte/elements'

  interface Props extends HTMLFieldsetAttributes {
    options?: Array<{ value: string; label?: string; disabled?: boolean }>
    value?: string
    direction?: 'row' | 'column'
    children?: import('svelte').Snippet
  }

  let {
    name,
    options = [],
    value = $bindable(''),
    id = undefined,
    disabled = false,
    required = false,
    direction = 'column',
    form = undefined,
    style = undefined,
    children,
    ...rest
  }: Props = $props()
</script>

<fieldset
  class="radio-group {rest.class || ''}"
  class:row={direction === 'row'}
  class:column={direction === 'column'}
  {style}
  {disabled}
  {...rest}
>
  {#each options as option}
    <label class="radio-label" class:disabled={option.disabled || disabled}>
      <input
        class="radio-input"
        type="radio"
        {name}
        {required}
        {form}
        value={option.value}
        disabled={option.disabled || disabled}
        checked={value === option.value}
        onchange={() => (value = option.value)}
      />
      <span class="radio-control"></span>
      <span class="radio-text">{option.label ?? option.value}</span>
    </label>
  {/each}
  {#if children}
    {@render children()}
  {/if}
</fieldset>

<style>
  .radio-group {
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: var(--size-2, 0.5rem);
  }

  .column { flex-direction: column; }
  .row {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--size-4, 1rem);
  }

  .radio-label {
    display: inline-flex;
    align-items: center;
    gap: var(--size-2, 0.5rem);
    cursor: pointer;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 1rem);
    color: var(--text-1, var(--fore, currentColor));
    user-select: none;
  }

  .radio-label.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .radio-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .radio-control {
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    border: var(--border-size-2, 2px) solid var(--gray-400, #999);
    border-radius: var(--radius-round, 50%);
    background-color: var(--surface-1, var(--white, #fff));
    flex-shrink: 0;
    position: relative;
    transition: border-color 0.15s ease;
  }

  .radio-control::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 0.55rem;
    height: 0.55rem;
    border-radius: var(--radius-round, 50%);
    background-color: var(--accent, var(--primary, royalblue));
    transition: transform 0.15s ease;
  }

  .radio-input:checked + .radio-control {
    border-color: var(--accent, var(--primary, royalblue));
  }

  .radio-input:checked + .radio-control::after {
    transform: translate(-50%, -50%) scale(1);
  }

  .radio-input:focus-visible + .radio-control {
    outline: var(--focus-size, 2px) solid var(--accent, var(--link, royalblue));
    outline-offset: var(--focus-offset, 2px);
  }
</style>
