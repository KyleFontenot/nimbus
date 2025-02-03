<script lang="ts">
	interface Props {
		style?: string | null;
		status?: "success" | "failure" | null;
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { style = null, status = null, children, ...rest }: Props = $props();
</script>

<div
	class="card {rest.class || ''}"
	class:success={status === "success"}
	class:failure={status === "failure"}
	{style}
>
	{@render children?.()}
</div>

<style lang="scss">
	.card {
		border-radius: 8px;
		box-shadow: 0 2px 7px -2px #88888888;
		padding: 0.7rem;
		background-color: var(--white-2);
		margin-bottom: 0.5rem;
		&.success,
		&.failure {
			padding: 1.25rem;
		}
		&.success {
			color: var(--secondary);
			background-color: var(--secondary-3);
		}
		&.failure {
			color: var(--tertiary-2);
			background-color: var(--tertiary);
		}
	}
</style>
