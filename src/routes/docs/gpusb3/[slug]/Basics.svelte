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
    Def shader [Shader name] using bind group layout [Bind group layout] :: hat {color1}
</pre>

<p>The def shader hat has 2 arguments. The first, the shader name, is how you run the shader(see the <a href="/docs/gpusb3/blocks#runShader">run shader block</a>). This must only use the text input, you can't add blocks. You can name it whatever you want. Then, there's the <a href="#bindGroupLayout">bind group layout</a> name(doesn't allow inputs), explained later. You can attach code to the hat, which is what makes up your shader. Be careful, as not all blocks are supported. You can see the list of supported blocks <a href="/docs/gpusb3/blocks">here</a>. Let's make a basic shader that takes in a list and returns the list with every item doubled. We can use the Compute shader C block to define what our shader will do when it is run:</p>

<pre class="blocks">
    Compute shader with workgroup size [[1\]] {oc}
        ... code goes here :: {color2}
    {cc} :: {color1}
</pre>

<p><small>Don't worry about workgroup size quite yet. It's explained <a href="/advanced#workgroups">here</a></small></p>

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
    Def shader [doublingShader] with bind group layout [] :: hat {color1}
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
    Def shader [doublingShader] with bind group layout [] :: hat {color1}
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
<p>Now when you press the flag your shader will be compiled! Check the "Error" block and look for any errors or warnings. If you see something along the lines of "invalid input", it means you put a block where a block isn't allowed to go. If you see something like "invalid opcode", it means you used an unsupported block in your shader. If you see any other errors, dm derpygamer2142 on discord. Now we can finally run our shader! This is done using the run shader block:</p>

<pre class="blocks">
    Run shader [shader name] using bind group [bind group name] dimensions x: [x dim] y: [y dim] z: [z dim] :: {color1}
</pre>

<p>Our shader name is whatever our shader is called, and the args is explained later. The dimensions are the number of workgroups on each axis, which is explained <a href="/advanced#workgroups">here</a>. For now, let's just dispatch 1 workgroup per axis.</p>

<pre class="smallblocks">
    Def shader [doublingShader] with bind group layout [] :: hat {color1}
    Compute shader with workgroup size [[1\]] {oc}
        Declare (var v) variable as [data] with value (Construct type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [3] :: reporter {color1}) with values [1.0, 2.0, 3.0] :: reporter {color1}): (auto v) :: {color1}
        For [i] in [0], [2] {oc}
            Variable (In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) (= v) ((In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) * [2.0] :: math) :: {color1}
        {cc} :: {color1}
    {cc} :: {color1}

    when green flag clicked
    compile shaders :: {color1}
    Run shader [doublingShader] with bind group [] dimensions x: [1] y: [1] z: [1] :: {color1}
</pre>

<p>Now you can click the green flag and hopefully have any errors! If you see something mentioning an error parsing wgsl, then something in your shader is wrong. Otherwise you should be good! Now, you may be thinking <i>"this is a great shader, finally I can easily and quickly double my hardcoded list of 3 numbers, but it would be great if I could give the shader an array to double instead of it being hardcoded!"</i>. Well you're in luck, because you can do this in the form of</p>

<!-- <pre class="blocks">
    Def shader [myShader] with resources [] :: hat {color1}
    Declare [const v] variable as [someVariable] with value ([15] * [8] :: operator): [i32 v] :: {color1}
</pre>

<p>This shader would be compiled to <code>const someVariable: i32 =  (15 * 12) ;</code> GPU.sb3 uses a special system for compiling shaders(partially explained in the <a href="/docs/gpusb3/interals">internals page</a>), and it only supports some blocks. You can see the list of supported blocks <a href="/docs/gpusb3/blocks">here</a>.</p> -->

<Spacer space="65px" />

<h2 id="shaderResources">Shader resources</h2>

<p>Your shader will be pretty much useless if it can't interact with the project, so you need to define some stuff to be able to provide your shader with data:</p>

<pre class="blocks" id="bindGroupLayout">
    Create bind group layout called [bindGroupLayoutName] {oc}
        Add bind group layout entry with binding [bindingNumber] for type (bindingType v) and descriptor [bindGroupLayoutEntryDescriptor] :: {color1}
    {cc} :: color {color1}
</pre>

