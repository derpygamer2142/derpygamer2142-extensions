<script>
    import { onMount } from "svelte"
    import { assets } from "$lib/assets/images/assetList.js"
    import Spacer from "$lib/Spacer.svelte";

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

<p>GPU.sb3 has some quirks that might make development a bit annoying if you don't know about them. Some of these are obvious, others less so. I'm probably forgetting a lot, so this list may be updated over time.</p>

<Spacer space="50px" />
<h3>All resources must have a corresponding bind type block</h3>
<p>Essentially if you don't give it a bind type block it doesn't exist. The binding number doesn't matter if the corresponding resource definition has a usage type of NONE, as it won't get bound.</p>

<Spacer space="50px" />
<h3>If you use any block not in <a href="/docs/gpusb3/blocks">the blocks list</a> compilation will fail</h3>
<p>Most scratch blocks are either not usable, unnecessary, or just impossible in WGSL.</p>

<Spacer space="50px" />
<h3>You need to compile the shaders before you can use them</h3>
<p>The extension needs to convert the scratch blocks into actual code, and this can be slow so you should only do it when you have to.</p>

<Spacer space="50px" />
<h3>The <a href="/docs/gpusb3/blocks#f32Array">f32 array block</a> returns a reference</h3>
<p>You can't do anything to this array. You might be able to in the future, idk.</p>

<Spacer space="50px" />
<h3>The variable created via the <a href="/docs/gpusb3/blocks#forLoop">for loop block</a> is an i32</h3>
<p>If you want to use it for something else you need to convert it, there are some casting functions in the wgsl builtin functions.</p>

<Spacer space="50px" />
<h3>NO RECURSION</h3>
<p>This is a limitation from wgsl, I can't do anything about it! If you're saying "but derpygamer2142, shadertoy does it!", that's because shadertoy uses glsl and inigo quilez used some sort of witchcraft that I can't be bothered researching.</p>

<Spacer space="50px" />
<h3>arrayLength builtin function doesn't work on anything other than bound buffers</h3>
<p>Once again, this is an issue with wgsl and not me. Cry about it.</p>

