<script lang="ts">
  import type { Snippet } from 'svelte'
  import type {
    HTMLButtonAttributes,
    HTMLAnchorAttributes,
    HTMLInputAttributes
  } from 'svelte/elements'

  // When `href` is set the component renders as <a>.
  // When `upload` is true it renders as <input type="file">.
  // Otherwise it renders as <button> and `type` maps to the native button type.
  interface Props extends HTMLButtonAttributes {
    href?: string
    target?: HTMLAnchorAttributes['target']
    download?: string | boolean
    upload?: boolean
    variant?: 'filled' | 'outlined' | 'minimal'
    color?: 'primary' | 'secondary' | 'white'
    fullWidth?: boolean
    children?: Snippet
  }

  let {
    href = undefined,
    target = undefined,
    download = undefined,
    upload = false,
    variant = 'filled',
    color = 'primary',
    fullWidth = false,
    type = 'button',
    disabled = false,
    class: className = '',
    style = undefined,
    value = undefined,
    children,
    ...rest
  }: Props = $props()
</script>

{#if href !== undefined}
  <a
    {href}
    {target}
    {download}
    class="button {className}"
    class:outlined={variant === 'outlined'}
    class:minimal={variant === 'minimal'}
    class:fullwidth={fullWidth}
    data-color={color}
    aria-disabled={disabled || undefined}
    {style}
    {...rest as unknown as HTMLAnchorAttributes}
  >
    {@render children?.()}
  </a>
{:else if upload}
  <input
    type="file"
    class="button {className}"
    class:outlined={variant === 'outlined'}
    class:minimal={variant === 'minimal'}
    class:fullwidth={fullWidth}
    data-color={color}
    {disabled}
    {style}
    {value}
    {...rest as unknown as HTMLInputAttributes}
  />
{:else}
  <button
    {type}
    class="button {className}"
    class:outlined={variant === 'outlined'}
    class:minimal={variant === 'minimal'}
    class:fullwidth={fullWidth}
    data-color={color}
    {disabled}
    {style}
    {value}
    {...rest}
  >
    {@render children?.()}
  </button>
{/if}

<style>
  .button {
    --_color: var(--color, var(--accent));

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-2);
    padding: 0.43rem 0.9rem;
    font-size: var(--font-size-0);
    font-family: var(--font-sans);
    font-weight: 500;
    letter-spacing: 0.2px;
    line-height: 1;
    border-radius: var(--radius, var(--radius-2));
    border: 1px solid transparent;
    background-color: var(--_color);
    color: white;
    box-shadow: 0 2px 5px -4px var(--_color);
    cursor: pointer;
    text-decoration: none;
    transition: transform var(--transition, 150ms ease);
  }

  .button[data-color='secondary'] {
    --_color: var(--color, var(--surface-3));
    color: var(--text-1);
  }
  .button[data-color='white'] {
    --_color: var(--color, var(--surface-1));
    color: var(--text-1);
  }

  .button:hover,
  .button:focus-visible {
    transform: translateY(-2px);
  }

  .button:disabled,
  .button[aria-disabled='true'] {
    background-color: var(--gray-200);
    border-color: var(--gray-300);
    color: var(--gray-500);
    box-shadow: none;
    cursor: not-allowed;
    pointer-events: none;
    transform: none;
  }

  .outlined {
    background-color: transparent;
    border-color: var(--_color);
    color: var(--_color);
    box-shadow: none;
  }

  .minimal {
    background-color: transparent;
    border: none;
    color: var(--_color);
    box-shadow: none;
  }

  .fullwidth {
    display: flex;
    width: 100%;
  }
</style>
