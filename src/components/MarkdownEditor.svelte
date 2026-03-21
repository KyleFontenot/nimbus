<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    value?: string
    name?: string | null
    id?: string | undefined
    form?: string | undefined
    placeholder?: string
    parse?: ((markdown: string) => string | Promise<string>) | undefined
    toolbar?: boolean
    preview?: boolean
    splitView?: boolean
    fullscreen?: boolean
    minHeight?: string
    maxHeight?: string
    wordCount?: boolean
    readonly?: boolean
    disabled?: boolean
    tabSize?: number
    onImageUpload?: ((file: File) => Promise<string>) | undefined
    style?: string | undefined
    children?: Snippet
    [key: string]: unknown
  }

  let {
    value = $bindable(''),
    name = null,
    id = undefined,
    form = undefined,
    placeholder = 'Write markdown...',
    parse = undefined,
    toolbar = true,
    preview = $bindable(false),
    splitView = $bindable(false),
    fullscreen = $bindable(false),
    minHeight = '20rem',
    maxHeight = '80vh',
    wordCount = true,
    readonly = false,
    disabled = false,
    tabSize = 2,
    onImageUpload = undefined,
    style = undefined,
    children,
    ...rest
  }: Props = $props()

  let textareaEl: HTMLTextAreaElement | undefined = $state()
  let previewHtml = $state('')
  let fileInputEl: HTMLInputElement | undefined = $state()

  // Word/char count
  let stats = $derived.by(() => {
    const trimmed = value.trim()
    if (!trimmed) return { words: 0, chars: 0 }
    return {
      words: trimmed.split(/\s+/).length,
      chars: value.length
    }
  })

  // Update preview when value changes and preview is active
  $effect(() => {
    if ((preview || splitView) && parse) {
      const result = parse(value)
      if (result instanceof Promise) {
        result.then((html) => { previewHtml = html })
      } else {
        previewHtml = result
      }
    }
  })

  // --- Toolbar actions ---

  function getSelection(): { start: number; end: number; text: string } {
    if (!textareaEl) return { start: 0, end: 0, text: '' }
    return {
      start: textareaEl.selectionStart,
      end: textareaEl.selectionEnd,
      text: value.slice(textareaEl.selectionStart, textareaEl.selectionEnd)
    }
  }

  function replaceSelection(replacement: string, cursorOffset?: number) {
    if (!textareaEl) return
    const { start, end } = getSelection()
    value = value.slice(0, start) + replacement + value.slice(end)
    const pos = cursorOffset != null ? start + cursorOffset : start + replacement.length
    requestAnimationFrame(() => {
      textareaEl?.focus()
      textareaEl?.setSelectionRange(pos, pos)
    })
  }

  function wrapSelection(before: string, after: string) {
    const { start, end, text } = getSelection()
    if (!textareaEl) return
    const wrapped = before + text + after
    value = value.slice(0, start) + wrapped + value.slice(end)
    const newStart = start + before.length
    const newEnd = newStart + text.length
    requestAnimationFrame(() => {
      textareaEl?.focus()
      textareaEl?.setSelectionRange(newStart, newEnd)
    })
  }

  function prependLine(prefix: string) {
    if (!textareaEl) return
    const { start } = getSelection()
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const lineEnd = value.indexOf('\n', start)
    const end = lineEnd === -1 ? value.length : lineEnd
    const line = value.slice(lineStart, end)

    if (line.startsWith(prefix)) {
      value = value.slice(0, lineStart) + line.slice(prefix.length) + value.slice(end)
    } else {
      value = value.slice(0, lineStart) + prefix + line + value.slice(end)
    }
  }

  const actions = {
    bold: () => wrapSelection('**', '**'),
    italic: () => wrapSelection('_', '_'),
    strikethrough: () => wrapSelection('~~', '~~'),
    inlineCode: () => wrapSelection('`', '`'),
    h1: () => prependLine('# '),
    h2: () => prependLine('## '),
    h3: () => prependLine('### '),
    link: () => {
      const { text } = getSelection()
      if (text) {
        wrapSelection('[', '](url)')
      } else {
        replaceSelection('[link text](url)', 1)
      }
    },
    image: () => {
      if (onImageUpload && fileInputEl) {
        fileInputEl.click()
      } else {
        const { text } = getSelection()
        if (text) {
          wrapSelection('![', '](url)')
        } else {
          replaceSelection('![alt](url)', 2)
        }
      }
    },
    codeBlock: () => {
      const { text } = getSelection()
      if (text) {
        wrapSelection('\n```\n', '\n```\n')
      } else {
        replaceSelection('\n```\n\n```\n', 5)
      }
    },
    ul: () => prependLine('- '),
    ol: () => prependLine('1. '),
    quote: () => prependLine('> '),
    hr: () => replaceSelection('\n---\n'),
    table: () => replaceSelection('\n| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |\n'),
  }

  async function handleFileUpload(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file || !onImageUpload) return
    const url = await onImageUpload(file)
    replaceSelection(`![${file.name}](${url})`)
    input.value = ''
  }

  function handleKeydown(e: KeyboardEvent) {
    const mod = e.ctrlKey || e.metaKey

    if (mod && e.key === 'b') { e.preventDefault(); actions.bold() }
    else if (mod && e.key === 'i') { e.preventDefault(); actions.italic() }
    else if (mod && e.key === 'k') { e.preventDefault(); actions.link() }
    else if (mod && e.key === 'e') { e.preventDefault(); actions.inlineCode() }
    else if (mod && e.shiftKey && e.key === 'x') { e.preventDefault(); actions.strikethrough() }
    else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault()
      replaceSelection(' '.repeat(tabSize))
    } else if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault()
      if (!textareaEl) return
      const { start } = getSelection()
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const linePrefix = value.slice(lineStart, lineStart + tabSize)
      if (linePrefix === ' '.repeat(tabSize)) {
        value = value.slice(0, lineStart) + value.slice(lineStart + tabSize)
      }
    } else if (e.key === 'Enter') {
      handleAutoList(e)
    }
  }

  function handleAutoList(e: KeyboardEvent) {
    if (!textareaEl) return
    const { start } = getSelection()
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const line = value.slice(lineStart, start)

    const ulMatch = line.match(/^(\s*)([-*+])\s/)
    const olMatch = line.match(/^(\s*)(\d+)\.\s/)

    if (ulMatch) {
      const [full, indent, marker] = ulMatch
      if (line.trim() === `${marker}`) {
        // Empty list item — remove it
        e.preventDefault()
        value = value.slice(0, lineStart) + value.slice(start)
        requestAnimationFrame(() => textareaEl?.setSelectionRange(lineStart, lineStart))
      } else {
        e.preventDefault()
        replaceSelection(`\n${indent}${marker} `)
      }
    } else if (olMatch) {
      const [full, indent, num] = olMatch
      if (line.trim() === `${num}.`) {
        e.preventDefault()
        value = value.slice(0, lineStart) + value.slice(start)
        requestAnimationFrame(() => textareaEl?.setSelectionRange(lineStart, lineStart))
      } else {
        e.preventDefault()
        replaceSelection(`\n${indent}${Number(num) + 1}. `)
      }
    }
  }

  function handleDrop(e: DragEvent) {
    if (!onImageUpload || !e.dataTransfer?.files.length) return
    const file = e.dataTransfer.files[0]
    if (!file.type.startsWith('image/')) return
    e.preventDefault()
    onImageUpload(file).then((url) => {
      replaceSelection(`![${file.name}](${url})`)
    })
  }

  function handlePaste(e: ClipboardEvent) {
    if (!onImageUpload) return
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (!file) return
        onImageUpload(file).then((url) => {
          replaceSelection(`![${file.name}](${url})`)
        })
        return
      }
    }
  }
