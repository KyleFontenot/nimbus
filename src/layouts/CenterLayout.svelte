<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    maxWidth?: string
    fullHeight?: boolean
    children?: Snippet
  }

  let {
    maxWidth = '28rem',
    fullHeight = true,
    children,
    style = null,
    ...rest
  }: Props = $props()
</script>

<div
  class="center-layout {rest.class || ''}"
  class:full-height={fullHeight}
  style:--center-max-width={maxWidth}
  style={style}
  {...rest}
>
  <div class="center-layout-inner">
    {@render children?.()}
  </div>
</div>

<style>
  .center-layout {
    display: grid;
    place-items: center;
    width: 100%;
    padding: var(--size-fluid-2, 1rem);
  }

  .full-height {
    min-height: 100dvh;
  }

  .center-layout-inner {
    width: 100%;
    max-width: var(--center-max-width, 28rem);
  }
</style>
