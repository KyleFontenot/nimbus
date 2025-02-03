<script lang="ts">
  interface Props {
    wrap?: boolean
    wrapperTag?: string
    children?: import('svelte').Snippet
    [key: string]: unknown
  }

  let { wrap = false, wrapperTag = 'div', children, ...rest }: Props = $props()
</script>

{#if wrap}
  <svelte:element this={wrapperTag} {...rest}>
    {@render children?.()}
  </svelte:element>
{:else}
  {@render children?.()}
{/if}
