<script lang="ts">
  import type { HTMLProgressAttributes } from 'svelte/elements'

  let uid = 0

  interface Props extends HTMLProgressAttributes {
    value?: number | null
    max?: number
    label?: string | null
    size?: 'small' | 'medium' | 'large'
  }

  let {
    value = null,
    max = 100,
    label = null,
    size = 'medium',
    style = undefined,
    ...rest
  }: Props = $props()

  const progressId = `progress-${uid++}`

  let percent = $derived(
    value != null && max != null ? Math.min(100, Math.max(0, (value / max) * 100)) : null
  )
</script>

{#if label}
  <label class="progress-label" for={progressId}>
    <span class="progress-label-text">{label}</span>
    {#if percent != null}
      <span class="progress-label-value">{Math.round(percent)}%</span>
    {/if}
  </label>
{/if}
<progress
  id={progressId}
  class="progress {size} {rest.class || ''}"
  {value}
  {max}
  {style}
  aria-label={label ? undefined : 'Progress'}
  {...rest}
>{percent != null ? `${Math.round(percent)}%` : ''}</progress>

<style>
  .progress-label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: var(--size-1, 0.25rem);
    font-family: var(--font-sans);
    font-size: var(--font-size-1, 0.9rem);
    color: var(--text-1);
  }

  .progress-label-value {
    font-variant-numeric: tabular-nums;
    color: var(--gray-500, #888);
    font-size: var(--font-size-0, 0.8rem);
  }

  .progress {
    display: block;
    width: 100%;
    appearance: none;
    border: none;
    border-radius: var(--radius-round, 999px);
    overflow: hidden;
    background-color: var(--gray-200, #e0e0e0);
  }

  .small { height: 0.35rem; }
  .medium { height: 0.6rem; }
  .large { height: 0.85rem; }

  /* Webkit */
  .progress::-webkit-progress-bar {
    background-color: var(--gray-200, #e0e0e0);
    border-radius: var(--radius-round, 999px);
  }
  .progress::-webkit-progress-value {
    background-color: var(--accent);
    border-radius: var(--radius-round, 999px);
    transition: width 0.3s ease;
  }

  /* Firefox */
  .progress::-moz-progress-bar {
    background-color: var(--accent);
    border-radius: var(--radius-round, 999px);
  }

  /* Indeterminate */
  .progress:indeterminate {
    animation: indeterminate 1.5s ease-in-out infinite;
    background: linear-gradient(
      90deg,
      var(--gray-200, #e0e0e0) 0%,
      var(--accent) 50%,
      var(--gray-200, #e0e0e0) 100%
    );
    background-size: 200% 100%;
  }
  .progress:indeterminate::-webkit-progress-bar {
    background-color: transparent;
  }
  .progress:indeterminate::-moz-progress-bar {
    background-color: transparent;
  }

  @keyframes indeterminate {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
