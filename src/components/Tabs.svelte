<script lang="ts">
  interface Tab {
    id: string
    label: string
    disabled?: boolean
  }

  interface Props {
    tabs: Tab[]
    active?: string
    style?: string | undefined
    children?: import('svelte').Snippet<[string]>
    [key: string]: unknown
  }

  let {
    tabs,
    active = $bindable(tabs[0]?.id ?? ''),
    style = undefined,
    children,
    ...rest
  }: Props = $props()
</script>

<div class="tabs-wrapper {rest.class || ''}" {style} {...rest}>
  <div class="tabs-list" role="tablist">
    {#each tabs as tab}
      <button
        class="tabs-trigger"
        class:active={active === tab.id}
        role="tab"
        type="button"
        id="tab-{tab.id}"
        aria-selected={active === tab.id}
        aria-controls="tabpanel-{tab.id}"
        disabled={tab.disabled}
        onclick={() => (active = tab.id)}
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
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    font-weight: 500;
    color: var(--gray-500, #888);
    white-space: nowrap;
    transition: color 0.15s ease, border-color 0.15s ease;
  }

  .tabs-trigger:hover:not(:disabled) {
    color: var(--text-1, var(--fore, currentColor));
  }

  .tabs-trigger.active {
    color: var(--accent, var(--primary, royalblue));
    border-bottom-color: var(--accent, var(--primary, royalblue));
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
