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

<p>This page contains a list of every block, its inputs, and what it does. You might be thinking "wow, that probably took a while to write"</p>


<pre class="blocks" id="defShader">
    Def shader [shaderName] using bind group layout [bindGroupLayout] :: hat {color1}
</pre>

<p>This creates a new shader with the code underneath the hat, compiled when the <a href="#compileShaders">compile shaders</a> block is run.</p>

<h3>Inputs:</h3>

<ul>
    <p>shaderName - The name by which the shader is referenced, for example in the <a href="#runShader">run shader</a> block. <strong>Does not allow inputs.</strong></p>
    <p>bindGroupLayout - The bind group layout that this shader will use, references a <a href="#bindGroupLayout">bind group layout definition</a></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="compileShaders">
    compile shaders :: {color1}
</pre>

<p>Compiles all of the shaders in your project. This can be pretty slow depending on the number and length of your shaders, so you should probably only run this whenever you update your shaders or the first time your project is run.</p>

<Spacer space="30px" />
<pre class="blocks">
    when error thrown :: hat {color1}
</pre>

<p>This hat is run whenever an error is thrown. More info at the <a href="/docs/gpusb3/errors">errors page</a>.</p>

<Spacer space="30px" />
<pre class="blocks">
    clear current error :: {color1}
</pre>

<p>Resets the <a href="#error">error reporter</a> to the default of {oc} {cc}</p>

<Spacer space="30px" />
<pre class="blocks">
    Error :: reporter {color1}
</pre>

<p>This reports the current error when an error is thrown, in the format:
    {JSON.stringify({
        name: "errorName",
        body: "errorBody",
        source: "errorSource",
        full: "fullError"
    })}
</p>

<ul>
    <p>name - The name of the error thrown, this doesn't contain spaces(unless it's a webgpu error, which might)</p>
    <p>body - A short description of the error</p>
    <p>source - The block or process that caused this error</p>
    <p>full - The full error, along with what may have caused it</p>
</ul>

<Spacer space="30px" />
<pre class="blocks">
    Reconnect to GPU :: {color1}
</pre>

<p>If you somehow lose connection to the webgpu adapter(whether that be by accidentally making a permenant loop or something else), you can use this block to reconnect and continue using it. You will need to recreate all buffers, bind groups, etc.</p>

<Spacer space="50px" />
<pre class="blocks" id="runShader">
    Run shader [shaderName] with using bind group [bindGroup] dimensions x: [dimX] y: [dimY] z: [dimZ] :: {color1}
</pre>

<p>This block will run whatever is in the <a href="#computeShader">compute function</a> of your shader.</p>

<h3>Inputs</h3>

<ul>
    <p>shaderName - The name of the shader to run. <strong>Allows inputs.</strong></p>
    <p>bindGroup - The bind group to use to provide resources to your shader. Takes a name which references a <a href="#bindGroup">bind group definition</a>.</p>
    <p>dimX, dimY, dimZ - The number of workgroups to dispatch per axis. This gets passed to the compute shader as a vector, you can reference it with num_workgroups. Your compute shader is run once for each location in these dimensions. <strong>Allows inputs.</strong></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="bindGroupLayout">
    Create bind group layout called [bindGroupLayoutName] {oc}
        Entries... :: {color2}
    {cc} :: color {color1}
</pre>

<p>Creates a bind group layout.</p>

<h3>Inputs</h3>

<ul>
    <p>bindGroupLayoutName - The name that will be used to reference the bind group layout</p>
    <p>entries - Put <a href="#bindGroupLayoutEntry">bind group layout entry blocks</a> here to define the layout.</p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="bindGroupLayoutEntry">
    Add bind group layout entry with binding [bindingNumber] for type (bindingType v) and descriptor [bindGroupLayoutEntryDescriptor] :: {color1}
</pre>

<p>Adds an entry to the bind group layout definition the block is inside of.</p>

<h3>Inputs</h3>

