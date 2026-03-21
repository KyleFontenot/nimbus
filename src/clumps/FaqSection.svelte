<script lang="ts">
  import type { Snippet } from 'svelte'
  import Details from '../components/Details.svelte'

  interface FaqItem {
    question: string
    answer: string
  }

  interface Props {
    items?: FaqItem[]
    title?: string | undefined
    columns?: 1 | 2
    children?: Snippet
    style?: string | undefined
    [key: string]: unknown
  }

  let {
    items = [],
    title = undefined,
    columns = 1,
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<section
  class="faq-section {rest.class || ''}"
  {style}
  {...rest}
>
  {#if title}
    <h2 class="faq-title">{title}</h2>
  {/if}

  <div class="faq-list" class:two-columns={columns === 2}>
    {#if children}
      {@render children()}
    {:else}
      {#each items as item}
        <Details summary={item.question}>
          <p class="faq-answer">{item.answer}</p>
        </Details>
      {/each}
    {/if}
  </div>
</section>

<style>
  .faq-section {
    display: flex;
    flex-direction: column;
    gap: var(--size-5, 1.5rem);
    padding: var(--size-6, 2.5rem) var(--size-5, 1.5rem);
    max-width: var(--content-width, 1200px);
    margin: 0 auto;
  }

  .faq-title {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-5, 2rem);
    font-weight: 700;
    color: var(--text-1, var(--fore, currentColor));
    text-align: center;
    line-height: 1.2;
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: var(--size-2, 0.5rem);
  }

  .faq-list.two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-2, 0.5rem);
  }

  .faq-answer {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    color: var(--gray-600, var(--black-3, #666));
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    .faq-list.two-columns {
      grid-template-columns: 1fr;
    }

    .faq-section {
      padding: var(--size-4, 1rem);
    }
  }
</style>
