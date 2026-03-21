<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    date: string
    title: string
    description?: string | undefined
    active?: boolean
    position?: 'left' | 'right' | 'auto'
    children?: Snippet
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    date,
    title,
    description = undefined,
    active = false,
    position = 'auto',
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<div
  class="timeline-item {rest.class || ''}"
  class:active
  class:pos-left={position === 'left'}
  class:pos-right={position === 'right'}
  {style}
  {...rest}
>
  <div class="timeline-line">
    <div class="timeline-dot"></div>
  </div>

  <div class="timeline-content">
    <span class="timeline-date">{date}</span>
    <h3 class="timeline-title">{title}</h3>
    {#if description}
      <p class="timeline-description">{description}</p>
    {/if}
    {#if children}
      <div class="timeline-extra">
        {@render children()}
      </div>
    {/if}
  </div>
</div>

<style>
  .timeline-item {
    display: grid;
    grid-template-columns: 3rem 1fr;
    gap: var(--size-3, 0.75rem);
    position: relative;
    padding-bottom: var(--size-5, 1.5rem);
  }

  .timeline-item.pos-right {
    grid-template-columns: 1fr 3rem;
  }

  .timeline-item.pos-right .timeline-line {
    order: 2;
  }

  .timeline-item.pos-right .timeline-content {
    order: 1;
    text-align: right;
  }

  .timeline-line {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .timeline-line::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--gray-200, #e0e0e0);
  }

  .timeline-item:last-child .timeline-line::before {
    bottom: 50%;
  }

  .timeline-dot {
    position: relative;
    width: 0.875rem;
    height: 0.875rem;
    border-radius: var(--radius-round, 50%);
    background-color: var(--gray-300, #ccc);
    border: 2px solid var(--surface-1, var(--white-2, #fff));
    box-shadow: 0 0 0 2px var(--gray-200, #e0e0e0);
    flex-shrink: 0;
    margin-top: 0.375rem;
    z-index: 1;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }

  .timeline-item.active .timeline-dot {
    background-color: var(--accent, var(--primary, royalblue));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent, var(--primary, royalblue)) 25%, transparent);
  }

  .timeline-content {
    display: flex;
    flex-direction: column;
    gap: var(--size-1, 0.25rem);
    padding: var(--size-3, 0.75rem) var(--size-4, 1rem);
    border-radius: var(--radius-2, 8px);
    background-color: var(--surface-1, var(--white-2, #fff));
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    transition: box-shadow 0.2s ease;
  }

  .timeline-item.active .timeline-content {
    border-color: var(--accent, var(--primary, royalblue));
    box-shadow: 0 0 0 1px var(--accent, var(--primary, royalblue));
  }

  .timeline-date {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-0, 0.85rem);
    font-weight: 600;
    color: var(--accent, var(--primary, royalblue));
    letter-spacing: 0.02em;
  }

  .timeline-title {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-2, 1.1rem);
    font-weight: 600;
    color: var(--text-1, var(--fore, currentColor));
    line-height: 1.3;
  }

  .timeline-description {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    color: var(--gray-600, var(--black-3, #666));
    line-height: 1.6;
  }

  .timeline-extra {
    margin-top: var(--size-2, 0.5rem);
  }

  @media (max-width: 640px) {
    .timeline-item.pos-right {
      grid-template-columns: 3rem 1fr;
    }

    .timeline-item.pos-right .timeline-line {
      order: unset;
    }

    .timeline-item.pos-right .timeline-content {
      order: unset;
      text-align: left;
    }
  }
</style>
