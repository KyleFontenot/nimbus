<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  let uid = 0

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value?: string
    placeholder?: string
    searchFn: (query: string) => unknown[] | Promise<unknown[]>
    onResultClick?: ((result: unknown) => void) | undefined
    onEmptyValue?: (() => void) | undefined
    delay?: number
    name?: string | null
    form?: string | undefined
    resultSnippet?: Snippet<[unknown]>
    children?: Snippet
  }

  let {
    value = $bindable(''),
    placeholder = 'Search...',
    searchFn,
    onResultClick = undefined,
    onEmptyValue = undefined,
    delay = 400,
    name = null,
    form = undefined,
    resultSnippet,
    style = undefined,
    children,
    ...rest
  }: Props = $props()

  const listboxId = `search-results-${uid++}`

  let results: unknown[] = $state([])
  let showResults = $state(false)
  let loading = $state(false)
  let activeIndex = $state(-1)
  let debounceTimer: ReturnType<typeof setTimeout> | undefined = $state()
  let wrapperEl: HTMLDivElement | undefined = $state()

  let activeDescendant = $derived(
    showResults && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
  )

  function handleInput() {
    clearTimeout(debounceTimer)

    activeIndex = -1

    if (!value.trim()) {
      results = []
      showResults = false
      loading = false
      onEmptyValue?.()
      return
    }

    loading = true
    debounceTimer = setTimeout(async () => {
      const searchResults = await searchFn(value)
      if (Array.isArray(searchResults)) {
        results = searchResults
        showResults = results.length > 0
      }
      loading = false
    }, delay)
  }

  function handleFocus() {
    if (results.length > 0) showResults = true
  }

  function handleResultClick(result: unknown) {
    onResultClick?.(result)
    showResults = false
    activeIndex = -1
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      showResults = false
      activeIndex = -1
    } else if (e.key === 'ArrowDown' && showResults && results.length > 0) {
      e.preventDefault()
      activeIndex = activeIndex < results.length - 1 ? activeIndex + 1 : 0
    } else if (e.key === 'ArrowUp' && showResults && results.length > 0) {
      e.preventDefault()
      activeIndex = activeIndex > 0 ? activeIndex - 1 : results.length - 1
    } else if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex] !== undefined) {
      e.preventDefault()
      handleResultClick(results[activeIndex])
    }
  }

  $effect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperEl && !wrapperEl.contains(e.target as Node)) {
        showResults = false
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => document.removeEventListener('click', handleClickOutside, true)
  })
</script>

<div class="search {rest.class || ''}" bind:this={wrapperEl} {style} {...rest}>
  <div class="search-input-wrapper">
    <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M8.5 3a5.5 5.5 0 014.383 8.823l4.147 4.147a.75.75 0 01-1.06 1.06l-4.147-4.147A5.5 5.5 0 118.5 3zm0 1.5a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
    <input
      type="search"
      class="search-input"
      bind:value
      {placeholder}
      {name}
      {form}
      oninput={handleInput}
      onfocus={handleFocus}
      onkeydown={handleKeydown}
      aria-label={placeholder}
      role="combobox"
      aria-expanded={showResults}
      aria-haspopup="listbox"
      aria-controls={listboxId}
      aria-autocomplete="list"
      aria-activedescendant={activeDescendant}
    />
    {#if loading}
      <span class="search-loading" aria-hidden="true"></span>
    {/if}
  </div>

  {#if showResults && results.length > 0}
    <div class="search-results" id={listboxId} role="listbox">
      {#each results as result, i}
        <button
          id="{listboxId}-{i}"
          class="search-result"
          class:active={activeIndex === i}
          type="button"
          role="option"
          aria-selected={activeIndex === i}
          tabindex="-1"
          onclick={() => handleResultClick(result)}
          onmouseenter={() => (activeIndex = i)}
        >
          {#if resultSnippet}
            {@render resultSnippet(result)}
          {:else}
            {String(result)}
          {/if}
        </button>
      {/each}
    </div>
  {/if}

  {#if children}
    {@render children()}
  {/if}
</div>

<style>
  .search {
    position: relative;
    width: 100%;
    max-width: 25rem;
    margin-inline: auto;
  }

  .search-input-wrapper {
    display: flex;
    align-items: center;
    gap: var(--size-1, 0.35rem);
    padding: var(--size-2, 0.5rem) var(--size-3, 0.75rem);
    background-color: var(--surface-1);
    border: var(--border-size-1, 1px) solid var(--gray-300, #ccc);
    border-radius: var(--radius-2, 6px);
    box-shadow: var(--shadow-1, 0 1px 3px -1px rgba(0, 0, 0, 0.1));
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .search-input-wrapper:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 20%, transparent);
  }

  .search-icon {
    width: 1rem;
    height: 1rem;
    color: var(--gray-400, #aaa);
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-family: var(--font-sans);
    font-size: var(--font-size-1, 0.95rem);
    color: var(--text-1);
    min-width: 0;
  }

  .search-input::placeholder {
    color: var(--gray-400, #aaa);
  }

  .search-input::-webkit-search-cancel-button,
  .search-input::-webkit-search-decoration {
    appearance: none;
  }

  .search-loading {
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--gray-200, #ddd);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .search-results {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: var(--layer-3, 50);
    background-color: var(--surface-1);
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    border-radius: var(--radius-2, 6px);
    box-shadow: var(--shadow-3, 0 4px 14px -4px rgba(0, 0, 0, 0.2));
    overflow: hidden;
    max-height: 20rem;
    overflow-y: auto;
  }

  .search-result {
    display: block;
    width: 100%;
    text-align: left;
    padding: var(--size-2, 0.5rem) var(--size-3, 0.75rem);
    border: none;
    background: none;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: var(--font-size-1, 0.9rem);
    color: var(--text-1);
    border-bottom: var(--border-size-1, 1px) solid var(--gray-100, #f0f0f0);
    transition: background-color 0.1s;
  }

  .search-result:last-child {
    border-bottom: none;
  }

  .search-result:hover,
  .search-result.active {
    background-color: var(--gray-50, #f9f9f9);
  }

  .search-result:focus-visible {
    outline: var(--focus-size, 2px) solid var(--accent);
    outline-offset: -2px;
  }
</style>
