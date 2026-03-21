<script lang="ts">
  import type { Snippet } from 'svelte'
  import Avatar from '../components/Avatar.svelte'

  interface Props {
    name: string
    subtitle?: string | undefined
    src?: string | undefined
    initials?: string | undefined
    size?: 'small' | 'medium' | 'large'
    href?: string | undefined
    children?: Snippet
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    name,
    subtitle = undefined,
    src = undefined,
    initials = undefined,
    size = 'medium',
    href = undefined,
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<div
  class="user-block {size} {rest.class || ''}"
  {style}
  {...rest}
>
  <Avatar
    {src}
    {initials}
    {size}
    alt={name}
  />

  <div class="user-block-info">
    <div class="user-block-name-row">
      {#if href}
        <a class="user-block-name" {href}>{name}</a>
      {:else}
        <span class="user-block-name">{name}</span>
      {/if}
    </div>
    {#if subtitle}
      <span class="user-block-subtitle">{subtitle}</span>
    {/if}
  </div>

  {#if children}
    <div class="user-block-extra">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .user-block {
    display: inline-flex;
    align-items: center;
    gap: var(--size-2, 0.5rem);
  }

  .user-block.small {
    gap: var(--size-1, 0.35rem);
  }

  .user-block.large {
    gap: var(--size-3, 0.75rem);
  }

  .user-block-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  .user-block-name-row {
    display: flex;
    align-items: center;
    gap: var(--size-1, 0.25rem);
  }

  .user-block-name {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-weight: 600;
    color: var(--gray-900, var(--black, #222));
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  a.user-block-name {
    text-decoration: none;
    color: var(--accent, var(--primary, royalblue));
  }

  a.user-block-name:hover {
    text-decoration: underline;
  }

  a.user-block-name:focus-visible {
    outline: 2px solid var(--accent, var(--primary, royalblue));
    outline-offset: 2px;
    border-radius: var(--radius-1, 2px);
  }

  .small .user-block-name {
    font-size: var(--font-size-0, 0.8rem);
  }

  .medium .user-block-name {
    font-size: var(--font-size-1, 0.95rem);
  }

  .large .user-block-name {
    font-size: var(--font-size-2, 1.1rem);
  }

  .user-block-subtitle {
    font-family: var(--font-sans, var(--font2, sans-serif));
    color: var(--gray-500, #888);
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .small .user-block-subtitle {
    font-size: var(--font-size-00, 0.7rem);
  }

  .medium .user-block-subtitle {
    font-size: var(--font-size-0, 0.8rem);
  }

  .large .user-block-subtitle {
    font-size: var(--font-size-1, 0.95rem);
  }

  .user-block-extra {
    display: flex;
    align-items: center;
    gap: var(--size-1, 0.25rem);
    margin-left: auto;
    flex-shrink: 0;
  }
</style>
