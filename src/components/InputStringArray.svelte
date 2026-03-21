<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value?: string[]
    name?: string | null
    form?: string | undefined
    placeholder?: string
    label?: string | null
    disabled?: boolean
    separator?: string
  }

  let {
    value = $bindable([]),
    name = null,
    form = undefined,
    placeholder = 'Type and press Enter...',
    label = null,
    disabled = false,
    separator = ',',
    style = undefined,
    ...rest
  }: Props = $props()

  let inputValue = $state('')
  let inputEl: HTMLInputElement | undefined = $state()

  function addItem() {
    const trimmed = inputValue.trim()
    if (trimmed && !value.includes(trimmed)) {
      value = [...value, trimmed]
      inputValue = ''
    }
  }

  function removeItem(index: number) {
    value = value.filter((_, i) => i !== index)
    inputEl?.focus()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === separator) {
      e.preventDefault()
      addItem()
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeItem(value.length - 1)
    }
  }

  function handlePaste(e: ClipboardEvent) {
    const pasted = e.clipboardData?.getData('text')
    if (!pasted) return
    const items = pasted.split(separator).map(s => s.trim()).filter(Boolean)
    if (items.length > 1) {
      e.preventDefault()
      const unique = items.filter(item => !value.includes(item))
      value = [...value, ...unique]
    }
  }
</script>

{#if label}
  <label class="string-array-label">{label}</label>
{/if}
<div
  class="string-array {rest.class || ''}"
  class:disabled
  {style}
  onclick={() => inputEl?.focus()}
  role="group"
  {...rest}
>
  {#each value as item, i}
    <span class="string-array-tag">
      <span class="string-array-tag-text">{item}</span>
      {#if !disabled}
        <button
          type="button"
          class="string-array-tag-remove"
          aria-label="Remove {item}"
          onclick={() => removeItem(i)}
          tabindex="-1"
        >&times;</button>
      {/if}
    </span>
  {/each}
  <input
    bind:this={inputEl}
    bind:value={inputValue}
    class="string-array-input"
    {placeholder}
    {disabled}
    onkeydown={handleKeydown}
    onpaste={handlePaste}
    onblur={addItem}
  />
  {#if name}
    <input type="hidden" {name} {form} value={value.join(separator)} />
  {/if}
</div>

<style>
  .string-array-label {
    display: block;
    font-weight: 500;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    margin-bottom: var(--size-1, 0.25rem);
    color: var(--text-1, var(--fore, currentColor));
  }

  .string-array {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--size-1, 0.3rem);
    padding: var(--size-1, 0.3rem) var(--size-2, 0.5rem);
    border: var(--border-size-1, 1px) solid var(--gray-400, #999);
    border-radius: var(--radius-2, 4px);
    background-color: var(--surface-1, var(--white, #fff));
    min-height: 2.5rem;
    cursor: text;
    transition: border-color 0.15s;
  }

  .string-array:focus-within {
    border-color: var(--accent, var(--primary, royalblue));
    outline: var(--focus-size, 2px) solid var(--accent, var(--primary, royalblue));
    outline-offset: var(--focus-offset, 1px);
  }

  .string-array.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .string-array-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.15rem;
    padding: var(--size-1, 0.15rem) var(--size-2, 0.4rem);
    background-color: var(--gray-100, var(--white-2, #f0f0f0));
    border: var(--border-size-1, 1px) solid var(--gray-200, #ddd);
    border-radius: var(--radius-2, 4px);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-0, 0.85rem);
    color: var(--text-1, var(--fore, currentColor));
    line-height: 1.4;
    white-space: nowrap;
  }

  .string-array-tag-remove {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gray-500, #888);
    font-size: 1em;
    line-height: 1;
    padding: 0 0.1rem;
    display: inline-flex;
    align-items: center;
  }

  .string-array-tag-remove:hover {
    color: var(--red-7, var(--error, #d32f2f));
  }

  .string-array-input {
    flex: 1;
    min-width: 6rem;
    border: none;
    outline: none;
    background: transparent;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.9rem);
    color: var(--text-1, var(--fore, currentColor));
    padding: var(--size-1, 0.2rem) 0;
  }

  .string-array-input::placeholder {
    color: var(--gray-400, #aaa);
  }
</style>