</script>

<div
  class="md-editor {rest.class || ''}"
  class:fullscreen
  class:disabled
  style:--md-min-height={minHeight}
  style:--md-max-height={maxHeight}
  {style}
  {...rest}
>
  {#if toolbar}
    <div class="md-toolbar" role="toolbar" aria-label="Formatting">
      <div class="md-toolbar-group">
        <button type="button" class="md-btn" title="Bold (Ctrl+B)" onclick={actions.bold} {disabled}><strong>B</strong></button>
        <button type="button" class="md-btn" title="Italic (Ctrl+I)" onclick={actions.italic} {disabled}><em>I</em></button>
        <button type="button" class="md-btn" title="Strikethrough (Ctrl+Shift+X)" onclick={actions.strikethrough} {disabled}><s>S</s></button>
      </div>

      <span class="md-toolbar-divider"></span>

      <div class="md-toolbar-group">
        <button type="button" class="md-btn" title="Heading 1" onclick={actions.h1} {disabled}>H1</button>
        <button type="button" class="md-btn" title="Heading 2" onclick={actions.h2} {disabled}>H2</button>
        <button type="button" class="md-btn" title="Heading 3" onclick={actions.h3} {disabled}>H3</button>
      </div>

      <span class="md-toolbar-divider"></span>

      <div class="md-toolbar-group">
        <button type="button" class="md-btn" title="Link (Ctrl+K)" onclick={actions.link} {disabled}>
          <svg viewBox="0 0 20 20" fill="currentColor" class="md-icon"><path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"/></svg>
        </button>
        <button type="button" class="md-btn" title="Image" onclick={actions.image} {disabled}>
          <svg viewBox="0 0 20 20" fill="currentColor" class="md-icon"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/></svg>
        </button>
      </div>

      <span class="md-toolbar-divider"></span>

      <div class="md-toolbar-group">
        <button type="button" class="md-btn" title="Inline code (Ctrl+E)" onclick={actions.inlineCode} {disabled}>
          <svg viewBox="0 0 20 20" fill="currentColor" class="md-icon"><path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </button>
        <button type="button" class="md-btn" title="Code block" onclick={actions.codeBlock} {disabled}>
          <svg viewBox="0 0 20 20" fill="currentColor" class="md-icon"><path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm5.5 2.5a.5.5 0 00-.854-.354l-2 2a.5.5 0 000 .708l2 2a.5.5 0 00.854-.354v-4zm3 0a.5.5 0 01.854-.354l2 2a.5.5 0 010 .708l-2 2a.5.5 0 01-.854-.354v-4z" clip-rule="evenodd"/></svg>
        </button>
      </div>

      <span class="md-toolbar-divider"></span>

      <div class="md-toolbar-group">
        <button type="button" class="md-btn" title="Bullet list" onclick={actions.ul} {disabled}>
          <svg viewBox="0 0 20 20" fill="currentColor" class="md-icon"><path fill-rule="evenodd" d="M6 4a1 1 0 011 1h10a1 1 0 110 2H7a1 1 0 01-1-1zm0 5a1 1 0 011 0h10a1 1 0 110 2H7a1 1 0 010-2zm0 5a1 1 0 011 0h10a1 1 0 110 2H7a1 1 0 010-2zM3 5a1 1 0 112 0 1 1 0 01-2 0zm0 5a1 1 0 112 0 1 1 0 01-2 0zm0 5a1 1 0 112 0 1 1 0 01-2 0z" clip-rule="evenodd"/></svg>
        </button>
        <button type="button" class="md-btn" title="Numbered list" onclick={actions.ol} {disabled}>
          <svg viewBox="0 0 20 20" fill="currentColor" class="md-icon"><path fill-rule="evenodd" d="M7 4h10a1 1 0 110 2H7a1 1 0 01-1-1 1 1 0 011-1zm0 5h10a1 1 0 110 2H7a1 1 0 010-2zm0 5h10a1 1 0 110 2H7a1 1 0 010-2zM3.5 4.5a.75.75 0 01.75.75v2a.5.5 0 01-1 0V6h-.5a.5.5 0 010-1h.75z" clip-rule="evenodd"/></svg>
        </button>
        <button type="button" class="md-btn" title="Blockquote" onclick={actions.quote} {disabled}>
          <svg viewBox="0 0 20 20" fill="currentColor" class="md-icon"><path fill-rule="evenodd" d="M6 3.75A2.75 2.75 0 003.25 6.5v2.5A2.75 2.75 0 006 11.75h.25v1.5a.75.75 0 001.28.53l2.03-2.03H6A1.25 1.25 0 014.75 10.5V6.5A1.25 1.25 0 016 5.25h8A1.25 1.25 0 0115.25 6.5v4a1.25 1.25 0 01-1.25 1.25.75.75 0 000 1.5A2.75 2.75 0 0016.75 10.5v-4A2.75 2.75 0 0014 3.75H6z" clip-rule="evenodd"/></svg>
        </button>
      </div>

      <span class="md-toolbar-divider"></span>

      <div class="md-toolbar-group">
        <button type="button" class="md-btn" title="Table" onclick={actions.table} {disabled}>
          <svg viewBox="0 0 20 20" fill="currentColor" class="md-icon"><path fill-rule="evenodd" d="M5 4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5zm0 2h3v3H5V6zm5 0h5v3h-5V6zM5 11h3v3H5v-3zm5 0h5v3h-5v-3z" clip-rule="evenodd"/></svg>
        </button>
        <button type="button" class="md-btn" title="Horizontal rule" onclick={actions.hr} {disabled}>&mdash;</button>
      </div>

      <div class="md-toolbar-right">
        {#if parse}
          <button
            type="button"
            class="md-btn"
            class:md-btn-active={splitView}
            title="Split view"
            onclick={() => { splitView = !splitView; if (splitView) preview = false }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" class="md-icon"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 0v12h5V4H4zm7 0v12h5V4h-5z"/></svg>
          </button>
          <button
            type="button"
            class="md-btn"
            class:md-btn-active={preview && !splitView}
            title="Preview"
            onclick={() => { preview = !preview; if (preview) splitView = false }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" class="md-icon"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
          </button>
        {/if}
        <button
          type="button"
          class="md-btn"
          class:md-btn-active={fullscreen}
          title="Fullscreen"
          onclick={() => (fullscreen = !fullscreen)}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" class="md-icon">
            {#if fullscreen}
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 112 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4zm13 0a1 1 0 10-2 0v1.586l-2.293-2.293a1 1 0 00-1.414 1.414L13.586 15H12a1 1 0 100 2h4a1 1 0 001-1v-4z" clip-rule="evenodd"/>
            {:else}
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H5v3a1 1 0 01-2 0V4zm12-1a1 1 0 011 1v4a1 1 0 11-2 0V5h-3a1 1 0 110-2h4zM4 13a1 1 0 011-1h0a1 1 0 011 1v2h3a1 1 0 110 2H4a1 1 0 01-1-1v-3zm12 0a1 1 0 10-2 0v2h-3a1 1 0 100 2h4a1 1 0 001-1v-3z" clip-rule="evenodd"/>
            {/if}
          </svg>
        </button>
      </div>
    </div>
  {/if}

  <div class="md-body" class:md-split={splitView && !preview}>
    {#if !preview || splitView}
      <div class="md-input-pane" class:md-split-pane={splitView}>
        <textarea
          bind:this={textareaEl}
          bind:value
          class="md-textarea"
          {name}
          {id}
          {form}
          {placeholder}
          {readonly}
          {disabled}
          spellcheck="true"
          onkeydown={handleKeydown}
          ondrop={handleDrop}
          onpaste={handlePaste}
        ></textarea>
      </div>
    {/if}
    {#if (preview || splitView) && parse}
      <div class="md-preview-pane" class:md-split-pane={splitView}>
        <div class="md-preview-content">
          {@html previewHtml}
        </div>
      </div>
    {:else if preview && !parse}
      <div class="md-preview-pane">
        <pre class="md-preview-raw">{value}</pre>
      </div>
    {/if}
  </div>

  {#if wordCount || children}
    <div class="md-footer">
      {#if children}
        {@render children()}
      {/if}
      {#if wordCount}
        <span class="md-stats">
          {stats.words} word{stats.words !== 1 ? 's' : ''} &middot; {stats.chars} char{stats.chars !== 1 ? 's' : ''}
        </span>
      {/if}
    </div>
  {/if}

  {#if onImageUpload}
    <input
      bind:this={fileInputEl}
      type="file"
      accept="image/*"
      class="md-file-input"
      onchange={handleFileUpload}
      tabindex="-1"
    />
  {/if}
</div>

<style>
  .md-editor {
    display: flex;
    flex-direction: column;
    border: var(--border-size-1, 1px) solid var(--gray-300, #ccc);
    border-radius: var(--radius-2, 6px);
    background-color: var(--surface-1, var(--white, #fff));
    color: var(--text-1, var(--fore, currentColor));
    overflow: hidden;
    min-height: var(--md-min-height, 20rem);
  }

  .md-editor.fullscreen {
    position: fixed;
    inset: 0;
    z-index: var(--layer-5, 200);
    border-radius: 0;
    border: none;
    min-height: unset;
    max-height: unset;
  }

  .md-editor.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  /* Toolbar */
  .md-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--size-1, 0.2rem);
    padding: var(--size-1, 0.3rem) var(--size-2, 0.5rem);
    border-bottom: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    background-color: var(--gray-50, var(--white-2, #fafafa));
    min-height: 2.5rem;
  }

  .md-toolbar-group {
    display: flex;
    align-items: center;
    gap: 1px;
  }

  .md-toolbar-divider {
    width: 1px;
    height: 1.25rem;
    background-color: var(--gray-200, #ddd);
    margin-inline: var(--size-1, 0.2rem);
    flex-shrink: 0;
  }

  .md-toolbar-right {
    display: flex;
    align-items: center;
    gap: 1px;
    margin-inline-start: auto;
  }

  .md-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.85rem;
    height: 1.85rem;
    padding: 0 var(--size-1, 0.25rem);
    border: none;
    border-radius: var(--radius-1, 3px);
    background: none;
    color: var(--gray-600, var(--black-3, #555));
    cursor: pointer;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-0, 0.8rem);
    line-height: 1;
    transition: background-color 0.1s, color 0.1s;
  }

  .md-btn:hover:not(:disabled) {
    background-color: var(--gray-100, #eee);
    color: var(--text-1, var(--fore, currentColor));
  }

  .md-btn:focus-visible {
    outline: var(--focus-size, 2px) solid var(--accent, var(--primary, royalblue));
    outline-offset: -1px;
  }

  .md-btn-active {
    background-color: var(--gray-200, #ddd);
    color: var(--accent, var(--primary, royalblue));
  }

  .md-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  /* Body */
  .md-body {
    flex: 1;
    display: flex;
    min-height: 0;
    max-height: var(--md-max-height, 80vh);
  }

  .fullscreen .md-body {
    max-height: unset;
  }

  .md-split {
    flex-direction: row;
  }

  .md-input-pane {
    flex: 1;
    display: flex;
    min-height: 0;
  }

  .md-split-pane {
    flex: 1;
    min-width: 0;
  }

  .md-split .md-preview-pane {
    border-left: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
  }

  .md-textarea {
    flex: 1;
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    padding: var(--size-3, 0.75rem) var(--size-4, 1rem);
    font-family: var(--font-mono, 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', monospace);
    font-size: var(--font-size-1, 0.9rem);
    line-height: var(--font-lineheight-4, 1.7);
    color: var(--text-1, var(--fore, currentColor));
    background: transparent;
    tab-size: 2;
  }

  .md-textarea::placeholder {
    color: var(--gray-400, #aaa);
  }

  /* Preview */
  .md-preview-pane {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .md-preview-content {
    padding: var(--size-3, 0.75rem) var(--size-4, 1rem);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    line-height: var(--font-lineheight-4, 1.7);
    color: var(--text-1, var(--fore, currentColor));
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  /* Prose styling for preview */
  .md-preview-content :global(h1) {
    font-size: var(--font-size-5, 2rem);
    font-weight: 700;
    margin: 0 0 var(--size-3, 1rem);
    padding-bottom: var(--size-1, 0.25rem);
    border-bottom: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    line-height: 1.25;
  }
  .md-preview-content :global(h2) {
    font-size: var(--font-size-4, 1.5rem);
    font-weight: 600;
    margin: var(--size-4, 1.5rem) 0 var(--size-2, 0.5rem);
    padding-bottom: var(--size-1, 0.15rem);
    border-bottom: var(--border-size-1, 1px) solid var(--gray-100, #eee);
    line-height: 1.3;
  }
  .md-preview-content :global(h3) {
    font-size: var(--font-size-3, 1.25rem);
    font-weight: 600;
    margin: var(--size-3, 1rem) 0 var(--size-2, 0.5rem);
    line-height: 1.35;
  }
  .md-preview-content :global(h4),
  .md-preview-content :global(h5),
  .md-preview-content :global(h6) {
    font-weight: 600;
    margin: var(--size-3, 0.75rem) 0 var(--size-1, 0.25rem);
  }
  .md-preview-content :global(p) {
    margin: 0 0 var(--size-3, 1rem);
  }
  .md-preview-content :global(ul),
  .md-preview-content :global(ol) {
    padding-left: var(--size-5, 1.5rem);
    margin: 0 0 var(--size-3, 1rem);
  }
  .md-preview-content :global(li) {
    margin-bottom: var(--size-1, 0.25rem);
  }
  .md-preview-content :global(blockquote) {
    margin: 0 0 var(--size-3, 1rem);
    padding: var(--size-2, 0.5rem) var(--size-4, 1rem);
    border-left: 4px solid var(--gray-300, var(--primary-4, #ccc));
    background-color: var(--gray-50, var(--white-2, #fafafa));
    color: var(--gray-700, var(--black-2, #444));
  }
  .md-preview-content :global(blockquote p:last-child) {
    margin-bottom: 0;
  }
  .md-preview-content :global(code) {
    font-family: var(--font-mono, 'SFMono-Regular', 'Consolas', monospace);
    font-size: 0.875em;
    background-color: var(--gray-100, #f0f0f0);
    padding: 0.15em 0.35em;
    border-radius: var(--radius-1, 3px);
  }
  .md-preview-content :global(pre) {
    margin: 0 0 var(--size-3, 1rem);
    padding: var(--size-3, 0.75rem) var(--size-4, 1rem);
    background-color: var(--gray-900, var(--dark, #1e1e1e));
    color: var(--gray-100, #e0e0e0);
    border-radius: var(--radius-2, 6px);
    overflow-x: auto;
    line-height: 1.5;
  }
  .md-preview-content :global(pre code) {
    background: none;
    padding: 0;
    font-size: var(--font-size-0, 0.85rem);
    color: inherit;
  }
  .md-preview-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 var(--size-3, 1rem);
    font-size: var(--font-size-1, 0.9rem);
  }
  .md-preview-content :global(th),
  .md-preview-content :global(td) {
    padding: var(--size-2, 0.5rem) var(--size-3, 0.75rem);
    border: var(--border-size-1, 1px) solid var(--gray-200, #ddd);
    text-align: left;
  }
  .md-preview-content :global(th) {
    background-color: var(--gray-50, #fafafa);
    font-weight: 600;
  }
  .md-preview-content :global(hr) {
    border: none;
    border-top: var(--border-size-2, 2px) solid var(--gray-200, #e0e0e0);
    margin: var(--size-4, 1.5rem) 0;
  }
  .md-preview-content :global(a) {
    color: var(--accent, var(--primary, royalblue));
    text-decoration: underline;
  }
  .md-preview-content :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-2, 4px);
  }
  .md-preview-content :global(strong) {
    font-weight: 700;
  }

  .md-preview-raw {
    margin: 0;
    padding: var(--size-3, 0.75rem) var(--size-4, 1rem);
    font-family: var(--font-mono, monospace);
    font-size: var(--font-size-1, 0.9rem);
    white-space: pre-wrap;
    word-wrap: break-word;
    color: var(--gray-600, #666);
  }

  /* Footer */
  .md-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--size-1, 0.25rem) var(--size-3, 0.75rem);
    border-top: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    background-color: var(--gray-50, var(--white-2, #fafafa));
    min-height: 1.75rem;
  }

  .md-stats {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-00, 0.7rem);
    color: var(--gray-400, #aaa);
    margin-inline-start: auto;
    font-variant-numeric: tabular-nums;
  }

  .md-file-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }
</style>
