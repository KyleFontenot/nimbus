<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import Spinner from '../components/Spinner.svelte'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value?: string
    placeholder?: string
    loading?: boolean
    name?: string | undefined
    id?: string | undefined
    form?: string | undefined
    shortcutHint?: string | undefined
    onsubmit?: ((e: SubmitEvent) => void) | undefined
    children?: Snippet
  }

  let {
    value = $bindable(''),
    placeholder = 'Search...',
    loading = false,
    name = undefined,
    id = undefined,
    form = undefined,
    shortcutHint = undefined,
    onsubmit = undefined,
    children,
    style = undefined,
    ...rest
  }: Props = $props()

  let inputEl: HTMLInputElement | undefined = $state()

  function handleClear() {
    value = ''
    inputEl?.focus()
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    onsubmit?.(e)
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && value) {
      e.preventDefault()
      handleClear()
    }
  }
</script>

<div
  class="search-field {rest.class || ''}"
  {style}
  {...rest}
>
  <form
    class="search-field-form"
    {form}
    onsubmit={handleSubmit}
    role="search"
  >
    <div class="search-field-input-wrapper">
      <svg class="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M8.5 3a5.5 5.5 0 014.383 8.823l4.147 4.147a.75.75 0 01-1.06 1.06l-4.147-4.147A5.5 5.5 0 118.5 3zm0 1.5a4 4 0 100 8 4 4 0 000-8z" fill="currentColor" />
      </svg>

      <input
        bind:this={inputEl}
        bind:value
        type="search"
        class="search-field-input"
        {placeholder}
        {name}
        {id}
        onkeydown={handleKeydown}
        aria-label={placeholder}
      />

      {#if loading}
        <span class="search-field-loading">
          <Spinner size="small" label="Searching" />
        </span>
      {:else if value}
        <button
          type="button"
          class="search-field-clear"
          onclick={handleClear}
          aria-label="Clear search"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      {/if}

      {#if shortcutHint && !value}
        <kbd class="search-field-shortcut">{shortcutHint}</kbd>
      {/if}
    </div>
  </form>

  {#if children}
    <div class="search-field-results">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .search-field {
    position: relative;
    width: 100%;
  }

  .search-field-form {
    display: contents;
  }

  .search-field-input-wrapper {
    display: flex;
    align-items: center;
    gap: var(--size-1, 0.35rem);
    padding: var(--size-2, 0.5rem) var(--size-3, 0.75rem);
    background-color: var(--surface-1, #fff);
    border: var(--border-size-1, 1px) solid var(--gray-300, #ccc);
    border-radius: var(--radius-2, 6px);
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .search-field-input-wrapper:focus-within {
    border-color: var(--accent, var(--primary, royalblue));
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent, var(--primary, royalblue)) 20%, transparent);
  }

  .search-icon {
    width: 1.1rem;
    height: 1.1rem;
    color: var(--gray-400, #aaa);
    flex-shrink: 0;
  }

  .search-field-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    color: var(--gray-900, var(--black, #222));
    min-width: 0;
  }

  .search-field-input::placeholder {
    color: var(--gray-400, #aaa);
  }

  /* Remove default search input styling */
  .search-field-input::-webkit-search-cancel-button,
  .search-field-input::-webkit-search-decoration {
    -webkit-appearance: none;
    appearance: none;
  }

  .search-field-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
    border: none;
    background: var(--gray-200, #e0e0e0);
    border-radius: var(--radius-round, 50%);
    color: var(--gray-600, #666);
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 0.15s;
  }

  .search-field-clear:hover {
    background: var(--gray-300, #ccc);
  }

  .search-field-clear:focus-visible {
    outline: 2px solid var(--accent, var(--primary, royalblue));
    outline-offset: 2px;
  }

  .search-field-clear svg {
    width: 0.7rem;
    height: 0.7rem;
  }

  .search-field-loading {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .search-field-shortcut {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-00, 0.7rem);
    color: var(--gray-400, #aaa);
    background: var(--gray-100, #f0f0f0);
    border: var(--border-size-1, 1px) solid var(--gray-200, #ddd);
    border-radius: var(--radius-1, 3px);
    padding: 0.1em 0.4em;
    line-height: 1.4;
    white-space: nowrap;
    flex-shrink: 0;
    pointer-events: none;
  }

  .search-field-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 100;
    margin-top: var(--size-1, 0.25rem);
    background-color: var(--surface-1, #fff);
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    border-radius: var(--radius-2, 6px);
    box-shadow: var(--shadow-3, 0 4px 14px -4px #88888888);
    overflow: hidden;
  }
</style>
