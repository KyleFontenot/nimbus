<script lang="ts">
  interface Tab {
    id: string
    label: string
    disabled?: boolean
  }

  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    tabs: Tab[]
    active?: string
    children?: import('svelte').Snippet<[string]>
  }

  let {
    tabs,
    active = $bindable(tabs[0]?.id ?? ''),
    style = undefined,
    children,
    ...rest
  }: Props = $props()

  let tabButtons: (HTMLButtonElement | undefined)[] = $state([])

  function handleTabsKeydown(e: KeyboardEvent, currentIndex: number) {
    let nextIndex: number

    if (e.key === 'ArrowRight') {
      nextIndex = currentIndex
      do {
        nextIndex = (nextIndex + 1) % tabs.length
      } while (tabs[nextIndex]?.disabled && nextIndex !== currentIndex)
    } else if (e.key === 'ArrowLeft') {
      nextIndex = currentIndex
      do {
        nextIndex = (nextIndex - 1 + tabs.length) % tabs.length
      } while (tabs[nextIndex]?.disabled && nextIndex !== currentIndex)
    } else if (e.key === 'Home') {
      nextIndex = tabs.findIndex(t => !t.disabled)
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1 - [...tabs].reverse().findIndex(t => !t.disabled)
    } else {
      return
    }

    if (nextIndex < 0 || tabs[nextIndex]?.disabled) return
    e.preventDefault()
    active = tabs[nextIndex].id
    tabButtons[nextIndex]?.focus()
  }
</script>

<div class="tabs-wrapper {rest.class || ''}" {style} {...rest}>
  <div class="tabs-list" role="tablist">
    {#each tabs as tab, i}
      <button
        bind:this={tabButtons[i]}
        class="tabs-trigger"
        class:active={active === tab.id}
        role="tab"
        type="button"
        id="tab-{tab.id}"
        tabindex={active === tab.id ? 0 : -1}
        aria-selected={active === tab.id}
        aria-controls="tabpanel-{tab.id}"
        disabled={tab.disabled}
        onclick={() => (active = tab.id)}
        onkeydown={e => handleTabsKeydown(e, i)}
      >
        {tab.label}
      </button>
    {/each}
  </div>
  {#each tabs as tab}
    <div
      class="tabs-panel"
      role="tabpanel"
      id="tabpanel-{tab.id}"
      aria-labelledby="tab-{tab.id}"
      hidden={active !== tab.id}
    >
      {#if active === tab.id && children}
        {@render children(tab.id)}
      {/if}
    </div>
  {/each}
</div>

<style>
  .tabs-wrapper {
    width: 100%;
  }

  .tabs-list {
    display: flex;
    border-bottom: var(--border-size-2, 2px) solid var(--gray-200, #e0e0e0);
    gap: 0;
    overflow-x: auto;
  }

  .tabs-trigger {
    padding: var(--size-2, 0.5rem) var(--size-4, 1rem);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: var(--font-size-1, 0.95rem);
    font-weight: 500;
    color: var(--gray-500, #888);
    white-space: nowrap;
    transition: color 0.15s ease, border-color 0.15s ease;
  }

  .tabs-trigger:hover:not(:disabled) {
    color: var(--text-1);
  }

  .tabs-trigger.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
  }

  .tabs-trigger:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .tabs-trigger:focus-visible {
    outline: var(--focus-size, 2px) solid var(--accent, var(--link, royalblue));
    outline-offset: -2px;
    border-radius: var(--radius-2, 4px) var(--radius-2, 4px) 0 0;
  }

  .tabs-panel {
    padding: var(--size-4, 1rem) 0;
  }

  .tabs-panel[hidden] {
    display: none;
  }
</style>
