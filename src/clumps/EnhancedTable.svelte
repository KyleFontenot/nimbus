<script lang="ts" module>
  import { SvelteSet } from 'svelte/reactivity'

  export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'other'

  export interface EnhancedColumn {
    key: string
    label: string
    type: ColumnType
    hidden: boolean
  }

  export type SortDirection = 'asc' | 'desc'
  export type Comparator<T> = (a: T, b: T) => number

  export interface MutableStringSet {
    has(key: string): boolean
    add(key: string): void
    delete(key: string): void
  }

  export interface EnhancedTableOptions<T extends Record<string, unknown>> {
    data?: T[]
    columnLabels?: Record<string, string>
    typeOverrides?: Record<string, ColumnType>
    excludeColumns?: string[]
    searchExclude?: string[]
    sortComparators?: Record<string, Comparator<T> | { asc: Comparator<T>; desc: Comparator<T> }>
    filterFn?: (row: T, query: string, searchableKeys: string[]) => boolean
    hiddenColumns?: MutableStringSet
    typeSampleSize?: number
  }

  function inferColumnType<T extends Record<string, unknown>>(
    rows: T[],
    key: string,
    sampleSize: number
  ): ColumnType {
    const limit = Math.min(rows.length, sampleSize)
    for (let i = 0; i < limit; i++) {
      const val = rows[i][key]
      if (val === null || val === undefined || val === '') continue
      if (val instanceof Date) return 'date'
      const t = typeof val
      if (t === 'number' || t === 'string' || t === 'boolean') return t
      return 'other'
    }
    return 'other'
  }

  function defaultComparator<T extends Record<string, unknown>>(
    type: ColumnType,
    key: string
  ): Comparator<T> {
    switch (type) {
      case 'number':
        return (a, b) => (a[key] as number) - (b[key] as number)
      case 'boolean':
        return (a, b) => Number(a[key]) - Number(b[key])
      case 'date':
        return (a, b) => new Date(a[key] as never).getTime() - new Date(b[key] as never).getTime()
      case 'string':
        return (a, b) =>
          String(a[key]).localeCompare(String(b[key]), undefined, {
            sensitivity: 'base',
            numeric: true,
          })
      default:
        return () => 0
    }
  }

  function withNullsLast<T extends Record<string, unknown>>(
    comparator: Comparator<T>,
    key: string
  ): Comparator<T> {
    return (a, b) => {
      const av = a[key]
      const bv = b[key]
      const aEmpty = av === null || av === undefined || av === ''
      const bEmpty = bv === null || bv === undefined || bv === ''
      if (aEmpty && bEmpty) return 0
      if (aEmpty) return 1
      if (bEmpty) return -1
      return comparator(a, b)
    }
  }

  function defaultFilter<T extends Record<string, unknown>>(
    row: T,
    query: string,
    searchableKeys: string[]
  ): boolean {
    const q = query.toLowerCase()
    return searchableKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q))
  }

  /**
   * Reactive filter/sort/column-visibility state for EnhancedTable. Construct one directly
   * when you need to drive a table from outside the component (e.g. an external search box),
   * otherwise just pass `data` to <EnhancedTable> and let it create its own.
   */
  export class EnhancedTableStore<T extends Record<string, unknown>> {
    all: T[] = $state([])
    query: string = $state('')
    sortKey: string | null = $state(null)
    sortDirection: SortDirection = $state('asc')
    hiddenColumns: MutableStringSet

    columnLabels: Record<string, string>
    typeOverrides: Record<string, ColumnType>
    excludeColumns: string[]
    searchExclude: string[]
    sortComparators: Record<string, Comparator<T> | { asc: Comparator<T>; desc: Comparator<T> }>
    filterFn: (row: T, query: string, searchableKeys: string[]) => boolean
    typeSampleSize: number

    #inferredTypes: Record<string, ColumnType> = $state({})

    columns: EnhancedColumn[] = $derived.by(() => {
      if (!this.all.length) return []
      return Object.keys(this.all[0])
        .filter((key) => !this.excludeColumns.includes(key))
        .map((key) => ({
          key,
          label: this.columnLabels[key] ?? key,
          type: this.typeOverrides[key] ?? this.#inferredTypes[key] ?? 'other',
          hidden: this.hiddenColumns.has(key),
        }))
    })

    searchableKeys: string[] = $derived(
      this.columns.filter((c) => !this.searchExclude.includes(c.key)).map((c) => c.key)
    )

    rows: T[] = $derived.by(() => {
      let results = this.all

      const q = this.query.trim()
      if (q) {
        results = results.filter((row) => this.filterFn(row, q, this.searchableKeys))
      }

      if (!this.sortKey) return results

      const comparator = this.#resolveComparator(this.sortKey)
      return [...results].sort(comparator)
    })

    constructor(options: EnhancedTableOptions<T> = {}) {
      this.all = options.data ?? []
      this.columnLabels = options.columnLabels ?? {}
      this.typeOverrides = options.typeOverrides ?? {}
      this.excludeColumns = options.excludeColumns ?? []
      this.searchExclude = options.searchExclude ?? []
      this.sortComparators = options.sortComparators ?? {}
      this.filterFn = options.filterFn ?? defaultFilter
      this.hiddenColumns = options.hiddenColumns ?? new SvelteSet()
      this.typeSampleSize = options.typeSampleSize ?? 25
      this.#inferTypes()
    }

    #inferTypes() {
      const types: Record<string, ColumnType> = {}
      if (this.all.length) {
        for (const key of Object.keys(this.all[0])) {
          types[key] = inferColumnType(this.all, key, this.typeSampleSize)
        }
      }
      this.#inferredTypes = types
    }

    #resolveComparator(key: string): Comparator<T> {
      const custom = this.sortComparators[key]
      const desc = this.sortDirection === 'desc'

      if (typeof custom === 'function') {
        return desc ? (a, b) => -custom(a, b) : custom
      }
      if (custom && typeof custom === 'object') {
        if (desc && custom.desc) return custom.desc
        if (!desc && custom.asc) return custom.asc
        if (desc && custom.asc) return (a, b) => -custom.asc(a, b)
        if (!desc && custom.desc) return (a, b) => -custom.desc(a, b)
      }

      const column = this.columns.find((c) => c.key === key)
      const guessed = withNullsLast(defaultComparator<T>(column?.type ?? 'other', key), key)
      return desc ? (a, b) => -guessed(a, b) : guessed
    }

    /** Replace the underlying data and re-infer column types from it. */
    refresh(data: T[]) {
      this.all = data
      this.#inferTypes()
    }

    /** Cycle a column through ascending -> descending -> unsorted. */
    toggleSort(key: string) {
      if (this.sortKey !== key) {
        this.sortKey = key
        this.sortDirection = 'asc'
      } else if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc'
      } else {
        this.sortKey = null
      }
    }

    toggleColumn(key: string) {
      if (this.hiddenColumns.has(key)) {
        this.hiddenColumns.delete(key)
      } else {
        this.hiddenColumns.add(key)
      }
    }

    showAllColumns() {
      for (const col of this.columns) {
        if (this.hiddenColumns.has(col.key)) this.hiddenColumns.delete(col.key)
      }
    }
  }
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import Table from '../components/Table.svelte'
  import Input from '../components/Input.svelte'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    data: T[]
    store?: EnhancedTableStore<T>
    columnLabels?: Record<string, string>
    typeOverrides?: Record<string, ColumnType>
    excludeColumns?: string[]
    searchExclude?: string[]
    sortComparators?: Record<string, Comparator<T> | { asc: Comparator<T>; desc: Comparator<T> }>
    filterFn?: (row: T, query: string, searchableKeys: string[]) => boolean
    hiddenColumns?: MutableStringSet
    searchable?: boolean
    hideableColumns?: boolean
    emptyMessage?: string
    alternatingrows?: boolean
    header?: Snippet<[EnhancedColumn]>
    cell?: Snippet<[EnhancedColumn, unknown, T]>
    style?: string
  }

  let {
    data,
    store,
    columnLabels,
    typeOverrides,
    excludeColumns,
    searchExclude,
    sortComparators,
    filterFn,
    hiddenColumns,
    searchable = true,
    hideableColumns = false,
    emptyMessage = 'No results found.',
    alternatingrows = true,
    header,
    cell,
    style = undefined,
    ...rest
  }: Props = $props()

  // svelte-ignore state_referenced_locally
  const table: EnhancedTableStore<T> =
    store ??
    new EnhancedTableStore<T>({
      data,
      columnLabels,
      typeOverrides,
      excludeColumns,
      searchExclude,
      sortComparators,
      filterFn,
      hiddenColumns,
    })

  $effect.pre(() => {
    table.all = data
  })

  const visibleColumns = $derived(table.columns.filter((c) => !c.hidden))
  const hiddenCount = $derived(table.columns.length - visibleColumns.length)
