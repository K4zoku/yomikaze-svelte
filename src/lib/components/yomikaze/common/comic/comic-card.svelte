<script lang="ts">
    import Picture from "$components/picture.svelte";
    import type Comic from "$models/Comic";

    export let comic: Comic;
</script>

<a href="/comics/{comic.id}" class="flex flex-col gap-2 items-center snap-start p-2">
    <Picture
      src={comic.cover}
      class="h-48 w-32 aspect-cover rounded-md shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
      imgClass="rounded-md shadow w-full h-full object-cover object-center"
    />
    <span class="text-sm font-semibold text-left max-w-full text-ellipsis line-clamp-2">
      {comic.name}
    </span>
  </a>