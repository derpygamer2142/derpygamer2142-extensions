<script>
    import DocButton from "$lib/DocButton.svelte";
</script>

<h1>Extension documentation</h1>

<p class="notdoc">Placeholder text</p>
<p class="notdoc">Note: some of the block colors are a little off, that's because you can't change inputs' colors</p>

<h3>Here are the currently documented extensions:</h3>



<div id="docs">
    <DocButton imgsrc="SoupCat" name="GPU.sb3" description="An extension that allows you to run scratch code on the gpu." link="/docs/gpusb3"/>
</div>

<style>
    #docs {
        display: block;
        width: 50vw;
        position: relative;
        left: 25vw;
    }
</style>