<script>
    import Demo from "$lib/Demo.svelte";
</script>

<h1>Extension documentation</h1>

<p class="notdoc">Uhh just some examples of my extensions or whatever being used</p>



<div id="demos">
    <Demo project="doublingdemo.zip" title="Doubling shader(gpu.sb3)"/>
    <Demo project="atomicDemo.zip" title="Atomic shader(gpu.sb3)"/>
    <Demo project="textureDemo.zip" title="Texture shader(gpu.sb3)"/>
</div>

<style>
    #demos {
        display: flex;
        width: 100vw;
        position: relative;
        left: 6.25vw;
    }
</style>