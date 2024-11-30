<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();
	function sayHello() {
		dispatch('message', {
			text: 'Hello!'
		});
	}

	type buttonTypes = 'button' | 'input' | 'link' | 'submit' | 'upload';
	type colorTypes = 'white' | 'primary' | 'secondary';
	// Props
	export let text = 'Button',
		type: buttonTypes = 'button',
		href: string | null = null,
		outlined = false,
		color: colorTypes = 'primary',
		newWindow = false,
		style: string | null = null,
		leftArrow: boolean | null = null,
		className = '',
		download: string | null = null,
		onClick: undefined | (() => void) | ((e: Event) => void) = undefined,
		minimal = false,
		disabled = false,
		name: string | undefined = undefined,
		formAction: string | undefined = undefined,
		fullWidth = false;
</script>

{#if type === 'link'}
	<a
		{href}
		{download}
		class={`button ${className} {$$restProps.class || ''}`}
		class:outlined
		class:white={color === 'white'}
		class:buttonLeftarrow={leftArrow}
		class:primary={color === 'primary'}
		class:secondary={color === 'secondary'}
		class:fullwidth={fullWidth}
		class:minimal
		class:disabled
		on:click={onClick}
		target={newWindow ? '_blank' : null}
		rel={newWindow ? 'noopener' : null}
		style={`--color: var(--${color});${style}`}
	>
		{text}
	</a>
{:else if type === ('submit' || 'input')}
	<input
		type="submit"
		class="button {$$restProps.class || ''}"
		class:outlined
		class:white={color === 'white'}
		class:buttonLeftarrow={leftArrow}
		class:primary={color === 'primary'}
		class:secondary={color === 'secondary'}
		class:minimal
		class:fullwidth={fullWidth}
		class:disabled
		formaction={formAction}
		value={text}
		style={`--color: var(--${color});${style}`}
	/>
{:else if type === 'upload'}
	<input
		type="file"
		class="button {$$restProps.class || ''}"
		class:outlined
		class:white={color === 'white'}
		class:buttonLeftarrow={leftArrow}
		class:primary={color === 'primary'}
		class:secondary={color === 'secondary'}
		class:minimal
		class:disabled
		value={text}
		style={`--color: var(--${color});${style}`}
		id={name}
		{name}
	/>
{:else}
	<button
		class="button {$$restProps.class || ''}"
		class:outlined
		{type}
		class:white={color === 'white'}
		class:buttonLeftarrow={leftArrow}
		class:primary={color === 'primary'}
		class:secondary={color === 'secondary'}
		class:fullwidth={fullWidth}
		tabindex="0"
		class:minimal
		formaction={formAction}
		value={text}
		on:click={onClick}
		style={`--color: var(--${color});${style}`}
	>
		{text}
	</button>
{/if}

<style lang="scss">
	@use '../styles/variables';

	.button {
		color: white;
		color: var(--white);
		padding: 0.43rem 0.9rem;
		position: relative;
		font-size: 0.75rem;
		font-family: variables.$font2;
		// font-family: $font2;
		// font-weight: 450;
		letter-spacing: 0.2px;
		letter-spacing: 0.4px;
		font-weight: 525;
		display: inline-block;
		height: auto;
		width: auto;
		min-width: auto;
		border: none;
		border-radius: variables.$interface-border-radius;
		// margin: 0.5rem 0.5rem 1rem;
		border-color: var(--color);
		border-width: 0;
		border-style: solid;
		box-shadow: 0 2px 5px -4px var(--color);
		background-color: var(--color);
		cursor: pointer;
		transition: transform 0.2s;

		&:hover,
		&:focus-visible {
			transform: translate3d(0, -3px, 0);
		}

		&:focus-visible {
			outline: 2px solid #777;
		}
		// .fullwidth {
		// 	width: 100%;
		// }
	}

	.outlined {
		border-width: 1px;
		border-style: solid;
		border-color: var(--primary-2);
		border-color: var(--color);
		background-color: transparent;
		background: var(--white);
		background: var(--color);
		color: var(--primary-2);
	}
	.minimal {
		background-color: #eeeeee33;
		background-color: unset;
		background-color: var(--white);
		background: unset;
		background: var(--white);
		color: var(--color);
		// color: var(--black-3);
		border-width: 1px;
		border-style: solid;
		// border-color: var(--black-4);		// color: #888;
	}
	.disabled {
		background-color: #eeeeee33;
		border: 1px solid #aaaaaaaa;
		border: 1px solid var(--white-2);
		border-width: 1px;
		border-style: solid;
		color: #888;
		color: var(--black-3);
		box-shadow: 0 0 0 0 transparent;
	}
</style>
