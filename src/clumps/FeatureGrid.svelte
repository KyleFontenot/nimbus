<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Feature {
    title: string
    description: string
    icon?: Snippet
  }

  interface Props extends HTMLAttributes<HTMLDivElement> {
    features?: Feature[]
    columns?: number
    centered?: boolean
    children?: Snippet
  }

  let {
    features = [],
    columns = 3,
    centered = true,
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<section
  class="feature-grid {rest.class || ''}"
  class:centered
  style="--columns: {columns};{style || ''}"
  {...rest}
>
  {#if children}
    {@render children()}
  {:else}
    {#each features as feature}
      <div class="feature-card">
        {#if feature.icon}
          <div class="feature-icon" aria-hidden="true">
            {@render feature.icon()}
          </div>
        {/if}
        <h3 class="feature-title">{feature.title}</h3>
        <p class="feature-description">{feature.description}</p>
      </div>
    {/each}
  {/if}
</section>

<style>
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, calc(100% / var(--columns) - 2rem)), 1fr));
    gap: var(--size-5, 1.5rem);
    padding: var(--size-6, 2.5rem) var(--size-5, 1.5rem);
    max-width: var(--content-width, 1200px);
    margin: 0 auto;
  }

  .feature-card {
    display: flex;
    flex-direction: column;
    gap: var(--size-2, 0.5rem);
    padding: var(--size-5, 1.5rem);
    border-radius: var(--radius-2, 8px);
    background-color: var(--surface-1, var(--white-2, #fff));
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  .feature-card:hover {
    box-shadow: var(--shadow-3, 0 4px 14px -4px #88888866);
    transform: translateY(-2px);
  }

  .centered .feature-card {
    text-align: center;
    align-items: center;
  }

  .feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-2, 8px);
    background-color: var(--accent-light, var(--primary-light, #e8f0fe));
    color: var(--accent, var(--primary, royalblue));
    margin-bottom: var(--size-2, 0.5rem);
  }

  .feature-icon :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
  }

  .feature-title {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-2, 1.1rem);
    font-weight: 600;
    color: var(--text-1, var(--fore, currentColor));
    line-height: 1.3;
  }

  .feature-description {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    color: var(--gray-600, var(--black-3, #666));
    line-height: 1.6;
  }

  @media (max-width: 640px) {
    .feature-grid {
      grid-template-columns: 1fr;
      padding: var(--size-4, 1rem);
    }
  }
</style>
