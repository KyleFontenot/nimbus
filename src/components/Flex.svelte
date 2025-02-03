<script lang="ts">
  type FlowType = ''
  interface Props {
    style?: string | null
    direction?: 'column' | 'row'
    wrap?: boolean
    childMaxWidth?: string | null
    id?: string | null
    gap?: string | null
    flexGrow?: string | null
    padding?: string | null
    justify?: string | null
    align?: string | null
    children?: import('svelte').Snippet
    [key: string]: unknown
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
  style={`${childMaxWidth ? `--flexbox-childmaxwidth:${childMaxWidth};` : ''}${
    gap ? `--flexbox-gap:${gap};` : ''
  }${flexGrow ? `--flexbox-flexgrow:${flexGrow}` : ''}${
    padding ? `--flexbox-padding:${padding};` : ''
  }${justify ? `--flexbox-justify:${justify};` : ''}${
    align ? `--flexbox-align:${align};` : ''
  }${style};`}
>
  {@render children?.()}
</div>

<style lang="scss">
  .flexbox {
    display: flex;
    gap: var(--flexbox-gap);
    // gap: 1rem;
    flex-grow: var(--flexbox-flexgrow);
    padding: var(--flexbox-padding);
    justify-content: var(--flexbox-justify);
    align-content: var(--flexbox-align);
    margin-block: 1.5rem;

    & > :global(*) {
      max-width: var(--flexbox-childmaxwidth);
    }
  }
  .column {
    flex-direction: column;
  }
  .row {
    flex-direction: row;
  }
  .wrap {
    flex-wrap: wrap;
  }
  .space-around {
    justify-content: space-around;
  }
  .space-between {
    justify-content: space-between;
  }
  .center {
    justify-content: center;
  }
  .flex-end {
    justify-content: flex-end;
  }
  .flex-start {
    justify-content: flex-start;
  }
</style>
