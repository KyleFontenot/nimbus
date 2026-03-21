<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLElement> {
    open?: boolean
    side?: 'left' | 'right'
    overlay?: boolean
    breakpoint?: number
    persistent?: boolean
    width?: string
    closeable?: boolean
    children?: Snippet
  }

  let {
    open = $bindable(false),
    side = 'left',
    overlay = true,
    breakpoint = 768,
    persistent = true,
    width = '280px',
    closeable = true,
    style = undefined,
    children,
    ...rest
  }: Props = $props()

  let sidebarEl: HTMLElement | undefined = $state()
  let isMobile = $state(false)
  let mediaQuery: MediaQueryList | undefined = $state()

  $effect(() => {
    mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`)
    isMobile = mediaQuery.matches

    function onMediaChange(e: MediaQueryListEvent) {
      isMobile = e.matches
      if (!e.matches && persistent) {
        open = true
      }
    }

    mediaQuery.addEventListener('change', onMediaChange)
    return () => {
      mediaQuery?.removeEventListener('change', onMediaChange)
    }
  })

  // Focus trap for mobile drawer
  $effect(() => {
    if (!isMobile || !open || !sidebarEl) return

    const focusable = sidebarEl.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    // Store the element that opened the sidebar so we can restore focus
    const previouslyFocused = document.activeElement as HTMLElement | null
    first?.focus()

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && closeable) {
        e.preventDefault()
        open = false
        return
      }

      if (e.key !== 'Tab' || !focusable.length) return

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      previouslyFocused?.focus()
    }
  })

  // Prevent body scroll when mobile drawer is open
  $effect(() => {
    if (isMobile && open) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  })

  function handleBackdropClick() {
    if (closeable) {
      open = false
    }
  }

  function handleCloseClick() {
    open = false
  }

  let isDrawer = $derived(isMobile)
  let showBackdrop = $derived(isDrawer && overlay && open)
  let isVisible = $derived(isDrawer ? open : (persistent || open))

  let cssVars = $derived(
    [
      `--sidebar-width: ${width}`,
      style
    ].filter(Boolean).join('; ')
  )
</script>

{#if showBackdrop}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="sidebar-backdrop"
    class:sidebar-backdrop-visible={showBackdrop}
    onclick={handleBackdropClick}
    onkeydown={(e) => { if (e.key === 'Escape' && closeable) open = false }}
  ></div>
{/if}

<aside
  bind:this={sidebarEl}
  class="sidebar {rest.class || ''}"
  class:sidebar-left={side === 'left'}
  class:sidebar-right={side === 'right'}
  class:sidebar-open={isVisible}
  class:sidebar-drawer={isDrawer}
  class:sidebar-persistent={!isDrawer && persistent}
  style={cssVars}
  role={isDrawer ? 'dialog' : undefined}
  aria-modal={isDrawer && open ? 'true' : undefined}
  aria-label={typeof rest['aria-label'] === 'string' ? rest['aria-label'] : 'Sidebar navigation'}
  aria-hidden={!isVisible}
  inert={!isVisible ? true : undefined}
  {...rest}
>
  {#if isDrawer && closeable}
    <button
      class="sidebar-close"
      type="button"
      aria-label="Close sidebar"
      onclick={handleCloseClick}
    >
      &times;
    </button>
  {/if}
  <div class="sidebar-content">
    {@render children?.()}
  </div>
</aside>

<style>
  .sidebar-backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--layer-4, 40);
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(2px);
    animation: backdrop-in 0.2s ease-out;
  }

  @keyframes backdrop-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .sidebar {
    position: relative;
    display: flex;
    flex-direction: column;
    width: var(--sidebar-width, 280px);
    min-height: 0;
    height: 100%;
    background-color: var(--surface-1, var(--white, #fff));
    color: var(--text-1, var(--fore, currentColor));
    border-color: var(--gray-200, #e0e0e0);
    border-style: solid;
    border-width: 0;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    transition: transform 0.25s ease, visibility 0.25s ease;
    will-change: transform;
  }

  .sidebar-left {
    border-right-width: var(--border-size-1, 1px);
  }

  .sidebar-right {
    border-left-width: var(--border-size-1, 1px);
  }

  /* Desktop persistent state */
  .sidebar-persistent {
    flex-shrink: 0;
  }

  /* Hidden state (desktop collapsible) */
  .sidebar:not(.sidebar-drawer):not(.sidebar-open) {
    width: 0;
    overflow: hidden;
    border-width: 0;
    visibility: hidden;
  }

  /* Drawer mode (mobile) */
  .sidebar-drawer {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: var(--layer-5, 50);
    max-width: 85vw;
    box-shadow: var(--shadow-5, 0 12px 40px -8px rgba(0, 0, 0, 0.3));
    visibility: hidden;
  }

  .sidebar-drawer.sidebar-left {
    left: 0;
    transform: translateX(-100%);
  }

  .sidebar-drawer.sidebar-right {
    right: 0;
    transform: translateX(100%);
  }

  .sidebar-drawer.sidebar-open {
    transform: translateX(0);
    visibility: visible;
  }

  .sidebar-close {
    position: absolute;
    top: var(--size-2, 0.5rem);
    right: var(--size-2, 0.5rem);
    z-index: 1;
    background: none;
    border: none;
    font-size: var(--font-size-5, 1.75rem);
    cursor: pointer;
    color: var(--gray-500, #888);
    line-height: 1;
    padding: var(--size-1, 0.25rem) var(--size-2, 0.5rem);
    border-radius: var(--radius-2, 4px);
  }

  .sidebar-close:hover {
    color: var(--text-1, var(--fore, currentColor));
    background-color: var(--gray-100, #f0f0f0);
  }

  .sidebar-content {
    flex: 1;
    padding: var(--size-4, 1rem);
    min-height: 0;
    overflow-y: auto;
  }

  /* Ensure drawer content has room for the close button */
  .sidebar-drawer .sidebar-content {
    padding-top: var(--size-8, 2.5rem);
  }
</style>
