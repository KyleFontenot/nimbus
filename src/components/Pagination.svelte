<script lang="ts">
  interface Props {
    page?: number
    total: number
    perPage?: number
    siblings?: number
    style?: string | undefined
    onchange?: (page: number) => void
    [key: string]: unknown
  }

  let {
    page = $bindable(1),
    total,
    perPage = 10,
    siblings = 1,
    style = undefined,
    onchange,
    ...rest
  }: Props = $props()

  let totalPages = $derived(Math.max(1, Math.ceil(total / perPage)))

  let pages = $derived.by(() => {
    const items: (number | '...')[] = []
    const left = Math.max(2, page - siblings)
    const right = Math.min(totalPages - 1, page + siblings)

    items.push(1)
    if (left > 2) items.push('...')
    for (let i = left; i <= right; i++) items.push(i)
    if (right < totalPages - 1) items.push('...')
    if (totalPages > 1) items.push(totalPages)

    return items
  })

  function goTo(p: number) {
    if (p < 1 || p > totalPages || p === page) return
    page = p
    onchange?.(page)
  }
</script>

<nav class="pagination {rest.class || ''}" aria-label="Pagination" {style} {...rest}>
  <button
    class="pagination-btn prev"
    type="button"
    disabled={page <= 1}
    aria-label="Previous page"
    onclick={() => goTo(page - 1)}
  >&lsaquo;</button>

  {#each pages as item}
    {#if item === '...'}
      <span class="pagination-ellipsis">&hellip;</span>
    {:else}
      <button
        class="pagination-btn"
        class:active={item === page}
        type="button"
        aria-label="Page {item}"
        aria-current={item === page ? 'page' : undefined}
        onclick={() => goTo(item)}
      >{item}</button>
    {/if}
  {/each}

  <button
    class="pagination-btn next"
    type="button"
    disabled={page >= totalPages}
    aria-label="Next page"
    onclick={() => goTo(page + 1)}
  >&rsaquo;</button>
</nav>

<style>
  .pagination {
    display: flex;
    align-items: center;
    gap: var(--size-1, 0.25rem);
    font-family: var(--font-sans, var(--font2, sans-serif));
  }

  .pagination-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 var(--size-2, 0.5rem);
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    border-radius: var(--radius-2, 4px);
    background-color: var(--surface-1, var(--white, #fff));
    color: var(--text-1, var(--fore, currentColor));
    font-size: var(--font-size-1, 0.9rem);
    cursor: pointer;
    transition: background-color 0.1s ease;
  }

  .pagination-btn:hover:not(:disabled):not(.active) {
    background-color: var(--gray-100, #f5f5f5);
  }

  .pagination-btn.active {
    background-color: var(--accent, var(--primary, royalblue));
    color: var(--gray-0, var(--white, #fff));
    border-color: var(--accent, var(--primary, royalblue));
  }

  .pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .pagination-btn:focus-visible {
    outline: var(--focus-size, 2px) solid var(--accent, var(--link, royalblue));
    outline-offset: var(--focus-offset, 1px);
  }

  .prev, .next {
    font-size: var(--font-size-3, 1.25rem);
    font-weight: 600;
  }

  .pagination-ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    color: var(--gray-400, #aaa);
  }
</style>
