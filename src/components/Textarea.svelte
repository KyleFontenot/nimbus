<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements'

  interface Props extends HTMLTextareaAttributes {
    value?: string
    label?: string | null
    autoResize?: boolean
    showCount?: boolean
    children?: import('svelte').Snippet
  }

  let {
    value = $bindable(''),
    name = null,
    id = undefined,
    label = null,
    placeholder = undefined,
    rows = 4,
    maxlength = undefined,
    minlength = undefined,
    disabled = false,
    readonly = false,
    required = false,
    form = undefined,
    autoResize = false,
    showCount = false,
    style = undefined,
    children,
    ...rest
  }: Props = $props()

  let textareaEl: HTMLTextAreaElement | undefined = $state()

  function handleInput() {
    if (autoResize && textareaEl) {
      textareaEl.style.height = 'auto'
      textareaEl.style.height = textareaEl.scrollHeight + 'px'
    }
  }

  $effect(() => {
    if (autoResize && textareaEl) {
      textareaEl.style.height = 'auto'
      textareaEl.style.height = textareaEl.scrollHeight + 'px'
    }
  })
</script>

{#if label}
  <label class="textarea-label" for={id}>{label}</label>
{/if}
<textarea
  bind:this={textareaEl}
  bind:value
  class="textarea {rest.class || ''}"
  class:auto-resize={autoResize}
  {name}
  {id}
  {placeholder}
  {rows}
  {maxlength}
  {minlength}
  {disabled}
  {readonly}
  {required}
  {form}
  {style}
  oninput={handleInput}
  {...rest}
></textarea>
{#if showCount}
  <div class="textarea-count">
    <span>{value.length}{maxlength ? ` / ${maxlength}` : ''}</span>
  </div>
{/if}

<style>
  .textarea-label {
    display: block;
    font-weight: var(--font-weight-5, 500);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    margin-bottom: var(--size-1, 0.25rem);
    color: var(--text-1, var(--fore, currentColor));
  }

  .textarea {
    display: block;
    width: 100%;
    padding: var(--size-2, 0.5rem) var(--size-3, 0.75rem);
    border: var(--border-size-1, 1px) solid var(--gray-400, #999);
    border-radius: var(--radius-2, 6px);
    background-color: var(--surface-1, var(--white, #fff));
    color: var(--text-1, var(--fore, currentColor));
    font-family: inherit;
    font-size: var(--font-size-1, 0.95rem);
    line-height: var(--font-lineheight-3, 1.55);
    resize: vertical;
  }

  .auto-resize {
    resize: none;
    overflow: hidden;
  }

  .textarea:focus-visible {
    outline: var(--focus-size, 2px) solid var(--accent, var(--link, royalblue));
    outline-offset: var(--focus-offset, 1px);
  }

  .textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .textarea::placeholder {
    color: var(--gray-400, #aaa);
  }

  .textarea-count {
    text-align: right;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-00, 0.7rem);
    color: var(--gray-400, #aaa);
    margin-top: var(--size-1, 0.2rem);
    font-variant-numeric: tabular-nums;
  }
</style>
