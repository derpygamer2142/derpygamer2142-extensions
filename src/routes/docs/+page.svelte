<script>
    import DocButton from "$lib/DocButton.svelte";
</script>

<h1>Extension documentation</h1>

<p class="notdoc">You might be wondering "damn this extension is probably pretty cool but idk what any of these blocks do". If you are, you're in luck because I planned for this and documented stuff.</p>
<p class="notdoc">Note: some of the block colors are a little off, it's a scratchblocks skill issue</p>

<h3>Here are the currently documented extensions:</h3>



<div id="docs">
    <DocButton imgsrc="GPUSb3Thumbnail" name="GPU.sb3" description="An extension that allows you to run scratch code on the gpu." link="/docs/gpusb3"/>
</div>

<style>
    #docs {
        display: block;
        width: 50vw;
        position: relative;
        left: 25vw;
    }
</style>