<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    src: string
    alt: string
    width?: string | number | undefined
    height?: string | number | undefined
    aspectRatio?: string | undefined
    loading?: 'lazy' | 'eager'
    objectFit?: 'cover' | 'contain' | 'fill' | 'none'
    placeholder?: Snippet
    fallback?: Snippet
    rounded?: boolean
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    src,
    alt,
    width = undefined,
    height = undefined,
    aspectRatio = undefined,
    loading = 'lazy',
    objectFit = 'cover',
    placeholder,
    fallback,
    rounded = false,
    style = undefined,
    ...rest
  }: Props = $props()

  let status: 'loading' | 'loaded' | 'error' = $state('loading')

  $effect(() => {
    // Reset status when src changes
    src;
    status = 'loading'
  })

  function handleLoad() {
    status = 'loaded'
  }

  function handleError() {
    status = 'error'
  }

  function buildStyle(): string {
    const parts: string[] = []
    if (aspectRatio) parts.push(`aspect-ratio: ${aspectRatio}`)
    if (width != null) parts.push(`width: ${typeof width === 'number' ? `${width}px` : width}`)
    if (height != null) parts.push(`height: ${typeof height === 'number' ? `${height}px` : height}`)
    parts.push(`object-fit: ${objectFit}`)
    if (style) parts.push(style)
    return parts.join('; ')
  }
</script>

<div
  class="image-wrapper {rest.class || ''}"
  class:rounded
  style:aspect-ratio={aspectRatio}
  style:width={width != null ? (typeof width === 'number' ? `${width}px` : width) : undefined}
  style:height={height != null ? (typeof height === 'number' ? `${height}px` : height) : undefined}
>
  {#if status === 'error' && fallback}
    <div class="fallback">
      {@render fallback()}
    </div>
  {:else}
    {#if status === 'loading' && placeholder}
      <div class="placeholder">
        {@render placeholder()}
      </div>
    {/if}
    <img
      {src}
      {alt}
      {loading}
      width={typeof width === 'number' ? width : undefined}
      height={typeof height === 'number' ? height : undefined}
      class:loaded={status === 'loaded'}
      class:hidden={status === 'error'}
      style={buildStyle()}
      onload={handleLoad}
      onerror={handleError}
      {...rest}
    />
  {/if}
</div>

<style>
  .image-wrapper {
    position: relative;
    display: inline-block;
    overflow: hidden;
    background-color: var(--gray-100, #f0f0f0);
    border-radius: var(--radius-2, 6px);
    line-height: 0;
  }

  .image-wrapper.rounded {
    border-radius: var(--radius-round, 999px);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  img.loaded {
    opacity: 1;
  }

  img.hidden {
    display: none;
  }

  .placeholder,
  .fallback {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--gray-100, #f0f0f0);
    color: var(--gray-500, #999);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-0, 0.8rem);
  }

  .fallback {
    background-color: var(--gray-50, #fafafa);
  }
</style>