</script>

{#snippet _header(col: EnhancedColumn)}
  {#if header}
    {@render header(col)}
  {:else}
    <span>{col.label}</span>
  {/if}
{/snippet}

{#snippet _cell(col: EnhancedColumn, value: unknown, row: T)}
  {#if cell}
    {@render cell(col, value, row)}
  {:else}
    <td>{value ?? ''}</td>
  {/if}
{/snippet}

<div class="enhanced-table {rest.class || ''}" {style} {...rest}>
  {#if searchable || (hideableColumns && hiddenCount > 0)}
    <div class="enhanced-table-toolbar">
      {#if searchable}
        <Input type="text" placeholder="Search..." bind:value={table.query} minimal />
      {/if}
      {#if hideableColumns && hiddenCount > 0}
        <button type="button" class="show-all-button" onclick={() => table.showAllColumns()}>
          Show all columns ({hiddenCount} hidden)
        </button>
      {/if}
    </div>
  {/if}

  <Table {alternatingrows} class="enhanced-table-table">
    <thead>
      <tr>
        {#each visibleColumns as col}
          <th
            aria-sort={table.sortKey === col.key
              ? table.sortDirection === 'asc'
                ? 'ascending'
                : 'descending'
              : 'none'}
          >
            <button type="button" class="sort-button" onclick={() => table.toggleSort(col.key)}>
              {@render _header(col)}
              {#if table.sortKey === col.key}
                <svg class="sort-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  {#if table.sortDirection === 'asc'}
                    <path d="M8 5l4.5 6h-9z" />
                  {:else}
                    <path d="M8 11l-4.5-6h9z" />
                  {/if}
                </svg>
              {/if}
            </button>

            {#if hideableColumns}
              <button
                type="button"
                class="hide-button"
                aria-label="Hide {col.label} column"
                onclick={() => table.toggleColumn(col.key)}
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
                  <path d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8z" />
                  <circle cx="8" cy="8" r="2" />
                </svg>
              </button>
            {/if}
          </th>
        {/each}
      </tr>
    </thead>

    <tbody>
      {#if table.rows.length === 0}
        <tr>
          <td class="empty-state" colspan={Math.max(visibleColumns.length, 1)}>
            {data.length === 0 ? 'No data available' : emptyMessage}
          </td>
        </tr>
      {:else}
        {#each table.rows as row}
          <tr>
            {#each visibleColumns as col}
              {@render _cell(col, row[col.key], row)}
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </Table>
</div>

<style>
  .enhanced-table {
    display: flex;
    flex-direction: column;
    gap: var(--size-3, 0.75rem);
    width: 100%;
  }

  .enhanced-table-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-3, 0.75rem);
  }

  .enhanced-table-toolbar :global(input) {
    max-width: 20rem;
  }

  .show-all-button {
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    font-size: var(--font-size-0, 0.85rem);
    color: var(--accent, var(--primary, royalblue));
    padding: 0;
    white-space: nowrap;
  }

  .show-all-button:hover {
    text-decoration: underline;
  }

  :global(.enhanced-table-table) th {
    position: relative;
    padding: 0 !important;
  }

  .sort-button {
    display: flex;
    align-items: center;
    gap: var(--size-1, 0.25rem);
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    font-weight: var(--font-weight-6, 600);
    color: inherit;
    padding: var(--size-3, 0.75rem);
    text-align: left;
  }

  .sort-button:hover {
    color: var(--accent, var(--primary, royalblue));
  }

  .sort-button:focus-visible {
    outline: var(--focus-size, 2px) solid var(--accent, var(--primary, royalblue));
    outline-offset: -2px;
  }

  .sort-icon {
    width: 0.7rem;
    height: 0.7rem;
    flex-shrink: 0;
  }

  .hide-button {
    position: absolute;
    top: var(--size-1, 0.25rem);
    right: var(--size-1, 0.25rem);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border: none;
    border-radius: var(--radius-full, 999px);
    background-color: transparent;
    color: var(--text-1, currentColor);
    opacity: 0;
    cursor: pointer;
    transition: opacity 0.15s ease, background-color 0.15s ease, color 0.15s ease;
  }

  .hide-button svg {
    width: 0.85rem;
    height: 0.85rem;
  }

  th:hover .hide-button,
  .hide-button:focus-visible {
    opacity: 1;
  }

  .hide-button:hover {
    background-color: var(--accent, var(--primary, royalblue));
    color: var(--white, #fff);
  }

  .empty-state {
    text-align: center;
    padding: var(--size-5, 1.5rem) var(--size-3, 0.75rem);
    color: var(--gray-500, #888);
    font-style: italic;
  }
</style>
