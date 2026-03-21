<script lang="ts">
  interface Props {
    width?: string
    height?: string
    circle?: boolean
    lines?: number
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    width = '100%',
    height = '1rem',
    circle = false,
    lines = 1,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

{#if lines > 1}
  <div class="skeleton-lines" {style} {...rest}>
    {#each { length: lines } as _, i}
      <span
        class="skeleton {rest.class || ''}"
        style:width={i === lines - 1 ? '75%' : width}
        style:height
        aria-hidden="true"
      ></span>
    {/each}
  </div>
{:else}
  <span
    class="skeleton {rest.class || ''}"
    class:circle
    style:width={circle ? height : width}
    style:height
    {style}
    aria-hidden="true"
    {...rest}
  ></span>
{/if}

<style>
  .skeleton {
    display: block;
    background: linear-gradient(
      90deg,
      var(--gray-100, #eee) 25%,
      var(--gray-200, #ddd) 50%,
      var(--gray-100, #eee) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
    border-radius: var(--radius-2, 4px);
  }

  .circle {
    border-radius: var(--radius-round, 50%);
  }

  .skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: var(--size-2, 0.5rem);
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
