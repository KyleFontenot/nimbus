<script lang="ts" module>
  import type { Snippet } from 'svelte'

  interface ToastLink {
    href: string
    text: string
  }

  interface ToastData {
    message: string
    type: 'info' | 'success' | 'error'
    duration: number
    links?: ToastLink[]
  }

  let toastState: ToastData | null = $state(null)
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  export function showToast(
    message: string,
    options: {
      type?: 'info' | 'success' | 'error'
      duration?: number
      links?: ToastLink[]
    } = {}
  ) {
    if (timeoutId) clearTimeout(timeoutId)

    toastState = {
      message,
      type: options.type ?? 'info',
      duration: options.duration ?? 3000,
      links: options.links
    }

    timeoutId = setTimeout(() => {
      toastState = null
      timeoutId = undefined
    }, toastState.duration)
  }

  export function hideToast() {
    if (timeoutId) clearTimeout(timeoutId)
    toastState = null
    timeoutId = undefined
  }
</script>

<script lang="ts">
  import { fly } from 'svelte/transition'

  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
  }

  let { style = undefined, ...rest }: Props = $props()

  function handleMouseEnter() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  function handleMouseLeave() {
    if (toastState) {
      timeoutId = setTimeout(() => {
        toastState = null
        timeoutId = undefined
      }, 2000)
    }
  }
</script>

{#if toastState}
  <div
    role="alert"
    class="toast {toastState.type} {rest.class || ''}"
    {style}
    in:fly={{ y: 20, duration: 300 }}
    out:fly={{ y: -20, duration: 200 }}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    {...rest}
  >
    <span class="toast-message">{toastState.message}</span>
    {#if toastState.links && toastState.links.length > 0}
      <div class="toast-links">
        {#each toastState.links as link}
          <a class="toast-link" href={link.href}>{link.text}</a>
        {/each}
      </div>
    {/if}
    <button
      type="button"
      class="toast-dismiss"
      aria-label="Dismiss"
      onclick={hideToast}
    >&times;</button>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    bottom: var(--size-4, 1.5rem);
    left: 50%;
    transform: translateX(-50%);
    width: clamp(16rem, 50vw, 40rem);
    padding: var(--size-3, 0.75rem) var(--size-4, 1rem);
    border-radius: var(--radius-2, 8px);
    color: var(--text-1, var(--black, #222));
    z-index: var(--layer-5, 200);
    box-shadow: var(--shadow-4, 0 6px 20px -4px rgba(0, 0, 0, 0.3));
    display: flex;
    align-items: center;
    gap: var(--size-3, 0.75rem);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
  }

  .toast-message {
    flex: 1;
  }

  .info {
    background-color: var(--gray-100, var(--white-3, #f0f0f0));
    border: var(--border-size-1, 1px) solid var(--gray-200, var(--white-4, #ddd));
  }

  .success {
    background-color: var(--green-1, var(--tertiary4, #e8f5e9));
    border: var(--border-size-1, 1px) solid var(--green-3, var(--tertiary2, #a5d6a7));
    color: var(--green-9, var(--tertiary, #2e7d32));
  }

  .error {
    background-color: var(--red-1, var(--secondary2, #ffebee));
    border: var(--border-size-1, 1px) solid var(--red-3, var(--secondary, #ef9a9a));
    color: var(--red-9, var(--secondary, #c62828));
  }

  .toast-links {
    display: flex;
    gap: var(--size-2, 0.5rem);
    flex-shrink: 0;
  }

  .toast-link {
    padding: var(--size-1, 0.25rem) var(--size-2, 0.5rem);
    border-radius: var(--radius-2, 4px);
    background-color: rgba(255, 255, 255, 0.7);
    color: inherit;
    text-decoration: none;
    font-size: var(--font-size-0, 0.85rem);
    font-weight: 500;
    border: var(--border-size-1, 1px) solid rgba(0, 0, 0, 0.1);
  }

  .toast-link:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }

  .toast-dismiss {
    background: none;
    border: none;
    font-size: var(--font-size-3, 1.25rem);
    cursor: pointer;
    color: inherit;
    opacity: 0.5;
    line-height: 1;
    padding: 0 var(--size-1, 0.25rem);
    flex-shrink: 0;
  }

  .toast-dismiss:hover {
    opacity: 1;
  }
</style>
