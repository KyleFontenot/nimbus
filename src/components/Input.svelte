<script lang="ts">
  import { onMount } from 'svelte'
  import ConditionalWrapper from './util/ConditionalWrapper.svelte'
  import 'highlight.js/styles/github.css'
  import type { HLJSApi } from 'highlight.js'
  import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements'

  type InputType =
    | 'text'
    | 'email'
    | 'tel'
    | 'password'
    | 'number'
    | 'checkbox'
    | 'hidden'
    | 'textarea'

  // Merging input + textarea attributes — textarea has a subset, the union covers both.
  interface Props extends HTMLInputAttributes {
    type?: InputType
    label?: string | null
    value?: string
    minimal?: boolean
    incrementor?: boolean
    flexibleHeight?: boolean
    monospace?: boolean
    code?: boolean
    dataVault?: string
    disabled?: boolean
    children?: import('svelte').Snippet
  }

  let {
    type = 'text',
    label = null,
    value = $bindable(''),
    minimal = false,
    incrementor = false,
    flexibleHeight = false,
    monospace = false,
    code = false,
    dataVault = '',
    class: className = '',
    style = undefined,
    disabled = $bindable(false),
    checked = $bindable(false),
    ...rest
  }: Props = $props()

  let hljs: HLJSApi | undefined = $state()
  let codevalue: string = $state(value)
  let el: HTMLElement | undefined = $state()

  async function loadHighlightJs(): Promise<void> {
    const h = await import('highlight.js/lib/core')
    hljs = h.default
    const syntax = await import('highlight.js/lib/languages/sql')
    hljs.registerLanguage('sql', syntax.default)
  }

  if (code) loadHighlightJs()

  $effect(() => {
    if (code && hljs) {
      codevalue = hljs.highlightAuto(value).value
    } else if (code) {
      codevalue = value
    }
  })

  function checkHeight(element: HTMLElement) {
    element.style.height = 'auto'
    element.style.height = `${element.scrollHeight + 5}px`
  }

  onMount(() => {
    if (type === 'textarea' && flexibleHeight && el) checkHeight(el)
  })
</script>

{#snippet field()}
  {#if type === 'checkbox'}
    <label class="checkmark-container" class:disabled>
      <input
        type="checkbox"
        class="checkmark-input {className}"
        data-vault={dataVault}
        bind:checked
        {style}
        {...rest}
      />
      <span class="checkmark"></span>
    </label>
  {:else if type === 'hidden'}
    <input type="hidden" bind:value {style} {...rest} />
  {:else if type === 'textarea'}
    <ConditionalWrapper wrap={code} class="textarea-code-wrap">
      <textarea
        class="input {className}"
        class:minimal
        class:monospace
        class:code
        bind:value
        bind:this={el}
        spellcheck={code ? false : undefined}
        oninput={e => {
          if (flexibleHeight && e.target instanceof HTMLElement) checkHeight(e.target)
        }}
        {style}
        {...(rest as unknown as HTMLTextareaAttributes)}
      ></textarea>
      {#if code}
        <pre><code
            contenteditable="true"
            spellcheck="false"
            bind:innerHTML={codevalue}
            oninput={e =>
              (codevalue = (e.target as HTMLElement).innerHTML)}>{@html codevalue}</code></pre>
      {/if}
    </ConditionalWrapper>
  {:else}
    <input
      {type}
      class="input {className}"
      class:minimal
      class:no-incrementor={!incrementor}
      bind:value
      data-vault={dataVault}
      {style}
      {...rest}
    />
  {/if}
{/snippet}

{#if label}
  <label class="label">
    {label}
    {@render field()}
  </label>
{:else}
  {@render field()}
{/if}

<style>
  .input {
    padding: 8px;
    outline: 1px solid var(--accent);
    border-radius: var(--radius-2, 4px);
    background: var(--surface-1, #fff);
    display: block;
    width: 100%;
    border: 1px solid transparent;
    font-family: var(--font-sans);
  }

  .input::placeholder {
    color: var(--gray-400);
  }

  .input:disabled {
    background: var(--surface-2);
    color: var(--gray-500);
    cursor: not-allowed;
  }

  .minimal {
    outline: 1px solid var(--gray-300);
  }

  .no-incrementor::-webkit-outer-spin-button,
  .no-incrementor::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'].no-incrementor {
    appearance: textfield;
    -moz-appearance: textfield;
  }

  .label {
    display: inline-block;
    font-size: 100%;
    font-weight: 400;
    font-family: var(--font-sans);
    line-height: 1.6rem;
    position: relative;
  }

  /* ── Textarea ── */
  .input:is(textarea) {
    display: block;
    width: 100%;
    height: auto;
    resize: none;
    line-height: 1.2rem;
  }

  .monospace {
    font-family: var(--font-mono);
  }

  /* ── Checkbox ── */
  .checkmark-container {
    display: inline-block;
    position: relative;
    padding-left: 2rem;
    margin-bottom: 0.75rem;
    cursor: pointer;
    user-select: none;
  }

  .checkmark-input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 1.3rem;
    width: 1.3rem;
    background-color: var(--surface-2, #f9f9f9);
    border: 1px solid var(--accent);
    border-radius: var(--radius-2, 5px);
    transition: background-color var(--transition, 150ms ease);
  }

  .checkmark-container:hover .checkmark-input:not(:disabled) ~ .checkmark {
    background-color: var(--gray-200);
  }

  .checkmark-container .checkmark-input:checked ~ .checkmark {
    background-color: var(--accent);
  }

  .checkmark::after {
    content: '';
    position: absolute;
    display: none;
    left: 6px;
    top: 1px;
    width: 8px;
    height: 12px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(35deg);
  }

  .checkmark-container .checkmark-input:checked ~ .checkmark::after {
    display: block;
  }

  .checkmark-container.disabled {
    cursor: not-allowed;
  }

  .checkmark-container.disabled .checkmark {
    background-color: var(--surface-2);
    border-color: var(--gray-300);
  }

  .checkmark-container.disabled .checkmark-input:checked ~ .checkmark {
    background-color: var(--gray-400);
  }

  /* ── Code textarea overlay ── */
  :global(.textarea-code-wrap) {
    position: relative;
  }

  :global(.textarea-code-wrap) pre {
    position: absolute;
    top: 0;
    left: 0;
    padding: 8px;
    display: block;
    height: 100%;
    width: 100%;
    z-index: 9;
    cursor: text;
    pointer-events: none;
  }

  :global(.textarea-code-wrap) pre code {
    position: relative;
    font-size: inherit;
    padding: 0;
    margin: 0;
    pointer-events: auto;
  }

  :global(.textarea-code-wrap) pre,
  :global(.textarea-code-wrap) textarea {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.2rem;
  }

  :global(.textarea-code-wrap) textarea {
    color: transparent;
    caret-color: var(--text-1);
  }
</style>
