<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    text: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    children?: import('svelte').Snippet
  }

  let {
    text,
    position = 'top',
    style = undefined,
    children,
    ...rest
  }: Props = $props()
</script>

<span
  class="tooltip-wrapper {rest.class || ''}"
  {style}
  {...rest}
>
  {@render children?.()}
  <span class="tooltip-bubble {position}" role="tooltip">{text}</span>
</span>

<style>
  .tooltip-wrapper {
    position: relative;
    display: inline-flex;
  }

  .tooltip-bubble {
    position: absolute;
    padding: var(--size-1, 0.25rem) var(--size-2, 0.5rem);
    background-color: var(--gray-900, var(--dark, #222));
    color: var(--gray-0, var(--light, #fefefe));
    font-size: var(--font-size-0, 0.8rem);
    font-family: var(--font-sans, var(--font2, sans-serif));
    line-height: var(--font-lineheight-1, 1.3);
    border-radius: var(--radius-2, 4px);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
    z-index: var(--layer-4, 100);
    width: max-content;
    max-width: 20rem;
  }

  .tooltip-wrapper:hover .tooltip-bubble,
  .tooltip-wrapper:focus-within .tooltip-bubble {
    opacity: 1;
  }

  /* Positions */
  .top {
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
  }
  .bottom {
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
  }
  .left {
    right: calc(100% + 6px);
    top: 50%;
    transform: translateY(-50%);
  }
  .right {
    left: calc(100% + 6px);
    top: 50%;
    transform: translateY(-50%);
  }
</style>
