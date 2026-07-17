<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    onclickoutside: () => void
    enabled?: boolean
    children?: import('svelte').Snippet
  }

  let {
    onclickoutside,
    enabled = true,
    style = undefined,
    children,
    ...rest
  }: Props = $props()

  let wrapperEl: HTMLDivElement | undefined = $state()

  function handleClick(e: MouseEvent) {
    if (!enabled || !wrapperEl) return
    if (!wrapperEl.contains(e.target as Node)) {
      onclickoutside()
    }
  }

  $effect(() => {
    if (enabled) {
      document.addEventListener('click', handleClick, true)
      return () => document.removeEventListener('click', handleClick, true)
    }
  })
</script>

<div bind:this={wrapperEl} class={rest.class || undefined} {style} {...rest}>
  {@render children?.()}
</div>
