<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLElement> {
    src?: string | null
    alt?: string
    size?: 'small' | 'medium' | 'large' | string
    initials?: string | null
  }

  let {
    src = null,
    alt = '',
    size = 'medium',
    initials = null,
    style = undefined,
    ...rest
  }: Props = $props()

  let sizeClass = $derived(
    size === 'small' || size === 'medium' || size === 'large' ? size : ''
  )
  let customSize = $derived(
    size !== 'small' && size !== 'medium' && size !== 'large' ? size : null
  )
</script>

{#if src}
  <img
    class="avatar {sizeClass} {rest.class || ''}"
    {src}
    {alt}
    style:width={customSize}
    style:height={customSize}
    {style}
    loading="lazy"
    {...rest}
  />
{:else}
  <span
    class="avatar placeholder {sizeClass} {rest.class || ''}"
    style:width={customSize}
    style:height={customSize}
    {style}
    role="img"
    aria-label={alt || initials || 'avatar'}
    {...rest}
  >
    {initials ?? ''}
  </span>
{/if}

<style>
  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-round, 50%);
    object-fit: cover;
    vertical-align: middle;
    flex-shrink: 0;
  }

  .small { width: 2rem; height: 2rem; font-size: var(--font-size-00, 0.7rem); }
  .medium { width: 3rem; height: 3rem; font-size: var(--font-size-1, 1rem); }
  .large { width: 4.5rem; height: 4.5rem; font-size: var(--font-size-3, 1.35rem); }

  .placeholder {
    background-color: var(--gray-300, var(--primary-4, #ccc));
    color: var(--gray-700, var(--black-2, #444));
    font-weight: 600;
    font-family: var(--font-sans, var(--font2, sans-serif));
    text-transform: uppercase;
  }
</style>
