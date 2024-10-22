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

<p>Error handling in this extension is a little weird, but pretty simple, since the <a href="https://toji.dev/webgpu-best-practices/error-handling.html">usual methods</a> aren't really applicable to scratch. In place of these, there are a couple of blocks for basic error handling, which I will show you how to do.</p>

<pre class="blocks">
    when error thrown :: hat {color1}
    Error :: reporter {color1}
</pre>

<p>This hat is run whenever an error occurs. When an error is thrown, it also sets the Error block to the error's data, in the format:</p>

<code>
    {JSON.stringify({
        name: "errorName",
        body: "errorBody",
        source: "errorSource",
        full: "fullError"
    })}
</code>

<p>We can make a pretty basic error logger using the debugger addon:</p>

<pre class="blocks">
    when error thrown :: hat {color1}
    log (Error :: reporter {color1}) :: #29beb8
</pre>

<p>Then we can run some very obviously wrong blocks</p>

<pre class="blocks">
    Run shader [awwdfaegsbrht] using bind group [your mother] dimensions x: [-15] y: [0] z: [2134] :: {color1}
</pre>

<p>Which logs the error </p>
<code>
    {JSON.stringify({"name":"ShaderNotFound","body":"Couldn't find specified shader!","source":"RunShaderBlock","full":"Couldn't find shader \"awwdfaegsbrht\"!"})}
</code>

<p>This works fine, but you can probably check what kind of error it is depending on how you use this extension. However, the main error for you to check for is DeviceLost. This means your connection to the gpu was interrupted, so you need to reconnect. We can check for this, and use the Reconnect to gpu block:</p>

<pre class="blocks">
    when error thrown :: hat {color1}
    if {"<"}(value of [name] in (Error :: reporter {color1}) :: reporter #3271D0) = [DeviceLost]{">"} {oc}
        Reconnect to GPU :: {color1}
    {cc} else {oc}
        log (Error :: reporter {color1}) :: #29beb8
    {cc} :: control
</pre>
<small>The "value of [name]" block is from the json extension</small>

<p>That's pretty much it, you can probably figure out how to handle the rest. Here's the (incomplete) list of possible error name:</p>

<small>Some of these are just internal catch-alls when running a webgpu operation, so it's a good idea to check the error messages.</small>
<ul>
    <p>BufferReadError - Thrown when webgpu fails to read the buffer</p>
    <p>BufferNotFound - Thrown when a buffer referenced in a block doesn't exist</p>
    <p>InvalidInput - Thrown by various(currently only 2) sources if an input is invalid</p>
    <p>CopyBufferToBufferError - Thrown when webgpu fails to copy one buffer to another buffer</p>
    <p>ArrayNotFound - Thrown when the array referenced in a block doesn't exist</p>
    <p>BindGroupCreationError - Thrown when webgpu fails to create the bind group</p>
    <p>BindGroupCreationErrorOOM - OOM stands for Out Of Memory, this is bad and your gpu doesn't have enough memory to create the bind group</p>
    <p>InvalidEntryDescriptor - Thrown when the bind group layout entry descriptor given to a bind group entry block is invalid</p>
    <p>BindGroupLayoutCreationError - Thrown when webgpu fails to create the bind group layout</p>
    <p>BindGroupLayoutCreationErrorOOM - OOM stands for Out Of Memory, this is bad and your gpu doesn't have enough memory to create the bind group layout</p>
    <p>BufferCreationError - Thrown when webgpu fails to create the buffer</p>
    <p>BufferCreationErrorOOM - OOM stands for Out Of Memory, this is bad and your gpu doesn't have enough memory to create the buffer</p>
    <p>UnclassifiedRuntimeError - Thrown when webgpu fails to run your shader</p>
    <p>UnclassifiedRuntimeErrorOOM - OOM stands for Out Of Memory, this is bad and I'm not even sure if it's possible for this to happen. Let me know if it does because I'm curious</p>
    <p>BindGroupNotFound - Thrown when the bind group referenced in a block doesn't exist</p>
    <p>ShaderNotFound - Thrown when the shader referenced in a block doesn't exist</p>
    <p>ConputePipelineError - Thrown when compiling and webgpu failed to create the compute pipeline for one of your shaders</p>
    <p>WGSLError - Thrown when compiling if your shader has some sort of error in it. The relevant error will be highlighted in **markdown bolding**</p>
    <p>ShaderCreationError - Thrown when compiling and webgpu failed to create the shader module</p>
    <p>BindGroupLayoutNotFound - Thrown when the bind group layout referenced in a block doesn't exist</p>
    <p>UnexpectedInput - Thrown when you put a block where blocks aren't allowed</p>
    <p>MissingInput - Thrown when you don't put a block where a block is supposed to go, this isn't always an error and sometimes it's just a warning</p>
    <p>InvalidBlock - Thrown when you put an unrecognized block in a shader hat</p>
    <p>MissingOp - Mostly for developers, thrown when trying to get a raw input's value but it's not in the list. Check the textFromOp function</p>
    <p>DeviceLost - Thrown when the connection to webgpu is lost, you'll need to reconnect</p>
    <p>UnclassifiedError - Thrown for any error that wasn't caught by existing internal error handling, please report these!</p>
</ul>