<ul>
    <li>bindingNumber - The binding number you are describing. A binding number is a slot in the list of possible inputs you can give your shader.</li>
    <li>bindingType - The type of resource you are going to put in this slot. Here's the possible values for this:</li>
    <ul>
        <li>buffer - Essentially just a list, but instead of items it sometimes has individual bytes. A buffer can only have numbers in it.</li>
    </ul>
    <li>bindGroupLayoutEntryDescriptor - Fancy name, fairly simple input. Takes an input of an <a href="#bindGroup">entry descriptor block</a>. This input describes how this slot will be used, and the type of descriptor depends on the bindingType.</li>
</ul>

<Spacer space="50px" />
<h3>Entry descriptor blocks</h3>
<p>An entry descriptor block describes a bind group layout entry, which block to use depends on the bindingType of the entry.</p>

<pre class="blocks">
    Buffer layout entry descriptor with usage type (usageType v) :: {color1} reporter
</pre>
<ul>
    <p>Usage type - How this buffer will be used. Possible values: </p>
    <ul>
        <li>read-only-storage is for a buffer that will only be read from</li>
        <li>storage is for a buffer that will be written to and possibly read from</li>
        <li>uniform is essentially read-only-storage except it's optimized for buffers that won't change much(or at all)</li>
    </ul>
</ul>

<Spacer space="100px" />

<pre class="blocks" id="bindGroup">
    Create bind group called [bindGroupName] using layout [bindGroupLayoutName] {oc}
        Entries... :: {color2}
    {cc} :: {color1}
</pre>

<p>Creates a bind group, which binds various resources to binding slots. Similar to the create bind group layout block where you put the entries inside of it.</p>

<h3>Inputs</h3>

<ul>
    <p>bindGroupName - The name by which this bind group will be referenced</p>
    <p>bindGroupLayoutName - The name of a <a href="#bindGroupLayout">bind group layout definition</a> to describe this bind group.</p>
    <p>entries - Put <a href="#bindGroupEntry">bind group entry blocks</a> here</p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="bindGroupEntry">
    Add bind group entry with binding [bindingNumber] of type (bindingType v) using resource named [resourceName] :: {color1}
</pre>

<p>Binds a given resource to a binding slot in the bind group this block is inside of.</p>

<h3>Inputs</h3>

<ul>
    <p>bindingNumber - The slot to bind the resource to</p>
    <p>bindingType - The type of resource to bind here. Valid types:</p>
    <ul>
        <li>buffer</li>
    </ul>
    <p>resourceName - The name of the resource, corresponds to a <a href="#resourceDefinitions">resource definition</a> of the previously specified type.</p>
</ul>

<Spacer space="50px" />

<h3 id="resourceDefinitions">Resource definitions</h3>
<pre class="blocks">
    Create buffer called [bufferName] with size\(in bytes\) [size] and usage flags [usageFlags] :: {color1}
</pre>

<p>Creates a buffer.</p>

<h3>Inputs</h3>

<ul>
    <p>bufferName - The name by which this buffer will be referenced.</p>
    <p>size - The size of the buffer, in bytes.</p>
    <p>usageFlags - Flags using the <a href="#bufferUsage">buffer usage block</a> which describe how the buffer can be used.</p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="bufferUsage">
    Buffer usage (usage v) :: reporter {color1}
</pre>

<p>This block is an individual flag for how a buffer can be used, and multiple can be strung together using the <a href="#usageOr">usage |</a> block.</p>

<h3>Inputs</h3>

<ul>
    <p>usage - This block's flag. Possible values:</p>
    <ul>
        <li>COPY_SRC - This can be the source buffer in the <a href="#copyData">copy data block</a>.</li>
        <li>COPY_DST - This can be the destination buffer in the copy data block, and you can write data to it using the <a href="#writeData">write data block</a>.</li>
        <li>MAP_READ - You can read from this buffer using the <a href="#readBuffer">read buffer block</a>.</li>
        <li>MAP_WRITE - You can write to this buffer when it's been mapped. Currently unimplemented, so dw about it</li>
        <li>QUERY_RESOLVE - No clue, but I haven't needed to use it anywhere and there's nothing implemented that uses it so dw about this</li>
        <li>STORAGE - This buffer can be written and read from by your shader.</li>
        <li>UNIFORM - This buffer will only be read from by your shader.</li>
    </ul>
