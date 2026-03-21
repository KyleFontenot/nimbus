<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  interface Props extends HTMLInputAttributes {
    value?: number
    label?: string | null
    showValue?: boolean
  }

  let {
    value = $bindable(50),
    min = 0,
    max = 100,
    step = 1,
    name = null,
    id = undefined,
    label = null,
    disabled = false,
    required = false,
    showValue = false,
    form = undefined,
    style = undefined,
    ...rest
  }: Props = $props()

  let percent = $derived(((value - min) / (max - min)) * 100)
</script>

{#if label}
  <label class="range-label" for={id}>
    <span class="range-label-text">{label}</span>
    {#if showValue}
      <span class="range-label-value">{value}</span>
    {/if}
  </label>
{/if}
<input
  class="range {rest.class || ''}"
  type="range"
  bind:value
  {min}
  {max}
  {step}
  {name}
  {id}
  {disabled}
  {required}
  {form}
  {style}
  style:--range-percent="{percent}%"
  aria-label={label}
  {...rest}
/>

<style>
  .range-label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: var(--size-1, 0.25rem);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.9rem);
    color: var(--text-1, var(--fore, currentColor));
  }

  .range-label-value {
    font-variant-numeric: tabular-nums;
    color: var(--gray-500, #888);
    font-size: var(--font-size-0, 0.8rem);
  }

  .range {
    display: block;
    width: 100%;
    height: 0.4rem;
    appearance: none;
    background: linear-gradient(
      to right,
      var(--accent, var(--primary, royalblue)) 0%,
      var(--accent, var(--primary, royalblue)) var(--range-percent, 50%),
      var(--gray-200, #e0e0e0) var(--range-percent, 50%),
      var(--gray-200, #e0e0e0) 100%
    );
    border-radius: var(--radius-round, 999px);
    outline: none;
    cursor: pointer;
    border: none;
  }

  .range:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .range::-webkit-slider-thumb {
    appearance: none;
    width: 1.2rem;
    height: 1.2rem;
    background-color: var(--accent, var(--primary, royalblue));
    border-radius: var(--radius-round, 50%);
    border: 2px solid var(--surface-1, var(--white, #fff));
    box-shadow: var(--shadow-2, 0 1px 3px rgba(0, 0, 0, 0.25));
    cursor: pointer;
  }

  .range::-moz-range-thumb {
    width: 1.2rem;
    height: 1.2rem;
    background-color: var(--accent, var(--primary, royalblue));
    border-radius: var(--radius-round, 50%);
    border: 2px solid var(--surface-1, var(--white, #fff));
    box-shadow: var(--shadow-2, 0 1px 3px rgba(0, 0, 0, 0.25));
    cursor: pointer;
  }

  .range:focus-visible {
    outline: var(--focus-size, 2px) solid var(--accent, var(--link, royalblue));
    outline-offset: var(--focus-offset, 4px);
  }
</style>
