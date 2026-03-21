<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import Table from '../components/Table.svelte'
  import Input from '../components/Input.svelte'
  import Pagination from '../components/Pagination.svelte'

  interface Column {
    key: string
    label: string
    sortable?: boolean
  }

  interface Props extends HTMLAttributes<HTMLDivElement> {
    data: any[]
    columns: Column[]
    searchable?: boolean
    searchKeys?: string[]
    pageSize?: number
    page?: number
    children?: Snippet<[any]>
  }

  let {
    data,
    columns,
    searchable = false,
    searchKeys = [],
    pageSize = 10,
    page = $bindable(1),
    children,
    style = undefined,
    ...rest
  }: Props = $props()

  let searchQuery = $state('')
  let sortKey = $state<string | null>(null)
  let sortDir = $state<'asc' | 'desc'>('asc')

  let filteredData = $derived.by(() => {
    let result = data

    if (searchable && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      const keys = searchKeys.length > 0 ? searchKeys : columns.map(c => c.key)
      result = result.filter(row =>
        keys.some(key => {
          const val = row[key]
          return val != null && String(val).toLowerCase().includes(q)
        })
      )
    }

    if (sortKey) {
      const key = sortKey
      const dir = sortDir === 'asc' ? 1 : -1
      result = [...result].sort((a, b) => {
        const aVal = a[key]
        const bVal = b[key]
        if (aVal == null && bVal == null) return 0
        if (aVal == null) return dir
        if (bVal == null) return -dir
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * dir
        }
        return String(aVal).localeCompare(String(bVal)) * dir
      })
    }

    return result
  })

  let totalItems = $derived(filteredData.length)
  let totalPages = $derived(Math.max(1, Math.ceil(totalItems / pageSize)))

  let paginatedData = $derived.by(() => {
    const start = (page - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  })

  $effect(() => {
    // Reset to page 1 when search changes
    searchQuery
    page = 1
  })

  function handleSort(key: string) {
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey = key
      sortDir = 'asc'
    }
  }

  function getSortIndicator(key: string): string {
    if (sortKey !== key) return ''
    return sortDir === 'asc' ? ' \u25B2' : ' \u25BC'
  }
</script>

<div class="data-table {rest.class || ''}" {style} {...rest}>
  {#if searchable}
    <div class="data-table-search">
      <Input
        type="text"
        placeholder="Search..."
        bind:value={searchQuery}
        minimal
      />
    </div>
  {/if}

  <Table alternatingrows>
    <thead>
      <tr>
        {#each columns as col}
          <th>
            {#if col.sortable}
              <button
                class="sort-button"
                type="button"
                onclick={() => handleSort(col.key)}
                aria-label="Sort by {col.label}"
              >
                {col.label}{getSortIndicator(col.key)}
              </button>
            {:else}
              {col.label}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each paginatedData as row}
        {#if children}
          {@render children(row)}
        {:else}
          <tr>
            {#each columns as col}
              <td>{row[col.key] ?? ''}</td>
            {/each}
          </tr>
        {/if}
      {/each}
      {#if paginatedData.length === 0}
        <tr>
          <td colspan={columns.length}>
            <div class="data-table-empty">No results found.</div>
          </td>
        </tr>
      {/if}
    </tbody>
  </Table>

  {#if totalPages > 1}
    <div class="data-table-pagination">
      <Pagination bind:page total={totalItems} perPage={pageSize} />
    </div>
  {/if}
</div>

<style>
  .data-table {
    display: flex;
    flex-direction: column;
    gap: var(--size-3, 0.75rem);
    width: 100%;
  }

  .data-table-search {
    max-width: 20rem;
  }

  .sort-button {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 500;
    font-family: inherit;
    font-size: inherit;
    color: var(--text-1, var(--fore, currentColor));
    padding: 0;
    white-space: nowrap;
    user-select: none;
  }

  .sort-button:hover {
    color: var(--accent, var(--primary, royalblue));
  }

  .sort-button:focus-visible {
    outline: var(--focus-size, 2px) solid var(--accent, var(--primary, royalblue));
    outline-offset: 2px;
  }

  .data-table-empty {
    text-align: center;
    padding: var(--size-5, 1.5rem) var(--size-3, 0.75rem);
    color: var(--gray-500, #888);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
  }

  .data-table-pagination {
    display: flex;
    justify-content: center;
    margin-top: var(--size-2, 0.5rem);
  }
</style>
