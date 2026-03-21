<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    brand?: Snippet | undefined
    brandText?: string | undefined
    maxWidth?: string
    children?: Snippet
    footer?: Snippet
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    brand = undefined,
    brandText = undefined,
    maxWidth = '24rem',
    children,
    footer,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<div class="auth-layout {rest.class || ''}" {style} {...rest}>
  <div class="auth-container" style:--auth-max-width={maxWidth}>
    {#if brand || brandText}
      <div class="auth-brand">
        {#if brand}
          {@render brand()}
        {:else if brandText}
          <span class="auth-brand-text">{brandText}</span>
        {/if}
      </div>
    {/if}

    <div class="auth-content">
      {@render children?.()}
    </div>

    {#if footer}
      <div class="auth-footer">
        {@render footer()}
      </div>
    {/if}
  </div>
</div>

<style>
  .auth-layout {
    display: grid;
    place-items: center;
    min-height: 100dvh;
    padding: var(--size-4, 1rem);
    background-color: var(--surface-2, var(--gray-50, #f9f9f9));
    font-family: var(--font-sans, var(--font2, sans-serif));
  }

  .auth-container {
    width: 100%;
    max-width: var(--auth-max-width, 24rem);
    display: flex;
    flex-direction: column;
    gap: var(--size-5, 1.5rem);
  }

  .auth-brand {
    text-align: center;
  }

  .auth-brand-text {
    font-size: var(--font-size-4, 1.5rem);
    font-weight: var(--font-weight-7, 700);
    color: var(--text-1, var(--fore, currentColor));
    letter-spacing: -0.02em;
  }

  .auth-content {
    background-color: var(--surface-1, var(--white, #fff));
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    border-radius: var(--radius-3, 8px);
    box-shadow: var(--shadow-2, 0 1px 4px rgba(0, 0, 0, 0.08));
    padding: var(--size-6, 2rem);
  }

  .auth-footer {
    text-align: center;
    font-size: var(--font-size-0, 0.85rem);
    color: var(--gray-500, #888);
  }

  .auth-footer :global(a) {
    color: var(--accent, var(--primary, royalblue));
    text-decoration: none;
  }

  .auth-footer :global(a:hover) {
    text-decoration: underline;
  }
</style>
