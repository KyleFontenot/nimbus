<script lang="ts">
  import type { Snippet } from 'svelte'
  import Button from '../components/Button.svelte'

  interface Props {
    title: string
    description?: string | undefined
    buttonLabel: string
    buttonHref?: string | undefined
    onclick?: (() => void) | undefined
    variant?: 'default' | 'accent' | 'dark'
    children?: Snippet
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    title,
    description = undefined,
    buttonLabel,
    buttonHref = undefined,
    onclick = undefined,
    variant = 'default',
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<section
  class="cta-banner {rest.class || ''}"
  class:variant-accent={variant === 'accent'}
  class:variant-dark={variant === 'dark'}
  {style}
  {...rest}
>
  <div class="cta-banner-inner">
    <div class="cta-banner-content">
      <h2 class="cta-banner-title">{title}</h2>
      {#if description}
        <p class="cta-banner-description">{description}</p>
      {/if}
      {#if children}
        <div class="cta-banner-extra">
          {@render children()}
        </div>
      {/if}
    </div>
    <div class="cta-banner-action">
      <Button
        type={buttonHref ? 'link' : 'button'}
        href={buttonHref}
        color={variant === 'accent' || variant === 'dark' ? 'white' : 'primary'}
        {onclick}
      >
        {buttonLabel}
      </Button>
    </div>
  </div>
</section>

<style>
  .cta-banner {
    width: 100%;
    padding: var(--size-6, 2.5rem) var(--size-5, 1.5rem);
    background-color: var(--gray-100, #f5f5f5);
    border-radius: var(--radius-3, 12px);
  }

  .cta-banner.variant-accent {
    background-color: var(--accent, var(--primary, royalblue));
    color: white;
  }

  .cta-banner.variant-dark {
    background-color: var(--gray-900, #1a1a1a);
    color: white;
  }

  .cta-banner-inner {
    max-width: var(--content-width, 1200px);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-5, 1.5rem);
  }

  .cta-banner-content {
    display: flex;
    flex-direction: column;
    gap: var(--size-2, 0.5rem);
    flex: 1;
    min-width: 0;
  }

  .cta-banner-title {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-4, 1.5rem);
    font-weight: 700;
    line-height: 1.2;
  }

  .variant-accent .cta-banner-title,
  .variant-dark .cta-banner-title {
    color: white;
  }

  .cta-banner-description {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    line-height: 1.6;
    opacity: 0.85;
  }

  .cta-banner-extra {
    margin-top: var(--size-2, 0.5rem);
  }

  .cta-banner-action {
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .cta-banner {
      padding: var(--size-5, 1.5rem) var(--size-4, 1rem);
    }

    .cta-banner-inner {
      flex-direction: column;
      text-align: center;
    }

    .cta-banner-action {
      width: 100%;
    }

    .cta-banner-action :global(.button) {
      width: 100%;
      text-align: center;
    }
  }
</style>
