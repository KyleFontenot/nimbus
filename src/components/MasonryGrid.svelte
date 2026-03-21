<script lang="ts">
  interface Props {
    columns?: string
    gap?: string
    maxWidth?: string
    style?: string | undefined
    children?: import('svelte').Snippet
    [key: string]: unknown
  }

  let {
    columns = undefined,
    gap = undefined,
    maxWidth = undefined,
    style = undefined,
    children,
    ...rest
  }: Props = $props()
</script>

<div
  class="masonry-grid {rest.class || ''}"
  style:--column-width={columns}
  style:--gap={gap}
  style:--masonry-max-width={maxWidth}
  {style}
  {...rest}
>
  {@render children?.()}
</div>

<style>
  .masonry-grid {
    --column-width: 250px;
    --gap: 16px;

    columns: var(--column-width);
    column-gap: var(--gap);
    padding: var(--gap);
    width: 100%;
    max-width: var(--masonry-max-width, 1400px);
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    .masonry-grid { columns: 3; }
  }
  @media (min-width: 1024px) {
    .masonry-grid { columns: 4; }
  }
  @media (min-width: 1400px) {
    .masonry-grid { columns: 5; }
  }
  @media (max-width: 767px) {
    .masonry-grid {
      columns: 2;
      --column-width: 160px;
      --gap: 12px;
    }
  }
  @media (max-width: 480px) {
    .masonry-grid {
      columns: 1;
      --gap: 8px;
    }
  }
</style>
