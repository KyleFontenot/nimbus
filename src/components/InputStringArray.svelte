<script lang="ts">
  import { readableStreamToArrayBuffer } from 'bun'
  import { writable } from 'svelte/store'
  interface Props {
    style?: string | null
    value?: string[]
  }

  let { style = null, value = [] }: Props = $props()
  const array = $state(value)
  function assessWidth() {
    const widthOfAllElements = document.getElementsByClassName('intringarraystringitem')
  }
</script>

<div class="visiblediv">
  {#if array}
    {#each array as stringitem}
      <div class="intringarraystringitem"><code>{stringitem}</code></div>
    {/each}
  {/if}
  <input
    class="invisibletextinput"
    style={`left:${23}px;`}
    onkeydown={e => {
      e.stopPropagation()
      e.preventDefault()
      // e.target.value += e.key;
    }}
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
