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

<p>This page contains a list of every block, its inputs, and what it does. You're probably thinking "wow, that probably took a while to write". Well here's the list:</p>


<pre class="blocks" id="defShader">
    Def shader [shaderName] with resources [resources] :: hat {color1}
</pre>

<p>This creates a new shader with the code underneath the hat, compiled when the <a href="#compileShaders">compile shaders</a> block is run.</p>

<h3>Inputs:</h3>

<ul>
    <p>shaderName - The name by which the shader is referenced, for example in the <a href="#runShader">run shader</a> block. <strong>Does not allow inputs.</strong></p>
    <p>resources - The resources that this shader will use. Takes in an input of <a href="#defShaderResource">def shader resource</a> blocks(or nothing), anything else will cause an error. These are accessible based on the binding defined by the <a href="#bindType">bind type block</a> using  the <a href="#bindShaderResource">bind shader resource</a> block.</p>
</ul>

<Spacer space="100px" />
<pre class="blocks" id="defShaderResource">
    Def shader resource [resourceName] type (resourceType v) usage [resourceUsage] settings [resourceSettings] usage type (resourceUsageType v) next [] :: reporter {color1}
</pre>

<p>This block defines a shader resource, used in the resources input of the <a href="#defShader">Def shader block</a>.</p>

<h3>Inputs</h3>

