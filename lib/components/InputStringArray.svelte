<script lang="ts">
  import { stopPropagation } from 'svelte/legacy'

  import { writable } from 'svelte/store'
  import type { PageData } from './types'
  interface Props {
    data: PageData
    style?: string | null
    value?: any
  }

  let { data, style = null, value = [] }: Props = $props()
  const array = writable(value)
  function assessWidth() {
    const widthOfAllElements = document.getElementsByClassName('intringarraystringitem')
  }
</script>

<div class="visiblediv">
  {#each $array as stringitem}
    <div class="intringarraystringitem"><code>{stringitem}</code></div>
  {/each}
  <input
    class="invisibletextinput"
    style={`left:${23}px;`}
    onkeydown={stopPropagation(e => {
      e.preventDefault()
      // e.target.value += e.key;
    })}
  />
</div>

<style lang="scss">
  .visiblediv {
    padding: 8px;
    outline: 1px solid var(--primary);
    border-radius: 4px;
    background: white;
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    border: 1px solid transparent;
    position: relative;
    min-height: 2rem;
  }
  .invisibletextinput {
    position: absolute;
    top: 0;
    outline: 0;
  }
  .stringitem {
    padding: 0.25rem;
    border: var(--white-5);
    background: var(--white-2);
  }
</style>
