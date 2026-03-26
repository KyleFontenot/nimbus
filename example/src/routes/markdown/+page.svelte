<script lang="ts">
  import { marked } from 'marked'
  import MarkdownViewer from '../../../../src/components/MarkdownViewer.svelte'
  import MarkdownEditor from '../../../../src/components/MarkdownEditor.svelte'
  import Alert from '../../../../src/components/Alert.svelte'
  import Badge from '../../../../src/components/Badge.svelte'
  import Button from '../../../../src/components/Button.svelte'
  import Card from '../../../../src/components/Card.svelte'
  import Kbd from '../../../../src/components/Kbd.svelte'
  import Divider from '../../../../src/components/Divider.svelte'
  import Progress from '../../../../src/components/Progress.svelte'

  const parse = (md: string) => marked.parse(md, { async: false }) as string

  const componentMap = {
    Alert,
    Badge,
    Button,
    Card,
    Kbd,
    Divider,
    Progress,
  }

  const readerMarkdown = `# Markdown with Svelte Components

This page demonstrates **embedding Svelte components** directly inside markdown content.
Regular markdown features like *italics*, **bold**, \`inline code\`, and [links](#) all work as expected.

## Alerts

You can drop Nimbus components right into the markdown:

<Alert type="warning">This is a live Svelte Alert component rendered inside markdown!</Alert>

<Alert type="error">Something went wrong. This is an error alert.</Alert>

<Alert type="success">Operation completed successfully.</Alert>

## Inline Components

Components work inline too. Here's a <Badge color="primary">Badge</Badge> and a <Badge color="secondary">New</Badge> badge sitting right in the text.

Press <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd> to save your work.

## Cards

<Card>
  <h3>Card Inside Markdown</h3>
  <p>This entire card is a Svelte component. The content is passed as children HTML.</p>
</Card>

## Progress Bars

Loading progress: <Progress value="65" max="100" />

Almost done: <Progress value="90" max="100" />

## Dividers

Content above the divider.

<Divider />

Content below the divider.

## Buttons

<Button color="primary">Primary Action</Button>

<Button color="secondary" outlined>Secondary Action</Button>

## Mixed Content

Here's a real-world example mixing markdown and components:

> **Pro tip:** Use the \`components\` prop on \`MarkdownViewer\` to register
> which Svelte components should be available in your markdown.

<Alert type="info">
  The component registry maps tag names to actual Svelte component classes.
  Only registered components are rendered — unknown tags are left as plain HTML.
</Alert>

### Code Example

\`\`\`svelte
<MarkdownViewer
  value={markdown}
  {parse}
  components={{ Alert, Badge, Button }}
/>
\`\`\`

---

*That's it! Svelte components and markdown, working together.*
`

  let editorValue = $state(`# Write Markdown with Components

Try typing some **markdown** here, then switch to preview mode.

## Embedded Components

<Alert type="warning">This alert is a live Svelte component!</Alert>

You can use <Badge>badges</Badge> inline with text.

<Button color="primary">Click Me</Button>

Press <Kbd>Ctrl</Kbd> + <Kbd>B</Kbd> for bold.

## Regular Markdown

- Lists work normally
- **Bold** and *italic*
- \`inline code\`

> Blockquotes too!
`)
</script>

<svelte:head>
  <title>Markdown + Svelte Components Demo</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 2rem;
      background: var(--surface-1, #fff);
      color: var(--text-1, #1a1a1a);
    }
  </style>
</svelte:head>

<div class="demo-page">
  <header class="demo-header">
    <h1>Markdown + Svelte Components</h1>
    <p>Embed live Svelte components directly inside your markdown content.</p>
    <a href="/">&larr; Back to main demo</a>
  </header>

  <section class="demo-section">
    <h2>MarkdownViewer with Components</h2>
    <p class="demo-desc">
      The <code>MarkdownViewer</code> below renders markdown that includes Svelte component tags.
      Components like <code>&lt;Alert&gt;</code>, <code>&lt;Badge&gt;</code>, and <code>&lt;Button&gt;</code>
      are mounted as live interactive instances.
    </p>
    <div class="demo-box">
      <MarkdownViewer
        value={readerMarkdown}
        {parse}
        components={componentMap}
      />
    </div>
  </section>

  <section class="demo-section">
    <h2>MarkdownEditor with Component Preview</h2>
    <p class="demo-desc">
      The editor's preview pane also renders embedded components.
      Try editing the markdown and toggling the preview or split view.
    </p>
    <div class="demo-box">
      <MarkdownEditor
        bind:value={editorValue}
        {parse}
        components={componentMap}
        minHeight="30rem"
      />
    </div>
  </section>

  <section class="demo-section">
    <h2>How It Works</h2>
    <div class="demo-box explanation">
      <h3>1. Register components</h3>
      <pre><code>{`const componentMap = {
  Alert,
  Badge,
  Button,
  Card,
}`}</code></pre>

      <h3>2. Use in MarkdownViewer</h3>
      <pre><code>{`<MarkdownViewer
  value={markdownString}
  parse={marked.parse}
  components={componentMap}
/>`}</code></pre>

      <h3>3. Write component tags in markdown</h3>
      <pre><code>{`# My Document

Regular **markdown** here.

<Alert type="warning">This becomes a real Svelte component!</Alert>

More markdown with a <Badge>badge</Badge> inline.
`}</code></pre>

      <h3>4. How it renders</h3>
      <ol>
        <li>The <code>parse</code> function converts markdown to HTML (component tags pass through as raw HTML)</li>
        <li>The <code>extractComponents</code> utility finds tags matching registered component names</li>
        <li>Those tags are replaced with placeholder <code>&lt;div&gt;</code> elements</li>
        <li>After <code>{`{@html}`}</code> renders, Svelte 5's <code>mount()</code> dynamically inserts real component instances into the placeholders</li>
        <li>Children content is passed via <code>createRawSnippet</code></li>
      </ol>
    </div>
  </section>
</div>

<style lang="scss">
  .demo-page {
    max-width: 56rem;
    margin: 0 auto;
  }

  .demo-header {
    margin-bottom: 3rem;

    h1 {
      font-size: 2.25rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }

    p {
      color: #666;
      font-size: 1.1rem;
      margin: 0 0 1rem;
    }

    a {
      color: royalblue;
      text-decoration: none;
      font-size: 0.9rem;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .demo-section {
    margin-bottom: 3rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
    }

    .demo-desc {
      color: #666;
      margin: 0 0 1rem;

      code {
        background: #f0f0f0;
        padding: 0.15em 0.35em;
        border-radius: 3px;
        font-size: 0.9em;
      }
    }
  }

  .demo-box {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 2rem;
    background: #fff;
  }

  .explanation {
    h3 {
      font-size: 1.1rem;
      margin: 1.5rem 0 0.5rem;

      &:first-child {
        margin-top: 0;
      }
    }

    pre {
      background: #1e1e1e;
      color: #e0e0e0;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 0.85rem;
      line-height: 1.5;
    }

    ol {
      padding-left: 1.5rem;
      line-height: 1.8;

      code {
        background: #f0f0f0;
        padding: 0.15em 0.35em;
        border-radius: 3px;
        font-size: 0.9em;
      }
    }
  }
</style>
