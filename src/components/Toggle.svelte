<script lang="ts">
  interface Props {
    checked?: boolean
    name?: string | null
    id?: string | undefined
    label?: string | null
    disabled?: boolean
    required?: boolean
    value?: string
    form?: string | undefined
    style?: string | undefined
    children?: import('svelte').Snippet
    [key: string]: unknown
  }

  let {
    checked = $bindable(false),
    name = null,
    id = undefined,
    label = null,
    disabled = false,
    required = false,
    value = 'on',
    form = undefined,
    style = undefined,
    children,
    ...rest
  }: Props = $props()
</script>

<label class="toggle-label {rest.class || ''}" class:disabled {style} {...rest}>
  {#if name}
    <input type="hidden" {name} value={checked ? value : ''} {form} />
  {/if}
  <input
    class="toggle-input"
    type="checkbox"
    bind:checked
    name={null}
    {id}
    {disabled}
    {required}
    {value}
  />
  <span class="toggle-track">
    <span class="toggle-thumb"></span>
  </span>
  {#if label}
    <span class="toggle-text">{label}</span>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</label>

<style>
  .toggle-label {
    display: inline-flex;
    align-items: center;
    gap: var(--size-2, 0.5rem);
    cursor: pointer;
    user-select: none;
    font-family: var(--font-sans, var(--font2, sans-serif));
  }

  .toggle-label.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .toggle-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .toggle-track {
    position: relative;
    display: inline-block;
    width: 2.75rem;
    height: 1.5rem;
    background-color: var(--gray-300, #ccc);
    border-radius: var(--radius-round, 999px);
    transition: background-color 0.2s ease;
    flex-shrink: 0;
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: calc(1.5rem - 4px);
    height: calc(1.5rem - 4px);
    background-color: var(--surface-1, var(--white, #fff));
    border-radius: var(--radius-round, 999px);
    transition: transform 0.2s ease;
    box-shadow: var(--shadow-2, 0 1px 3px rgba(0, 0, 0, 0.2));
  }

  .toggle-input:checked + .toggle-track {
    background-color: var(--accent, var(--primary, royalblue));
  }

  .toggle-input:checked + .toggle-track .toggle-thumb {
    transform: translateX(1.25rem);
  }

  .toggle-input:focus-visible + .toggle-track {
    outline: var(--focus-size, 2px) solid var(--accent, var(--link, royalblue));
    outline-offset: var(--focus-offset, 2px);
  }

  .toggle-text {
    font-size: var(--font-size-1, 1rem);
    color: var(--text-1, var(--fore, currentColor));
  }
</style>
