<script lang="ts">
  import type { Snippet } from 'svelte'

  interface NavItem {
    href: string
    label: string
    active?: boolean
  }

  interface Props {
    brand?: string | Snippet
    items?: NavItem[]
    sticky?: boolean
    children?: Snippet
    style?: string | undefined
    breakpoint?: string
    [key: string]: unknown
  }

  let {
    brand = undefined,
    items = [],
    sticky = false,
    children,
    style = undefined,
    breakpoint = '768px',
    ...rest
  }: Props = $props()

  let mobileOpen = $state(false)

  function toggleMenu() {
    mobileOpen = !mobileOpen
  }

  function closeMenu() {
    mobileOpen = false
  }
</script>

<nav
  class="navbar {rest.class || ''}"
  class:sticky
  aria-label={rest['aria-label'] as string || 'Main navigation'}
  style:--navbar-breakpoint={breakpoint}
  {style}
  {...rest}
>
  <div class="navbar-inner">
    {#if brand}
      <div class="navbar-brand">
        {#if typeof brand === 'string'}
          <span class="navbar-brand-text">{brand}</span>
        {:else}
          {@render brand()}
        {/if}
      </div>
    {/if}

    <button
      class="navbar-toggle"
      type="button"
      aria-expanded={mobileOpen}
      aria-controls="navbar-menu"
      aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      onclick={toggleMenu}
    >
      <span class="hamburger" class:open={mobileOpen}>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </span>
    </button>

    <div
      class="navbar-menu"
      class:open={mobileOpen}
      id="navbar-menu"
      role="group"
    >
      {#if items.length > 0}
        <ul class="navbar-nav" role="list">
          {#each items as item}
            <li class="navbar-nav-item">
              <a
                class="navbar-link"
                class:active={item.active}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                onclick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
      {/if}

      {#if children}
        <div class="navbar-end">
          {@render children()}
        </div>
      {/if}
    </div>
  </div>
</nav>

<style>
  .navbar {
    --_navbar-bg: var(--navbar-bg, var(--surface-1, #fff));
    --_navbar-color: var(--navbar-color, var(--text-1, #1a1a1a));
    --_navbar-link-color: var(--navbar-link-color, var(--text-2, #444));
    --_navbar-link-hover: var(--navbar-link-hover, var(--accent, var(--primary, royalblue)));
    --_navbar-active-color: var(--navbar-active-color, var(--accent, var(--primary, royalblue)));
    --_navbar-height: var(--navbar-height, 3.5rem);
    --_navbar-padding-x: var(--navbar-padding-x, var(--size-3, 1rem));
    --_navbar-border: var(--navbar-border, var(--gray-200, #e0e0e0));
    --_navbar-shadow: var(--navbar-shadow, 0 1px 3px rgba(0, 0, 0, 0.08));
    --_navbar-z: var(--navbar-z, 100);

    position: relative;
    width: 100%;
    background-color: var(--_navbar-bg);
    color: var(--_navbar-color);
    border-bottom: 1px solid var(--_navbar-border);
    box-shadow: var(--_navbar-shadow);
    z-index: var(--_navbar-z);
    font-family: var(--font-sans, var(--font2, system-ui, sans-serif));
  }

  .navbar.sticky {
    position: sticky;
    top: 0;
  }

  .navbar-inner {
    display: flex;
    align-items: center;
    min-height: var(--_navbar-height);
    padding-inline: var(--_navbar-padding-x);
    max-width: var(--navbar-max-width, none);
    margin-inline: auto;
    gap: var(--size-3, 1rem);
  }

  /* Brand */
  .navbar-brand {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .navbar-brand-text {
    font-size: var(--font-size-3, 1.2rem);
    font-weight: var(--font-weight-7, 700);
    color: var(--_navbar-color);
    white-space: nowrap;
  }

  /* Hamburger toggle */
  .navbar-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--size-2, 0.5rem);
    margin-inline-start: auto;
    -webkit-tap-highlight-color: transparent;
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 24px;
    height: 20px;
    position: relative;
  }

  .hamburger-line {
    display: block;
    width: 100%;
    height: 2px;
    background-color: var(--_navbar-color);
    border-radius: var(--radius-1, 2px);
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform-origin: center;
  }

  .hamburger.open .hamburger-line:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .hamburger.open .hamburger-line:nth-child(2) {
    opacity: 0;
  }

  .hamburger.open .hamburger-line:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  /* Menu area (links + end content) */
  .navbar-menu {
    display: flex;
    align-items: center;
    flex: 1;
    gap: var(--size-2, 0.5rem);
  }

  /* Nav links */
  .navbar-nav {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: var(--size-1, 0.25rem);
  }

  .navbar-nav-item {
    display: flex;
  }

  .navbar-link {
    display: inline-flex;
    align-items: center;
    padding: var(--size-1, 0.25rem) var(--size-2, 0.5rem);
    color: var(--_navbar-link-color);
    text-decoration: none;
    font-size: var(--font-size-1, 0.9rem);
    font-weight: var(--font-weight-5, 500);
    border-radius: var(--radius-2, 4px);
    transition: color 0.15s ease, background-color 0.15s ease;
    white-space: nowrap;
  }

  .navbar-link:hover,
  .navbar-link:focus-visible {
    color: var(--_navbar-active-color);
    background-color: var(--gray-100, #f5f5f5);
  }

  .navbar-link:focus-visible {
    outline: 2px solid var(--_navbar-active-color);
    outline-offset: 2px;
  }

  .navbar-link.active {
    color: var(--_navbar-active-color);
    font-weight: var(--font-weight-6, 600);
  }

  /* Right-side content */
  .navbar-end {
    display: flex;
    align-items: center;
    gap: var(--size-2, 0.5rem);
    margin-inline-start: auto;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    .navbar-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .navbar-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      flex-direction: column;
      align-items: stretch;
      background-color: var(--_navbar-bg);
      border-bottom: 1px solid var(--_navbar-border);
      box-shadow: var(--_navbar-shadow);
      padding: 0;
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      visibility: hidden;
      transition:
        max-height 0.35s ease,
        opacity 0.25s ease,
        padding 0.35s ease,
        visibility 0s linear 0.35s;
    }

    .navbar-menu.open {
      max-height: 100vh;
      opacity: 1;
      visibility: visible;
      padding-block: var(--size-2, 0.5rem);
      transition:
        max-height 0.35s ease,
        opacity 0.25s ease,
        padding 0.35s ease,
        visibility 0s linear 0s;
    }

    .navbar-nav {
      flex-direction: column;
      align-items: stretch;
      gap: 0;
    }

    .navbar-link {
      padding: var(--size-2, 0.5rem) var(--_navbar-padding-x);
      border-radius: 0;
      width: 100%;
    }

    .navbar-link:hover,
    .navbar-link:focus-visible {
      background-color: var(--gray-100, #f5f5f5);
    }

    .navbar-end {
      margin-inline-start: 0;
      padding: var(--size-2, 0.5rem) var(--_navbar-padding-x);
      border-top: 1px solid var(--_navbar-border);
    }
  }
</style>
