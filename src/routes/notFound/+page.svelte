<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>
<style>
    .emoji-404 {
        position: relative;
        animation: mymove 2.5s infinite;
    }

    @keyframes mymove {
        33% { top: 0px; }
        66% { top: 20px; }
        100% { top: 0px; }
    }
</style>

<div class="bg-gray-100 h-screen flex flex-col items-center justify-center">
    <center class="mt-18">
            <img class="emoji-404 w-56 h-56" src="/images/logo.svg" alt="logo">
        <div class="tracking-widest mt-4">
            <span class="text-gray-500 text-6xl block"><span>4 0 4</span></span>
            <span class="text-gray-500 text-xl">Sorry, We couldn't find what you are looking for!</span>
        </div>
    </center>
    <center class="mt-6">
        <a href="/" class="text-warning btn-outline btn-warning font-mono border text-xl p-3 rounded-md hover:shadow-md">Go Back </a>
        
    </center>
</div>
