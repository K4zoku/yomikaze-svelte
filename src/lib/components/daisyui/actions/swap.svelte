<script lang="ts">
    export let name: string | undefined = undefined;
    export let form: string | undefined = undefined;
    export let flip: boolean = false;
    export let rotate: boolean = false;
    export let active: boolean = false;
    export let itemsClass: string | undefined = undefined;

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let disabled = false;
</script>

<label class="swap {$$props.class ?? ''}" class:swap-flip={flip} class:swap-rotate={rotate}>
    <input type="checkbox" {form} {name} bind:checked={active} on:change={() => dispatch('change', active)} disabled={disabled}/>
    <div class="swap-on {itemsClass ?? ''}"><slot name="on"></slot></div>
    <div class="swap-off {itemsClass ?? ''}"><slot name="off"></slot></div>
</label>