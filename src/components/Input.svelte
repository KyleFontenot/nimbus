<script lang="ts">
  import { onMount } from 'svelte'
  import ConditionalWrapper from './ConditionalWrapper.svelte'
  import 'highlight.js/styles/github.css'
  import type { HLJSApi } from 'highlight.js'

  type InputType =
    | 'text'
    | 'email'
    | 'tel'
    | 'password'
    | 'textarea'
    | 'number'
    | 'checkbox'
    | 'hidden'

  interface Props {
    type?: InputType
    label?: string | null
    incrementor?: boolean
    id?: string | undefined
    placeholder?: string | undefined
    style?: string | undefined
    maxlength?: number | undefined
    hidden?: boolean
    value?: string
    disabled?: boolean
    name?: string | null
    minimal?: boolean
    checked?: boolean
    dataVault?: string
    initial?: string | number | undefined
    onChange?: ((e: Event) => void) | undefined
    onInput?: ((e: Event) => void) | undefined
    onFocus?: ((e: Event) => void) | undefined
    flexibleHeight?: boolean
    monospace?: boolean
    code?: boolean
    required?: boolean
    form?: string | undefined
    [key: string]: unknown
  }

  let {
    type = 'text',
    label = null,
    incrementor = false,
    id = undefined,
    placeholder = undefined,
    style = undefined,
    maxlength = undefined,
    hidden = false,
    value = $bindable(''),
    disabled = false,
    name = null,
    minimal = false,
    checked = false,
    dataVault = '',
    initial = $bindable(undefined),
    onChange = undefined,
    onInput = undefined,
    onFocus = undefined,
    flexibleHeight = false,
    monospace = false,
    code = false,
    required = false,
    form = undefined,
    ...rest
  }: Props = $props()

  if (!value && initial) {
    value = initial.toString()
  }
  let checkedObj = {}
  if (checked) {
    Object.assign(checkedObj, { checked })
  }

  let hljs: HLJSApi | undefined = $state()
  let codevalue: string = $state(value)

  async function loadHighlightJs(): Promise<void> {
    const h = await import('highlight.js/lib/core')
    hljs = h.default
    const syntax = await import('highlight.js/lib/languages/sql')
    hljs.registerLanguage('sql', syntax)
  }

  if (code) {
    loadHighlightJs()
  }
  $effect(() => {
    if (code) {
      if (hljs) {
        const highlighted = hljs.highlightAuto(value)
        codevalue = highlighted.value
      } else {
        codevalue = value
      }
    }
  })

  let el: HTMLElement = $state()
  function checkHeight(element: HTMLElement) {
    element.style.height = 'auto'
    element.style.height = `${element.scrollHeight + 5}px`
  }
  onMount(() => {
    if (type === 'textarea') {
      flexibleHeight && checkHeight(el)
    }
    if (initial) {
      if (typeof initial === 'number') {
        initial = initial.toString()
      }
      value = initial
    }
  })
</script>

