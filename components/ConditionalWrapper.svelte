<script>
	export let wrap = false;
	export let wrapperTag = "div";
</script>

{#if wrap}
	<svelte:element this={wrapperTag} {...$$restProps}>
		<slot />
	</svelte:element>
{:else}
	<slot />
{/if}
