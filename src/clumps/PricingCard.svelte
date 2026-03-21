<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import Button from '../components/Button.svelte'
  import Badge from '../components/Badge.svelte'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    name: string
    price: string
    period?: string
    description?: string | undefined
    features?: string[]
    buttonLabel?: string
    buttonHref?: string | undefined
    highlighted?: boolean
    badge?: string | undefined
    onselect?: (() => void) | undefined
    children?: Snippet
  }

  let {
    name,
    price,
    period = '/mo',
    description = undefined,
    features = [],
    buttonLabel = 'Get started',
    buttonHref = undefined,
    highlighted = false,
    badge = undefined,
    onselect = undefined,
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<div
  class="pricing-card {rest.class || ''}"
  class:highlighted
  {style}
  {...rest}
>
  {#if badge}
    <div class="pricing-badge">
      <Badge variant={highlighted ? 'info' : 'default'} pill>{badge}</Badge>
    </div>
  {/if}

  <div class="pricing-header">
    <h3 class="pricing-name">{name}</h3>
    <div class="pricing-price">
      <span class="pricing-amount">{price}</span>
      {#if period}
        <span class="pricing-period">{period}</span>
      {/if}
    </div>
    {#if description}
      <p class="pricing-description">{description}</p>
    {/if}
  </div>

  {#if features.length > 0}
    <ul class="pricing-features">
      {#each features as feature}
        <li class="pricing-feature">
          <svg class="pricing-check" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M13.485 3.929a.75.75 0 01.036 1.06l-6.5 7a.75.75 0 01-1.097.017l-3-3a.75.75 0 111.06-1.06l2.44 2.44 5.96-6.42a.75.75 0 011.1-.037z" />
          </svg>
          {feature}
        </li>
      {/each}
    </ul>
  {/if}

  {#if children}
    <div class="pricing-extra">
      {@render children()}
    </div>
  {/if}

  <div class="pricing-action">
    {#if buttonHref}
      <Button type="link" href={buttonHref} color={highlighted ? 'primary' : 'white'} fullWidth>
        {buttonLabel}
      </Button>
    {:else}
      <Button
        color={highlighted ? 'primary' : 'white'}
        outlined={!highlighted}
        fullWidth
        onclick={onselect}
      >
        {buttonLabel}
      </Button>
    {/if}
  </div>
</div>

<style>
  .pricing-card {
    display: flex;
    flex-direction: column;
    padding: var(--size-5, 1.5rem);
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
    border-radius: var(--radius-3, 8px);
    background-color: var(--surface-1, var(--white, #fff));
    position: relative;
  }

  .highlighted {
    border-color: var(--accent, var(--primary, royalblue));
    border-width: 2px;
    box-shadow: var(--shadow-3, 0 4px 14px -4px rgba(0, 0, 0, 0.15));
  }

  .pricing-badge {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .pricing-header {
    text-align: center;
    margin-bottom: var(--size-4, 1rem);
  }

  .pricing-name {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-2, 1.1rem);
    font-weight: var(--font-weight-6, 600);
    color: var(--text-1, var(--fore, currentColor));
    margin: 0 0 var(--size-2, 0.5rem);
  }

  .pricing-price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.15em;
  }

  .pricing-amount {
    font-size: var(--font-size-5, 2.5rem);
    font-weight: var(--font-weight-7, 700);
    color: var(--text-1, var(--fore, currentColor));
    line-height: 1;
    font-family: var(--font-sans, var(--font2, sans-serif));
  }

  .pricing-period {
    font-size: var(--font-size-1, 0.95rem);
    color: var(--gray-500, #888);
    font-family: var(--font-sans, var(--font2, sans-serif));
  }

  .pricing-description {
    margin: var(--size-2, 0.5rem) 0 0;
    font-size: var(--font-size-1, 0.9rem);
    color: var(--gray-500, #888);
    font-family: var(--font-sans, var(--font2, sans-serif));
    line-height: var(--font-lineheight-3, 1.55);
  }

  .pricing-features {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--size-4, 1rem);
    display: flex;
    flex-direction: column;
    gap: var(--size-2, 0.5rem);
  }

  .pricing-feature {
    display: flex;
    align-items: center;
    gap: var(--size-2, 0.5rem);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.9rem);
    color: var(--text-1, var(--fore, currentColor));
  }

  .pricing-check {
    width: 1rem;
    height: 1rem;
    color: var(--green-7, var(--secondary, #4caf50));
    flex-shrink: 0;
  }

  .pricing-extra {
    margin-bottom: var(--size-4, 1rem);
  }

  .pricing-action {
    margin-top: auto;
  }
</style>
