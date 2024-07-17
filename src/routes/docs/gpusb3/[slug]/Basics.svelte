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
    Def shader [Shader name] with resources [inputs] :: hat {color1}
</pre>

<p>The def shader hat has 2 arguments. The first, the shader name, is how you call and read data from the shader(see <a href="404">run function block</a>). This must only use the text input, you can't add blocks. You can name it whatever you want. Then, there's the <a href="/docs/gpusb3/basics#shaderResources">shader resources</a>, explained below. You can attach code to the hat, which is what makes up your shader. Be careful, as not all blocks are supported. You can see the list of supported blocks <a href="/docs/gpusb3/blocks">here</a>. Let's make a basic shader that takes in a list and returns the list with every item doubled. We can use the Compute shader C block to define what our shader will do when it is run:</p>

<pre class="blocks">
    Compute shader with workgroup size [[1\]] {oc}
        ... code goes here :: {color2}
    {cc} :: {color1}
</pre>

<p><small>Don't worry about workgroup size quite yet. It's explained <a href="404">here</a></small></p>

<p>Let's define an array in our compute shader, named "data". First we need to make the type so we can construct it. We will have an array of 3 floats, which in blocks looks like this:</p>

<pre class="blocks">
    Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [3] :: reporter {color1}
</pre>

<p>We can use the Construct type block to create our array:</p>

<pre class="smallblocks">
    Construct type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [3] :: reporter {color1}) with values (Function arg input [1.0], next (Function arg input [2.0], next (Function arg input [3.0], next () :: reporter {color1}) :: reporter {color1}) :: reporter {color1}) :: reporter {color1}
</pre>

<p>Or, if you want to be fancy and decrease block count, you can replace your function arg inputs with your inputs like this:</p>

<pre class="blocks">
    Construct type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [3] :: reporter {color1}) with values [1.0, 2.0, 3.0] :: reporter {color1}
</pre>

<p>This is purely a visual change. Now we can declare our variable:</p>

<pre class="smallblocks">
    Compute shader with workgroup size [[1\]] {oc}
        Declare (var v) variable as [data] with value (Construct type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [3] :: reporter {color1}) with values [1.0, 2.0, 3.0] :: reporter {color1}): (auto v) :: {color1}
    {cc} :: {color1}
</pre>
<p>This will make a variable called "data" that we can use. The "var" option says that we can change our variable as much as we want. The "auto" option at the end means that we don't need to specify the variable type here, which saves some time for us. To get a value in this array we can use the In array get block:</p>

<pre class="blocks">
    In array [data] get [index] :: reporter {color1}
</pre>

<p>We can perform operations on this value using the variable operations block:</p>

<pre class="blocks">
    Variable (In array [data] get [0] :: reporter {color1}) (= v) [15] :: {color1}
</pre>

<p>We don't want to have to have a bunch of these blocks, so we can use the for loop:</p>

<pre class="blocks">
    For [variable name] in [start], [end] {oc}

    {cc} :: {color1}
</pre>
<p><small>This isn't the best way to do this! Ideally you would dispatch a workgroup for each item, but this is just a demo so you don't need to worry about that.</small></p>

<p>This will create a new variable with the name specified in variable name, with an initial value of start. It will run the code in the c, then increment variable name. If the variable is more than end, it stops. We can use this to go through our array, since we can read the value of the variable we are incrementing using the get variable block:</p>

<pre class="blocks">
    Def shader [doublingShader] with resources [] :: hat {color1}
    Compute shader with workgroup size [[1\]] {oc}
        Declare (var v) variable as [data] with value (Construct type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [3] :: reporter {color1}) with values [1.0, 2.0, 3.0] :: reporter {color1}): (auto v) :: {color1}
        For [i] in [0], [2] {oc}
            Variable (In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) (= v) ((In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) * [2.0] :: math) :: {color1}
        {cc} :: {color1}
    {cc} :: {color1}
    
</pre>

<small>WGSL is 0 indexed!</small>

<p>Great! Our shader is done, and we can double the numbers in the array. Now we just need to run it. However, first we need to compile our shaders so they can be run. You can do this with the compile shaders block:</p>

