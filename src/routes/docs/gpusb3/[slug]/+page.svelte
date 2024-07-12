<script>
    import Basics from "./Basics.svelte"

    import { pages } from "../pages.js"

    export let data
    
    const p = data.data

    const next = pages.indexOf(p) === -1 ? "404" : pages.indexOf(p) + 1
</script>

{#if {p} == "basics"}
    <Basics />
{/if}

<p>Next: {next}</p>