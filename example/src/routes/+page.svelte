<script>
  import Button from '../../../src/components/Button.svelte'
  import Inpuut from '../../../src/components/Input.svelte'
  import Card from '../../../src/components/Card.svelte'
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a>
  to read the documentation
</p>

<main>
  <Button>Hello</Button>
  <Card>
    <div class="colorbox" style="--color: var(--primary)"></div>
  </Card>
</main>

<style>
  .colorbox {
    width: 5rem;
    height: 5rem;
    border-radius: var(--interface-border-radius, 4px);
  }
</style>
