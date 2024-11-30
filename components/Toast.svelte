<script lang="ts" context="module">
	import { onDestroy } from "svelte";
	import { writable } from "svelte/store";
	import { fade, fly } from "svelte/transition";

	export let message = "";
	export let duration = 3000; // Default duration of 3 seconds
	export let type; // Default toast type (info, success, error, etc.)
	let links: ToastLink[] | undefined = undefined;

	let isVisible = writable(false);
	let divel: HTMLDivElement;
	let timeout: ReturnType<typeof setTimeout> | undefined = undefined;

	interface ShowToastOptions {
		type?: string;
		duration?: number;
		links?: ToastLink[];
	}
	interface ToastLink {
		href: string;
		text: string;
	}

	function showToast(
		newMessage: string,
		options: ShowToastOptions = {
			type: "info",
			duration: 3000,
			links: undefined,
		}
	) {
		console.log(options.type);
		message = newMessage;
		type = options.type || "info";
		duration = options.duration || 3000;
		links = options.links || undefined;

		if (isVisible) {
			divel?.remove();
		}
		isVisible.set(true);
		timeout = setTimeout(() => {
			isVisible.set(false);
		}, duration);
	}

	export { showToast };
</script>

<script>
	onDestroy(() => {
		timeout && clearTimeout(timeout);
		divel?.remove();
	});
</script>

{#if $isVisible}
	<div
		bind:this={divel}
		role="alert"
		class="toast {type} show"
		in:fly={{ y: 20, duration: 500 }}
		out:fly={{ y: -20, duration: 250 }}
		on:mouseenter={() => {
			timeout = undefined;
		}}
		on:mouseleave={() => {
			timeout = setTimeout(() => {
				isVisible.set(false);
			}, 3000);
		}}
	>
		{message}
		{#if links && links.length > 0}
			<div>
				{#each links as link}
					<a class="toastlink" href={link.href}>{link.text}</a>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	@use "../src/styles/variables.scss";
	.toast {
		position: fixed;
		bottom: 1.5rem;
		left: 25%;
		width: clamp(8rem, 50vw, 60rem);
		padding: 1.2rem 2rem;
		border-radius: 0.7rem;
		color: var(--black);
		background-color: gray;
		opacity: 0;
		transform: translateY(40px);
		transition: opacity 0.3s;
		z-index: 200;
		box-shadow: 0 6px 13px -3px #333333bb;
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		align-items: center;
	}

	.toast.show {
		opacity: 1;
		transform: translateY(0);
	}

	.toast.info {
		/* background-color: #007bff; */
		background-color: var(--white-3);
		outline: 2px solid var(--white-4);
	}
	.toast.success {
		/* background-color: #28a745; */
		background-color: variables.$tertiary-4;
		outline: 2px solid variables.$tertiary-2;
		color: variables.$tertiary;
	}
	.toast.error {
		/* background-color: #dc3545; */
		background-color: variables.$secondary-3;
		outline: 2px solid variables.$secondary-2;
		color: variables.$secondary;
	}
	.toastlink {
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		background-color: var(--white-4);
		color: var(--black);
		margin-inline: 0.5rem;
		outline: 2px solid var(--white-3);
	}
</style>
