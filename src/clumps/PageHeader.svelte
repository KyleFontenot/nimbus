<script lang="ts">
  import type { Snippet } from 'svelte'
  import Breadcrumb from '../components/Breadcrumb.svelte'

  interface BreadcrumbItem {
    label: string
    href?: string
  }

  interface Props {
    title: string
    subtitle?: string | undefined
    breadcrumbs?: BreadcrumbItem[] | undefined
    actions?: Snippet | undefined
    children?: Snippet | undefined
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    title,
    subtitle = undefined,
    breadcrumbs = undefined,
    actions = undefined,
    children = undefined,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<header class="page-header {rest.class || ''}" {style} {...rest}>
  {#if breadcrumbs && breadcrumbs.length > 0}
    <div class="page-header-breadcrumbs">
      <Breadcrumb items={breadcrumbs} />
    </div>
  {/if}

  <div class="page-header-row">
    <div class="page-header-titles">
      <h1 class="page-header-title">{title}</h1>
      {#if subtitle}
        <p class="page-header-subtitle">{subtitle}</p>
      {/if}
    </div>

    {#if actions}
      <div class="page-header-actions">
        {@render actions()}
      </div>
    {/if}
  </div>

  {#if children}
    <div class="page-header-content">
      {@render children()}
    </div>
  {/if}
</header>

<style>
  .page-header {
    display: flex;
    flex-direction: column;
    gap: var(--size-2, 0.5rem);
    padding-bottom: var(--size-4, 1rem);
    border-bottom: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    margin-bottom: var(--size-4, 1rem);
  }

  .page-header-breadcrumbs {
    margin-bottom: var(--size-1, 0.25rem);
  }

  .page-header-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--size-4, 1rem);
    flex-wrap: wrap;
  }

  .page-header-titles {
    display: flex;
    flex-direction: column;
    gap: var(--size-1, 0.25rem);
    min-width: 0;
    flex: 1;
  }

  .page-header-title {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-6, 2rem);
    font-weight: 700;
    color: var(--text-1, var(--fore, currentColor));
    line-height: 1.2;
  }

  .page-header-subtitle {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-2, 1rem);
    color: var(--gray-600, var(--black-3, #666));
    line-height: var(--font-lineheight-3, 1.6);
  }

  .page-header-actions {
    display: flex;
    align-items: center;
    gap: var(--size-2, 0.5rem);
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .page-header-content {
    margin-top: var(--size-2, 0.5rem);
  }

  @media (max-width: 640px) {
    .page-header-row {
      flex-direction: column;
      align-items: stretch;
    }

    .page-header-actions {
      justify-content: flex-start;
    }

    .page-header-title {
      font-size: var(--font-size-5, 1.5rem);
    }
  }
</style>