{#if label}
  <label class="label">
    {label}

    {#if type === 'text'}
      <input
        class={`input ${rest.class}`}
        {maxlength}
        class:noincrementor={!incrementor}
        class:minimal
        class:hidden
        {name}
        type="text"
        {id}
        {checked}
        {placeholder}
        {style}
        oninput={onInput}
        onchange={onChange}
        onfocus={onFocus}
        readonly={disabled}
        bind:value
        data-vault={dataVault}
      />
    {:else if type === 'number'}
      <input
        class={`input ${rest.class}`}
        {maxlength}
        class:noincrementor={!incrementor}
        class:minimal
        class:hidden
        {name}
        type="number"
        {id}
        {checked}
        {placeholder}
        {style}
        oninput={onInput}
        onchange={onChange}
        onfocus={onFocus}
        readonly={disabled}
        bind:value
        data-vault={dataVault}
      />
    {:else if type === 'password'}
      <input
        class={`input ${rest.class}`}
        {maxlength}
        class:noincrementor={!incrementor}
        class:minimal
        class:hidden
        {name}
        type="password"
        {id}
        {checked}
        {placeholder}
        {style}
        oninput={onInput}
        onchange={onChange}
        onfocus={onFocus}
        readonly={disabled}
        bind:value
        data-vault={dataVault}
      />
    {:else if type === 'checkbox'}
      <label class="checkmarkcontainer" class:disabled>
        <input
          class={`${rest.class}`}
          {maxlength}
          class:noincrementor={!incrementor}
          class:hideDefault={true}
          class:checkbox={true}
          class:checkmarkinput={true}
          class:minimal
          class:hidden
          {name}
          type="checkbox"
          {id}
          {checked}
          {placeholder}
          {style}
          oninput={onInput}
          onchange={onChange}
          readonly={disabled}
          value={initial ?? value}
          data-vault={dataVault}
        />
        <span class="checkmark"></span>
      </label>
    {:else if type === 'hidden'}
      <input
        class={`${rest.class}`}
        class:hidden
        {name}
        type="hidden"
        {id}
        {style}
        onchange={onChange}
        bind:value
      />
    {:else if type === 'textarea'}
      <ConditionalWrapper wrap={code} class="textareahighlightcodediv">
        <textarea
          class="input"
          {name}
          class:textarea={type === 'textarea'}
          class:minimal
          class:hidden
          class:monospace
          class:code
          bind:value
          spellcheck={code ? false : true}
          bind:this={el}
          {id}
          oninput={e => {
            flexibleHeight && e?.target instanceof HTMLElement && checkHeight(e.target)
            if (onInput) {
              onInput(e)
            }
            if (code) {
            }
          }}
          {placeholder}
          {style}
        ></textarea>
        {#if code}
          <pre><code
              contenteditable="true"
              spellcheck="false"
              bind:innerHTML={codevalue}
              oninput={e => (codevalue = e.target.value)}>{@html codevalue}</code></pre>
        {/if}
      </ConditionalWrapper>
    {/if}
  </label>
{:else if !label}
  {#if type === 'text'}
    <input
      class={`input ${rest.class}`}
      {maxlength}
      class:noincrementor={!incrementor}
      class:minimal
      class:hidden
      {name}
      type="text"
      {id}
      {checked}
      {placeholder}
      {style}
      oninput={onInput}
      onchange={onChange}
      onfocus={onFocus}
      readonly={disabled}
      bind:value
      data-vault={dataVault}
    />
  {:else if type === 'hidden'}
    <input
      class={`${rest.class}`}
      class:hidden
      {name}
      type="hidden"
      {id}
      {style}
      onchange={onChange}
      bind:value
    />
  {:else if type === 'number'}
    <input
      class={`input ${rest.class}`}
      {maxlength}
      class:noincrementor={!incrementor}
      class:minimal
      class:hidden
      {name}
      type="number"
      {id}
      {checked}
      {placeholder}
      {style}
      oninput={onInput}
      onchange={onChange}
      onfocus={onFocus}
      readonly={disabled}
      bind:value
      data-vault={dataVault}
    />
  {:else if type === 'password'}
    <input
      class={`input ${rest.class}`}
      {maxlength}
      class:noincrementor={!incrementor}
      class:minimal
      class:hidden
      {name}
      type="password"
      {id}
      {checked}
      {placeholder}
      {style}
      oninput={onInput}
      onchange={onChange}
      onfocus={onFocus}
      readonly={disabled}
      bind:value
      data-vault={dataVault}
    />
  {:else if type === 'checkbox'}
    <label class="checkmarkcontainer" class:disabled>
      <input
        class={`${rest.class}`}
        {maxlength}
        class:noincrementor={!incrementor}
        class:hideDefault={true}
        class:checkbox={true}
        class:checkmarkinput={true}
        class:minimal
        class:hidden
        {name}
        type="checkbox"
        {id}
        {checked}
        {placeholder}
        {style}
        oninput={onInput}
        onchange={onChange}
        readonly={disabled}
        value={initial ?? value}
        data-vault={dataVault}
      />
      <span class="checkmark"></span>
    </label>
  {:else if type === 'textarea'}
    <ConditionalWrapper wrap={code} class="codediv">
      <textarea
        class="input"
        {name}
        class:textarea={type === 'textarea'}
        class:minimal
        class:hidden
        class:monospace
        class:code
        spellcheck={code ? false : true}
        bind:this={el}
        bind:value
        {id}
        oninput={e => {
          flexibleHeight && e?.target instanceof HTMLElement && checkHeight(e.target)
          if (onInput) {
            onInput(e)
          }
        }}
        {placeholder}
        {style}
      ></textarea>
      {#if code}
        <pre><code
            spellcheck="false"
            contenteditable="true"
            oninput={e => (codevalue = e.target.value)}>{@html codevalue}</code></pre>
      {/if}
    </ConditionalWrapper>
  {/if}
{/if}

<!-- {#if type === 'checkbox'}

{/if} -->

<style lang="scss">
  $padding: 8px;
  .input {
    padding: $padding;
    outline: 1px solid var(--primary);
    border-radius: 4px;
    background: var(--surface-1, var(--white, #fff));
    display: inline-block;
    display: block;
    width: 100%;
    border: 1px solid transparent;
    &::placeholder {
      color: var(--gray-400, #aaa);
    }
    &.checkbox {
      outline: none;
    }
  }
  .textarea {
    width: 80%;
    height: 4rem;
    display: block;
    width: 100%;
    height: auto;
    resize: none;
    line-height: 1.2rem;
    font-family: var(--font1);
    &.monospace {
      font-family: monospace;
    }
  }
  .minimal {
    outline: 1px solid var(--gray-300, #cccccc99);
  }
  .minimal.checkbox {
    outline: none;
  }
  input.checkbox {
    width: unset;
  }
  input.noincrementor::-webkit-outer-spin-button,
  input.noincrementor::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'].noincrementor {
    appearance: textfield;
    -moz-appearance: textfield;
  }
  .label {
    display: inline-block;
    font-size: 100%;
    font-weight: 400;
    font-family: var(--font2);
    line-height: 1.6rem;
    position: relative;
  }
  .hidden {
    display: none;
    visibility: hidden;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
  }

  .checkmarkcontainer {
    display: inline-block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .checkmarkinput {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 1.3rem;
    width: 1.3rem;
    background-color: var(--gray-50, #f9f9f9);
    border: 1px solid var(--primary);
    border-radius: var(--radius-2, 5px);
    transition: background-color 0.1s;
  }

  /* On mouse-over, add a grey background color */
  .checkmarkcontainer:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .checkmarkcontainer input:checked ~ .checkmark {
    background-color: var(--primary);
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .checkmarkcontainer input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .checkmarkcontainer .checkmark:after {
    left: 6px;
    top: 1px;
    width: 8px;
    height: 12px;
    border: solid white;
    border-width: 0 3px 3px 0;
    // -webkit-transform: rotate(49deg);
    // -ms-transform: rotate(52deg);
    transform: rotate(35deg);
  }

  .checkmarkcontainer.disabled {
    &:hover input ~ .checkmark {
      background-color: #f9f9f9;
    }
    & input:checked ~ .checkmark {
      background-color: #bbb;
    }
    & > .checkmark {
      background-color: #f9f9f9;
      border: 1px solid #ddd;
    }
  }

  :global(.textareahighlightcodediv) {
    // border: 1px solid red;
    position: relative;
    pre {
      position: absolute;
      top: 0;
      left: 0;
      padding: $padding;
      display: block;
      height: 100%;
      width: 100%;

      z-index: 9;
      cursor: text;
      code {
        top: 0;
        position: relative;
        margin-inline: unset;
        font-size: inherit;
        padding: 0;
        margin: 0;
        // color: red;
        // z-index: 10;
      }
    }
    pre,
    textarea {
      font-family: monospace;
      font-size: 0.9rem;
      line-height: 1.2rem;
    }
    textarea {
      // color: blue;
      color: transparent;
      // background-color: transparent;
    }
  }
</style>