</ul>

<Spacer space="25px" />

<pre class="blocks">
    Usage [a] | [b] :: reporter {color1}
</pre>

<p>This just lets you string together usage flags. Put a flag or another usage block in the inputs. This is equivilant to a binary OR operator.</p>

<h3>Inputs</h3>

<ul>
    <p>a - An individual usage flag or another of this block.</p>
    <p>b - An individual usage flag or another of this block.</p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="f32Array">
    F32 array from array [array] :: reporter {color1}
</pre>

<p>Creates a typed f32 array from the inputs provided. Returns a reference, not the array!</p>

<h3>Inputs</h3>

<ul>
    <p>array - An array of numbers. You can use the json extension as an input here.</p>
</ul>

<pre class="blocks" id="writeData">
    Write [amount] elements of data from array [array] to buffer [bufferName] from offset [off1] to offset [off2] :: {color1}
</pre>

<p>This writes data from a typed array or some other data source(currently unimplemented) to a buffer.</p>

<h3>Inputs</h3>

<ul>
    <li>amount - For a typed array(currently the only available kind of array), this is in elements(aka list items). Otherwise in bytes.</li>
    <li>array - The array of data to write to the buffer. Currently the only available kind is the <a href="#f32Array">f32 array</a>.</li>
    <li>bufferName - The buffer to write to.</li>
    <li>off1 - The offset to start reading from, see note in amount.</li>
    <li>off2 - The offset to start writing to, see note in amount.</li>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="copyData">
    Copy [numBytes] bytes of data from buffer [srcBuffer] from position [pos1] to buffer [dstBuffer] at position [pos2] :: {color1}
</pre>

<p>Allows you to copy data from one buffer to another. The first buffer must have a usage of <a href="#copySrc">COPY_SRC</a>, the second buffer must have a usage of <a href="#copyDst">COPY_DST</a>.</p>

<h3>Inputs</h3>

<ul>
    <p>numBytes - The amount of bytes to copy from the first buffer to the second. Must be a multiple of 4. <strong>Allows inputs.</strong></p>
    <p>srcBuffer - The buffer to copy data from. Must have a usage flag of COPY_SRC.</p>
    <p>pos1 - The index at which to start copying data. Must be a multiple of 4. <strong>Allows inputs.</strong></p>
    <p>dstBuffer - The buffer to copy data to. Must have a usage flag of COPY_DST</p>
    <p>pos2 - The index at which to start pasting data. Must be a multiple of 4. <strong>Allows inputs.</strong></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="readBuffer">
    Read buffer [buffer] :: reporter {color1}
</pre>

<p>Returns the specified buffer parsed as an f32 array. Expect this to change soon!</p>
<p><strong>Note: This has a 1 frame delay when reading, which can't really be avoided.</strong></p>

<h3>Inputs</h3>

<ul>
    <p>buffer - The buffer to read. Must have a usage flag of MAP_READ.</p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="declareVar">
    Declare (variableType v) variable as [variableName] with value [value]: (type v) :: {color1}
</pre>
    
<p>This allows you to declare a variable. Not much else to it.</p>

<h3>Inputs</h3>

