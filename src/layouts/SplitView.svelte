<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    ratio?: string
    gap?: string
    stackBelow?: string
    reverse?: boolean
    primary?: Snippet
    secondary?: Snippet
    style?: string | null
    [key: string]: unknown
  }

  let {
    ratio = '1:1',
    gap = 'var(--size-fluid-3, 1.5rem)',
    stackBelow = '640px',
    reverse = false,
    primary,
    secondary,
    style = null,
    ...rest
  }: Props = $props()

  let fractions = $derived(() => {
    const parts = ratio.split(':').map(Number)
    return { left: parts[0] ?? 1, right: parts[1] ?? 1 }
  })
</script>

<div
  class="split-view {rest.class || ''}"
  class:reverse
  style:--split-left={fractions().left + 'fr'}
  style:--split-right={fractions().right + 'fr'}
  style:--split-gap={gap}
  style:--split-stack-below={stackBelow}
  style={style}
  {...rest}
>
  <div class="split-view-primary">
    {@render primary?.()}
  </div>
  <div class="split-view-secondary">
    {@render secondary?.()}
  </div>
</div>

<style>
  .split-view {
    display: grid;
    grid-template-columns: var(--split-left, 1fr) var(--split-right, 1fr);
    gap: var(--split-gap, 1.5rem);
    width: 100%;
    container-type: inline-size;
    container-name: split-view;
  }

  .reverse .split-view-primary {
    order: 0;
  }

  /* Container query: stack when container is narrow */
  @container split-view (max-width: 640px) {
    .split-view {
      grid-template-columns: 1fr;
    }

    .reverse .split-view-primary {
      order: 2;
    }
  }

  /* Fallback media query for browsers without container query support */
  @supports not (container-type: inline-size) {
    @media (max-width: 640px) {
      .split-view {
        grid-template-columns: 1fr;
      }

      .reverse .split-view-primary {
        order: 2;
      }
    }
  }
</style>
