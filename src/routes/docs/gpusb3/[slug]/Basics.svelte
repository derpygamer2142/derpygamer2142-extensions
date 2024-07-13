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
</script>

<!-- <pre class="blocks">
    when flag clicked
    move (10) steps
</pre> -->

<p>Once you've installed the extension from the <a href="/">home page</a>, load it unsandboxed in your mod of choice. If you get an alert that says "WebGPU is not supported." or "Failed to get WebGPU adapter.", reload. If this continues, check your browser's compatibility with webgpu at <a href="https://webgpu.io">webgpu.io</a>. This is a fairly new api, so not all browsers support it.</p>

<Spacer space="65px" />

<img src={assets.AdapterFail} alt="An alert saying failed to get adapter.">

<p>If your browser doesn't support webgpu, you're pretty much out of luck without switching to another browser.</p>

<Spacer space="65px" />

<p>Now that everything is (hopefully) working correctly, we can start making our first shader. The def shader hat is used to create a new shader.</p>

<pre class="blocks">
    Def shader [Shader name] with inputs [inputs] :: hat {color1}
</pre>

<p>The def shader hat has 2 arguments. The first, the shader name, is how you call and read data from the shader(see <a href="404">run function block</a>). This must only use the text input, you can't add blocks. You can name it whatevre you want. Then, there's the <a href="/docs/gpusb3/basics#shaderResources">shader resources</a>, explained below. You can attach code to the hat, which is what makes up your shader. Be careful, as not all blocks are supported. You can see the list of supported blocks <a href="/docs/gpusb3/blocks">here</a>.</p>

<!-- <pre class="blocks">
    Def shader [myShader] with inputs [] :: hat {color1}
    Declare [const v] variable as [someVariable] with value ([15] * [8] :: operator): [i32 v] :: {color1}
</pre>

<p>This shader would be compiled to <code>const someVariable: i32 =  (15 * 12) ;</code> GPU.sb3 uses a special system for compiling shaders(partially explained in the <a href="/docs/gpusb3/interals">internals page</a>), and it only supports some blocks. You can see the list of supported blocks <a href="/docs/gpusb3/blocks">here</a>.</p> -->

<Spacer space="65px" />

<h2 id="shaderResources">Shader resources</h2>

<p>Your shader will be pretty much useless if it can't interact with the project, so you can define usable resources for your shader to access using the def shader resource block:</p>

<pre class="smallblocks">
    Def shader resource [resource name] type (resource type v) usage [resource usage] settings [resource settings] usage type (binding type v) next [] :: reporter {color1}
</pre>

<p id="nextExplanation"><small>You will see <pre class="blocks">next [] :: reporter {color1}</pre> very often. This means that there is a list of that block, and you put either nothing, (rarely) a value, or another one of that block into the next slot. It will look something like this:</small></p>

<pre class="blocks">
    Some block that does things, next (Some block that does things, next [] :: reporter {color1}) :: reporter {color1}
</pre>

<p>That's a lot of inputs, so we'll go over them one at a time:</p>

<Spacer space="50px" />
<h3>Resource name</h3>
<p>The resource name is sometimes how you reference the resource, but it is also used when logging errors in the console. <strong>You cannot put blocks for this input!</strong></p>

<Spacer space="50px" />
<h3>Resource type</h3>
<p>Currently the only supported resource type is buffers. A buffer is similar to a list, except that it can be used to represent all kinds of data formats, but it must be typed(this only matters in your shader code, but more on that <a href="404">later</a>). <strong>You cannot put blocks for this input!</strong></p>

<Spacer space="50px" />
<h3>Resource usage</h3>
<p>This input defines how your buffer will be used. <strong>You must use the Buffer usage block here!</strong></p>

<pre class="blocks">
    Buffer usage (usage v), next [] :: reporter {color1}
</pre>

<p>The buffer usage block has a list of options that will describe a component of how your resource will be used. It's recommended that you mess around to see how you can combine multiple resources and usage combinations to get the most out of your resources:</p>
<ul>
    <p>These will dictate how your resource is used in your project.</p>
    <li>MAP_READ - Your resource can be read from using the read buffer block. The only other valid usage with this type is COPY_DST.</li>
    <li>MAP_WRITE - This pretty much does nothing in this extension right now, but more features may be added in the future. You should not use this, the only other valid usage with this type is COPY_SRC</li>
    <li>COPY_SRC - This can be the resource you are copying from using the copy data block. </li>
    <p><small>Note: this has no restrictions, only MAP_READ restricts the valid combinations! This goes for COPY_DST as well.</small></p>
    <li>COPY_DST - This can be the resource you are copying data to in the copy data block. You need this usage to be able to use an input array in the <a href="404">bind resource block</a>!</li>
    
    <Spacer space="25px" />
    <p id="resourceShaderUsage">These will dictate how your resource is used in your <i>shader</i>. You can see how this is used <a href="404">here</a>.</p>

    <li>UNIFORM - This is an input resource that will not and cannot be modified in your shader. Used with the uniform usage type.</li>
    <li>STORAGE - This resource can be used to store changing data. Used with the storage and read_only_storage usage types.</li>
</ul>

<p>Since this can be a bit confusing, here are some examples:</p>
<pre class="blocks">
    Buffer usage (STORAGE v), next (Buffer usage (COPY_DST v), next (Buffer usage (COPY_SRC v), next [] :: reporter {color1}) :: reporter {color1}) :: reporter {color1}
</pre>
<p>This usage combination allows you to give the buffer an input array and use it in you shader. However, you can't read from this buffer, so we also give it the COPY_SRC usage so we can copy it to another buffer:</p>
<pre class="blocks">
    Buffer usage (COPY_DST v), next (Buffer usage (MAP_READ v), next [] :: reporter {color1}) :: reporter {color1}
</pre>
<p>This combination would allow you to copy the buffer from the other usage combination to this one, and then read the buffer in your project.</p>

<Spacer space="50px" />
<h3>Resource settings</h3>
<p>This accepts json describing resource type-specific settings. Since the only currently implemented input type is buffers, you can only define the size. This is in bytes(there's 4 bytes in one item of the f32 array, so just multiply the number of items in the list you want by 4. This might not work in the future with more array types and such). <strong>You cannot put blocks for this input!</strong></p>

<Spacer space="50px" />
<h3>Usage type</h3>
<p>This describes how your resource is used in your shader, this goes together with <a href="/docs/gpusb3/basics#resourceShaderUsage">these buffer usages</a>. Use NONE if you just want your buffer to be used in your project, and not bound in your shader (not a storage buffer)</p>

<Spacer space="50px" />
<h3>Next</h3>
<p>See <a href="/docs/gpusb3/basics#nextExplanation">next explanation</a></p>

<Spacer space="100px" />
<h2>The full hat</h2>
<p>Now that we've got all the blocks used in the hat, we can put them together into what a basic input/output shader might look like:</p>
<pre class="vsmallblocks">
    Def shader [myShader] with inputs (Def shader resource [inputBuffer] type (buffer v) usage (Buffer usage (STORAGE v), next (Buffer usage (COPY_DST v), next (Buffer usage (COPY_SRC v), next [] :: reporter {color1}) :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (storage v) next (Def shader resource [outputBuffer] type (buffer v) usage (Buffer usage (COPY_DST v), next (Buffer usage (MAP_READ v), next [] :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (NONE v) next () :: reporter {color1}) :: reporter {color1}) :: hat {color1}
</pre>
<p>That's pretty large, and might not fit on your screen. You can download the image <a href={assets.FullBasicsHat} download="Full hat" target="_blank">here</a>, or just zoom as the image is an svg.</p>