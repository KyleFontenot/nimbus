/**
 * Utility for extracting Svelte component references from rendered markdown HTML.
 *
 * When markdown contains tags that match registered component names
 * (e.g. `<Alert type="warning">content</Alert>` or `<Badge color="primary" />`),
 * this utility replaces them with placeholder `<div>` elements and returns
 * metadata so the caller can mount real Svelte components into those placeholders.
 */

export interface ComponentBlock {
  /** Unique id used as the placeholder's data attribute */
  id: string
  /** Component name (must match a key in the components registry) */
  name: string
  /** Parsed props from the tag attributes */
  props: Record<string, any>
  /** Inner HTML between opening and closing tags (may be empty) */
  children: string
}

export interface ExtractionResult {
  /** The processed HTML with component tags replaced by placeholders */
  html: string
  /** Metadata for each component instance found */
  blocks: ComponentBlock[]
}

/**
 * Scan `html` for tags whose names appear in `componentNames`, replace each
 * with a `<div data-nimbus-component="<id>"></div>` placeholder, and return
 * the processed HTML together with a list of {@link ComponentBlock} entries
 * describing what to mount and where.
 */
export function extractComponents(
  html: string,
  componentNames: string[]
): ExtractionResult {
  if (!componentNames.length || !html) return { html, blocks: [] }

  const blocks: ComponentBlock[] = []
  let processed = html
  let idCounter = 0

  for (const name of componentNames) {
    // Paired tags: <Name ...>children</Name>
    // Using [\s\S]*? for children to match across lines (non-greedy)
    const pairedRe = new RegExp(
      `<${name}(\\s[^>]*)?>([\\s\\S]*?)<\\/${name}\\s*>`,
      'g'
    )

    processed = processed.replace(pairedRe, (_match, attrs, children) => {
      const id = `nimbus-md-${idCounter++}`
      blocks.push({
        id,
        name,
        props: parseAttributes(attrs || ''),
        children: (children || '').trim(),
      })
      return `<div data-nimbus-component="${id}" role="region" aria-label="${name} component" aria-busy="true"></div>`
    })

    // Self-closing tags: <Name ... /> or <Name .../>
    const selfClosingRe = new RegExp(`<${name}(\\s[^>]*)?\\/>`, 'g')

    processed = processed.replace(selfClosingRe, (_match, attrs) => {
      const id = `nimbus-md-${idCounter++}`
      blocks.push({
        id,
        name,
        props: parseAttributes(attrs || ''),
        children: '',
      })
      return `<div data-nimbus-component="${id}" role="region" aria-label="${name} component" aria-busy="true"></div>`
    })
  }

  return { html: processed, blocks }
}

/**
 * Parse an HTML-style attribute string into a key/value object.
 *
 * Supports:
 *   - `key="value"` and `key='value'`  → string
 *   - `key={expression}`               → parsed via JSON or kept as string
 *   - bare `key`                        → boolean `true`
 *
 * Numeric strings are coerced to numbers; `"true"` / `"false"` become booleans.
 */
export function parseAttributes(attrString: string): Record<string, any> {
  const attrs: Record<string, any> = {}
  const trimmed = attrString.trim()
  if (!trimmed) return attrs

  const re =
    /([\w-]+)(?:\s*=\s*(?:"([^"]*?)"|'([^']*?)'|\{([^}]*?)\}))?/g
  let m: RegExpExecArray | null

  while ((m = re.exec(trimmed)) !== null) {
    const key = m[1]
    const raw = m[2] ?? m[3] ?? m[4]

    if (raw === undefined) {
      // bare attribute
      attrs[key] = true
      continue
    }

    // Coerce known primitives
    if (raw === 'true') {
      attrs[key] = true
    } else if (raw === 'false') {
      attrs[key] = false
    } else if (raw === 'null') {
      attrs[key] = null
    } else if (/^-?\d+(\.\d+)?$/.test(raw)) {
      attrs[key] = Number(raw)
    } else {
      // Try JSON parse for objects/arrays (from {…} syntax)
      if (m[4] !== undefined) {
        try {
          attrs[key] = JSON.parse(raw)
        } catch {
          attrs[key] = raw
        }
      } else {
        attrs[key] = raw
      }
    }
  }

  return attrs
}
