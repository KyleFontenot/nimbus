<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    title: string
    description?: string | undefined
    icon?: Snippet
    children?: Snippet
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    title,
    description = undefined,
    icon,
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<div
  class="empty-state {rest.class || ''}"
  {style}
  {...rest}
>
  {#if icon}
    <div class="empty-state-icon" aria-hidden="true">
      {@render icon()}
    </div>
  {/if}

  <h3 class="empty-state-title">{title}</h3>

  {#if description}
    <p class="empty-state-description">{description}</p>
  {/if}

  {#if children}
    <div class="empty-state-actions">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--size-7, 3rem) var(--size-4, 1.5rem);
    gap: var(--size-2, 0.5rem);
  }

  .empty-state-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--size-2, 0.5rem);
    color: var(--gray-400, #bbb);
    font-size: var(--font-size-6, 3rem);
  }

  .empty-state-icon :global(svg) {
    width: 3.5rem;
    height: 3.5rem;
  }

  .empty-state-icon :global(img) {
    max-width: 8rem;
    max-height: 8rem;
    object-fit: contain;
  }

  .empty-state-title {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-3, 1.25rem);
    font-weight: 600;
    color: var(--gray-800, var(--black-2, #333));
    line-height: 1.3;
  }

  .empty-state-description {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    color: var(--gray-500, #888);
    line-height: 1.5;
    max-width: 36ch;
  }

  .empty-state-actions {
    display: flex;
    align-items: center;
    gap: var(--size-2, 0.5rem);
    margin-top: var(--size-3, 1rem);
  }
</style>
