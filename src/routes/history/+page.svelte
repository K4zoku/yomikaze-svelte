<script>
    import ExpandableDiv from './ExpandableDiv.svelte';
    import http from '$utils/http';
    import { onMount } from 'svelte';
  
    let historyData = [];
  
    async function getHistory() {
      const response = await http.get(`/history`);
      const results = response.data.results;
  
      const groupedData = results.reduce((acc, current) => {
        const { comicId } = current.chapter;
        if (!acc[comicId]) {
          acc[comicId] = {
            comic: current.comic,
            chapters: []
          };
        }
        acc[comicId].chapters.push(current.chapter);
        return acc;
      }, {});
  
      historyData = Object.values(groupedData);
    }
  
    onMount(async () => {
      await getHistory();
    });
  </script>
  
  <div class="container mt-20 ml-20 mx-auto flex flex-col gap-2">
    {#each historyData as data}
      <div class="bg-base-200 flex mb-4 p-4 rounded-lg shadow-md">
        <div class="img-c">
          <img
            class="rounded-md shadow w-full h-full object-cover"
            src={`https://i.yomikaze.org${data.comic.cover}`}
            alt={data.comic.name}
          />
        </div>
        <div class="flex-1 ml-4">
          <div class="grid grid-flow-col justify-stretch">
            <div class="">
              <p class="font-bold text-xl">{data.comic.name}</p>
              <p class="text-sm">{data.comic.authors.join(', ')}</p>
            </div>
            <div class="relative">
              <p class="absolute right-2">{data.comic.status}</p>
            </div>
          </div>
          <ExpandableDiv {chapters}={data.chapters} />
        </div>
      </div>
    {/each}
  </div>
<style>
  .img-c {
    height: 200px;
    width: 140px;
  }
</style>
