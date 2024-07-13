<script>
    import { onMount } from "svelte";

    export let space = "25px"
    let spacer;

    onMount(() => {
        spacer.style.margin = space
    })
</script>

<div id="spacer" bind:this={spacer}></div>