<ul>
    <p>variableType - How the variable will be used. This also dictates where it can be declared. <strong>Does not allow inputs</strong>. Values:</p>
    <ul>
        <li>var - This value can be changed, it is declared inside of a function or some other non-uniform control flow.</li>
        <li>let - This value cannot be changed, it is declared inside of a function or some other non-uniform control flow. Different from javascript let!</li>
        <li>const - This value cannot be changed, it is declared in uniform control flow.</li>
    </ul>
    <p>variableName - The name that you can use to reference the variable. <strong>Does not allow inputs</strong>.</p>
    <p>value - The initial value for this variable. <strong>Allows inputs.</strong></p>
    <p>type - The type of this variable. This accepts inputs(you can use the <a href="#createType">create type block</a>), but it also has a menu. Values:</p>
    <ul>
        <li>i32 - 32 bit integer.</li>
        <li>u32 - Unsigned 32 bit integer.</li>
        <li>f32 - 32 bit float.</li>
        <li>bool - Boolean value.</li>
        <li>auto - The type will be automatically determined, but the type still cannot be changed. For example, you can't give it an initial value of 3(an integer) with type auto, then try to set it to 3.14159.</li>
    </ul>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="bindShaderResource">
    Bind shader resource #[bindingNumber] to variable [variableName] with settings [usageSettings] type [type] :: {color1}
</pre>

<p>Binds a resource provided from the <a href="#bindType">bind type block</a> so it can be used in your shader.</p>

<h3>Inputs</h3>

<ul>
    <p>bindingNumber - The bindingNumber input of the corresponding <a href="#bindType">bind type block</a>. <strong>Does not allow inputs</strong></p>
    <p>variableName - The name that you can use to reference the binding. <strong>Does not allow inputs</strong></p>
    <p>usageSettings - How the variable will be used. Takes an input of <a href="#variableUsage">variable usage blocks</a> corresponding to the resourceUsage input of the <a href="#bufferUsage">resource's definition</a>.</p>
    <p>type - The variable's type. Accepts an input of <a href="#createType">create type blocks</a>.</p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="variableUsage">
    Variable usage (usage v) next [] :: reporter {color1}
</pre>

<p>A block that can be used to describe how a variable will be used.</p>

<h3>Inputs</h3>

<ul>
    <p>usage - The individual descriptor. <strong>Allows inputs.</strong> Values:</p>
    <ul>
        <p>These settings describe how you can access the variable:</p>
        <li>read - You can read from this variable</li>
        <li>write - You can write to this variable</li>
        <li>read_write - You can read and write. Not sure what the difference is between this and the above two.</li>

        <p>These settings describe when you can access the variable:</p>
        <li>function - You can only access it from the same function that it is declared? Not too sure.</li>
        <li>private - I assume you can only access this in the same scope it is declared, I have no idea.</li>
        <li>workgroup - The variable is accessible in across the workgroup, regardless of local invocation.</li>
        <li>uniform - This is used with the <a href="#uniformBufferUsage">uniform usage type in input buffers.</a></li>
        <li>storage - This is used with the <a href="#storageBufferUsage">storage usage type in input buffers.</a> </li>
    </ul>
</ul>


<Spacer space="50px" />
<pre class="blocks" id="varOp">
    Variable [varName] (operation v) [value] :: {color1}
</pre>

<p>This block lets you perform operations on variables.</p>

<h3>Inputs</h3>

<ul>
    <p>varName - The name of the variable. This also accepts inputs, so you could put the <a href="#getArray">In array get block</a> here and change a value in the array.</p>
    <p>operation - The operation to perform here. I'm not explainingall these, go look at <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators">this page</a>, it's basically the same. <strong>Does not allow inputs.</strong></p>
    <p>value - The value to use in the operation. <strong>Allows inputs.</strong></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="getVariable">
    Get variable [variableName] :: reporter {color1}
</pre>

<p>Get's the variable. There's not much to this.</p>

<h3>Inputs</h3>

<ul>
    <p>variableName - The variable name. <strong>Does not allow inputs.</strong></p>
</ul>


<Spacer space="50px" />
<pre class="blocks" id="getArray">
    In object [objectName] get index [index] :: reporter {color1}
</pre>

<p>Gets an index in an object, usually an array</p>

<h3>Inputs</h3>

