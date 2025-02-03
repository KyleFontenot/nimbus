<script lang="ts">
  import type { Snippet } from 'svelte'
  type buttonTypes = 'button' | 'input' | 'link' | 'submit' | 'upload'
  type colorTypes = 'white' | 'primary' | 'secondary'
  interface Props {
    type?: buttonTypes
    href?: string | null
    outlined?: boolean
    color?: colorTypes
    newWindow?: boolean
    style?: string | null
    leftArrow?: boolean | null
    className?: string
    download?: string | null
    minimal?: boolean
    disabled?: boolean
    name?: string | undefined
    value?: string
    formAction?: string | undefined
    fullWidth?: boolean
    children?: Snippet
    target?: '_self' | '_blank' | '_parent' | '_top'
    [key: string]: unknown
  }
  let {
    type = 'button',
    href = null,
    outlined = false,
    color = 'primary',
    newWindow = false,
    style = null,
    leftArrow = null,
    className = '',
    download = null,
    minimal = false,
    disabled = false,
    name = undefined,
    value = '',
    formAction = undefined,
    fullWidth = false,
    children,
    ...restProps
  }: Props = $props()
</script>

{#if type === 'link'}
  <a
    {href}
    {download}
    class="button {restProps?.class || ''}"
    class:outlined
    class:white={color === 'white'}
    class:buttonLeftarrow={leftArrow}
    class:primary={color === 'primary'}
    class:secondary={color === 'secondary'}
    class:fullwidth={fullWidth}
    class:minimal
    class:disabled
    {...restProps}
    target={newWindow ? '_blank' : (restProps?.target as Props['target']) || undefined}
    rel={newWindow ? 'noopener' : null}
    style={`--color: var(--${color});${style}`}
  >
    {value}
  </a>
{:else if type === 'submit' || type === 'input'}
  <input
    type="submit"
    class="button {restProps?.class || ''}"
    class:outlined
    class:white={color === 'white'}
    class:buttonLeftarrow={leftArrow}
    class:primary={color === 'primary'}
    class:secondary={color === 'secondary'}
    class:minimal
    class:fullwidth={fullWidth}
    class:disabled
    formaction={formAction}
    {value}
    {...restProps}
    style={`--color: var(--${color});${style}`}
  />
{:else if type === 'upload'}
  <input
    type="file"
    class:outlined
    class:white={color === 'white'}
    class:buttonLeftarrow={leftArrow}
    class:primary={color === 'primary'}
    class:secondary={color === 'secondary'}
    class:minimal
    class="button {restProps.class || ''}"
    class:disabled
    {value}
    style={`--color: var(--${color});${style}`}
    id={name}
    {name}
    {...restProps}
  />
{:else}
  <button
    class="button {restProps.class || ''}"
    class:outlined
    {type}
    class:white={color === 'white'}
    class:buttonLeftarrow={leftArrow}
    class:primary={color === 'primary'}
    class:secondary={color === 'secondary'}
    class:fullwidth={fullWidth}
    tabindex="0"
    class:minimal
    formaction={formAction}
    {value}
    {...restProps}
    style={`--color: var(--${color});${style}`}
  >
    {value}
  </button>
{/if}

<style lang="scss">
  .button {
    color: white;
    color: var(--white);
    padding: 0.43rem 0.9rem;
    position: relative;
    font-size: 0.75rem;
    font-family: var(--font2);
    letter-spacing: 0.2px;
    letter-spacing: 0.4px;
    font-weight: 525;
    display: inline-block;
    height: auto;
    width: auto;
    min-width: auto;
    border: none;
    border-color: var(--color);
    border-width: 0;
    border-style: solid;
    box-shadow: 0 2px 5px -4px var(--color);
    background-color: var(--color);
    cursor: pointer;
    transition: transform 0.2s;

    &:hover,
    &:focus-visible {
      transform: translate3d(0, -3px, 0);
    }

    &:focus-visible {
      outline: 2px solid #777;
    }
  }

  .outlined {
    border-width: 1px;
    border-style: solid;
    border-color: var(--primary-2);
    border-color: var(--color);
    background-color: transparent;
    background: var(--white);
    background: var(--color);
    color: var(--primary-2);
  }
  .minimal {
    background-color: #eeeeee33;
    background-color: unset;
    background-color: var(--white);
    background: unset;
    background: var(--white);
    color: var(--color);
    border-width: 1px;
    border-style: solid;
  }
  .disabled {
    background-color: #eeeeee33;
    border: 1px solid #aaaaaaaa;
    border: 1px solid var(--white-2);
    border-width: 1px;
    border-style: solid;
    color: #888;
    color: var(--black-3);
    box-shadow: 0 0 0 0 transparent;
  }
</style>