<h3>Bind groups and bind group layouts</h3>

<p>To provide our shader with inputs, we need to first describe what inputs the shader is going to have, otherwise the gpu is essentially going to need to guess based on your shader's code, which isn't ideal. The things that describe how your inputs are used are called "bind group layouts". They tell the gpu what kind of resource is going in what binding. Here's what the extension's blocks to do this look like:</p>

<ul>
    <p>Create bind group layout block's inputs</p>
    <li>bindGroupLayoutName - This is the name that you will use to reference your bind group layout. All your bind group layout entry blocks go inside this block.</li>

    <p>Bind group layout entry block's inputs</p>
    <li>bindingNumber - The binding number you are describing. A binding number is a slot in the list of possible inputs you can give your shader.</li>
    <li>bindingType - The type of resource you are going to put in this slot. Here's the possible values for this:</li>
    <ul>
        <li>buffer - Essentially just a list, but instead of items it sometimes has individual bytes. A buffer can only have numbers in it.</li>
    </ul>
    <li>bindGroupLayoutEntryDescriptor - Fancy name, fairly simple input. Takes an input of a  entry descriptor block(explained below). This input describes how this slot will be used, and the type of descriptor depends on the bindingType.</li>

    <p>Entry descriptor blocks</p>
    <p>Which of these blocks to use depends on the bindingType input.</p>
    <ul>
        <pre class="blocks">
            Buffer layout entry descriptor with usage type (usageType v) :: {color1} reporter
        </pre>
        <li>Usage type - How this buffer will be used. read-only-storage is for a buffer that will only be read from, storage is for a buffer that will be written to and possibly read from, uniform is essentially read-only-storage but it's optimized for buffers that won't change much(or at all).</li>
    </ul>
</ul>

<p>That's a lot, hopefully our usage of these will help explain a little more. We only need one buffer, which we will use for passing data to and from our shader.</p>
<small>Hey! This isn't best practice, usually you would have seperate buffers for passing data to and from the gpu.</small>

<pre class="blocks" id="bindGroupLayout">
    when flag clicked
    Create bind group layout called [doublingBGL] {oc}
        Add bind group layout entry with binding [0] for type (buffer v) and descriptor (Buffer layout entry descriptor with usage type (storage v) :: {color1}) :: {color1}
    {cc} :: color {color1}
    compile shaders :: {color1}
    run shader [doublingShader] with bind group [] dimensions x: [1] y: [1] z: [1] :: {color1}
</pre>


<p>Now we need to alter our shader's code to use inputs. We set the bindGroupLayout input in the hat to the name of our bindGroupLayout, which is doublingBGL here.</p>
<pre class="blocks">
    Def shader [doublingShader] with bind group layout [doublingBGL] :: hat {color1}
</pre>
<p>Now we want to be able to use the first buffer(which will contain the input array) and double the inputs. We can do this with the bind buffer block in our shader:</p>

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
    <li>read_write - You can read and write. Not sure what the difference is between this and the above two, probably some internal optimization stuff.</li>

    <p>These settings describe when you can access the variable:</p>
    <li>function - You can only access it from the same function that it is declared? Not too sure.</li>
    <li>private - I assume you can only access this in the same scope it is declared, I have no idea.</li>
    <li>workgroup - This one is pretty cool, it's accessible in each workgroup, regardless of local invocation.</li>
    <li>uniform - This is used with the uniform usage type in a bind group layout entry.</li>
    <li>storage - This is used with the storage usage type in a bind group layout entry.</li>
</ul>
<p>Note: The order of these usage settings does actually matter! Put the usage of how you will access the variable first(for example: storage), followed by the access settings.</p>

<Spacer space="50px" />
<p>Back to the Bind shader resource block, the last input in this block is the variable type. This can be any type you want, but for our case it will be an array of floats. We want to be able to read and write to it, so we give it that usage, and since it's a storage buffer we give it the storage usage type. Here's what our block looks like:</p>

<pre class="smallblocks">
    Bind shader resource #[0] to variable [data] with settings (Variable usage (read_write v) next (Variable usage (storage v) next [] :: reporter {color1}) :: reporter {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: reporter {color1}) :: {color1}
</pre>

<p>Now that we have our input buffer, we can get rid of our other array, leading our shader code to look like this:</p>