<ul>
    <p>objectName - The name of an object variable, or an object input. <strong>Allows inputs.</strong></p>
    <p>index - The index you want to get from the object. <strong>Allows inputs.</strong></p>
    <p></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="getProperty">
    In object [objectName] get property [property] :: reporter {color1}
</pre>

<p>This allows you to get a value, or multiple values, from an object. An object, in this case, is a struct(not yet added) or vector. For vectors, you can add multiple properties to return another vector, which is called swizzling. For example you could get xzyx from vec3(1,2,3), which would return vec4(1,3,2,1).</p>

<h3>Inputs</h3>

<ul>
    <p>objectName - The name of the object, or an input object. <strong>Allows inputs.</strong></p>
    <p>property - The property, or properties, to get from the object. <strong>Does not allow inputs.</strong></p>
    <p></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="constructType">
    Construct type (type v) with values [values] :: reporter {color1}
</pre>

<p>Allows you turn to a type into a value.</p>

<h3>Inputs</h3>

<ul>
    <p>type - Accepts an input of a <a href="#createType">create type block</a>, or you can use the menu for whatever reason. </p>
    <p>values - You can use the <a href="#functionArgInput">function arg input block</a> here, or just enter comma seperated inputs.</p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="createType">
    Create type (type v) of [subtype] length\(array only!\) [length] :: reporter {color1}
</pre>

<p>Creates a type of the subtype. For example, with a type input of vec3 and a subtype input of a <a href="#baseType">base type block</a> with an input of bool, it would make a vec3 of boolean values.</p>

<h3>Inputs</h3>

<ul>
    <p>type - The type to create. <strong>Does not allow inputs</strong>. Values:</p>
    <ul>
        <li>vec2 - 2 values, accesible with xy/rg via the <a href="#getProperty">get property block</a>.</li>
        <li>vec3 - 3 values, accesible with xyz/rgb via the <a href="#getProperty">get property block</a>.</li>
        <li>vec4 - 4 values, accesible with xyzw/rgba via the <a href="#getProperty">get property block</a>.</li>
        <li>array - A list of length values, accesible via the <a href="#getArray">get array block</a>.</li>
    </ul>
    <p>subtype - What the type will be made out of. Accepts inputs, you can use the <a href="#baseType">base type block</a>, the text input, or another one of this block.</p>
    <p>length - Array only. How long the array will be. <strong>Allows inputs</strong>(but the length must be constant).</p>
</ul>

<Spacer space="50px" />
<pre class="blocks">
    Matrix type with [columns] columns and [rows] rows :: reporter {color1}
</pre>

<p>Creates a matrix type with the specified dimensions. If you don't know what a matrix is, idk google it or something man, how did you get this far in the first place</p>

<h3>Inputs</h3>

<ul>
    <p>columns - The number of columns in the matrix, must be at least 2 and no more than 4</p>
    <p>rows - The number of rows in the matrix, must be at least 2 and no more than 4</p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="baseType">
    Base type (type v) :: reporter {color1}
</pre>

<p>Returns a base type that can be used in the <a href="#createType">create type block</a>, <a href="#constructType">construct type block</a>, or whatever else accepts a type input.</p>

<h3>Inputs</h3>

<ul>
    <p>type - The type. Just returns the type. <strong>Does not allow inputs.</strong> Values:</p>
    <ul>
        <li>i32 - 32 bit integer.</li>
        <li>u32 - Unsigned 32 bit integer.</li>
        <li>f32 - 32 bit float.</li>
        <li>bool - Boolean value.</li>
    </ul>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="builtinFunc">
    WGSL builtin (funcName v) with args [args] :: reporter {color1}
</pre>

<p>WGSL has a lot of builtin functions for vectors and other things. You can use them with this block.</p>

<h3>Inputs</h3>

