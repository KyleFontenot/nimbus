<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    open?: boolean
    position?: 'top' | 'bottom' | 'left' | 'right'
    trigger?: Snippet
    children?: Snippet
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    open = $bindable(false),
    position = 'bottom',
    trigger,
    children,
    style = undefined,
    ...rest
  }: Props = $props()

  let wrapperEl: HTMLDivElement | undefined = $state()
  let popoverEl: HTMLDivElement | undefined = $state()
  let supportsPopover = $state(false)

  $effect(() => {
    supportsPopover = typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype
  })

  $effect(() => {
    if (!open) return

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        open = false
        e.stopPropagation()
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (!wrapperEl) return
      if (!wrapperEl.contains(e.target as Node)) {
        open = false
      }
    }

    document.addEventListener('keydown', handleKeydown, true)
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('keydown', handleKeydown, true)
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  // Sync native popover state when supported
  $effect(() => {
    if (!supportsPopover || !popoverEl) return
    if (open) {
      try { popoverEl.showPopover() } catch {}
    } else {
      try { popoverEl.hidePopover() } catch {}
    }
  })

  function toggle(e: MouseEvent) {
    e.stopPropagation()
    open = !open
  }

  function handleNativeToggle(e: Event) {
    const toggleEvent = e as ToggleEvent
    open = toggleEvent.newState === 'open'
  }
</script>

<div
  bind:this={wrapperEl}
  class="popover-wrapper {rest.class || ''}"
  {style}
  {...rest}
>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="popover-trigger" onclick={toggle} role="button" tabindex="0" aria-expanded={open}>
    {@render trigger?.()}
  </div>

  {#if supportsPopover}
    <div
      bind:this={popoverEl}
      popover="manual"
      class="popover-content {position}"
      class:popover-open={open}
      role="dialog"
      ontoggle={handleNativeToggle}
    >
      {@render children?.()}
    </div>
  {:else if open}
    <div
      class="popover-content popover-fallback {position}"
      class:popover-open={open}
      role="dialog"
    >
      {@render children?.()}
    </div>
  {/if}
</div>

<style>
  .popover-wrapper {
    position: relative;
    display: inline-flex;
  }

  .popover-trigger {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
  }

  .popover-content {
    position: absolute;
    z-index: var(--layer-4, 100);
    background-color: var(--surface-1, var(--white, #fff));
    color: var(--text-1, var(--fore, currentColor));
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    border-radius: var(--radius-3, 8px);
    padding: var(--size-3, 0.75rem);
    box-shadow: var(--shadow-3, 0 4px 20px -3px rgba(0, 0, 0, 0.2));
    width: max-content;
    max-width: min(90vw, 24rem);
    animation: popover-in 0.15s ease-out;
  }

  /* When using native popover API, override browser defaults */
  .popover-content[popover] {
    inset: unset;
    margin: 0;
    overflow: visible;
  }

  .popover-content:not(.popover-open) {
    pointer-events: none;
    opacity: 0;
  }

  .popover-content.popover-open {
    opacity: 1;
    animation: popover-in 0.15s ease-out;
  }

  @keyframes popover-in {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Positions */
  .bottom {
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    transform-origin: top center;
  }

  .top {
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    transform-origin: bottom center;
  }

  .left {
    right: calc(100% + 6px);
    top: 50%;
    transform: translateY(-50%);
    transform-origin: center right;
  }

  .right {
    left: calc(100% + 6px);
    top: 50%;
    transform: translateY(-50%);
    transform-origin: center left;
  }
</style>
