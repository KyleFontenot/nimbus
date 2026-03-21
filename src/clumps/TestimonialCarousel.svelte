<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import TestimonialCard from './TestimonialCard.svelte'

  interface Testimonial {
    quote: string
    author: string
    role?: string
    company?: string
    avatar?: string
    rating?: number
  }

  interface Props extends HTMLAttributes<HTMLDivElement> {
    testimonials?: Testimonial[]
    autoPlay?: boolean
    interval?: number
    children?: Snippet
  }

  let {
    testimonials = [],
    autoPlay = false,
    interval = 5000,
    children,
    style = undefined,
    ...rest
  }: Props = $props()

  let scrollContainer: HTMLDivElement | undefined = $state()
  let activeIndex = $state(0)
  let isHovered = $state(false)
  let itemCount = $derived(children ? 0 : testimonials.length)
  let timer: ReturnType<typeof setInterval> | undefined

  function scrollToIndex(index: number) {
    if (!scrollContainer) return
    const cards = scrollContainer.children
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    }
    activeIndex = index
  }

  function handleScroll() {
    if (!scrollContainer) return
    const scrollLeft = scrollContainer.scrollLeft
    const cardWidth = scrollContainer.firstElementChild
      ? (scrollContainer.firstElementChild as HTMLElement).offsetWidth
      : 1
    const gap = 24
    activeIndex = Math.round(scrollLeft / (cardWidth + gap))
  }

  $effect(() => {
    if (autoPlay && itemCount > 1 && !isHovered) {
      timer = setInterval(() => {
        const next = (activeIndex + 1) % itemCount
        scrollToIndex(next)
      }, interval)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  })
</script>

<div
  class="testimonial-carousel {rest.class || ''}"
  {style}
  {...rest}
  onmouseenter={() => (isHovered = true)}
  onmouseleave={() => (isHovered = false)}
>
  <div
    class="testimonial-carousel-track"
    bind:this={scrollContainer}
    onscroll={handleScroll}
    role="region"
    aria-label="Testimonials"
    tabindex="0"
  >
    {#if children}
      {@render children()}
    {:else}
      {#each testimonials as testimonial}
        <div class="testimonial-carousel-slide">
          <TestimonialCard {...testimonial} />
        </div>
      {/each}
    {/if}
  </div>

  {#if itemCount > 1}
    <nav class="testimonial-carousel-dots" aria-label="Testimonial navigation">
      {#each Array(itemCount) as _, i}
        <button
          class="testimonial-carousel-dot"
          class:active={activeIndex === i}
          aria-label="Go to testimonial {i + 1}"
          aria-current={activeIndex === i ? 'true' : undefined}
          onclick={() => scrollToIndex(i)}
        ></button>
      {/each}
    </nav>
  {/if}
</div>

<style>
  .testimonial-carousel {
    display: flex;
    flex-direction: column;
    gap: var(--size-4, 1rem);
    padding: var(--size-4, 1rem) 0;
  }

  .testimonial-carousel-track {
    display: flex;
    gap: var(--size-5, 1.5rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    padding: var(--size-2, 0.5rem) var(--size-5, 1.5rem);
    scrollbar-width: none;
  }

  .testimonial-carousel-track::-webkit-scrollbar {
    display: none;
  }

  .testimonial-carousel-track:focus-visible {
    outline: 2px solid var(--accent, var(--primary, royalblue));
    outline-offset: 2px;
    border-radius: var(--radius-2, 8px);
  }

  .testimonial-carousel-slide {
    flex: 0 0 min(100%, 380px);
    scroll-snap-align: start;
  }

  .testimonial-carousel-slide :global(.testimonial-card) {
    height: 100%;
  }

  .testimonial-carousel-dots {
    display: flex;
    justify-content: center;
    gap: var(--size-2, 0.5rem);
    padding: var(--size-2, 0.5rem) 0;
  }

  .testimonial-carousel-dot {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: var(--radius-round, 50%);
    border: none;
    background-color: var(--gray-300, #ccc);
    cursor: pointer;
    padding: 0;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }

  .testimonial-carousel-dot:hover {
    background-color: var(--gray-500, #888);
  }

  .testimonial-carousel-dot.active {
    background-color: var(--accent, var(--primary, royalblue));
    transform: scale(1.3);
  }

  .testimonial-carousel-dot:focus-visible {
    outline: 2px solid var(--accent, var(--primary, royalblue));
    outline-offset: 2px;
  }
</style>
