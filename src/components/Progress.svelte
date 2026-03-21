<script lang="ts">
  interface Props {
    value?: number | null
    max?: number
    label?: string | null
    size?: 'small' | 'medium' | 'large'
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    value = null,
    max = 100,
    label = null,
    size = 'medium',
    style = undefined,
    ...rest
  }: Props = $props()

  let percent = $derived(value != null ? Math.min(100, Math.max(0, (value / max) * 100)) : null)
</script>

{#if label}
  <label class="progress-label">
    <span class="progress-label-text">{label}</span>
    {#if percent != null}
      <span class="progress-label-value">{Math.round(percent)}%</span>
    {/if}
  </label>
{/if}
<progress
  class="progress {size} {rest.class || ''}"
  {value}
  {max}
  {style}
  aria-label={label}
  {...rest}
>{percent != null ? `${Math.round(percent)}%` : ''}</progress>

<style>
  .progress-label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: var(--size-1, 0.25rem);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.9rem);
    color: var(--text-1, var(--fore, currentColor));
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
    background-color: var(--accent, var(--primary, royalblue));
    border-radius: var(--radius-round, 999px);
    transition: width 0.3s ease;
  }

  /* Firefox */
  .progress::-moz-progress-bar {
    background-color: var(--accent, var(--primary, royalblue));
    border-radius: var(--radius-round, 999px);
  }

  /* Indeterminate */
  .progress:indeterminate {
    animation: indeterminate 1.5s ease-in-out infinite;
    background: linear-gradient(
      90deg,
      var(--gray-200, #e0e0e0) 0%,
      var(--accent, var(--primary, royalblue)) 50%,
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
