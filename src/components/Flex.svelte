<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    direction?: 'column' | 'row'
    wrap?: boolean
    childMaxWidth?: string | null
    gap?: string | null
    flexGrow?: string | null
    padding?: string | null
    justify?: string | null
    align?: string | null
    margin?: string | null
    children?: import('svelte').Snippet
  }

  let {
    style = null,
    direction = 'row',
    wrap = true,
    childMaxWidth = null,
    id = null,
    gap = null,
    flexGrow = null,
    padding = null,
    justify = 'center',
    align = null,
    margin = null,
    children,
    ...rest
  }: Props = $props()
</script>

<div
  class="flexbox {rest.class || ''}"
  class:column={direction === 'column'}
  class:row={direction === 'row'}
  class:wrap
  {id}
  style:--flexbox-childmaxwidth={childMaxWidth}
  style:--flexbox-gap={gap}
  style:--flexbox-flexgrow={flexGrow}
  style:--flexbox-padding={padding}
  style:--flexbox-justify={justify}
  style:--flexbox-align={align}
  style:--flexbox-margin={margin}
  {style}
  {...rest}
>
  {@render children?.()}
</div>

<style>
  .flexbox {
    display: flex;
    gap: var(--flexbox-gap, 0);
    flex-grow: var(--flexbox-flexgrow, 0);
    padding: var(--flexbox-padding, 0);
    justify-content: var(--flexbox-justify, center);
    align-content: var(--flexbox-align, normal);
    margin-block: var(--flexbox-margin, 0);
  }

  .flexbox > :global(*) {
    max-width: var(--flexbox-childmaxwidth, none);
  }

  .column { flex-direction: column; }
  .row { flex-direction: row; }
  .wrap { flex-wrap: wrap; }
</style>
