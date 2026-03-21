<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLElement> {
    direction?: 'horizontal' | 'vertical'
    label?: string | null
  }

  let {
    direction = 'horizontal',
    label = null,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

{#if label}
  <div
    class="divider labeled {direction} {rest.class || ''}"
    role="separator"
    aria-orientation={direction}
    {style}
    {...rest}
  >
    <span class="divider-line"></span>
    <span class="divider-label">{label}</span>
    <span class="divider-line"></span>
  </div>
{:else}
  <hr
    class="divider {direction} {rest.class || ''}"
    aria-orientation={direction}
    {style}
    {...rest}
  />
{/if}

<style>
  hr.divider {
    border: none;
    margin: 0;
  }

  hr.horizontal {
    border-top: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    width: 100%;
    margin-block: var(--size-3, 0.75rem);
  }

  hr.vertical {
    border-left: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    height: 100%;
    display: inline-block;
    margin-inline: var(--size-3, 0.75rem);
    align-self: stretch;
  }

  .labeled {
    display: flex;
    align-items: center;
    gap: var(--size-3, 0.75rem);
  }

  .labeled.horizontal {
    flex-direction: row;
    margin-block: var(--size-3, 0.75rem);
  }

  .labeled.vertical {
    flex-direction: column;
    margin-inline: var(--size-3, 0.75rem);
  }

  .divider-line {
    flex: 1;
    border-top: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
  }

  .labeled.vertical .divider-line {
    border-top: none;
    border-left: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    height: 100%;
    min-height: 1rem;
    width: 0;
  }

  .divider-label {
    font-size: var(--font-size-0, 0.8rem);
    color: var(--gray-500, #888);
    font-family: var(--font-sans, var(--font2, sans-serif));
    white-space: nowrap;
  }
</style>
