<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    header?: Snippet
    sidebar?: Snippet
    footer?: Snippet
    children?: Snippet
    sidebarPosition?: 'left' | 'right'
    stickyHeader?: boolean
    stickyFooter?: boolean
    style?: string | null
    [key: string]: unknown
  }

  let {
    header,
    sidebar,
    footer,
    children,
    sidebarPosition = 'left',
    stickyHeader = false,
    stickyFooter = false,
    style = null,
    ...rest
  }: Props = $props()
</script>

<div
  class="app-shell {rest.class || ''}"
  class:has-sidebar={!!sidebar}
  class:sidebar-right={sidebarPosition === 'right'}
  class:sticky-header={stickyHeader}
  class:sticky-footer={stickyFooter}
  style={style}
  {...rest}
>
  {#if header}
    <header class="app-shell-header">
      {@render header()}
    </header>
  {/if}

  <div class="app-shell-body">
    {#if sidebar}
      <aside class="app-shell-sidebar">
        {@render sidebar()}
      </aside>
    {/if}

    <main class="app-shell-main">
      {@render children?.()}
    </main>
  </div>

  {#if footer}
    <footer class="app-shell-footer">
      {@render footer()}
    </footer>
  {/if}
</div>

<style>
  .app-shell {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100dvh;
    width: 100%;
  }

  .app-shell-header {
    grid-row: 1;
    z-index: var(--layer-2, 20);
  }

  .sticky-header .app-shell-header {
    position: sticky;
    top: 0;
  }

  .app-shell-body {
    display: grid;
    grid-template-columns: 1fr;
    grid-row: 2;
    min-height: 0;
  }

  .has-sidebar .app-shell-body {
    grid-template-columns: auto 1fr;
  }

  .has-sidebar.sidebar-right .app-shell-body {
    grid-template-columns: 1fr auto;
  }

  .app-shell-sidebar {
    overflow-y: auto;
    min-height: 0;
  }

  .sidebar-right .app-shell-sidebar {
    order: 2;
  }

  .sidebar-right .app-shell-main {
    order: 1;
  }

  .app-shell-main {
    overflow-y: auto;
    min-height: 0;
    container-type: inline-size;
    container-name: main-content;
  }

  .app-shell-footer {
    grid-row: 3;
    z-index: var(--layer-2, 20);
  }

  .sticky-footer .app-shell-footer {
    position: sticky;
    bottom: 0;
  }
</style>
