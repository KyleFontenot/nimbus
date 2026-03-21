<script lang="ts">
  import type { HTMLTableAttributes } from 'svelte/elements'

  interface Props extends HTMLTableAttributes {
    spreadsheet?: boolean
    alternatingrows?: boolean
    grid?: boolean
    compact?: boolean
    hrsections?: boolean
    dragScroll?: boolean
    striped?: boolean
    hoverable?: boolean
    children?: import('svelte').Snippet
  }

  let {
    style = undefined,
    spreadsheet = false,
    alternatingrows = false,
    grid = false,
    compact = false,
    hrsections = false,
    dragScroll = false,
    striped = false,
    hoverable = false,
    children,
    ...rest
  }: Props = $props()
</script>

<div class="table-wrapper" class:drag-scroll={dragScroll}>
  <table
    class="table {rest.class || ''}"
    class:grid
    class:alternatingrows={alternatingrows || striped}
    class:spreadsheet
    class:compact
    class:hrsections
    class:hoverable
    {style}
    {...rest}
  >
    {@render children?.()}
  </table>
</div>

<style>
  .table-wrapper {
    width: 100%;
    overflow-x: auto;
  }

  .drag-scroll {
    overflow-x: scroll;
    cursor: grab;
  }

  .table {
    width: 100%;
    max-width: 110rem;
    margin-inline: auto;
    border-collapse: separate;
    border-spacing: 0;
    background-color: var(--surface-1, var(--white, #fff));
    border-radius: var(--radius-3, 8px);
    overflow: hidden;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.9rem);
  }

  /* Header */
  .table :global(thead) {
    position: sticky;
    top: 0;
    z-index: var(--layer-2, 10);
  }

  .table :global(th) {
    font-weight: var(--font-weight-6, 600);
    padding: var(--size-3, 0.75rem) var(--size-3, 0.75rem);
    text-align: left;
    vertical-align: middle;
    background-color: var(--surface-2, var(--white-2, #f9f9f9));
    border-bottom: var(--border-size-2, 2px) solid var(--gray-200, #e0e0e0);
    color: var(--text-1, var(--fore, currentColor));
  }

  /* Body */
  .table :global(td) {
    padding: var(--size-2, 0.5rem) var(--size-3, 0.75rem);
    vertical-align: middle;
    border-bottom: var(--border-size-1, 1px) solid var(--gray-100, #f0f0f0);
    color: var(--text-1, var(--fore, currentColor));
  }

  .table :global(tbody tr:last-child td) {
    border-bottom: none;
  }

  /* Alternating / striped rows */
  .table.alternatingrows :global(tbody tr:nth-child(even)) {
    background-color: var(--surface-2, var(--white-2, #f9f9f9));
  }

  /* Hoverable rows */
  .table.hoverable :global(tbody tr:hover) {
    background-color: var(--gray-100, #f0f0f0);
  }

  /* Compact */
  .table.compact :global(th) {
    padding: var(--size-1, 0.3rem) var(--size-2, 0.5rem);
    font-size: var(--font-size-0, 0.85rem);
  }

  .table.compact :global(td) {
    padding: var(--size-1, 0.25rem) var(--size-2, 0.5rem);
    font-size: var(--font-size-0, 0.85rem);
  }

  /* HR sections */
  .table.hrsections :global(tr > th:first-of-type) {
    border-left: 3px solid var(--accent, var(--primary, royalblue));
  }

  /* Spreadsheet mode */
  .table.spreadsheet {
    overflow-x: scroll;
    display: block;
  }

  .table.spreadsheet :global(td),
  .table.spreadsheet :global(th) {
    border: var(--border-size-1, 1px) solid var(--gray-300, #ccc);
    white-space: nowrap;
  }

  /* Grid mode */
  .table.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
  }
</style>