<ul>
    <p>resourceName - The name that you can reference the resource with. I don't think this is actually used anywhere? It might just be internally. <strong>Does not allow inputs.</strong></p>
    <p>resourceType - What type it is. Currently the only supported type is buffers, but textures may be added in the future. <strong>Does not allow inputs.</strong></p>
    <p>resourceUsage - Dictates how the resource will be used, such as if you can give it an input array("input" input in the <a href="#bindType">bind type block</a>), whether you can read from it, copy from it, etc. Takes in an input of <a href="#bufferUsage">buffer usage blocks</a>. <strong>Does not allow inputs.</strong></p>
    <p>resourceSettings - The settings for your resource. If your resource is a buffer, you need to include a size(in bytes. There are 4 bytes in a f32 array) or it will default to 256. <strong>Does not allow inputs</strong>(but it may in the future for convenience)</p>
    <p>resourceUsageType - How your resource will be used in your shader, if at all. <strong>Does not allow inputs</strong>. Options:</p>
    <ul>
        <li>read-only-storage - You can only read from it(I think, haven't tested and the documentation is kinda bad). Goes with the STORAGE option for <a href="#bufferUsage">buffer usage blocks</a>.</li>
        <li id="storageBufferUsage">storage - You can use this as storage? idk man figure it out. Goes with the STORAGE option for <a href="#bufferUsage">buffer usage blocks</a>.</li>
        <li id="uniformBufferUsage">uniform - This resource cannot be changed in your shader. Idk about externally, again untested and badly documented. Goes with the UNIFORM option for <a href="#bufferUsage">buffer usage blocks</a>.</li>
        <li>NONE - This resource will not be used in your shader, and only referenced externally.</li>
    </ul>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="bufferUsage">
    Buffer usage (usage v) next [] :: reporter {color1}
</pre >
    
<p>This block is used with the <a href="#defShaderResource">def shader resource block</a> to describe how a resource will be used.</p>

<h3>Inputs</h3>

<ul>
    <p>usage - An individual descriptor of how it will be used. <strong>Does not allow inputs</strong>. Items:</p>
    <ul>
        <p>These descriptors will dictate how your resource is used in your project.</p>
        <li>MAP_READ - Your resource can be read from using the <a href="#readBuffer">read buffer block</a>. The only other valid usage with this type is COPY_DST.</li>
        <li>MAP_WRITE - This pretty much does nothing in this extension right now, but more features may be added in the future. You should not use this, the only other valid usage with this type is COPY_SRC</li>
        <li id="copySrc">COPY_SRC - This can be the resource you are copying from using the copy data block. </li>
        <p><small>Note: this has no restrictions, only MAP_READ restricts the valid combinations! This goes for COPY_DST as well.</small></p>
        <li id="copyDst">COPY_DST - This can be the resource you are copying data to in the <a href="#copyData">copy data block</a>. You need this usage to be able to use an input array in the <a href="#bindType">bind type block</a>!</li>
        
        <Spacer space="25px" />
        <p id="resourceShaderUsage">These descriptors will dictate how your resource is used in your <i>shader</i>.</p>
    
        <li>UNIFORM - This is an input resource that will not and cannot be modified in your shader. Used with the uniform usage type.</li>
        <li>STORAGE - This resource can be used to store changing data. Used with the storage and read_only_storage usage types.</li>
    </ul>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="compileShaders">
    compile shaders :: {color1}
</pre>

<p>Compiles all of the shaders in your project. This can be pretty slow depending on the number and length of your shaders, so you should probably only run this whenever you update your shaders or the first time your project is run.</p>

<Spacer space="50px" />
<pre class="blocks" id="runShader">
    Run shader [shaderName] with resources [shaderResources] dimensions x: [dimX] y: [dimY] z: [dimZ] :: {color1}
</pre>

<p>This block will run whatever is in the <a href="#computeShader">compute function</a> of your shader.</p>

<h3>Inputs</h3>

<ul>
    <p>shaderName - The name of the shader to run. <strong>Allows inputs.</strong></p>
    <p>shaderResources - The resources to use when running the shader. Takes in an input of <a href="#bindType">bind type blocks</a>.</p>
    <p>dimX, dimY, dimZ - The number of workgroups to dispatch per axis. This gets passed to the compute shader as a vector, you can reference it with num_workgroups. Your compute shader is run once for each location in these dimensions. <strong>Allows inputs.</strong></p>
</ul>


<Spacer space="50px" />
<pre class="blocks" id="bindType">
    Bind type (resourceType v) to [bindingNumber] input [resourceInput] next [] :: reporter {color1}
</pre>

<p>This blocks will provide inputs and initialize the resources defined in the <a href="#defShaderResource">def shader resource blocks</a>.</p>

<h3>Inputs</h3>

<ul>
    <p>resourceType - The kind of resource to bind to the input. Currently only supports buffers. <strong>Does not allow inputs.</strong></p>
    <p>bindingNumber - The binding number which you use to reference the resource, for example in the <a href="#bindShaderResource">bind shader resource block</a>. <strong>Allows inputs.</strong></p>
    <p>resourceInput - If the resource has the <a href="#copyDst">COPY_DST usage</a> you can provide an input using one of the corresponding data input blocks. Currently only supports the <a href="#f32Array">F32 array block.</a></p>
    <p></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="f32Array">
    F32 array from array [array] :: reporter {color1}
</pre>

<p>Creates a typed array from the inputs provided. Returns a reference, not the array!</p>

<h3>Inputs</h3>

<ul>
    <p>array - An array of numbers. You can use the json extension as an input here.</p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="copyData">
    Copy [numBytes] bytes of data from buffer at binding [binding1] in shader [shader1] from position [pos1] to buffer at binding [binding2] in shader [shader2] at position [pos2] :: {color1}
</pre>

<p>Allows you to copy data from one buffer to another. The first buffer must have a usage of <a href="#copySrc">COPY_SRC</a>, the second buffer must have a usage of <a href="#copyDst">COPY_DST</a>.</p>

<h3>Inputs</h3>

<ul>
    <p>numBytes - The amount of bytes to copy from the first buffer to the second. Must be a multiple of 4. <strong>Allows inputs.</strong></p>
    <p>binding1 - The buffer's binding in shader1, defined in the bindingNumber input of the corresponding <a href="#bindType">bind type block</a>. <strong>Allows inputs.</strong></p>
    <p>shader1 - The shader that the first buffer is defined in. Corresponds to the shaderName input of the corresponding <a href="#defShader">def shader block</a>. <strong>Allows inputs.</strong></p>
    <p>pos1 - The index at which to start copying data. Must be a multiple of 4. <strong>Allows inputs.</strong></p>
    <p>binding2 - The buffer's binding in shader2, defined in the bindingNumber input of the corresponding <a href="#bindType">bind type block</a>. <strong>Allows inputs.</strong></p>
    <p>shader2 - The shader that the second buffer is defined in. Corresponds to the shaderName input of the corresponding <a href="#defShader">def shader block</a>. <strong>Allows inputs.</strong></p>
    <p>pos2 - The index at which to start pasting data. Must be a multiple of 4. <strong>Allows inputs.</strong></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="readBuffer">
    Read buffer at binding [binding] in shader [shaderName] :: {color1}
</pre>

<p>Writes the contents of the buffer to the <a href="#bufferReadOutput">buffer read output block</a>.</p>

<h3>Inputs</h3>

<ul>
    <p>binding - The buffer's binding in shaderName, defined in the bindingNumber input of the corresponding <a href="#bindType">bind type block</a>. <strong>Allows inputs.</strong></p>
    <p>shaderName - The shader that the buffer is defined in. Corresponds to the shaderName input of the corresponding <a href="#defShader">def shader block</a>. <strong>Allows inputs.</strong></p>
</ul>

<Spacer space="50px" />
<pre class="blocks" id="bufferReadOutput">
    Buffer read output :: reporter {color1}
</pre>

<p>Returns the output from the <a href="#readBuffer">read buffer block</a>. <strong>May be changed to one block at some point.</strong></p>

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
    <p>usage - The individual descriptor. <strong>Does not allow inputs.</strong> Values:</p>
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
    In array [arrayName] get [index] :: reporter {color1}
</pre>

<p>Gets an index in an array</p>

<h3>Inputs</h3>

<ul>
    <p>arrayName - The name of an array variable, or an array input. <strong>Allows inputs.</strong></p>
    <p>index - The index you want to get from the array. <strong>Allows inputs.</strong></p>
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

<Spacer space="100px" />
<p>Wow, that's a lot of blocks.</p>
<h2>If you see something incorrect, missing, or you have any questions DM derpygamer2142 on discord.</h2>