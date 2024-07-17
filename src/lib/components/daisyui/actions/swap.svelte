<script lang="ts">
    export let name: string | undefined = undefined;
    export let form: string | undefined = undefined;
    export let flip: boolean = false;
    export let rotate: boolean = false;
    export let active: boolean = false;
</script>

<label class="swap {$$props.class ? $$props.class : ''}" class:swap-flip={flip} class:swap-rotate={rotate}>
    <input type="checkbox" {form} {name} bind:checked={active}/>
    <div class="swap-on"><slot name="on"></slot></div>
    <div class="swap-off"><slot name="off"></slot></div>
</label>