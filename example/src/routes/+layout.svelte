<script lang="ts">
  // Load the Nimbus global styles (design tokens, reset, base typography)
  // directly from source so the showcase reflects the current library.
  import '../../../src/style/nimbus.css'

  let { children } = $props()
</script>

{@render children()}
