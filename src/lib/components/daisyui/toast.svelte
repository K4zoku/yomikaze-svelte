<script lang="ts">
    import Icon from "$components/icon.svelte";

    export let color = 'alert-success';

    export let duration = 5000;

    let timeout: NodeJS.Timeout;

    function init(element: HTMLDivElement) {
        timeout = setTimeout(() => {
            element.remove();
        }, duration);
        return {
            destroy() {
                clearTimeout(timeout);
            }
        }
    }

    export let message: string;
    export let icon: string | undefined = undefined;
</script>

<div class="alert {color} flex items-center gap-2" use:init>
<slot name="icon">
    {#if icon}
        <Icon {icon} class="text-lg"/>
    {/if}
</slot>
<slot>{message}</slot>
</div>
