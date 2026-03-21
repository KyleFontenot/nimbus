<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    direction?: 'column' | 'row'
    columns?: string
    rows?: string
    gap?: string | null
    justify?: string | null
    padding?: string
    align?: string
    children?: import('svelte').Snippet
  }

  let {
    style = null,
    direction = 'row',
    columns = 'repeat(1fr)',
    rows = 'repeat(1fr)',
    gap = null,
    justify = 'start',
    padding = '',
    align = 'center',
    children,
    ...rest
  }: Props = $props()
</script>

<div
  class="grid {rest.class || ''}"
  style={`--grid-columns:${columns};
  --grid-rows:${rows};
  --gap:${gap};
  --justify:${justify};
  --align:${align};
  --padding:${padding};
  ${style}`}
>
  {@render children?.()}
</div>

<style lang="scss">
  .grid {
    display: grid;
    grid-template-columns: var(--grid-columns);
    grid-template-rows: var(--grid-rows);
    justify-items: var(--justify);
    align-items: var(--align);
    gap: var(--gap);
    // border: 2px solid var(--border);
  }
</style>
