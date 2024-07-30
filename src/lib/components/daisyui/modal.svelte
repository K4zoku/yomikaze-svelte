<script lang="ts">
  export let dialog: HTMLDialogElement;
  export let modalTitle: string = 'Modal';
  export let backdrop: boolean = true;
  export let closeX: boolean = true;
  export let closeButtonLabel: string = 'Close';
</script>

<dialog bind:this={dialog}>
  <div class="modal-box">
    {#if closeX}
      <slot name="closeX">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
      </slot>
    {/if}
    <slot name="header">
      <h3 class="text-lg font-bold">{modalTitle}</h3>
    </slot>
    <slot></slot>
    <slot name="modal-action">
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">{closeButtonLabel}</button>
        </form>
      </div>
    </slot>
  </div>
  {#if backdrop}
    <slot name="backdrop">
      <form method="dialog" class="modal-backdrop">
        <button>{closeButtonLabel}</button>
      </form>
    </slot>
  {/if}
</dialog>
