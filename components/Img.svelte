<script lang="ts">
	export let style: string | null = null,
		src: string,
		alt: string;
</script>

<img {src} {alt} />

<style>
	img {
		width: 700px;
		height: 700px;
	}
</style>
