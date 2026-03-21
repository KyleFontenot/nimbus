<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface NavItem {
    href: string
    label: string
    icon?: Snippet
    active?: boolean
  }

  interface Props extends HTMLAttributes<HTMLElement> {
    items: NavItem[]
    alwaysVisible?: boolean
  }

  let {
    items,
    alwaysVisible = false,
    style = undefined,
    ...rest
  }: Props = $props()

  const visibleItems = $derived(items.slice(0, 5))
</script>

<nav
  class="bottom-nav {rest.class || ''}"
  class:always-visible={alwaysVisible}
  aria-label="Bottom navigation"
  {style}
  {...rest}
>
  {#each visibleItems as item}
    <a
      href={item.href}
      class="bottom-nav-item"
      class:active={item.active}
      aria-current={item.active ? 'page' : undefined}
    >
      {#if item.icon}
        <span class="bottom-nav-icon" aria-hidden="true">
          {@render item.icon()}
        </span>
      {/if}
      <span class="bottom-nav-label">{item.label}</span>
    </a>
  {/each}
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: var(--layer-4, 100);
    display: flex;
    align-items: stretch;
    justify-content: space-around;
    background: var(--surface-1, var(--bg, #fff));
    border-top: 1px solid var(--gray-200, #e0e0e0);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    box-shadow: 0 -1px 3px rgb(0 0 0 / 0.08);
  }

  /* Hide on desktop by default */
  @media (min-width: 768px) {
    .bottom-nav:not(.always-visible) {
      display: none;
    }
  }

  .bottom-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--size-1, 0.25rem);
    padding: var(--size-2, 0.5rem) var(--size-1, 0.25rem);
    min-height: 3.25rem;
    text-decoration: none;
    color: var(--gray-500, #888);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-00, 0.7rem);
    font-weight: 500;
    position: relative;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: color 0.15s ease;
  }

  .bottom-nav-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--accent, var(--primary, royalblue));
    border-radius: 0 0 var(--radius-2, 4px) var(--radius-2, 4px);
    transition: width 0.2s ease, left 0.2s ease;
  }

  .bottom-nav-item.active::before {
    width: 2rem;
    left: calc(50% - 1rem);
  }

  .bottom-nav-item:hover:not(.active) {
    color: var(--text-1, var(--fore, currentColor));
  }

  .bottom-nav-item.active {
    color: var(--accent, var(--primary, royalblue));
  }

  .bottom-nav-item:focus-visible {
    outline: var(--focus-size, 2px) solid var(--accent, var(--link, royalblue));
    outline-offset: -2px;
    border-radius: var(--radius-2, 4px);
  }

  .bottom-nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    transition: transform 0.15s ease;
  }

  .bottom-nav-item.active .bottom-nav-icon {
    transform: translateY(-1px);
  }

  .bottom-nav-label {
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
</style>
