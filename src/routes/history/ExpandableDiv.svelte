<script>
    export let chapters = [];
  </script>
  
  <details class="collapse bg-base-200">
    <summary class="collapse-title text-xl font-medium">
      {#if chapters.length > 3}
        <span>Click to see {chapters.length} chapters</span>
      {/if}
    </summary>
    <div class="collapse-content">
      {#each chapters as chapter}
        <div class="mb-2">
          <p>Chapter {chapter.number}: {chapter.name}</p>
        </div>
      {/each}
    </div>
  </details>
  