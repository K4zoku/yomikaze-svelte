<script lang="ts">
    export let name: string | undefined = undefined;
    export let form: string | undefined = undefined;
    export let flip: boolean | string = false;
    export let rotate: boolean | string = false;
    export let state: number = 0;
    let checked: boolean;
    let indeterminate: boolean;
    
    $: checked = !!(state & 1)
    $: indeterminate = !!(state & 2)
</script>

<label class="swap {$$props.class ? $$props.class : ''}" class:swap-flip={flip} class:swap-rotate={rotate}>
    <input type="checkbox" {form} {name} bind:checked={checked} bind:indeterminate={indeterminate} on:change={() => state = (state + 1) % 3}/>
    <div class="swap-off"><slot name="one"></slot></div>
    <div class="swap-on"><slot name="two"></slot></div>
    <div class="swap-indeterminate"><slot name="three"></slot></div>
    <slot></slot>
</label>