<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import Button from '../components/Button.svelte'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    title: string
    subtitle?: string | undefined
    ctaLabel?: string | undefined
    ctaHref?: string | undefined
    secondaryLabel?: string | undefined
    secondaryHref?: string | undefined
    image?: string | undefined
    imageAlt?: string
    centered?: boolean
    reverse?: boolean
    children?: Snippet
  }

  let {
    title,
    subtitle = undefined,
    ctaLabel = undefined,
    ctaHref = undefined,
    secondaryLabel = undefined,
    secondaryHref = undefined,
    image = undefined,
    imageAlt = '',
    centered = false,
    reverse = false,
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<section
  class="hero {rest.class || ''}"
  class:centered
  class:reverse
  class:has-image={!!image && !centered}
  {style}
  {...rest}
>
  <div class="hero-inner">
    <div class="hero-content">
      <h1 class="hero-title">{title}</h1>
      {#if subtitle}
        <p class="hero-subtitle">{subtitle}</p>
      {/if}
      {#if ctaLabel || secondaryLabel}
        <div class="hero-actions">
          {#if ctaLabel}
            <Button
              type={ctaHref ? 'link' : 'button'}
              href={ctaHref}
              color="primary"
            >
              {ctaLabel}
            </Button>
          {/if}
          {#if secondaryLabel}
            <Button
              type={secondaryHref ? 'link' : 'button'}
              href={secondaryHref}
              color="primary"
              outlined
            >
              {secondaryLabel}
            </Button>
          {/if}
        </div>
      {/if}
      {#if children}
        <div class="hero-extra">
          {@render children()}
        </div>
      {/if}
    </div>
    {#if image}
      <div class="hero-image">
        <img src={image} alt={imageAlt} loading="eager" />
      </div>
    {/if}
  </div>
</section>

<style>
  .hero {
    width: 100%;
    padding: var(--size-8, 4rem) var(--size-5, 1.5rem);
    background-color: var(--surface-1, var(--white-2, #fff));
  }

  .hero-inner {
    max-width: var(--content-width, 1200px);
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: var(--size-8, 3rem);
  }

  .hero.has-image .hero-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .hero.has-image.reverse .hero-inner {
    direction: rtl;
  }

  .hero.has-image.reverse .hero-content {
    direction: ltr;
  }

  .hero.has-image.reverse .hero-image {
    direction: ltr;
  }

  .hero.centered .hero-inner {
    flex-direction: column;
    text-align: center;
  }

  .hero.centered .hero-actions {
    justify-content: center;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    gap: var(--size-4, 1.25rem);
  }

  .hero-title {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: clamp(2rem, 5vw, var(--font-size-8, 3.5rem));
    font-weight: 800;
    color: var(--text-1, var(--fore, currentColor));
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .hero-subtitle {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: clamp(1rem, 2vw, var(--font-size-3, 1.25rem));
    color: var(--gray-600, var(--black-3, #666));
    line-height: 1.6;
    max-width: 600px;
  }

  .hero.centered .hero-subtitle {
    max-width: 700px;
    margin: 0 auto;
  }

  .hero-actions {
    display: flex;
    gap: var(--size-3, 0.75rem);
    flex-wrap: wrap;
    align-items: center;
  }

  .hero-extra {
    margin-top: var(--size-2, 0.5rem);
  }

  .hero-image {
    flex-shrink: 0;
  }

  .hero-image img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--radius-3, 12px);
    object-fit: cover;
  }

  .hero.centered .hero-image {
    max-width: 800px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .hero {
      padding: var(--size-6, 2.5rem) var(--size-4, 1rem);
    }

    .hero.has-image .hero-inner {
      grid-template-columns: 1fr;
    }

    .hero.has-image.reverse .hero-inner {
      direction: ltr;
    }

    .hero-inner {
      flex-direction: column;
      text-align: center;
    }

    .hero-actions {
      justify-content: center;
    }

    .hero-subtitle {
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
