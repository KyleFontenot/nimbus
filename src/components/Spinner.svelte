<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    size?: 'small' | 'medium' | 'large'
    label?: string
  }

  let {
    size = 'medium',
    label = 'Loading',
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<span
  class="spinner {size} {rest.class || ''}"
  role="status"
  aria-label={label}
  {style}
  {...rest}
>
  <span class="spinner-sr">{label}</span>
</span>

<style>
  .spinner {
    display: inline-block;
    border-radius: var(--radius-round, 50%);
    border-style: solid;
    border-color: var(--gray-200, #e0e0e0);
    border-top-color: var(--accent, var(--primary, royalblue));
    animation: spin 0.7s linear infinite;
  }

  .small {
    width: 1rem;
    height: 1rem;
    border-width: 2px;
  }
  .medium {
    width: 1.5rem;
    height: 1.5rem;
    border-width: 3px;
  }
  .large {
    width: 2.5rem;
    height: 2.5rem;
    border-width: 4px;
  }

  .spinner-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
