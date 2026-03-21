<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Social {
    href: string
    label: string
    icon?: Snippet
  }

  interface Props extends HTMLAttributes<HTMLDivElement> {
    name: string
    email?: string | undefined
    phone?: string | undefined
    address?: string | undefined
    hours?: string | undefined
    socials?: Social[]
    children?: Snippet
  }

  let {
    name,
    email = undefined,
    phone = undefined,
    address = undefined,
    hours = undefined,
    socials = [],
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<div
  class="contact-card {rest.class || ''}"
  {style}
  {...rest}
>
  <h3 class="contact-name">{name}</h3>

  <div class="contact-fields">
    {#if email}
      <div class="contact-field">
        <span class="contact-field-label">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Email
        </span>
        <a href="mailto:{email}" class="contact-field-value contact-link">{email}</a>
      </div>
    {/if}

    {#if phone}
      <div class="contact-field">
        <span class="contact-field-label">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          Phone
        </span>
        <a href="tel:{phone.replace(/[^\d+]/g, '')}" class="contact-field-value contact-link">{phone}</a>
      </div>
    {/if}

    {#if address}
      <div class="contact-field">
        <span class="contact-field-label">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          Address
        </span>
        <span class="contact-field-value">{address}</span>
      </div>
    {/if}

    {#if hours}
      <div class="contact-field">
        <span class="contact-field-label">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
          Hours
        </span>
        <span class="contact-field-value">{hours}</span>
      </div>
    {/if}
  </div>

  {#if socials && socials.length > 0}
    <div class="contact-socials">
      {#each socials as social}
        <a href={social.href} class="contact-social-link" target="_blank" rel="noopener noreferrer" aria-label={social.label}>
          {#if social.icon}
            {@render social.icon()}
          {:else}
            <span class="contact-social-text">{social.label}</span>
          {/if}
        </a>
      {/each}
    </div>
  {/if}

  {#if children}
    <div class="contact-extra">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .contact-card {
    display: flex;
    flex-direction: column;
    gap: var(--size-4, 1rem);
    padding: var(--size-5, 1.5rem);
    border-radius: var(--radius-2, 8px);
    background-color: var(--surface-1, var(--white-2, #fff));
    border: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
  }

  .contact-name {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-3, 1.25rem);
    font-weight: 700;
    color: var(--text-1, var(--fore, currentColor));
    line-height: 1.3;
    padding-bottom: var(--size-3, 0.75rem);
    border-bottom: var(--border-size-1, 1px) solid var(--gray-200, #e0e0e0);
  }

  .contact-fields {
    display: flex;
    flex-direction: column;
    gap: var(--size-3, 0.75rem);
  }

  .contact-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .contact-field-label {
    display: flex;
    align-items: center;
    gap: var(--size-1, 0.25rem);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-0, 0.85rem);
    font-weight: 600;
    color: var(--gray-500, #888);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .contact-field-label svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  .contact-field-value {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    color: var(--text-1, var(--fore, currentColor));
    line-height: 1.5;
  }

  .contact-link {
    color: var(--accent, var(--primary, royalblue));
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .contact-link:hover {
    text-decoration: underline;
  }

  .contact-link:focus-visible {
    outline: 2px solid var(--accent, var(--primary, royalblue));
    outline-offset: 2px;
    border-radius: var(--radius-1, 2px);
  }

  .contact-socials {
    display: flex;
    gap: var(--size-3, 0.75rem);
    flex-wrap: wrap;
    padding-top: var(--size-3, 0.75rem);
    border-top: var(--border-size-1, 1px) solid var(--gray-100, #f0f0f0);
  }

  .contact-social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-round, 50%);
    background-color: var(--gray-100, #f5f5f5);
    color: var(--gray-600, #666);
    text-decoration: none;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .contact-social-link:hover {
    background-color: var(--accent, var(--primary, royalblue));
    color: white;
  }

  .contact-social-link:focus-visible {
    outline: 2px solid var(--accent, var(--primary, royalblue));
    outline-offset: 2px;
  }

  .contact-social-link :global(svg) {
    width: 1.125rem;
    height: 1.125rem;
  }

  .contact-social-text {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-00, 0.75rem);
    font-weight: 600;
    text-transform: uppercase;
  }

  .contact-extra {
    padding-top: var(--size-3, 0.75rem);
    border-top: var(--border-size-1, 1px) solid var(--gray-100, #f0f0f0);
  }
</style>