<pre class="blocks">
    Def shader [doublingShader] with resources [] :: hat {color1}
    Compute shader with workgroup size [[1\]] {oc}
        Declare (var v) variable as [data] with value (Construct type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [3] :: reporter {color1}) with values [1.0, 2.0, 3.0] :: reporter {color1}): (auto v) :: {color1}
        For [i] in [0], [2] {oc}
            Variable (In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) (= v) ((In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) * [2.0] :: math) :: {color1}
        {cc} :: {color1}
    {cc} :: {color1}

    when green flag clicked
    compile shaders :: {color1}
</pre>

<p><small>Ideally you should only compile your shaders when you make changes, or when your project is run for the first time as it can be pretty slow depending on the number and length of your shaders. We are doing it when the flag is clicked here for simplicity.</small></p>

<p>Now when you press the flag your shader will be compiled! Check the console using f12(or whatever button it is on your browser) and look for any errors or warnings. If you see something along the lines of "invalid input", it means you put a block where a block isn't allowed to go. If you see something like "invalid opcode", it means you used an unsupported block in your shader. If you see any other errors, dm derpygamer2142 on discord. Now we can finally run our shader! This is done using the run shader block:</p>

<pre class="blocks">
    Run shader [shader name] with resources ( :: {color3}) dimensions x: [x dim] y: [y dim] z: [z dim] :: {color1}
</pre>

<p>Our shader name is whatever our shader is called, and the args is explained later. The dimensions are the number of workgroups on each axis, which is explained <a href="404">here</a>. For now, let's just dispatch 1 workgroup per axis.</p>

<pre class="smallblocks">
    Def shader [doublingShader] with resources [] :: hat {color1}
    Compute shader with workgroup size [[1\]] {oc}
        Declare (var v) variable as [data] with value (Construct type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [3] :: reporter {color1}) with values [1.0, 2.0, 3.0] :: reporter {color1}): (auto v) :: {color1}
        For [i] in [0], [2] {oc}
            Variable (In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) (= v) ((In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) * [2.0] :: math) :: {color1}
        {cc} :: {color1}
    {cc} :: {color1}

    when green flag clicked
    compile shaders :: {color1}
    Run shader [doublingShader] with resources ( :: {color3}) dimensions x: [1] y: [1] z: [1] :: {color1}
</pre>

<p>Now you can click the green flag and hopefully have any errors! If you see something mentioning an error parsing wgsl, then something in your shader is wrong. Otherwise you should be good! Now, you may be thinking <i>"this is a great shader, finally I can easily and quickly double my hardcoded list of 3 numbers, but it would be great if I could give the shader an array to double instead of it being hardcoded!"</i>. Well you're in luck, because you can do this in the form of</p>

<!-- <pre class="blocks">
    Def shader [myShader] with resources [] :: hat {color1}
    Declare [const v] variable as [someVariable] with value ([15] * [8] :: operator): [i32 v] :: {color1}
</pre>

<p>This shader would be compiled to <code>const someVariable: i32 =  (15 * 12) ;</code> GPU.sb3 uses a special system for compiling shaders(partially explained in the <a href="/docs/gpusb3/interals">internals page</a>), and it only supports some blocks. You can see the list of supported blocks <a href="/docs/gpusb3/blocks">here</a>.</p> -->

<Spacer space="65px" />

<h2 id="shaderResources">Shader resources</h2>

<p>Your shader will be pretty much useless if it can't interact with the project, so you can define usable resources for your shader to access using the def shader resource block:</p>

<pre class="smallblocks">
    Def shader resource [resource name] type (resource type v) usage [resource usage] settings [resource settings] usage type (binding type v) next [] :: reporter {color1}
</pre>

<p id="nextExplanation"><small>You will see <code>some block, next ()</code> very often. This means that there is a list of that block, and you put either nothing, (rarely) a value, or another one of that block into the next slot. It will look something like this:</small></p>

<pre class="vsmallblocks">
    Some block that does things, next (Some block that does things, next [] :: reporter {color1}) :: reporter {color1}
</pre>

<Spacer space="50px" />

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

    <li id="uniformBufferUsage">UNIFORM - This is an input resource that will not and cannot be modified in your shader. Used with the uniform usage type.</li>
    <li id="storageBufferUsage">STORAGE - This resource can be used to store changing data. Used with the storage and read_only_storage usage types.</li>
