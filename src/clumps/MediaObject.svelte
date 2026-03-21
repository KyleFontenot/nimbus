<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    align?: 'top' | 'center' | 'bottom'
    gap?: string | undefined
    reverse?: boolean
    media?: Snippet
    children?: Snippet
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    align = 'top',
    gap = undefined,
    reverse = false,
    media,
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<div
  class="media-object {rest.class || ''}"
  class:reverse
  class:align-top={align === 'top'}
  class:align-center={align === 'center'}
  class:align-bottom={align === 'bottom'}
  style:--media-gap={gap}
  {style}
  {...rest}
>
  {#if media}
    <div class="media-figure">
      {@render media()}
    </div>
  {/if}
  <div class="media-body">
    {@render children?.()}
  </div>
</div>

<style>
  .media-object {
    display: flex;
    gap: var(--media-gap, var(--size-3, 0.75rem));
  }

  .reverse {
    flex-direction: row-reverse;
  }

  .align-top { align-items: flex-start; }
  .align-center { align-items: center; }
  .align-bottom { align-items: flex-end; }

  .media-figure {
    flex-shrink: 0;
  }

  .media-body {
    flex: 1;
    min-width: 0;
  }
</style>