<ul>
    <p>funcName - The function name. <strong>Does not allow inputs.</strong> Almost all of the functions <a href="https://webgpufundamentals.org/webgpu/lessons/webgpu-wgsl-function-reference.html">here</a> are implemented, but some of the atomic, texture, and other misc functions aren't because they're not applicable/idk what they do</p>
    <p>args - The arguments for the function. You can either use the text and enter comma seperated inputs or use <a href="#functionArgInput">function arg input blocks</a>.</p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="functionArgInput">
    Function arg input [input], next [] :: reporter {color1}
</pre>

<p>Allows you to provide inputs to functions, or the <a href="#constructType">construct type block</a>.</p>

<h3>Inputs</h3>

<ul>
    <p>input - The value for that input. <strong>Allows inputs.</strong></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="computeShader">
    Compute shader with workgroup size [dimensions] {oc}
        
    {cc} :: {color1}
</pre>

<p>This is the important part of your shader which will run when you use the <a href="#runShader">run shader block</a>. It will cause an error if you don't have one of these in your shader. </p>



<h3>Inputs</h3>

<ul>
    <p>dimensions - An array with a maximum of 3 values. This is how many local threads in your workgroup(this is kinda complicated, look at <a href="https://webgpufundamentals.org/webgpu/lessons/webgpu-compute-shaders.html#a-local-invocation-id">this diagram</a> from webgpu fundamentals for more info) are dispatched on each axis, allowing you to run large computations quickly and at the same time. There are some limits on this though:</p>
    <ul>
        <li>Cannot exceed 256 total</li>
        <li>256 on the x axis max</li>
        <li>256 on the y axis max</li>
        <li>64 on the z axis max</li>
    </ul>
    <p>You should try to use 64 unless you want to for some other reason. idk, look at <a href="https://webgpufundamentals.org/webgpu/lessons/webgpu-compute-shaders.html#workgroup-size">this page</a>. Oh also, <strong>Does not allow inputs.</strong></p>
</ul>

<p>You are provided with some information about when the compute shader is run. These cannot be accessed outside of your compute shader.:</p>

<ul>
    <p>local_invocation_id(vec3 of u32) - The position in the local threads of the running of your compute shader.</p>
    <p>workgroup_id(vec3 of u32) - The postion in the workgroups dimensions(defined in the x, y, and z inputs of the <a href="#runShader">run shader block</a>) of the running of your compute shader.</p>
    <p>global_invocation_id(vec3 of u32) - A unique id for each thread, basically <code>workgroup_id * workgroup_size + local_invocation_id</code>.</p>
    <p>num_workgroups(vec3 of u32) - What was used in the <a href="#runShader">run shader block</a> for the dimensions as a vec3.</p>
    <p>local_invocation_index(u32) - idk man just go read the beginning of <a href="https://webgpufundamentals.org/webgpu/lessons/webgpu-compute-shaders.html">webgpu fundamentals compute shaders</a>, i'm basically just repeating that anyways.</p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="forLoop">
    for [varName] in range [start], [end] {oc}

    {cc} :: {color1}
</pre>

<p>Just a for loop, nothing special.</p>

<h3>Inputs</h3>

<ul>
    <p>varName - The name of the variable to create(this will be an i32!) and increment. <strong>Does not allow inputs.</strong></p>
    <p>start - The starting value for the variable. <strong>Allows inputs.</strong></p>
    <p>end - The loop stops if the variable is more than this number after running the code in the c. <strong>Allows inputs.</strong></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="while">
    While [condition] {oc}

    {cc} :: {color1}
</pre>

<p>This is a while loop. You might be thinking, "derpygamer2142, why didn't you just do the repeat until block with a not statement 🤓🤓🤓", well it's because you can't use boolean variables in that(without the addon shut up) and stuff.</p>

<h3>Inputs</h3>

<ul>
    <p>condition - The condition to check. If it's false, the loop stops. <strong>Allows inputs.</strong></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="break">
    break :: cap {color1}
</pre>

<p>Just a break block. It exits out of any loop.</p>

<Spacer space="50px" />
<pre class="blocks" id="continue">
    continue :: cap {color1}
</pre>

