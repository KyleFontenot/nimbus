<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import type { Component } from 'svelte'
  import { createRawSnippet, mount, unmount } from 'svelte'
  import { extractComponents, type ComponentBlock } from '../utils/markdownComponents.js'

  interface Props extends HTMLAttributes<HTMLElement> {
    /** Raw markdown string (requires `parse` to render) */
    value?: string
    /** Pre-rendered HTML to display directly */
    html?: string
    /** Function to convert markdown → HTML. Async is supported. */
    parse?: ((markdown: string) => string | Promise<string>) | undefined
    /**
     * Map of component names to Svelte components.
     * Any matching tags in the markdown (e.g. `<Alert type="warning">…</Alert>`)
     * will be replaced with live Svelte component instances.
     */
    components?: Record<string, Component>
  }

  let {
    value = '',
    html = '',
    parse = undefined,
    components = {},
    style = undefined,
    ...rest
  }: Props = $props()

  let rendered = $state(html)
  let componentBlocks: ComponentBlock[] = $state([])
  let articleEl: HTMLElement | undefined = $state()
  let mountedInstances: ReturnType<typeof mount>[] = []

  const componentNames = $derived(Object.keys(components))

  function processHtml(rawHtml: string): string {
    if (!componentNames.length) {
      componentBlocks = []
      return rawHtml
    }
    const result = extractComponents(rawHtml, componentNames)
    componentBlocks = result.blocks
    return result.html
  }

  $effect(() => {
    if (html) {
      rendered = processHtml(html)
    } else if (parse && value) {
      const result = parse(value)
      if (result instanceof Promise) {
        result.then((h) => { rendered = processHtml(h) })
      } else {
        rendered = processHtml(result)
      }
    } else {
      rendered = ''
      componentBlocks = []
    }
  })

  // Mount Svelte components into placeholder divs after the HTML is rendered
  $effect(() => {
    // Subscribe to these so the effect re-runs when they change
    const _blocks = componentBlocks
    const _el = articleEl

    // Cleanup previous mounts
    for (const instance of mountedInstances) {
      try { unmount(instance) } catch { /* already unmounted */ }
    }
    mountedInstances = []

    if (!_el || !_blocks.length) return

    for (const block of _blocks) {
      const target = _el.querySelector(`[data-nimbus-component="${block.id}"]`)
      if (!target || !components[block.name]) continue

      const props: Record<string, any> = { ...block.props }

      // If the block has children HTML, create a raw snippet for it
      if (block.children) {
        const childHtml = block.children
        props.children = createRawSnippet(() => ({
          render: () => childHtml,
        }))
      }

      const instance = mount(components[block.name], { target, props })
      target.removeAttribute('aria-busy')
      mountedInstances.push(instance)
    }
  })
</script>

<article
  bind:this={articleEl}
  class="md-viewer {rest.class || ''}"
  aria-label="Rendered markdown content"
  {style}
  {...rest}
>
  {#if rendered}
    {@html rendered}
  {:else if value && !parse}
    <pre class="md-viewer-raw">{value}</pre>
  {/if}
</article>

<style>
  .md-viewer {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    line-height: var(--font-lineheight-4, 1.7);
    color: var(--text-1, var(--fore, currentColor));
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  /* Prose styling — mirrors MarkdownEditor preview */
  .md-viewer :global(h1) {
    font-size: var(--font-size-5, 2rem);
    font-weight: 700;
    margin: 0 0 var(--size-3, 1rem);
    padding-bottom: var(--size-1, 0.25rem);
    border-bottom: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    line-height: 1.25;
  }
  .md-viewer :global(h2) {
    font-size: var(--font-size-4, 1.5rem);
    font-weight: 600;
    margin: var(--size-4, 1.5rem) 0 var(--size-2, 0.5rem);
    padding-bottom: var(--size-1, 0.15rem);
    border-bottom: var(--border-size-1, 1px) solid var(--gray-100, #eee);
    line-height: 1.3;
  }
  .md-viewer :global(h3) {
    font-size: var(--font-size-3, 1.25rem);
    font-weight: 600;
    margin: var(--size-3, 1rem) 0 var(--size-2, 0.5rem);
    line-height: 1.35;
  }
  .md-viewer :global(h4),
  .md-viewer :global(h5),
  .md-viewer :global(h6) {
    font-weight: 600;
    margin: var(--size-3, 0.75rem) 0 var(--size-1, 0.25rem);
  }
  .md-viewer :global(p) {
    margin: 0 0 var(--size-3, 1rem);
  }
  .md-viewer :global(ul),
  .md-viewer :global(ol) {
    padding-left: var(--size-5, 1.5rem);
    margin: 0 0 var(--size-3, 1rem);
  }
  .md-viewer :global(li) {
    margin-bottom: var(--size-1, 0.25rem);
  }
  .md-viewer :global(blockquote) {
    margin: 0 0 var(--size-3, 1rem);
    padding: var(--size-2, 0.5rem) var(--size-4, 1rem);
    border-left: 4px solid var(--gray-300, var(--primary-4, #ccc));
    background-color: var(--gray-50, var(--white-2, #fafafa));
    color: var(--gray-700, var(--black-2, #444));
  }
  .md-viewer :global(blockquote p:last-child) {
    margin-bottom: 0;
  }
  .md-viewer :global(code) {
    font-family: var(--font-mono, 'SFMono-Regular', 'Consolas', monospace);
    font-size: 0.875em;
    background-color: var(--gray-100, #f0f0f0);
    padding: 0.15em 0.35em;
    border-radius: var(--radius-1, 3px);
  }
  .md-viewer :global(pre) {
    margin: 0 0 var(--size-3, 1rem);
    padding: var(--size-3, 0.75rem) var(--size-4, 1rem);
    background-color: var(--gray-900, var(--dark, #1e1e1e));
    color: var(--gray-100, #e0e0e0);
    border-radius: var(--radius-2, 6px);
    overflow-x: auto;
    line-height: 1.5;
  }
  .md-viewer :global(pre code) {
    background: none;
    padding: 0;
    font-size: var(--font-size-0, 0.85rem);
    color: inherit;
  }
  .md-viewer :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 var(--size-3, 1rem);
    font-size: var(--font-size-1, 0.9rem);
  }
  .md-viewer :global(th),
  .md-viewer :global(td) {
    padding: var(--size-2, 0.5rem) var(--size-3, 0.75rem);
    border: var(--border-size-1, 1px) solid var(--gray-200, #ddd);
    text-align: left;
  }
  .md-viewer :global(th) {
    background-color: var(--gray-50, #fafafa);
    font-weight: 600;
  }
  .md-viewer :global(hr) {
    border: none;
    border-top: var(--border-size-2, 2px) solid var(--gray-200, #e0e0e0);
    margin: var(--size-4, 1.5rem) 0;
  }
  .md-viewer :global(a) {
    color: var(--accent, var(--primary, royalblue));
    text-decoration: underline;
  }
  .md-viewer :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-2, 4px);
  }
  .md-viewer :global(strong) {
    font-weight: 700;
  }

  .md-viewer-raw {
    margin: 0;
    font-family: var(--font-mono, monospace);
    font-size: var(--font-size-1, 0.9rem);
    white-space: pre-wrap;
    word-wrap: break-word;
    color: var(--gray-600, #666);
  }
</style>
