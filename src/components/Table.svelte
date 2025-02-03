<script lang="ts">
  interface Props {
    style?: string | null
    spreadsheet?: boolean
    alternatingrows?: boolean
    grid?: boolean
    smallerpadding?: boolean
    hrsections?: boolean
    dragScroll?: boolean
    children?: import('svelte').Snippet
  }

  let {
    style = null,
    spreadsheet = false,
    alternatingrows = false,
    grid = false,
    smallerpadding = false,
    hrsections = false,
    dragScroll = false,
    children
  }: Props = $props()

  // const checkDragScroll : Action = (node) => {
  //   dragScroll && dragscroll(node, { cursor: false })
  //   return {
  // 		destroy() {
  // 		},
  // 	};
  // }
  let wrapperel: HTMLTableElement = $state()
  let tableel: HTMLTableElement = $state()
</script>

<div class:wrapper={dragScroll} bind:this={wrapperel}>
  <table
    class:grid
    class:table={!grid}
    class:alternatingrows
    class:spreadsheet
    class:smallerpadding
    class:dragscroll={dragScroll}
    class:hrsections
    bind:this={tableel}
    {style}
  >
    {@render children?.()}
  </table>
</div>

<style lang="scss" global>
  $tableborderwidth: 1px;
  $tableborderradius: 8px;

  $bordercolor: #f1f1f1;
  $bordercolor: var(--black-5);

  .table {
    background-color: white;
    background-color: var(--white-2);
    background-color: var(--white);
    transition: background-color 0.5s;
    transition-timing-function: ease;
    outline: 2px solid transparent;
    width: 100%;
    max-width: 110rem;
    margin-inline: auto;
    display: table;
    border-radius: $tableborderradius;
    overflow: auto;
    &.alternatingrows :global(tr):nth-of-type(even) {
      background-color: #aaaaaa0c;
      background-color: var(--white-2);
    }
    &.dragscroll {
      overflow: scroll;
    }
    &.hrsections :global(tr > th:first-of-type) {
      border-left-width: 1px;
    }
    & :global(thead) {
      position: sticky;
      inset-block-start: 0;
      top: 0;
      background-color: var(--white);
      z-index: 500;
    }
    & :global(thead tr) {
      // border: 2px solid purple;
      position: sticky;
      top: 5px;
      // background: cyan;
    }
    & :global(th) {
      font-weight: 500;
      padding: 8px 88px;
      transition: background-color 0.05s;
      // font-size: 1.15rem;
      vertical-align: middle;
      // For stickiness
      // position: sticky;
      // top: -1px;

      background-color: white;
      background-color: var(--white);
      z-index: 100;
    }
    & > :global(thead) {
      border-width: 1px;
      border-top-left-radius: $tableborderradius;
    }
    & :global(tr) {
      position: relative;
      // position: sticky;
      // top: -1px;
      overflow-x: auto;

      &.sectioned:first-of-type {
        border-left-width: 1px;
        border-left-width: 6px;
        border-left-color: var(--primary);
      }
      & :global(th) {
        padding: 12px 13px;
        border-color: $bordercolor;
        border-style: solid;
        border-width: $tableborderwidth;
        border-bottom-width: 1px;
        border-left-width: 1px;
        border-right-width: 1px;
        // position: sticky;
        position: relative;
        // top: -1px;
        background-color: white;
        background-color: var(--white-2);
        z-index: 3;
      }
      &:first-of-type {
        :global(td:first-of-type) {
          border-top-left-radius: $tableborderradius;
        }
        :global(td:last-of-type) {
          border-top-right-radius: $tableborderradius;
        }
      }
      &:last-of-type {
        & :global(td) {
          border-bottom-width: $tableborderwidth;
        }
        & :global(td:first-of-type) {
          border-bottom-left-radius: $tableborderradius;
        }
        & :global(td:last-of-type) {
          border-bottom-right-radius: $tableborderradius;
        }
      }
      & :global(td) {
        padding: 5px 10px;
        // padding: 0.3rem 0.4rem;
        border-color: $bordercolor;
        border-style: solid;
        border-width: $tableborderwidth;
        vertical-align: middle;
        max-height: 1rem;
        // z-index: -1;
      }
      & :global(td:first-of-type) {
        border-left-width: 1px;
      }
      & :global(tr:first-of-type td:first-of-type) {
        border-top-left-radius: $tableborderradius;
      }
      & :global(tr:first-of-type td:last-of-type) {
        border-top-right-radius: $tableborderradius;
      }
      & :global(tr:last-of-type td) {
        border-bottom-width: $tableborderwidth;
      }
      & :global(tr:last-of-type td:first-of-type) {
        border-bottom-left-radius: $tableborderradius;
      }
      & :global(tr:last-of-type td:last-of-type) {
        border-bottom-right-radius: $tableborderradius;
      }
    }

    & :global(tbody.alternating) :global(tr:nth-child(even)) {
      background-color: #f9f9f9;
    }
  }

  table.smallerpadding {
    & :global(th) {
      padding: 8px 10px;
    }
    & :global(tr) {
      & :global(th) {
        padding: 5px;
      }
      & :global(td) {
        padding: 5px 8px;
      }
    }
  }
  .spreadsheet {
    empty-cells: show;
    overflow-x: scroll;
    display: block;
    width: 100%;
    max-width: calc(100vw - 16rem);
    & :global(td) {
      border: 1px solid #333;
    }
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
    grid-auto-rows: 1fr;
  }
</style>
