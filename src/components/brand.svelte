<script lang="ts">
  export let autoHideBrandName:boolean = true;
</script>

<a
  href="/"
  aria-current="page"
  aria-label="Homepage"
  class="flex-0 btn-md btn btn-link no-underline hover:no-underline no-animation px-2"
>
  <img class="h-full object-contain" src="/images/logo.svg" alt="Logo" />
  <div class="font-title md:inline-flex text-lg md:text-2xl font-bold" class:hidden={autoHideBrandName}>
    <span class="text-base-content">Yomi</span>
    <span class="text-accent">Kaze</span>
  </div>
</a>
