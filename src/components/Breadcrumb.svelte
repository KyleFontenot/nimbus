<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Crumb {
    label: string
    href?: string
  }

  interface Props extends HTMLAttributes<HTMLElement> {
    items: Crumb[]
    separator?: string
  }

  let {
    items,
    separator = '/',
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<nav class="breadcrumb {rest.class || ''}" aria-label="Breadcrumb" {style} {...rest}>
  <ol class="breadcrumb-list">
    {#each items as item, i}
      <li class="breadcrumb-item">
        {#if item.href && i < items.length - 1}
          <a class="breadcrumb-link" href={item.href}>{item.label}</a>
        {:else}
          <span class="breadcrumb-current" aria-current={i === items.length - 1 ? 'page' : undefined}>
            {item.label}
          </span>
        {/if}
      </li>
      {#if i < items.length - 1}
        <li class="breadcrumb-separator" aria-hidden="true">{separator}</li>
      {/if}
    {/each}
  </ol>
</nav>

<style>
  .breadcrumb-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--size-1, 0.25rem);
  }

  .breadcrumb-item {
    display: inline-flex;
    align-items: center;
  }

  .breadcrumb-link {
    color: var(--accent, var(--primary, royalblue));
    text-decoration: none;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.9rem);
  }

  .breadcrumb-link:hover {
    text-decoration: underline;
  }

  .breadcrumb-current {
    color: var(--gray-500, #888);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.9rem);
  }

  .breadcrumb-separator {
    color: var(--gray-400, #aaa);
    font-size: var(--font-size-0, 0.8rem);
    user-select: none;
  }
</style>
