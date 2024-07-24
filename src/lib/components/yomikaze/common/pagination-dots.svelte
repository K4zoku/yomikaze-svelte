<script lang="ts">
  import Icon from '$components/icon.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let min: number = 1;
  export let max: number;

  let focus: boolean = false;

  function enterSubmit(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const input = e.target as HTMLInputElement;
      let page = +input.value;
      if (page < min) page = min;
      else if (page > max) page = max;
      dispatch('page', page);
      focus = false;
    }
  }

  function init(e: HTMLInputElement) {
    e.focus();
  }
</script>

{#if focus}
  <label class="input input-sm input-bordered text-center">
    <input
      use:init
      type="number"
      class="text-center"
      min={min}
      max={max}
      on:blur={() => (focus = false)}
      on:keypress={enterSubmit}
    />
  </label>
{:else}
  <button class="btn btn-sm btn-ghost no-animation" on:click={() => (focus = true)}>
    <Icon icon="lucide--ellipsis" class="text-lg" />
  </button>
{/if}
