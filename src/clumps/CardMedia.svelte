<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    src: string
    alt: string
    title: string
    description?: string | undefined
    href?: string | undefined
    horizontal?: boolean
    actions?: Snippet
    children?: Snippet
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    src,
    alt,
    title,
    description = undefined,
    href = undefined,
    horizontal = false,
    actions,
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

{#if href}
  <a
    {href}
    class="card-media {rest.class || ''}"
    class:horizontal
    {style}
    {...rest}
  >
    <div class="card-media-image">
      <img {src} {alt} loading="lazy" />
    </div>
    <div class="card-media-body">
      <h3 class="card-media-title">{title}</h3>
      {#if description}
        <p class="card-media-description">{description}</p>
      {/if}
      {#if children}
        <div class="card-media-content">
          {@render children()}
        </div>
      {/if}
      {#if actions}
        <div class="card-media-actions">
          {@render actions()}
        </div>
      {/if}
    </div>
  </a>
{:else}
  <div
    class="card-media {rest.class || ''}"
    class:horizontal
    {style}
    {...rest}
  >
    <div class="card-media-image">
      <img {src} {alt} loading="lazy" />
    </div>
    <div class="card-media-body">
      <h3 class="card-media-title">{title}</h3>
      {#if description}
        <p class="card-media-description">{description}</p>
      {/if}
      {#if children}
        <div class="card-media-content">
          {@render children()}
        </div>
      {/if}
      {#if actions}
        <div class="card-media-actions">
          {@render actions()}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .card-media {
    display: flex;
    flex-direction: column;
    border-radius: var(--radius-2, 8px);
    background-color: var(--surface-1, var(--white-2, #fff));
    box-shadow: var(--shadow-2, 0 2px 7px -2px #88888888);
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  a.card-media:hover,
  a.card-media:focus-visible {
    box-shadow: var(--shadow-3, 0 4px 14px -4px #88888888);
    transform: translateY(-2px);
  }

  a.card-media:focus-visible {
    outline: 2px solid var(--accent, var(--primary, royalblue));
    outline-offset: 2px;
  }

  .horizontal {
    flex-direction: row;
  }

  .card-media-image {
    flex-shrink: 0;
    overflow: hidden;
  }

  .card-media-image img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 16 / 9;
  }

  .horizontal .card-media-image {
    width: 40%;
    max-width: 280px;
  }

  .horizontal .card-media-image img {
    aspect-ratio: auto;
    height: 100%;
  }

  .card-media-body {
    display: flex;
    flex-direction: column;
    gap: var(--size-2, 0.5rem);
    padding: var(--size-3, 1rem);
    flex: 1;
  }

  .card-media-title {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-2, 1.1rem);
    font-weight: 600;
    color: var(--gray-900, var(--black, #222));
    line-height: 1.3;
  }

  .card-media-description {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    color: var(--gray-600, var(--black-3, #666));
    line-height: 1.5;
  }

  .card-media-content {
    flex: 1;
  }

  .card-media-actions {
    display: flex;
    align-items: center;
    gap: var(--size-2, 0.5rem);
    padding-top: var(--size-2, 0.5rem);
    border-top: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    margin-top: auto;
  }
</style>