<pre class="smallblocks">
    Def shader [doublingShader] with resources [doublingBGL] :: hat {color1}
    Bind shader resource #[0] to variable [data] with settings (Variable usage (read_write v) next (Variable usage (storage v) next [] :: reporter {color1}) :: reporter {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: reporter {color1}) :: {color1}
    Compute shader with workgroup size [[1\]] {oc}
        For [i] in [0], [2] {oc}
            Variable (In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) (= v) ((In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) * [2.0] :: math) :: {color1}
        {cc} :: {color1}
    {cc} :: {color1}
</pre>

<p><small>(an image will be provided when all the code is done)</small></p>


<p>Alright, our shader is prepped to recieve some data, now we just need to give it that data. First, we create our data, in this case buffers.</p>
<pre class="blocks">
    Create buffer called [bufferName] with size\(in bytes\) [size] and usage flags [usageFlags] :: {color1}
</pre>

<p>As mentioned before, a buffer is basically just a list except it only allows numbers, and instead of items in the list you can have individual bytes. Here's how you use the above block:</p>

<ul>
    <li>bufferName - The name you will use to reference the buffer.</li>
    <li>size - The number of bytes in the buffer. If you don't know what a byte is, god help you.</li>
    <li>usageFlags - How the buffer will be used. These are individual flags from the Buffer usage block, that you combine using the "usage () | () " block. Here's some more info on that...</li>
    <pre class="blocks">
        Buffer usage (usage v) :: reporter {color1}
        Usage [a] | [b] :: reporter {color1}
    </pre>
    <ul>
        <p>Buffer usage block - This is an individual flag to describe how a buffer will be used. It's possible values are:</p>
        <li>COPY_SRC - This can be the source buffer in the <a href="/docs/gpusb3/blocks#copyData">copy data block</a>.</li>
        <li>COPY_DST - This can be the destination buffer in the copy data block, and you can write data to it using the <a href="/docs/gpusb3/blocks#writeData">write data block</a>.</li>
        <li>MAP_READ - You can read from this buffer using the <a href="/docs/gpusb3/blocks#readBuffer">read buffer block</a>.</li>
        <li>MAP_WRITE - You can write to this buffer when it's been mapped. Currently unimplemented, so dw about it</li>
        <li>QUERY_RESOLVE - No clue, but I haven't needed to use it anywhere and there's nothing implemented that uses it so dw about this</li>
        <li>STORAGE - This buffer can be written and read from by your shader.</li>
        <li>UNIFORM - This buffer will only be read from by your shader.</li>
        <p>Usage | block - This just lets you string together usage flags. Put a flag or another usage block in the inputs.</p>
    </ul>

</ul>

<p>We'll need 2 buffers: One for our buffer to read/write from and one get our data from the gpu to our project. Here's what this looks like:</p>

