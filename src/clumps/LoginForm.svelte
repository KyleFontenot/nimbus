<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import Input from '../components/Input.svelte'
  import Button from '../components/Button.svelte'
  import Toggle from '../components/Toggle.svelte'
  import Alert from '../components/Alert.svelte'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    action?: string
    method?: string
    title?: string
    subtitle?: string | undefined
    showRememberMe?: boolean
    showForgotPassword?: boolean
    forgotPasswordHref?: string
    registerHref?: string | undefined
    loading?: boolean
    error?: string | undefined
    children?: Snippet | undefined
  }

  let {
    action = '?/login',
    method = 'POST',
    title = 'Sign in',
    subtitle = undefined,
    showRememberMe = false,
    showForgotPassword = false,
    forgotPasswordHref = '/forgot-password',
    registerHref = undefined,
    loading = false,
    error = undefined,
    children = undefined,
    style = undefined,
    ...rest
  }: Props = $props()
</script>

<div class="login-wrapper {rest.class || ''}" {style} {...rest}>
  <div class="login-header">
    <h1 class="login-title">{title}</h1>
    {#if subtitle}
      <p class="login-subtitle">{subtitle}</p>
    {/if}
  </div>

  {#if error}
    <Alert variant="error" dismissible>
      {error}
    </Alert>
  {/if}

  <form class="login-form" {action} {method}>
    <div class="login-field">
      <Input
        type="text"
        name="email"
        label="Email"
        placeholder="you@example.com"
        required
        disabled={loading}
      />
    </div>

    <div class="login-field">
      <Input
        type="password"
        name="password"
        label="Password"
        placeholder="Your password"
        required
        disabled={loading}
      />
    </div>

    {#if showRememberMe || showForgotPassword}
      <div class="login-options">
        {#if showRememberMe}
          <Toggle
            name="rememberMe"
            label="Remember me"
            disabled={loading}
          />
        {/if}
        {#if showForgotPassword}
          <a class="login-forgot" href={forgotPasswordHref}>
            Forgot password?
          </a>
        {/if}
      </div>
    {/if}

    {#if children}
      <div class="login-extra">
        {@render children()}
      </div>
    {/if}

    <Button
      type="submit"
      color="primary"
      fullWidth
      disabled={loading}
    >
      {#if loading}
        Signing in...
      {:else}
        {title}
      {/if}
    </Button>
  </form>

  {#if registerHref}
    <p class="login-register">
      Don't have an account?
      <a class="login-register-link" href={registerHref}>Create one</a>
    </p>
  {/if}
</div>

<style>
  .login-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--size-4, 1rem);
    width: 100%;
    max-width: 24rem;
    margin-inline: auto;
    padding: var(--size-6, 2rem);
  }

  .login-header {
    display: flex;
    flex-direction: column;
    gap: var(--size-1, 0.25rem);
    text-align: center;
  }

  .login-title {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-5, 1.5rem);
    font-weight: 700;
    color: var(--text-1, var(--fore, currentColor));
    line-height: 1.2;
  }

  .login-subtitle {
    margin: 0;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    color: var(--gray-600, var(--black-3, #666));
    line-height: var(--font-lineheight-3, 1.6);
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: var(--size-3, 0.75rem);
  }

  .login-field {
    display: flex;
    flex-direction: column;
  }

  .login-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--size-2, 0.5rem);
  }

  .login-forgot {
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-0, 0.85rem);
    color: var(--accent, var(--primary, royalblue));
    text-decoration: none;
    margin-left: auto;
  }

  .login-forgot:hover {
    text-decoration: underline;
  }

  .login-extra {
    display: flex;
    flex-direction: column;
    gap: var(--size-3, 0.75rem);
  }

  .login-register {
    margin: 0;
    text-align: center;
    font-family: var(--font-sans, var(--font2, sans-serif));
    font-size: var(--font-size-1, 0.95rem);
    color: var(--gray-600, var(--black-3, #666));
  }

  .login-register-link {
    color: var(--accent, var(--primary, royalblue));
    text-decoration: none;
    font-weight: 500;
  }

  .login-register-link:hover {
    text-decoration: underline;
  }
</style>
