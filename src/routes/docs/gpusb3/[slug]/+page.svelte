<script>
    import Basics from "./Basics.svelte"
    import Blocks from "./Blocks.svelte"
    import Quirks from "./Quirks.svelte"
    import Resources from "./Resources.svelte"
    import Errors from "./Errors.svelte"
    import Spacer from "$lib/Spacer.svelte"
    import { goto } from "$app/navigation"
    import { onMount } from "svelte"

    import { pages } from "../pages.js"

    export let data
    
    $: p = data.data

    $: nexti = pages.indexOf(p)
    $: previous = nexti === -1 ? "404" : (nexti-1 >= 0 ? pages[nexti-1] : "-1")
    $: next = nexti === -1 ? "404" : (nexti+1 < pages.length ? pages[nexti+1] : "-1")

</script>

<h1>{p[0].toUpperCase() + p.slice(1)}</h1> 

{#if p === "basics"}
    <Basics />
{:else if p === "blocks"}
    <Blocks />
{:else if p === "quirks"}
    <Quirks />
{:else if p === "resources"}
    <Resources />
{:else if p === "errors"}
    <Errors />
{/if}

<Spacer space="100px" />


{#if previous !== "-1"}
<h2>Previous page: <a href="/docs/gpusb3/{previous}">{previous}</a></h2>
{/if}


{#if next === "-1"}
<h2>You've reached the end of the documentation(for now), good luck!</h2>
{:else}
<h2>Next page: <a href="/docs/gpusb3/{next}">{next}</a></h2>
{/if}