<pre class="smallblocks">
    Create buffer called [inputBuffer] with size\(in bytes\) [12] and usage flags (Usage (Usage (Buffer usage (STORAGE v) :: {color1}) | (Buffer usage (COPY_SRC v) :: {color1}) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create buffer called [readBuffer] with size\(in bytes\) [12] and usage flags (Usage (Buffer usage (MAP_READ v) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
</pre>
<p>Our first buffer, inputBuffer, has the flags STORAGE(so our shader can read and write from it), COPY_DST(so we can write the data we want our shader to double to it), and COPY_SRC(so we can copy the buffer to the read buffer after running our shader)</p>
<p>Our second buffer, readBuffer, has the flags COPY_DST(so we can copy the data from inputBuffer to it), and MAP_READ(so we can read from it).</p>

<Spacer space="15px" />
<p>To actually write the data to inputBuffer, we can use the writeData block.</p>
<pre class="blocks">
    Write [amount] elements of data from arraybuffer [array] to buffer [bufferName] from offset [off1] to offset [off2] :: {color1}

    Create arraybuffer and view called [name] from array [data] of type (dataType v) :: {color1}
</pre>

<ul>
    <p>Write data - Writes data</p>
    <li>amount - For a typedArray(currently the only available kind of array), this is in elements. Otherwise in bytes.</li>
    <li>array - The arraybuffer to take the data from.</li>
    <li>bufferName - The buffer to write to.</li>
    <li>off1 - The offset to start reading from, see note in amount.</li>
    <li>off2 - The offset to start writing to, see note in amount.</li>
    <p>Create arraybuffer - this adds a new arraybuffer and arraybuffer view from the given array. More information at the <a href="/blocks#createArraybuffer">block list entry</a>.</p>
    <li>name - The name to use when creating the objects.</li>
    <li>data - A stringified array of <b>numbers</b>. You can make this using a json extension.</li>
    <li>dataType - A typedArray type. See <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#typedarray_objects">the mdn reference</a>.</li>
</ul>

<p>Since we're using float32s, and there's 4 bytes in 32 bits, and we are using a buffer length of 12 bytes, our array will have a length of 3. Here's what our writing code looks like:</p>

<pre class="blocks">
    Create arraybuffer and view called [inputArrayBuffer] from array [\[1, 2, 3\]] of type (Float32Array v) :: {color1}
    Write [3] elements of data from arraybuffer [inputArrayBuffer] to buffer [inputBuffer] from offset [0] to offset [0] :: {color1}
</pre>

<p>Adding all of that to our existing code and we have</p>

<pre class="smallblocks">
    when flag clicked
    Create bind group layout called [doublingBGL] {oc}
        Add bind group layout entry with binding [0] for type (buffer v) and descriptor (Buffer layout entry descriptor with usage type (storage v) :: {color1}) :: {color1}
    {cc} :: color {color1}
    Create buffer called [inputBuffer] with size\(in bytes\) [12] and usage flags (Usage (Usage (Buffer usage (STORAGE v) :: {color1}) | (Buffer usage (COPY_SRC v) :: {color1}) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create buffer called [readBuffer] with size\(in bytes\) [12] and usage flags (Usage (Buffer usage (MAP_READ v) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create arraybuffer and view called [inputArrayBuffer] from array [\[1, 2, 3\]] of type (Float32Array v) :: {color1}
    Write [3] elements of data from arraybuffer [inputArrayBuffer] to buffer [inputBuffer] from offset [0] to offset [0] :: {color1}
    compile shaders :: {color1}
    run shader [doublingShader] with bind group [] dimensions x: [1] y: [1] z: [1] :: {color1}
</pre>

<Spacer space="50px" />
<p>We're almost done, we just need to pass inputBuffer to our shader and then we can read the data after we've run the shader. We can do this by creating a bind group. A bind group essentially passes data to the bindings you described in your bind group layout. Here's what it looks like:</p>

<pre class="blocks">
    Create bind group called [bindGroupName] using layout [bindGroupLayoutName] {oc}
        Add bind group entry with binding [bindingNumber] of type (bindingType v) using resource named [resourceName] :: {color1}
    {cc} :: {color1}
</pre>

<ul>
    <p>Create bind group block - Similar to the create bind group layout block where we put the entries inside of it, but this actually binds the resources to the given slots.</p>
    <li>bindGroupName - The name that we will use to reference this bind group</li>
    <li>bindGroupLayoutName - The bind group layout to use in this bind group. We'll be using the one we defined earlier, doublingBGL</li>

    <p>Bind group entry block - Adds a binding entry to the bind group it's inside of, this binds a resource to the given slot.</p>
    <li>bindingNumber - The binding slot to bind the resource to</li>
    <li>bindingType - The type of resource to bind to this slot. In our case, it's a buffer.</li>
    <li>resourceName - The name of the resource to bind to this slot. In our case, we're binding the buffer called inputBuffer</li>

</ul>

<p>Our bind group looks like this:</p>
<pre class="blocks">
    Create bind group called [doublingBG] using layout [doublingBGL] {oc}
        Add bind group entry with binding [0] of type (buffer v) using resource named [inputBuffer] :: {color1}
    {cc} :: {color1}
</pre>

<p>We can throw that in our code, and update the run shader block to use our new bind group:</p>
<pre class="smallblocks">
    when flag clicked
    Create bind group layout called [doublingBGL] {oc}
        Add bind group layout entry with binding [0] for type (buffer v) and descriptor (Buffer layout entry descriptor with usage type (storage v) :: {color1}) :: {color1}
    {cc} :: color {color1}
    Create buffer called [inputBuffer] with size\(in bytes\) [12] and usage flags (Usage (Usage (Buffer usage (STORAGE v) :: {color1}) | (Buffer usage (COPY_SRC v) :: {color1}) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create buffer called [readBuffer] with size\(in bytes\) [12] and usage flags (Usage (Buffer usage (MAP_READ v) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create arraybuffer and view called [inputArrayBuffer] from array [\[1, 2, 3\]] of type (Float32Array v) :: {color1}
    Write [3] elements of data from arraybuffer [inputArrayBuffer] to buffer [inputBuffer] from offset [0] to offset [0] :: {color1}
    Create bind group called [doublingBG] using layout [doublingBGL] {oc}
        Add bind group entry with binding [0] of type (buffer v) using resource named [inputBuffer] :: {color1}
    {cc} :: {color1}
    compile shaders :: {color1}
    run shader [doublingShader] with bind group [doublingBG] dimensions x: [1] y: [1] z: [1] :: {color1}
</pre>

<p>Great, we are passing data to our shader, but we still can't read this data. To do this we need to copy the input buffer to the read buffer and read the read buffer.</p>

<pre class="blocks">
    copy [amount] bytes of data from buffer [srcBuffer] from position [readPos] to buffer [dstBuffer] at position [writePos] :: {color1}

    Read buffer [buffer] to arraybuffer [arrayBuffer] :: {color1}

    View arraybuffer (arrayBuffer v) as (arrayType v) called [viewName] :: {color1}

    Get view [view] as array :: reporter {color1}
</pre>

<ul>
    <p>Copy data block - Copies data between buffers. What did you expect.</p>
    <li>amount - Number of bytes to copy from srcBuffer to dstBuffer</li>
    <li>srcBuffer - Buffer to read from. Must have the COPY_SRC usage flag</li>
    <li>readPos - The position to start reading from</li>
    <li>dstBuffer - Buffer to write to. Must have COPY_DST usage flag</li>
    <li>writePos - The position to start writing to</li>
    <p>Read buffer block - This copies the data from the buffer to the specifed arrayBuffer.</p>
    <li>buffer - The buffer to read, must have MAP_READ usage flag.</li>
    <li>arrayBuffer - The arraybuffer to write the data to</li>
    <p>View arraybuffer block - This creates a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray">view</a> of an arraybuffer of the given type.</p>
    <li>arrayBuffer - The arraybuffer to view.</li>
    <li>arrayType - See <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#typedarray_objects">the mdn reference</a>. The type of typedArray to create.</li>
    <li>viewName - The name of the view to create</li>
    <p>Get view block - This reads a given view as its given type, returned as a stringified array.</p>
</ul>

<p>Our code using this looks like this:</p>
<pre class="blocks">
    Copy [12] bytes of data from buffer [inputBuffer] from position [0] to buffer [readBuffer] at position [0] :: {color1}
    Read buffer [readBuffer] to arraybuffer [outputArrayBuffer] :: {color1}
    View arraybuffer (outputArrayBuffer v) as (Float32Array v) called [outputView] :: {color1}
    set [my variable v] to (Get view [outputView] as array :: {color1})
</pre>

<p>Now we're done(see small note below), here's the full code:</p>

<pre class="smallblocks">
    Def shader [doublingShader] with resources [doublingBGL] :: hat {color1}
    Bind shader resource #[0] to variable [data] with settings (Variable usage (read_write v) next (Variable usage (storage v) next [] :: reporter {color1}) :: reporter {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: reporter {color1}) :: {color1}
    Compute shader with workgroup size [[1\]] {oc}
        For [i] in [0], [2] {oc}
            Variable (In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) (= v) ((In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) * [2.0] :: math) :: {color1}
        {cc} :: {color1}
    {cc} :: {color1}
    
    when flag clicked
    Create bind group layout called [doublingBGL] {oc}
        Add bind group layout entry with binding [0] for type (buffer v) and descriptor (Buffer layout entry descriptor with usage type (storage v) :: {color1}) :: {color1}
    {cc} :: color {color1}
    Create buffer called [inputBuffer] with size\(in bytes\) [12] and usage flags (Usage (Usage (Buffer usage (STORAGE v) :: {color1}) | (Buffer usage (COPY_SRC v) :: {color1}) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create buffer called [readBuffer] with size\(in bytes\) [12] and usage flags (Usage (Buffer usage (MAP_READ v) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create arraybuffer and view called [inputArrayBuffer] from array [\[1, 2, 3\]] of type (Float32Array v) :: {color1}
    Write [3] elements of data from arraybuffer [inputArrayBuffer] to buffer [inputBuffer] from offset [0] to offset [0] :: {color1}
    Create bind group called [doublingBG] using layout [doublingBGL] {oc}
        Add bind group entry with binding [0] of type (buffer v) using resource named [inputBuffer] :: {color1}
    {cc} :: {color1}
    compile shaders :: {color1}
    run shader [doublingShader] with bind group [doublingBG] dimensions x: [1] y: [1] z: [1] :: {color1}
    Copy [12] bytes of data from buffer [inputBuffer] from position [0] to buffer [readBuffer] at position [0] :: {color1}
    Read buffer [readBuffer] to arraybuffer [outputArrayBuffer] :: {color1}
    View arraybuffer (outputArrayBuffer v) as (Float32Array v) called [outputView] :: {color1}
    set [my variable v] to (Get view [outputView] as array :: {color1})
</pre>


<p>One last thing! We can make our shader support any length of inputs with the arrayLength built in function(this only works with shader inputs, not declared arrays unfortunately. There is no way to get the length of those :( ). Since the for loop uses an int and arrayLength returns an unsigned int we need to use the i32 builtin function to cast it:</p>

<pre class="smallblocks">
    Def shader [doublingShader] with resources [doublingBGL] :: hat {color1}
    Bind shader resource #[0] to variable [data] with settings (Variable usage (read_write v) next (Variable usage (storage v) next [] :: reporter {color1}) :: reporter {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: reporter {color1}) :: {color1}
    Compute shader with workgroup size [[1\]] {oc}
        For [i] in [0], (WGSL builtin (i32 v) with args ((WGSL builtin (arrayLength v) with args (Get variable [data] :: reporter {color1}) :: reporter {color1}) - [1] :: math) :: reporter {color1}) {oc}
            Variable (In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) (= v) ((In array [data] get (get variable [i] :: reporter {color1}) :: reporter {color1}) * [2.0] :: math) :: {color1}
        {cc} :: {color1}
    {cc} :: {color1}

    when flag clicked
    Create bind group layout called [doublingBGL] {oc}
        Add bind group layout entry with binding [0] for type (buffer v) and descriptor (Buffer layout entry descriptor with usage type (storage v) :: {color1}) :: {color1}
    {cc} :: color {color1}
    Create buffer called [inputBuffer] with size\(in bytes\) [12] and usage flags (Usage (Usage (Buffer usage (STORAGE v) :: {color1}) | (Buffer usage (COPY_SRC v) :: {color1}) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create buffer called [readBuffer] with size\(in bytes\) [12] and usage flags (Usage (Buffer usage (MAP_READ v) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create arraybuffer and view called [inputArrayBuffer] from array [\[1, 2, 3\]] of type (Float32Array v) :: {color1}
    Write [3] elements of data from arraybuffer [inputArrayBuffer] to buffer [inputBuffer] from offset [0] to offset [0] :: {color1}
    Create bind group called [doublingBG] using layout [doublingBGL] {oc}
        Add bind group entry with binding [0] of type (buffer v) using resource named [inputBuffer] :: {color1}
    {cc} :: {color1}
    compile shaders :: {color1}
    run shader [doublingShader] with bind group [doublingBG] dimensions x: [1] y: [1] z: [1] :: {color1}
    Copy [12] bytes of data from buffer [inputBuffer] from position [0] to buffer [readBuffer] at position [0] :: {color1}
    Read buffer [readBuffer] to arraybuffer [outputArrayBuffer] :: {color1}
    View arraybuffer (outputArrayBuffer v) as (Float32Array v) called [outputView] :: {color1}
    set [my variable v] to (Get view [outputView] as array :: {color1})
</pre>

<p>And we're done! That was quite a large explanation for so little code. As promised, here's a link to <a href={assets.FinishedBasicsImg} download="FinishedBasicsImg.svg">the image</a>, and in case you're having issues here's <a href="/doublingdemo.zip" download="FinishedBasics.sb3">the sb3</a>. If you have any questions, check the next few pages, otherwise dm derpygamer2142 on discord.</p>