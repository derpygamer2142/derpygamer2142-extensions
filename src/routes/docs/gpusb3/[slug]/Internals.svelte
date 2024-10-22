<script>
    import { onMount } from "svelte"
    import { assets } from "$lib/assets/images/assetList.js"
    import Spacer from "$lib/Spacer.svelte";
    import SoupCat from "$lib/assets/images/soup-cat.gif"

    onMount(() => {
        scratchblocks.renderMatching('pre.blocks', {
            style: "scratch3"
        });

        scratchblocks.renderMatching('pre.smallblocks', {
            style: "scratch3",
            scale: 0.75
        });

        scratchblocks.renderMatching('pre.vsmallblocks', {
            style: "scratch3",
            scale: 0.4
        });
    })

    const color1 = "#4287f5"
    const color2 = "#166af2"
    const color3 = "#032966"
    const oc = "{"
    const cc = "}"
</script>

<h3>Coming Soon™️</h3>

<h3>Enjoy this gif of a cat eating soup as an apology:</h3>

<img src={SoupCat} alt="I apologize deeply for you not being able to see this gif. It is a wonderful gif, and changed my life." width=500 height=500>