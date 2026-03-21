<script lang="ts">
  interface Props {
    onclickoutside: () => void
    enabled?: boolean
    style?: string | undefined
    children?: import('svelte').Snippet
    [key: string]: unknown
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