</ul>

<p>Since this can be a bit confusing, here are some examples:</p>
<pre class="blocks">
    Buffer usage (STORAGE v), next (Buffer usage (COPY_DST v), next (Buffer usage (COPY_SRC v), next [] :: reporter {color1}) :: reporter {color1}) :: reporter {color1}
</pre>
<p>This usage combination allows you to give the buffer an input array(via COPY_DST) and use it in you shader(STORAGE). However, you can't read from this buffer, so we also give it the COPY_SRC usage so we can copy it to another buffer:</p>
<pre class="blocks">
    Buffer usage (COPY_DST v), next (Buffer usage (MAP_READ v), next [] :: reporter {color1}) :: reporter {color1}
</pre>
<p>This combination would allow you to copy the buffer from the other usage combination to this one(COPY_DST), and then read the buffer in your project(MAP_READ).</p>

<Spacer space="50px" />
<h3>Resource settings</h3>
<p>This accepts json describing resource type-specific settings. Since the only currently implemented input type is buffers, you can only define the size. This is in bytes(there's 4 bytes in one item of the f32 array, so just multiply the number of items in the list you want by 4. This might not work in the future with more array types and such). In our case the length of a 3 item array is 12 bytes. <strong>You cannot put blocks for this input!</strong></p>

<Spacer space="50px" />
<h3>Usage type</h3>
<p>This describes how your resource is used in your shader, this goes together with <a href="/docs/gpusb3/basics#resourceShaderUsage">these buffer usages</a>. Use NONE if you just want your buffer to be used in your project, and not bound in your shader (not a storage buffer)</p>

<Spacer space="50px" />
<h3>Next</h3>
<p>See <a href="/docs/gpusb3/basics#nextExplanation">explanation of next inputs</a></p>

<Spacer space="100px" />
<h2>The full hat</h2>
<p>Now that we've got all the blocks used in the hat, we can put them together into what a basic input/output shader might look like:</p>
<pre class="vsmallblocks">
    Def shader [doublingShader] with resources (Def shader resource [inputBuffer] type (buffer v) usage (Buffer usage (STORAGE v), next (Buffer usage (COPY_DST v), next (Buffer usage (COPY_SRC v), next [] :: reporter {color1}) :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (storage v) next (Def shader resource [outputBuffer] type (buffer v) usage (Buffer usage (COPY_DST v), next (Buffer usage (MAP_READ v), next [] :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (NONE v) next () :: reporter {color1}) :: reporter {color1}) :: hat {color1}
</pre>
<p>That's pretty large, and might not fit on your screen. You can download the image <a href={assets.FullBasicsHat} download="Full hat" target="_blank">here</a>, or just zoom as the image is an svg. Anyways, now we want to be able to use the first buffer(which will contain the input array) and double the inputs. We can do this with the bind buffer block in our shader:</p>

<pre class="blocks">
    Bind shader resource #[binding number] to variable [variable] with settings [variable usage settings] type (variable type v) :: {color1}
</pre>

<p>The bind number is the number that is provided in the bind buffer block(explained later). The variable is how you can reference the data in your shader. The variable usage settings come from the variable usage block:</p>

<pre class="blocks">
    Variable usage (usage v) next [] :: reporter {color1}
</pre>

<p>There are a lot of options, here's what they do(note: this isn't very well documented, this is what I <i>think</i> they do. Please report issues):</p>

<ul>
    <p>These settings describe how you can access the variable:</p>
    <li>read - You can read from this variable</li>
    <li>write - You can write to this variable</li>
    <li>read_write - You can read and write. Not sure what the difference is between this and the above two.</li>

    <p>These settings describe when you can access the variable:</p>
    <li>function - You can only access it from the same function that it is declared? Not too sure.</li>
    <li>private - I assume you can only access this in the same scope it is declared, I have no idea.</li>
    <li>workgroup - This one is pretty cool, it's accessible in each workgroup, regardless of local invocation.</li>
    <li>uniform - This is used with the <a href="#uniformBufferUsage">uniform usage type in input buffers.</a></li>
    <li>storage - This is used with the <a href="#storageBufferUsage">storage usage type in input buffers.</a> </li>
</ul>

<Spacer space="50px" />
<p>Back to the Bind shader resource block, the last input in this block is the variable type. This can be any type you want, but for our case it will be an array of floats. We want to be able to read and write to it, so we give it that usage, and since it's a storage buffer we give it the storage usage type. Here's what our block looks like:</p>

<pre class="smallblocks">
    Bind shader resource #[0] to variable [data] with settings (Variable usage (read_write v) next (Variable usage (storage v) next [] :: reporter {color1}) :: reporter {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: reporter {color1}) :: {color1}
</pre>

<p>Now that we have our input buffer, we can get rid of our other array, leading our shader code to look like this:</p>

<pre class="vsmallblocks">
    Def shader [doublingShader] with resources (Def shader resource [inputBuffer] type (buffer v) usage (Buffer usage (STORAGE v), next (Buffer usage (COPY_DST v), next (Buffer usage (COPY_SRC v), next [] :: reporter {color1}) :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (storage v) next (Def shader resource [outputBuffer] type (buffer v) usage (Buffer usage (COPY_DST v), next (Buffer usage (MAP_READ v), next [] :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (NONE v) next () :: reporter {color1}) :: reporter {color1}) :: hat {color1}
    Bind shader resource #[0] to variable [data] with settings (Variable usage (read_write v) next (Variable usage (storage v) next [] :: reporter {color1}) :: reporter {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: reporter {color1}) :: {color1}
    Compute shader with workgroup size [[1\]] {oc}
        For [i] in [0], [2] {oc}
            Variable (In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) (= v) ((In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) * [2.0] :: math) :: {color1}
        {cc} :: {color1}
    {cc} :: {color1}
</pre>

<p><small>(an image will be provided when all the code is done)</small></p>

<p>To provide this buffer to our shader, we need to add some more code in our run gpu block using the bind type block:</p>

<pre class="blocks">
    bind type (type v) to [binding number], input [the resource input, if any] next () :: reporter {color1}
</pre>

<p>Currently the only available binding type is a buffer, so we will do that. Our binding number will be 0. The resource input will either be blank or take in a resource, currently the only available one is an f32 array:</p>

<pre class="blocks">
    F32 array from array [\[1, 2, 3\]] :: reporter {color1}
</pre>
<p><small>You can use the json extension to make the input for this block.</small></p>

<p>Here's what our binding for the input/output buffer will look like: </p>

<pre class="blocks">
    bind type (buffer v) to [0], input (F32 array from array [\[1, 2, 3\]] :: reporter {color1}) next (bind type (buffer v) to [0], input () next () :: reporter {color1}) :: reporter {color1}
</pre>

<p>Now we can put it in our run gpu block, and we can give our shader an input!</p>

<pre class="vsmallblocks">
    Def shader [doublingShader] with resources (Def shader resource [inputBuffer] type (buffer v) usage (Buffer usage (STORAGE v), next (Buffer usage (COPY_DST v), next (Buffer usage (COPY_SRC v), next [] :: reporter {color1}) :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (storage v) next (Def shader resource [outputBuffer] type (buffer v) usage (Buffer usage (COPY_DST v), next (Buffer usage (MAP_READ v), next [] :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (NONE v) next () :: reporter {color1}) :: reporter {color1}) :: hat {color1}
    Bind shader resource #[0] to variable [data] with settings (Variable usage (read_write v) next (Variable usage (storage v) next [] :: reporter {color1}) :: reporter {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: reporter {color1}) :: {color1}
    Compute shader with workgroup size [[1\]] {oc}
        For [i] in [0], [2] {oc}
            Variable (In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) (= v) ((In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) * [2.0] :: math) :: {color1}
        {cc} :: {color1}
    {cc} :: {color1}

    when green flag clicked
    compile shaders :: {color1}
    Run shader [doublingShader] with resources (bind type (buffer v) to [0], input (F32 array from array [\[1, 2, 3\]] :: reporter {color1}) next (bind type (buffer v) to [0], input ( :: {color3}) next () :: reporter {color1}) :: reporter {color1}) dimensions x: [1] y: [1] z: [1] :: {color1}
</pre>

<p>This is cool, but we still can't see the output. We need to copy the input buffer to our output buffer. We can do this with the copy data block:</p>

<pre class="smallblocks">
    Copy [number of bytes] bytes of data from buffer at binding [binding num] in shader [shader name] from position [start pos in buffer 1] to buffer at binding [binding num] in shader [shader name] at position [start pos in buffer 2] :: {color1}
</pre>

<p>That's a lot of inputs. The number of bytes(remember, in a f32 array there are 4 bytes per item in the array) is how many bytes(must be a multiple of 4) of data you want to copy. The binding numbers are the bindings that you specified in the run gpu block. The shader names are the names of the shaders, these don't need to be the same(I think, untested)! The first start position is where you will start copying data from. The second start position is where you will start putting that data. In our case, we are copying 12 bytes of data(3 items) from buffer 0 in doublingShader from position 0 to buffer 1 in doublingShader at position 0. That looks like this:</p>

<pre class="smallblocks">
    Copy [12] bytes of data from buffer at binding [0] in shader [doublingShader] from position [0] to buffer at binding [1] in shader [doublingShader] at position [0] :: {color1}
</pre>

<p>We can add that to our code, but we <i>still</i> can't read our data! Luckily there's only a few more blocks needed. We can use the Read buffer block:</p>

<pre class="blocks">
    Read buffer at binding [binding] in shader [shader name] :: {color1}
</pre>

<p>Once again, binding is the binding, shader name is the shader. This part isn't very complicated. This will set the buffer read output block to the result:</p>

<pre class="blocks">
    buffer read output :: reporter {color1}
</pre>

<p><small>This is because of a quirk with promises. Due to an issue described very soon, this may be changed to one block at some point.</small></p>

<p>Now we can add this to our code:</p>

<pre class="vsmallblocks">
    Def shader [doublingShader] with resources (Def shader resource [inputBuffer] type (buffer v) usage (Buffer usage (STORAGE v), next (Buffer usage (COPY_DST v), next (Buffer usage (COPY_SRC v), next [] :: reporter {color1}) :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (storage v) next (Def shader resource [outputBuffer] type (buffer v) usage (Buffer usage (COPY_DST v), next (Buffer usage (MAP_READ v), next [] :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (NONE v) next () :: reporter {color1}) :: reporter {color1}) :: hat {color1}
    Bind shader resource #[0] to variable [data] with settings (Variable usage (read_write v) next (Variable usage (storage v) next [] :: reporter {color1}) :: reporter {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: reporter {color1}) :: {color1}
    Compute shader with workgroup size [[1\]] {oc}
        For [i] in [0], [2] {oc}
            Variable (In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) (= v) ((In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) * [2.0] :: math) :: {color1}
        {cc} :: {color1}
    {cc} :: {color1}

    when green flag clicked
    compile shaders :: {color1}
    Run shader [doublingShader] with resources (bind type (buffer v) to [0], input (F32 array from array [\[1, 2, 3\]] :: reporter {color1}) next (bind type (buffer v) to [0], input ( :: {color3}) next () :: reporter {color1}) :: reporter {color1}) dimensions x: [1] y: [1] z: [1] :: {color1}
    Copy [12] bytes of data from buffer at binding [0] in shader [doublingShader] from position [0] to buffer at binding [1] in shader [doublingShader] at position [0] :: {color1}
    Read buffer at binding [1] in shader [doublingShader] :: {color1}
    set [my variable v] to (buffer read output :: reporter {color1}) :: variables
</pre>

<p>Now, when you run this you might notice an issue: you need to click it a few times to show up! This is because of how the buffer read block works, and it isn't always instant. You need to add a wait block with a very small value to account for this. <strong>This may be changed in the future!</strong></p>

<pre class="vsmallblocks">
    Def shader [doublingShader] with resources (Def shader resource [inputBuffer] type (buffer v) usage (Buffer usage (STORAGE v), next (Buffer usage (COPY_DST v), next (Buffer usage (COPY_SRC v), next [] :: reporter {color1}) :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (storage v) next (Def shader resource [outputBuffer] type (buffer v) usage (Buffer usage (COPY_DST v), next (Buffer usage (MAP_READ v), next [] :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (NONE v) next () :: reporter {color1}) :: reporter {color1}) :: hat {color1}
    Bind shader resource #[0] to variable [data] with settings (Variable usage (read_write v) next (Variable usage (storage v) next [] :: reporter {color1}) :: reporter {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: reporter {color1}) :: {color1}
    Compute shader with workgroup size [[1\]] {oc}
        For [i] in [0], [2] {oc}
            Variable (In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) (= v) ((In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) * [2.0] :: math) :: {color1}
        {cc} :: {color1}
    {cc} :: {color1}

    when green flag clicked
    compile shaders :: {color1}
    Run shader [doublingShader] with resources (bind type (buffer v) to [0], input (F32 array from array [\[1, 2, 3\]] :: reporter {color1}) next (bind type (buffer v) to [0], input ( :: {color3}) next () :: reporter {color1}) :: reporter {color1}) dimensions x: [1] y: [1] z: [1] :: {color1}
    Copy [12] bytes of data from buffer at binding [0] in shader [doublingShader] from position [0] to buffer at binding [1] in shader [doublingShader] at position [0] :: {color1}
    Read buffer at binding [1] in shader [doublingShader] :: {color1}
    wait [0.01] seconds :: control
    set [my variable v] to (buffer read output :: reporter {color1}) :: variables
</pre>

<p>One last thing! We can make our shader support any length of inputs with the arrayLength built in function(this only works with shader inputs, not declared arrays unfortunately. There is no way to get the length of those :( ). Since the for loop uses an int and arrayLength returns an unsigned int we need to use the i32 builtin function to cast it:</p>

<pre class="vsmallblocks">
    Def shader [doublingShader] with resources (Def shader resource [inputBuffer] type (buffer v) usage (Buffer usage (STORAGE v), next (Buffer usage (COPY_DST v), next (Buffer usage (COPY_SRC v), next [] :: reporter {color1}) :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (storage v) next (Def shader resource [outputBuffer] type (buffer v) usage (Buffer usage (COPY_DST v), next (Buffer usage (MAP_READ v), next [] :: reporter {color1}) :: reporter {color1}) settings [{"{"}"size":12{"}"}] usage type (NONE v) next () :: reporter {color1}) :: reporter {color1}) :: hat {color1}
    Bind shader resource #[0] to variable [data] with settings (Variable usage (read_write v) next (Variable usage (storage v) next [] :: reporter {color1}) :: reporter {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: reporter {color1}) :: {color1}
    Compute shader with workgroup size [[1\]] {oc}
        For [i] in [0], (WGSL builtin (i32 v) with args ((WGSL builtin (arrayLength v) with args (Get variable [data] :: reporter {color1}) :: reporter {color1}) - [1] :: math) :: reporter {color1}) {oc}
            Variable (In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) (= v) ((In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) * [2.0] :: math) :: {color1}
        {cc} :: {color1}
    {cc} :: {color1}

    when green flag clicked
    compile shaders :: {color1}
    Run shader [doublingShader] with resources (bind type (buffer v) to [0], input (F32 array from array [\[1, 2, 3\]] :: reporter {color1}) next (bind type (buffer v) to [0], input ( :: {color3}) next () :: reporter {color1}) :: reporter {color1}) dimensions x: [1] y: [1] z: [1] :: {color1}
    Copy [12] bytes of data from buffer at binding [0] in shader [doublingShader] from position [0] to buffer at binding [1] in shader [doublingShader] at position [0] :: {color1}
    Read buffer at binding [1] in shader [doublingShader] :: {color1}
    wait [0.01] seconds :: control
    set [my variable v] to (buffer read output :: reporter {color1}) :: variables
</pre>

<p>And we're done! That was quite a large explanation for so little code. As promised, here's a link to <a href={assets.FinishedBasicsImg} download="FinishedBasicsImg.svg">the image</a>, and in case you're having issues here's <a href={assets.FinishedBasicsProject} download="FinishedBasics.sb3">the sb3</a>. If you have any questions, check the next few pages, otherwise dm derpygamer2142 on discord.</p>