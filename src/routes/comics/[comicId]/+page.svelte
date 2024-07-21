<script lang="ts">
    export let data;
    const {comicId, comic} = data;
</script>

<div class="container mt-20">
    {comicId}

    {#await comic}
        <span>loading</span>
    {:then c} 
        <span>{JSON.stringify(c)}</span>
    {/await}
</div>