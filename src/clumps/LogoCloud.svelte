<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Logo {
    src: string
    alt: string
    href?: string
  }

  interface Props {
    logos?: Logo[]
    title?: string | undefined
    grayscale?: boolean
    children?: Snippet
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    logos = [],
    title = undefined,
    grayscale = true,
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<section
  class="logo-cloud {rest.class || ''}"
  class:grayscale
  {style}
  {...rest}
>
  {#if title}
    <p class="logo-cloud-title">{title}</p>
  {/if}
  <div class="logo-cloud-row">
    {#if children}
      {@render children()}
    {:else}
      {#each logos as logo}
        {#if logo.href}
          <a href={logo.href} class="logo-cloud-item" target="_blank" rel="noopener noreferrer">
            <img src={logo.src} alt={logo.alt} loading="lazy" />
          </a>
        {:else}
          <div class="logo-cloud-item">
            <img src={logo.src} alt={logo.alt} loading="lazy" />
          </div>
        {/if}
      {/each}
    {/if}
  </div>
</section>

<style>
  .logo-cloud {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-4, 1rem);
    padding: var(--size-6, 2.5rem) var(--size-5, 1.5rem);
  }

  .logo-cloud-title {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-0, 0.85rem);
    font-weight: 600;
    color: var(--gray-500, #888);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .logo-cloud-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--size-6, 2.5rem) var(--size-7, 3rem);
    max-width: var(--content-width, 1200px);
    width: 100%;
  }

  .logo-cloud-item {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: filter 0.3s ease, opacity 0.3s ease;
  }

  .grayscale .logo-cloud-item {
    filter: grayscale(100%);
    opacity: 0.6;
  }

  .grayscale .logo-cloud-item:hover {
    filter: grayscale(0%);
    opacity: 1;
  }

  .logo-cloud-item img {
    display: block;
    max-height: 2.5rem;
    max-width: 140px;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  a.logo-cloud-item:focus-visible {
    outline: 2px solid var(--accent, var(--primary, royalblue));
    outline-offset: 4px;
    border-radius: var(--radius-1, 4px);
  }

  @media (max-width: 640px) {
    .logo-cloud-row {
      gap: var(--size-5, 1.5rem) var(--size-5, 1.5rem);
    }

    .logo-cloud-item img {
      max-height: 2rem;
      max-width: 110px;
    }
  }
</style>
