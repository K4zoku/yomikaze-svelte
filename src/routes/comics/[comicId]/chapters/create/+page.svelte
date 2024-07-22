<script>
	export let data;
</script>

{#if data.comic}
	<div>{@html data.comic.name}</div>
{:else}
	<p>Comic not found</p>
{/if}
