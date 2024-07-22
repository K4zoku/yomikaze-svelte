<script lang="ts">
    // import type { PageData } from './$types';
    
    // export let data: PageData;

    let selectedFile = null;
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      // You can do further processing with the selected file here
      selectedFile = file;
      console.log('Selected file:', selectedFile);
    };
  </script>
  
  <div class="space-y-4">
    <input type="file" id="fileInput" class="hidden" on:change={handleFileChange} />
    <label for="fileInput" class="btn btn-primary">
      Choose File
    </label>
  
    {#if selectedFile}
      <p>Selected File: {selectedFile.name}</p>
    {/if}
  </div>
  
  <style>
    /* Add any additional styles here */
  </style>
  