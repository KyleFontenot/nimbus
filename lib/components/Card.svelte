<script lang="ts">
	export let style: string | null = null,
		status: "success" | "failure" | null = null;
</script>

<div
	class="card {$$restProps.class || ''}"
	class:success={status === "success"}
	class:failure={status === "failure"}
	{style}
>
	<slot />
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
