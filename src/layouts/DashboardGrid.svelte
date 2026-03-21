<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    minItemWidth?: string
    gap?: string
    children?: Snippet
  }

  let {
    minItemWidth = '18rem',
    gap = 'var(--size-fluid-3, 1.5rem)',
    children,
    style = null,
    ...rest
  }: Props = $props()
</script>

<div
  class="dashboard-grid {rest.class || ''}"
  style:--grid-min-item={minItemWidth}
  style:--grid-gap={gap}
  style={style}
  {...rest}
>
  {@render children?.()}
</div>

<style>
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(min(var(--grid-min-item, 18rem), 100%), 1fr)
    );
    gap: var(--grid-gap, 1.5rem);
    width: 100%;
    container-type: inline-size;
    container-name: dashboard-grid;
  }

  /* Adjust minimum widths at smaller container sizes */
  @container dashboard-grid (max-width: 30rem) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Fallback media query */
  @supports not (container-type: inline-size) {
    @media (max-width: 30rem) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
