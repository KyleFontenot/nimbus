<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    label: string
    for?: string | undefined
    helpText?: string | undefined
    error?: string | undefined
    required?: boolean
    children?: Snippet
  }

  let {
    label,
    for: forAttr = undefined,
    helpText = undefined,
    error = undefined,
    required = false,
    children,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<div
  class="form-field {rest.class || ''}"
  class:has-error={!!error}
  {style}
  {...rest}
>
  <label class="form-field-label" for={forAttr}>
    {label}
    {#if required}
      <span class="required-indicator" aria-hidden="true">*</span>
    {/if}
  </label>

  <div class="form-field-control">
    {@render children?.()}
  </div>

  {#if error}
    <p class="form-field-error" role="alert">{error}</p>
  {:else if helpText}
    <p class="form-field-help">{helpText}</p>
  {/if}
</div>

<style>
  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--size-1, 0.25rem);
    margin-bottom: var(--size-3, 1rem);
  }

  .form-field-label {
    display: inline-flex;
    align-items: baseline;
    gap: var(--size-1, 0.25rem);
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    font-weight: 500;
    color: var(--gray-800, var(--black-2, #333));
    line-height: 1.4;
  }

  .required-indicator {
    color: var(--red-7, var(--error, #d32f2f));
    font-weight: 700;
    line-height: 1;
  }

  .form-field-control {
    display: flex;
    flex-direction: column;
  }

  .form-field-help {
    margin: 0;
    font-size: var(--font-size-0, 0.8rem);
    color: var(--gray-500, #888);
    line-height: 1.4;
    font-family: var(--font-sans, var(--font2, sans-serif));
  }

  .form-field-error {
    margin: 0;
    font-size: var(--font-size-0, 0.8rem);
    color: var(--red-7, var(--error, #d32f2f));
    line-height: 1.4;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-weight: 500;
  }

  .has-error .form-field-label {
    color: var(--red-7, var(--error, #d32f2f));
  }

  .has-error .form-field-control :global(input),
  .has-error .form-field-control :global(select),
  .has-error .form-field-control :global(textarea) {
    outline-color: var(--red-7, var(--error, #d32f2f));
    border-color: var(--red-7, var(--error, #d32f2f));
  }
</style>