<p>Continues to the next iteration of a while or for loop. tbh i'm not sure if you can even use this, i don't know what the fuck "continuing" is or transferring control means. the documentation is cringe.</p>

<Spacer space="50px" />
<pre class="blocks" id="defFunc">
    Def function [funcName] that returns type (type v) with args [args] {oc}

    {cc} :: {color1}
</pre>

<p>Defines a function that can be used later in your shader. No recursion allowed!</p>

<h3>Inputs</h3>

<ul>
    <p>funcName - The name that you can use to reference the function. <strong>Does not allow inputs.</strong></p>
    <p>type - The return type, menu is all base types and void. Void means it doesn't return anything. <strong>Allows inputs.</strong></p>
    <p>args - The arguments that the function uses. Accepts an input of <a href="#defArg">def arg blocks</a>.</p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="defFuncArg">
    Def arg [argName]: (type v), next [] :: reporter {color1}
</pre>

<p>Defines an argument for your function.</p>

<h3>Inputs</h3>

<ul>
    <p>argName - The argument's name. <strong>Does not allow inputs.</strong></p>
    <p>type - The argument's type, when your function is run the corresponding input must be this type. <strong>Allows inputs.</strong></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="funcArg">
    Get function arg [argName] :: reporter {color1}
</pre>

<p>Basically the get variable block but with function arguments.</p>

<h3>Inputs</h3>

<ul>
    <p>argName - The name of the argument to get. <strong>Does not allow inputs.</strong></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="return">
    Return [value] :: cap {color1}
</pre>

<p>Makes the function return the value.</p>

<h3>Inputs</h3>

<ul>
    <p>value - The value to return. If left blank will not return anything. <strong>Allows inputs.</strong></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="runFunction">
    Run function [funcName] with args [args] :: {color1}
    Run function [funcName] with args [args] :: reporter {color1}
</pre>

<p>Runs the function specified. There's two of them because you probably want to use the value it returns.</p>

<h3>Inputs</h3>

<ul>
    <p>funcName - The name of the function to run. <strong>Does not allow inputs.</strong></p>
    <p>args - The arguments to pass to the function. Accepts an input of <a href="#functionArgInput">function arg input blocks</a>, or comma seperated values in the text input.</p>
</ul>

<Spacer space="50px" />
<pre class="blocks">
    Arbitrary WGSL [code] :: {color1}
    Arbitrary WGSL [code] :: reporter {color1}
</pre>

<p>This block allows you to add arbitrary WGSL to your shaders. If you feel like doing this, check the <a href="/docs/gpusb3/resources">resources page</a>.</p>

<h3>Inputs</h3>

<ul>
    <p>code - The code to add to your shader. This doesn't do semicolons for you.</p>
</ul>

<Spacer space="50px" />
<h2>Supported non-gpu.sb3 blocks</h2>

<Spacer space="50px" />
<pre class="blocks">
    if &lt; &gt; {oc}

    {cc} :: control

    if &lt; &gt; {oc}

    {cc} else {oc}

    {cc} :: control
</pre>

<p>If, if-else.</p>

<Spacer space="50px" />
<pre class="blocks">
    () + () :: math
    () - () :: math
    () * () :: math
    () / () :: math
</pre>
<p>These two input math blocks</p>

<Spacer space="50px" />
<pre class="blocks">
    () &gt; () :: math
    &lt; () &lt; () &gt;
    () = () :: math
</pre>
<p>Comparison blocks</p>

<Spacer space="50px" />
<pre class="blocks">
    &lt; &gt; and &lt &gt; :: math
    &lt; &gt; or &lt &gt; :: math
    not &lt &gt; :: math
</pre>
<p>Boolean operators</p>

<Spacer space="50px" />
<pre class="blocks">
    () mod ()
    [abs v] of ()
</pre>
<p>Mod, operator blocks.</p>

<Spacer space="100px" />
<p>Wow, that's a lot of blocks.</p>
<h2>If you see something incorrect, missing, or you have any questions DM derpygamer2142 on discord.</h2>