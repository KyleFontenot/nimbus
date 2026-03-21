<script lang="ts">
  import type { Snippet } from 'svelte'
  import Dialog from '../components/Dialog.svelte'
  import Button from '../components/Button.svelte'
  import Spinner from '../components/Spinner.svelte'

  interface Props {
    open?: boolean
    title?: string
    description?: string | undefined
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'default' | 'danger'
    onconfirm: () => void
    oncancel?: (() => void) | undefined
    loading?: boolean
    children?: Snippet
    [key: string]: unknown
  }

  let {
    open = $bindable(false),
    title = 'Are you sure?',
    description = undefined,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    onconfirm,
    oncancel = undefined,
    loading = false,
    children,
    ...rest
  }: Props = $props()

  function handleConfirm() {
    if (loading) return
    onconfirm()
  }

  function handleCancel() {
    if (loading) return
    oncancel?.()
    open = false
  }
</script>

<Dialog bind:open closeable={!loading} {...rest}>
  <div class="confirm-dialog" class:danger={variant === 'danger'}>
    <h2 class="confirm-title">{title}</h2>

    {#if description}
      <p class="confirm-description">{description}</p>
    {/if}

    {#if children}
      <div class="confirm-body">
        {@render children()}
      </div>
    {/if}

    <div class="confirm-actions">
      <Button
        type="button"
        minimal
        disabled={loading}
        onclick={handleCancel}
      >
        {cancelLabel}
      </Button>
      <Button
        type="button"
        color={variant === 'danger' ? 'secondary' : 'primary'}
        disabled={loading}
        onclick={handleConfirm}
      >
        {#if loading}
          <span class="confirm-loading">
            <Spinner size="small" label="Loading" />
            {confirmLabel}
          </span>
        {:else}
          {confirmLabel}
        {/if}
      </Button>
    </div>
  </div>
</Dialog>

<style>
  .confirm-dialog {
    display: flex;
    flex-direction: column;
    gap: var(--size-3, 0.75rem);
  }

  .confirm-title {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-4, 1.35rem);
    font-weight: 600;
    color: var(--text-1, var(--fore, currentColor));
    line-height: 1.3;
  }

  .danger .confirm-title {
    color: var(--red-9, var(--error, #c62828));
  }

  .confirm-description {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    color: var(--gray-600, var(--black-3, #666));
    line-height: var(--font-lineheight-3, 1.6);
  }

  .confirm-body {
    margin-top: var(--size-1, 0.25rem);
  }

  .confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--size-2, 0.5rem);
    margin-top: var(--size-2, 0.5rem);
  }

  .confirm-loading {
    display: inline-flex;
    align-items: center;
    gap: var(--size-2, 0.5rem);
  }
</style>
