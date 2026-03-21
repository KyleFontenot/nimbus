<script lang="ts">
  import type { HTMLDialogAttributes } from 'svelte/elements'

  interface Props extends HTMLDialogAttributes {
    open?: boolean
    modal?: boolean
    label?: string | undefined
    closeable?: boolean
    children?: import('svelte').Snippet
  }

  let {
    open = $bindable(false),
    modal = true,
    label = undefined,
    closeable = true,
    style = undefined,
    children,
    ...rest
  }: Props = $props()

  let dialogEl: HTMLDialogElement | undefined = $state()

  $effect(() => {
    if (!dialogEl) return
    if (open) {
      modal ? dialogEl.showModal() : dialogEl.show()
    } else {
      dialogEl.close()
    }
  })

  function handleClose() {
    open = false
  }

  function handleBackdropClick(e: MouseEvent) {
    if (closeable && e.target === dialogEl) {
      open = false
    }
  }
</script>

<dialog
  bind:this={dialogEl}
  class="dialog {rest.class || ''}"
  aria-label={label}
  {style}
  onclose={handleClose}
  onclick={handleBackdropClick}
  {...rest}
>
  {#if closeable}
    <button class="dialog-close" type="button" aria-label="Close" onclick={() => (open = false)}>
      &times;
    </button>
  {/if}
  <div class="dialog-content">
    {@render children?.()}
  </div>
</dialog>

<style>
  .dialog {
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    border-radius: var(--radius-3, 8px);
    padding: var(--size-5, 1.25rem);
    background-color: var(--surface-1, var(--white, #fff));
    color: var(--text-1, var(--fore, currentColor));
    box-shadow: var(--shadow-4, 0 8px 30px -5px rgba(0, 0, 0, 0.25));
    max-width: min(90vw, 40rem);
    width: 100%;
    position: relative;
  }

  .dialog::backdrop {
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(2px);
  }

  .dialog[open] {
    animation: dialog-in 0.2s ease-out;
  }

  @keyframes dialog-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .dialog-close {
    position: absolute;
    top: var(--size-2, 0.5rem);
    right: var(--size-2, 0.5rem);
    background: none;
    border: none;
    font-size: var(--font-size-4, 1.5rem);
    cursor: pointer;
    color: var(--gray-500, #888);
    line-height: 1;
    padding: var(--size-1, 0.25rem) var(--size-2, 0.5rem);
    border-radius: var(--radius-2, 4px);
  }

  .dialog-close:hover {
    color: var(--text-1, var(--fore, currentColor));
    background-color: var(--gray-100, #f0f0f0);
  }

  .dialog-content {
    margin: 0;
  }
</style>
