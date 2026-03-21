<script lang="ts">
  import type { Snippet } from 'svelte'

  type EnhanceAction = (node: HTMLFormElement) => { destroy?: () => void } | void

  interface Props {
    action?: string | undefined
    method?: 'GET' | 'POST'
    enhance?: EnhanceAction | undefined
    enctype?: string | undefined
    loading?: boolean
    children?: Snippet
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    action = undefined,
    method = 'POST',
    enhance = undefined,
    enctype = undefined,
    loading = $bindable(false),
    children,
    style = undefined,
    ...rest
  }: Props = $props()

  let formEl: HTMLFormElement | undefined = $state(undefined)
  let enhanceCleanup: (() => void) | undefined = $state(undefined)

  $effect(() => {
    if (formEl && enhance) {
      // Clean up previous enhance if any
      enhanceCleanup?.()

      const result = enhance(formEl)
      enhanceCleanup = result?.destroy

      return () => {
        enhanceCleanup?.()
        enhanceCleanup = undefined
      }
    }
  })

  function handleSubmit() {
    if (enhance) {
      loading = true
    }
  }
</script>

<form
  bind:this={formEl}
  {action}
  {method}
  {enctype}
  class="form {rest.class || ''}"
  {style}
  onsubmit={handleSubmit}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</form>

<style>
  .form {
    display: block;
    width: 100%;
    font-family: var(--font-sans, var(--font2, sans-serif));
  }
</style>
