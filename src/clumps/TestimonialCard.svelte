<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import Avatar from '../components/Avatar.svelte'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    quote: string
    author: string
    role?: string | undefined
    company?: string | undefined
    avatar?: string | undefined
    rating?: number | undefined
  }

  let {
    quote,
    author,
    role = undefined,
    company = undefined,
    avatar = undefined,
    rating = undefined,
    style = undefined,
    ...rest
  }: Props = $props()

  let stars = $derived(
    rating != null ? Array.from({ length: 5 }, (_, i) => i < Math.round(rating!)) : null
  )
</script>

<blockquote
  class="testimonial-card {rest.class || ''}"
  {style}
  {...rest}
>
  {#if stars}
    <div class="testimonial-rating" aria-label="{rating} out of 5 stars">
      {#each stars as filled}
        <svg
          class="star"
          class:filled
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      {/each}
    </div>
  {/if}

  <div class="testimonial-quote-mark" aria-hidden="true">&ldquo;</div>
  <p class="testimonial-quote">{quote}</p>

  <footer class="testimonial-author">
    {#if avatar}
      <Avatar src={avatar} alt={author} size="small" />
    {/if}
    <div class="testimonial-author-info">
      <cite class="testimonial-name">{author}</cite>
      {#if role || company}
        <span class="testimonial-meta">
          {#if role}{role}{/if}
          {#if role && company}{', '}{/if}
          {#if company}{company}{/if}
        </span>
      {/if}
    </div>
  </footer>
</blockquote>

<style>
  .testimonial-card {
    display: flex;
    flex-direction: column;
    gap: var(--size-3, 0.75rem);
    padding: var(--size-5, 1.5rem);
    border-radius: var(--radius-2, 8px);
    background-color: var(--surface-1, var(--white-2, #fff));
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    margin: 0;
    position: relative;
  }

  .testimonial-quote-mark {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 4rem;
    line-height: 0.6;
    color: var(--accent, var(--primary, royalblue));
    opacity: 0.25;
    user-select: none;
  }

  .testimonial-quote {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    color: var(--text-1, var(--fore, currentColor));
    line-height: 1.7;
    font-style: italic;
  }

  .testimonial-rating {
    display: flex;
    gap: 0.125rem;
  }

  .star {
    width: 1.1rem;
    height: 1.1rem;
    color: var(--gray-300, #ccc);
  }

  .star.filled {
    color: var(--yellow-5, var(--warning, #f59e0b));
  }

  .testimonial-author {
    display: flex;
    align-items: center;
    gap: var(--size-3, 0.75rem);
    margin-top: auto;
    padding-top: var(--size-3, 0.75rem);
    border-top: var(--border-size-1, 1px) solid var(--gray-100, #f0f0f0);
  }

  .testimonial-author-info {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .testimonial-name {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    font-weight: 600;
    font-style: normal;
    color: var(--text-1, var(--fore, currentColor));
  }

  .testimonial-meta {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-0, 0.85rem);
    color: var(--gray-500, #888);
  }
</style>
