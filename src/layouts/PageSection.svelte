<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    maxWidth?: string
    padding?: string | null
    centered?: boolean
    background?: string | null
    children?: Snippet
  }

  let {
    maxWidth = '72rem',
    padding = null,
    centered = false,
    background = null,
    children,
    style = null,
    ...rest
  }: Props = $props()
</script>

<section
  class="page-section {rest.class || ''}"
  class:centered
  style:--section-max-width={maxWidth}
  style:--section-padding={padding}
  style:--section-bg={background}
  style={style}
  {...rest}
>
  <div class="page-section-inner">
    {@render children?.()}
  </div>
</section>

<style>
  .page-section {
    width: 100%;
    background: var(--section-bg, transparent);
    padding-block: var(--section-padding, var(--size-fluid-4, 2rem));
    padding-inline: var(--section-padding, var(--size-fluid-2, 1rem));
  }

  .page-section-inner {
    max-width: var(--section-max-width, 72rem);
    margin-inline: auto;
    width: 100%;
    container-type: inline-size;
    container-name: page-section;
  }

  .centered {
    text-align: center;
  }

  .centered .page-section-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
