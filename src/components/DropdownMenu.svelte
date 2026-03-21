<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface MenuItem {
    label: string
    value?: string
    href?: string
    disabled?: boolean
    separator?: boolean
    onclick?: () => void
  }

  interface Props extends HTMLAttributes<HTMLDivElement> {
    items: MenuItem[]
    open?: boolean
    trigger?: Snippet
    align?: 'left' | 'right'
  }

  let {
    items,
    open = $bindable(false),
    trigger,
    align = 'left',
    style = undefined,
    ...rest
  }: Props = $props()

  let wrapperEl: HTMLDivElement | undefined = $state()
  let menuEl: HTMLDivElement | undefined = $state()
  let focusedIndex = $state(-1)

  const actionItems = $derived(
    items
      .map((item, i) => ({ ...item, originalIndex: i }))
      .filter((item) => !item.separator && !item.disabled)
  )

  $effect(() => {
    if (!open) {
      focusedIndex = -1
      return
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        open = false
        e.stopPropagation()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const currentPos = actionItems.findIndex((ai) => ai.originalIndex === focusedIndex)
        const nextPos = currentPos < actionItems.length - 1 ? currentPos + 1 : 0
        focusedIndex = actionItems[nextPos].originalIndex
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const currentPos = actionItems.findIndex((ai) => ai.originalIndex === focusedIndex)
        const prevPos = currentPos > 0 ? currentPos - 1 : actionItems.length - 1
        focusedIndex = actionItems[prevPos].originalIndex
      } else if (e.key === 'Home') {
        e.preventDefault()
        focusedIndex = actionItems[0]?.originalIndex ?? -1
      } else if (e.key === 'End') {
        e.preventDefault()
        focusedIndex = actionItems[actionItems.length - 1]?.originalIndex ?? -1
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (focusedIndex >= 0) {
          const item = items[focusedIndex]
          if (item && !item.disabled && !item.separator) {
            selectItem(item)
          }
        }
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

  // Focus the active menu item when focusedIndex changes
  $effect(() => {
    if (focusedIndex < 0 || !menuEl) return
    const el = menuEl.querySelector(`[data-index="${focusedIndex}"]`) as HTMLElement | null
    el?.focus()
  })

  function toggleMenu(e: MouseEvent) {
    e.stopPropagation()
    open = !open
  }

  function selectItem(item: MenuItem) {
    if (item.disabled) return
    item.onclick?.()
    open = false
  }
</script>

<div
  bind:this={wrapperEl}
  class="dropdown-wrapper {rest.class || ''}"
  {style}
  {...rest}
>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="dropdown-trigger"
    onclick={toggleMenu}
    role="button"
    tabindex="0"
    aria-haspopup="menu"
    aria-expanded={open}
  >
    {@render trigger?.()}
  </div>

  {#if open}
    <div
      bind:this={menuEl}
      class="dropdown-menu {align}"
      role="menu"
    >
      {#each items as item, i}
        {#if item.separator}
          <div class="dropdown-separator" role="separator"></div>
        {:else if item.href && !item.disabled}
          <a
            class="dropdown-item"
            class:dropdown-item-focused={focusedIndex === i}
            href={item.href}
            role="menuitem"
            tabindex={focusedIndex === i ? 0 : -1}
            data-index={i}
            onclick={() => { open = false }}
            onmouseenter={() => { focusedIndex = i }}
          >
            {item.label}
          </a>
        {:else}
          <button
            class="dropdown-item"
            class:dropdown-item-focused={focusedIndex === i}
            type="button"
            role="menuitem"
            tabindex={focusedIndex === i ? 0 : -1}
            disabled={item.disabled}
            data-index={i}
            onclick={() => selectItem(item)}
            onmouseenter={() => { if (!item.disabled) focusedIndex = i }}
          >
            {item.label}
          </button>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .dropdown-wrapper {
    position: relative;
    display: inline-flex;
  }

  .dropdown-trigger {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    z-index: var(--layer-4, 100);
    min-width: 10rem;
    background-color: var(--surface-1, var(--white, #fff));
    color: var(--text-1, var(--fore, currentColor));
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    border-radius: var(--radius-3, 8px);
    padding: var(--size-1, 0.25rem);
    box-shadow: var(--shadow-3, 0 4px 20px -3px rgba(0, 0, 0, 0.2));
    animation: dropdown-in 0.12s ease-out;
    display: flex;
    flex-direction: column;
  }

  .dropdown-menu.left {
    left: 0;
  }

  .dropdown-menu.right {
    right: 0;
  }

  @keyframes dropdown-in {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--size-2, 0.5rem) var(--size-3, 0.75rem);
    border: none;
    background: none;
    font: inherit;
    font-size: var(--font-size-1, 0.9rem);
    color: var(--text-1, var(--fore, currentColor));
    text-decoration: none;
    text-align: left;
    cursor: pointer;
    border-radius: var(--radius-2, 6px);
    white-space: nowrap;
    line-height: var(--font-lineheight-2, 1.5);
  }

  .dropdown-item:hover,
  .dropdown-item-focused {
    background-color: var(--gray-100, #f0f0f0);
    color: var(--text-1, var(--fore, currentColor));
  }

  .dropdown-item:active {
    background-color: var(--gray-200, #e0e0e0);
  }

  .dropdown-item:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dropdown-item:disabled:hover {
    background: none;
  }

  .dropdown-separator {
    height: 0;
    margin: var(--size-1, 0.25rem) 0;
    border-top: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
  }
</style>
