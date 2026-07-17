<script lang="ts">
  import { fly } from 'svelte/transition'

  interface Props {
    url?: string
    duration?: number
    children?: any
    class?: string
  }

  let { url = '', duration = 200, children, class: className = '' }: Props = $props()
</script>

<div class="transition-outer">
  {#key url}
    <div
      in:fly={{ x: 100, duration, delay: duration }}
      out:fly={{ x: -50, duration, delay: duration / 2 }}
      class="transition-inner {className}"
    >
      {@render children?.()}
    </div>
  {/key}
</div>

<style>
  .transition-outer {
    display: grid;
    grid-template-columns: 1fr;
  }

  .transition-inner {
    grid-row: 1;
    grid-column: 1;
  }
</style>
