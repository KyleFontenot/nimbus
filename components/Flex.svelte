<script lang="ts">
	type FlowType = '';
	export let style: string | null = null,
		direction: 'column' | 'row' = 'row',
		wrap: boolean = true,
		childMaxWidth: string | null = null,
		id: string | null = null,
		gap: string | null = null,
		flexGrow: string | null = null,
		padding: string | null = null,
		justify: string | null = 'center',
		align: string | null = null;
</script>

<div
	class="flexbox {$$restProps.class || ''}"
	class:column={direction === 'column'}
	class:row={direction === 'row'}
	class:wrap
	{id}
	style={`${childMaxWidth ? `--flexbox-childmaxwidth:${childMaxWidth};` : ''}${
		gap ? `--flexbox-gap:${gap};` : ''
	}${flexGrow ? `--flexbox-flexgrow:${flexGrow}` : ''}${
		padding ? `--flexbox-padding:${padding};` : ''
	}${justify ? `--flexbox-justify:${justify};` : ''}${
		align ? `--flexbox-align:${align};` : ''
	}${style};`}
>
	<slot />
</div>

<style lang="scss">
	.flexbox {
		display: flex;
		gap: var(--flexbox-gap);
		// gap: 1rem;
		flex-grow: var(--flexbox-flexgrow);
		padding: var(--flexbox-padding);
		justify-content: var(--flexbox-justify);
		align-content: var(--flexbox-align);
		margin-block: 1.5rem;

		& > :global(*) {
			max-width: var(--flexbox-childmaxwidth);
		}
	}
	.column {
		flex-direction: column;
	}
	.row {
		flex-direction: row;
	}
	.wrap {
		flex-wrap: wrap;
	}
	.space-around {
		justify-content: space-around;
	}
	.space-between {
		justify-content: space-between;
	}
	.center {
		justify-content: center;
	}
	.flex-end {
		justify-content: flex-end;
	}
	.flex-start {
		justify-content: flex-start;
	}
</style>
