<script>
    import Spacer from "$lib/Spacer.svelte"
    import { assets } from "$lib/assets/images/assetList.js"
</script>

<h1>GPU.sb3</h1>

<img src={assets.GPUSb3Thumbnail} alt="GPU.sb3 thumbnail" width="600px" height="300px">
<Spacer space="5px" />
<small>this is the greatest thumbnail you will ever see and you can't say otherwise</small>

<Spacer space="150px"/>

<h3>Warning: This extension is currently in beta! Everything is subject to change in such a way that might break projects!</h3>

<Spacer space="75px"/>

<p>While gpu.sb3 allows you to run code extremely quickly, it can be a bit complicated. This documentation will explain some of the blocks, how to use them, and occasionally what they do internally.</p>

<Spacer space="125px" />

<p>A good starting point would be the <a href="/docs/gpusb3/basics">basics</a>;</p>
<p>Once you've done that you might want to learn how to do <a href="/docs/gpusb3/errors">error handling</a>;</p>
<p>Then there's the <a href="/docs/gpusb3/advanced">advanced section</a>;</p>
<p>Alternatively, you can look at the <a href="/docs/gpusb3/blocks">block list</a> if you are looking for a specific block;</p>
<p>You can also look at the <a href="/docs/gpusb3/internals">internal documentation</a> if you want to know how this works or how to update it;</p>
<p>If you're experiencing issues, you should probably look a the <a href="/docs/gpusb3/quirks">quirks</a> of this extension.</p>
<p>Finally, there is the <a href="/docs/gpusb3/resources">webgpu resources</a> which can help if you want to learn about webgpu beyond this extension(or write raw shader code)</p>

<style>
    p {
        text-align: left;
        width: 50vw;
        font-size: large;
        position: relative;
        left: 25vw;
    }
</style>