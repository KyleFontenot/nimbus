<!-- <script module lang="ts">
  import type { SvelteComponent, Component } from 'svelte'
  // import { Carta } from "carta-md";
  // import { customRenderer } from "$components/MarkdownEditor.svelte";
  // import Image from "./Image.svelte";
  import { writable } from 'svelte/store'
  import type { Writable } from 'svelte/store'
  // import DOMPurify from "isomorphic-dompurify";

  export type CustomComponentInput = {
    querySelector: string
    component: Component
    staticProps?: Record<string, unknown>
  }

  export const customRenderer = (customComponents: CustomComponentInput[] = []): Plugin => ({
    listeners: [
      [
        'carta-render',
        function onRender({ detail: { carta } }) {
          const rendererContainer = carta.renderer?.container
          if (!rendererContainer) return
          for (const { querySelector, component, staticProps: propsPassed } of customComponents) {
            const elements = rendererContainer.querySelectorAll(querySelector)
            for (const element of elements) {
              let _props: Record<string, unknown> = {}
              for (const attr of element.attributes) {
                _props[attr.name] = attr.value
              }
              new component({
                target: element.parentElement!,
                anchor: element,
                props: { ..._props, ...propsPassed }
              })
              element.remove()
            }
          }
        }
      ]
    ]
  })

  const WHITELISTED_PROPS = ['float']
  const showingModal = writable(false)
  let modalInputControl: any = writable(null)
  let inputModalSlot: Writable<HTMLElement | null> = writable(null)

  export const carta = new Carta({
    sanitizer: input => DOMPurify.sanitize(input, { ADD_ATTR: WHITELISTED_PROPS }),
    extensions: [
      customRenderer([
        {
          querySelector: 'img',
          component: Image,
          staticProps: {}
        }
      ])
    ]
  })
</script>

<script lang="ts">
  import { CartaEditor } from 'carta-md'
  import type { Plugin } from 'carta-md'
  import 'carta-md/default.css'
  // import '@cartamd/plugin-attachment/default.css';
  import dompurify from 'isomorphic-dompurify'
  // import { writable } from "svelte/store";

  interface Props {
    // import type { Writable } from "svelte/store";
    value?: string
    // import type { Writable } from "svelte/store";
    plugins?: Plugin[] | []
    // import type { Writable } from "svelte/store";
    allowCustomComponentProps?: string[]
    // import type { Writable } from "svelte/store";
    carta?: Carta | undefined
  }

  let {
    value = $bindable(''),
    plugins = [],
    allowCustomComponentProps = [],
    carta = undefined
  }: Props = $props()

  const _carta = new Carta({
    // sanitizer: (input) => sanitize(input, {ADD_ATTR: allowCustomComponentProps}),
    sanitizer: input => dompurify.sanitize(input),
    extensions: [...plugins, customRenderer()]
  })
</script>

<CartaEditor carta={carta || _carta} bind:value />

<style lang="scss">
  :global(.carta-editor) {
    --border-color: var(--black);
    --text-color: var(--black);
  }
  :global(.carta-font-code) {
    font-family: '...', monospace;
  }
  :global(div.carta-filler) {
    flex: 0 !important;
  }
  :global(.carta-toolbar) {
    height: unset !important;
    padding-block: 0.5rem;
  }
  :global(button.carta-icon) {
    width: 2.2rem !important;
    height: 3rem !important;
  }

  :global(div.carta-input) {
    background-color: var(--white) !important;
    padding-left: 1rem;
    margin-block: 0 !important;
    padding-block: 1rem;
    height: 100% !important;
  }
  :global(div.carta-renderer) {
    height: 100% !important;
  }
  :global(div.carta-container) {
    height: clamp(5rem, 75vh, 80rem) !important;
  }
  :global(textarea.carta-font-code) {
    caret-color: var(--black) !important;
  }
  :global(div.carta-wrapper) {
    padding-inline: 0 !important;
  }
  :global(textarea.carta-font-code, div.carta-font-code) {
    line-height: 1.2rem;
    font-size: 0.9rem;
  }
  :global(textarea.carta-font-code) {
    line-height: 1.2rem;
    font-size: 0.9rem;
  }
  :global(div.carta-font-code code) {
    margin: 0;
    padding: 0;
  }
  :global(div.carta-renderer.markdown-body) {
    margin-block: 0;
  }
  .inputmodal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffffaa;
    $backdropblur: 3px;
    backdrop-filter: blur($backdropblur);
    -webkit-backdrop-filter: blur($backdropblur);
    z-index: -1;
    opacity: 0;
    padding-top: 3rem;
    // border-radius: var(--interface-border-radius);
    transition: opacity 0.1s;
    &.show {
      opacity: 1;
      z-index: 10;
    }
  }
  .modaldiv {
    background-color: var(--white);
    /* width: clamp(3rem, 70%, 80rem); */
    z-index: 12;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    box-shadow: 0 5px 6px 0px #22222255;
    border-radius: var(--interface-border-radius);
  }
  .closebutton {
    background-color: transparent;
    width: 3rem;
    height: 3rem;
    right: 0;
    top: 0;
    cursor: pointer;
  }

  :global(div.carta-renderer),
  :global(div.carta-viewer) {
    // & :global(h1) {
    // }
    // & :global(p) {
    // }
    color: var(--black);
    & :global(h1) {
      margin-bottom: 1.5rem;
    }
    & :global(h2) {
      text-indent: 0.5rem;
    }
    & :global(h3) {
      text-indent: 1rem;
    }
    & :global(ul) {
      padding-left: 2rem;
      margin-bottom: 0.75rem;
    }
    & :global(p) {
      margin: 0.5rem auto 1rem;
      max-width: 70rem;
      text-indent: 2rem;
      // TODO
      // line-height: calc(variables.$basefontsize + 0.5rem);
    }
    & :global(li) {
      list-style-type: disc;
      padding-left: 0.2rem;
      margin-bottom: 0.5rem;
    }
    & :global(blockquote) {
      background-color: var(--white-2);
      text-align: center;
      padding: 1rem 4%;
      border-radius: 20px;
      margin-top: 1rem;
      margin-bottom: 1.5rem;
      font-family: var(--font-3);
      & :global(*) {
        font-size: 130%;
        margin: 0;
      }
      & :global(p) {
        // font-size: 130%;
        margin: 0;
        letter-spacing: 0.4px;
      }
    }
  }
</style> -->
