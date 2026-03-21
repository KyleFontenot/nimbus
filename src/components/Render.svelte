<script lang="ts" module>
  import type { Component, Snippet } from 'svelte'

  /**
   * A type that accepts either a Svelte 5 Snippet or a Svelte Component.
   * Use with the <Render> component to display either type.
   *
   * @example
   * ```ts
   * import type { Renderable } from 'nimbus/components/Render.svelte'
   * interface Props {
   *   icon?: Renderable
   * }
   * ```
   *
   * ```svelte
   * <!-- As a snippet -->
   * <MyComponent>
   *   {#snippet icon()}<svg>...</svg>{/snippet}
   * </MyComponent>
   *
   * <!-- As a component -->
   * <MyComponent icon={MyIcon} />
   * ```
   */
  export type Renderable<
    Params extends unknown[] = [],
    Props extends Record<string, any> = Record<string, never>
  > = Snippet<Params> | Component<Props>

  /**
   * Detect whether a value is a Svelte Component rather than a Snippet.
   * Components are callable with (internals, props) signature and don't
   * return the branded SnippetReturn type. This uses a duck-typing check:
   * Components have a name property from their function declaration.
   */
  export function isComponent(value: unknown): value is Component {
    if (typeof value !== 'function') return false
    // Snippets created by the Svelte compiler are arrow functions or have
    // names starting with lowercase (e.g., snippet_name). Components are
    // named functions starting with uppercase or have the $$render method.
    // The most reliable heuristic: try to detect the component's internal shape.
    // Components have .length === 2 (internals, props), but so can snippets
    // with 1 user param. We check for non-arrow function with an uppercase name.
    const fn = value as Function
    if (fn.name && /^[A-Z]/.test(fn.name)) return true
    // Fallback: check for component-specific properties
    if ('$$set' in fn || '$$render' in fn) return true
    return false
  }
</script>

<script lang="ts">
  interface Props {
    of: Renderable
    props?: Record<string, any>
  }

  let { of: content, props: componentProps = {} }: Props = $props()

  let asComponent = $derived(isComponent(content))
</script>

{#if content}
  {#if asComponent}
    <svelte:component this={content} {...componentProps} />
  {:else}
    {@render content()}
  {/if}
{/if}
