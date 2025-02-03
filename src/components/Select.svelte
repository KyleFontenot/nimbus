<script lang="ts">
  interface SelectProps {
    name: string
    id?: string
    label?: string
    options?: string[]
    onChange?: (e: Event) => void
    style?: string
    blankDefault?: boolean
  }

  interface Props {
    name?: string | null
    id?: string | null
    blankDefault?: boolean
    options?: any[] | null
    onChange?: any
    value?: string | null
    children?: import('svelte').Snippet
  }

  let {
    name = null,
    id = null,
    blankDefault = false,
    options = null,
    onChange = null,
    value = $bindable(null),
    children
  }: Props = $props()
</script>

<select
  {name}
  {id}
  class="select"
  bind:value
  onchange={() => {
    onChange && onChange({ id, value })
  }}
>
  {#if blankDefault}
    <option selected value={null}>---</option>
  {/if}
  {#if options}
    {#each options as option}
      <option value={option.value}>{option.text ?? option.value}</option>
    {/each}
  {/if}
  {@render children?.()}
</select>

<style lang="scss">
  .select {
    background-color: white;
    padding: 6px 12px;
    display: block;
    // border:none;
    border-color: var(--primary);
    // outline: 1px solid $primary;
    // border-radius: 9px;
    border-radius: 6px;
    // min-width: 12rem;
    // width: calc(100% - 8rem);
    z-index: 29;
    // float: right;
    position: relative;
    //margin-top: 0.2rem;
    // margin-bottom: 0.4rem;
    margin-inline: 0.4rem;
    height: 1.8rem;
    &::after {
      content: '';
      position: relative;
      width: 30rem;
      height: 30rem;
      display: block;
      top: 0;
      right: 0;
      background-color: red;
      border-bottom: 8px solid purple;
      border-right: 8px solid purple;
      border-top: 8px solid transparent;
      border-left: 8px solid transparent;
      z-index: 100;
    }
  }
</style>
