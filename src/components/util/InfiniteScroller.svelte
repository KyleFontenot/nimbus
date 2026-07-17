<script lang="ts">
  import { onMount } from 'svelte'
  import type { Snippet } from 'svelte'

  let watchEl: Element
  let watcher: IntersectionObserver
  let infscrollwrapper: HTMLElement

  interface InfiniteScrollerProps {
    on?: boolean
    parent?: Element | Document
    mediaQuery?: boolean
    noScrollBars?: boolean
    children: Snippet
    fn: () => unknown
  }
  let {
    on = false,
    parent,
    mediaQuery = false,
    noScrollBars = false,
    fn,
    children
  }: InfiniteScrollerProps = $props()

  onMount(() => {
    watcher = new IntersectionObserver(fn, {
      root: parent || infscrollwrapper,
      threshold: 1.0
    })
  })

  $effect(() => {
    if (watchEl && !on) {
      setTimeout(() => {
        watcher.observe(watchEl)
        on = true
      }, 300)
    }
  })
</script>

<div class="infscroller" bind:this={infscrollwrapper}>
  {@render children()}
  <div
    class="observer"
    class:mediaquery={mediaQuery}
    class:noscrollbars={noScrollBars}
    bind:this={watchEl}
  ></div>
</div>

<style>
  .infscroller {
    margin-inline: auto;
    width: 100%;
    height: 100%;
    max-width: 100vw;
    overflow-y: hidden;
    overflow: hidden;
    position: relative;
    scrollbar-width: none;
  }
  .observer {
    position: absolute;
    height: 5%;
    width: 100%;
    bottom: -3%;
    right: 0;
  }
  @media (min-width: 900px) {
    .infscroller {
      margin-inline: auto;
      width: 100%;
      max-width: 100vw;
      overflow-x: scroll;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .observer.mediaquery {
      height: 100%;
      width: 0.5rem;
      right: 0.5rem;
      bottom: 0;
      overflow-y: hidden;
      overflow-x: scroll;
    }
  }
</style>
