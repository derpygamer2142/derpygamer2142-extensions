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

        scratchblocks.renderMatching('pre.msmallblocks', {
            style: "scratch3",
            scale: 0.6
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

<h3>This page is about advanced topics. If you haven't read <a href="/docs/gpusb3/basics">the basics</a> this won't make sense.</h3>

<h1>Unfinished page!</h1>
<p>This page is unfinished, it may contain inaccurate, wrong, or invalid information/code.</p>

<p>Topics covered here:</p>

<ul>
    <li>Atomics and thread safety stuff</li>
    <li>Textures(coming soon)</li>
</ul>

<h2>Atomics and thread safety</h2>

<p>An atomic is a variable that is shared across a workgroup, and when written to guarantees that multiple threads don't write to it at the same time, resulting in data loss. This is referred to as a <a href="https://en.wikipedia.org/wiki/Race_condition">race condition</a>. Atomics can either be a signed or unsigned 32 bit integer(i32 or u32). Here's what the block to construct them looks like:</p>

<pre class="blocks">
    Create atomic of type (type v) :: {color1}
</pre>

<p>The type input here is either i32 or u32. You can use this in the declare variable block like this:</p>

<pre class="blocks">
    Declare variable (Variable usage (workgroup v) next [] :: {color1}) variable as [sum] with value []: (Create atomic of type (i32 v) :: {color1}) :: {color1}
</pre>

<p>Let's go through each of these inputs one at a time. The first input where we put the variable usage block says that this variable will be shared across all threads in a workgroup. We named it sum, and we <strong>don't</strong> initialize it by putting nothing in the input. Then in the next input we say that the type is our i32 atomic. Let's make a simple shader that finds the sum of an array of inputs, and divides it by the thread id.</p>
<small>This is just some random shader I put together in 10 minutes to test atomics, it doesn't actually have any purpose.</small>

<p>Starting from the scratch code, we'll need 3 buffers: one for providing an input to the shader, one for the shader to write to, and a third to read the shader's output. This bind group layout looks like this:</p>

<pre class="blocks">
    Create bind group layout called [myBindGroupLayout] {oc}
        Add bind group layout entry with binding [0] for type (buffer v) and descriptor (Buffer layout entry descriptor with usage type (read-only-storage v) :: {color1}) :: {color1} 
        Add bind group layout entry with binding [1] for type (buffer v) and descriptor (Buffer layout entry descriptor with usage type (storage v) :: {color1}) :: {color1} 
    {cc} :: {color1}
</pre>

<p>The buffer at binding 0 will be our shader's input buffer, binding 1 will be the output buffer. Next we need to bind our buffers, which look like this:</p>

<pre class="blocks">
    Create buffer called [input] with size\(in bytes\) ([32] * [4]) and usage flags (Usage (Buffer usage (STORAGE v) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create buffer called [work] with size\(in bytes\) ([32] * [4]) and usage flags (Usage (Buffer usage (STORAGE v) :: {color1}) | (Buffer usage (COPY_SRC v) :: {color1}) :: {color1}) :: {color1}
    Create buffer called [output] with size\(in bytes\) ([32] * [4]) and usage flags (Usage (Buffer usage (MAP_READ v) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
</pre>

<p>Our input buffer can be read from via the STORAGE flag, and we can copy data to it using COPY_DST. The work buffer can be written to, and we can copy data from it using COPY_SRC. Finally the output buffer can be read from using MAP_READ, and we can copy data to it. Next we bind the buffers:</p>

<pre class="blocks">
    Create bind group called [myBindGroup] using layout [myBindGroupLayout] {oc}
        Add bind group entry with binding [0] of type (buffer v) using resource named [input] :: {color1}
        Add bind group entry with binding [1] of type (buffer v) using resource named [work] :: {color1}
    {cc} :: {color1}
</pre>


<p>Now we can work on our shader. We start by binding our resources:</p>

<pre class="blocks">
    Def shader [myShader] using bind group layout [myBindGroupLayout] :: hat {color1}
    Bind shader resource # [0] to variable [input] with settings (Variable usage (storage v) next (Variable usage (read v) :: {color1}) :: {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}) :: {color1}) :: {color1}
    Bind shader resource # [1] to variable [output] with settings (Variable usage (storage v) next (Variable usage (read_write v) :: {color1}) :: {color1}) type (Create type (array v) of (Base type (f32 v), length\(array only!\) [] :: {color1}) :: {color1}) :: {color1}
</pre>

<p>Now, atomic variables need to be declared in <strong>uniform</strong> control flow. This means it can't be inside of any functions, if statements or anything. We'll declare our i32 atomic, which we will use to store the sum of the values.</p>

<pre class="blocks">
    Def shader [myShader] using bind group layout [myBindGroupLayout] :: hat {color1}
    Bind shader resource # [0] to variable [input] with settings (Variable usage (storage v) next (Variable usage (read v) :: {color1}) :: {color1}) type (Create type (array v) of (Base type (f32 v), length\(array only!\) [] :: {color1}) :: {color1}) :: {color1}
    Bind shader resource # [1] to variable [output] with settings (Variable usage (storage v) next (Variable usage (read_write v) :: {color1}) :: {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: {color1}) :: {color1}
    Declare variable (Variable usage (workgroup v) next [] :: {color1}) variable as [sum] with value []: (Create atomic of type (i32 v) :: {color1}) :: {color1}
    Compute shader with workgroup size [\[1\]] {oc}

    {cc} :: {color1}
</pre>

<p>Now, we need to initialize our variable or it will lead to everything being undefined. We could just set it to 0 and go on with our day, but that would cause a race condition. We can fix this using barriers. A barrier is a function that will keep a thread from reading and writing to something until all other threads in the workgroup have reached that point. There's 2 types:</p>

<pre class="blocks">
    Barrier (storageBarrier v) :: {color1}

    Barrier (workgroupBarrier v) :: {color1}
</pre>

<ul>
    <p>storageBarrier - A storage barrier pauses threads from reading/writing to a storage buffer until all the threads haved reached the barrier, at which point they continue.</p>
    <p>workgroupBarrier - A workgroup barrier pauses threads from reading/writing to a workgroup variable until all the threads have reached the barrier, at which point they continue.</p>
</ul>

<p>That's cool and all, but first we need to go over how to use atomic variables. Atomics have built in functions to perform operations in a thread safe way. If you try to set the variable without using these functions, you're defeating the whole purpose of atomics.</p>

<pre class="blocks">
    Load atomic [atomic] :: reporter {color1}
    Perform operation (atomicOp v) on atomic [atomic] with value [value] :: {color1}
    Perform operation (atomicOp v) on atomic [atomic] with value [value] :: reporter {color1}
</pre>

<ul>
    <p>Load atomic:</p>
    <p>This block returns the value of the atomic specified.</p>
    <p>Perform operation:</p>
    <p>This performs the operation specified on the atomic using the value. For example, atomicStore sets the value of the atomic to the value. There's a lot of these and I'm lazy, so please read <a href="https://www.w3.org/TR/WGSL/#atomic-builtin-functions">the list of functions</a>.</p>
    <p>All of the atomic operations return the original value of the atomic before modification.</p>
</ul>

<p>Note: all of the "atomic" inputs take a pointer block! You will see a really long and complicated error otherwise.</p>

<pre class="blocks">
    Pointer to variable [] :: reporter {color1}
</pre>

<p>We'll set the value of the atomic to 0 and then have a workgroup barrier to wait until the variable has been initialized.</p>

<pre class="blocks">
    Def shader [myShader] using bind group layout [myBindGroupLayout] :: hat {color1}
    Bind shader resource # [0] to variable [input] with settings (Variable usage (storage v) next (Variable usage (read v) :: {color1}) :: {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: {color1}) :: {color1}
    Bind shader resource # [1] to variable [output] with settings (Variable usage (storage v) next (Variable usage (read_write v) :: {color1}) :: {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: {color1}) :: {color1}
    Declare variable (Variable usage (workgroup v) next [] :: {color1}) variable as [sum] with value []: (Create atomic of type (i32 v) :: {color1}) :: {color1}
    Compute shader with workgroup size [\[1\]] {oc}
        Perform operation (atomicStore v) on atomic (Pointer to variable [sum] :: {color1}) with value [0] :: {color1}
        Barrier (workgroupBarrier v) :: {color1}
    {cc} :: {color1}
</pre>

<p>Next we have each thread get their item from the input buffer, and add it to the sum. We'll need to cast it to an i32, and we can get the workgroup id using the (hidden) workgroup_id variable.</p>

<pre class="blocks">
    Def shader [myShader] using bind group layout [myBindGroupLayout] :: hat {color1}
    Bind shader resource # [0] to variable [input] with settings (Variable usage (storage v) next (Variable usage (read v) :: {color1}) :: {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: {color1}) :: {color1}
    Bind shader resource # [1] to variable [output] with settings (Variable usage (storage v) next (Variable usage (read_write v) :: {color1}) :: {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: {color1}) :: {color1}
    Declare variable (Variable usage (workgroup v) next [] :: {color1}) variable as [sum] with value []: (Create atomic of type (i32 v) :: {color1}) :: {color1}
    Compute shader with workgroup size [\[1\]] {oc}
        Perform operation (atomicStore v) on atomic (Pointer to variable [sum] :: {color1}) with value [0] :: {color1}
        Barrier (workgroupBarrier v) :: {color1}
        Perform operation (atomicAdd v) on atomic (Pointer to variable [sum] :: {color1}) with value (WGSL builtin (i32 v) with args (In object [input] get index (In object [workgroup_id] get property [x] :: {color1}) :: {color1}) :: {color1}) :: {color1}
    {cc} :: {color1}
</pre>

<p>After we've done that, we can add a storage barrier(I think a workgroup barrier would work here too because we're both reading from a buffer and writing to an atomic.) so we wait until the sum is finished, then set the respective item in the output buffer to the sum divided by the index(plus one so we don't get zero division issues). We'll need to cast everything to floats.</p>

<pre class="msmallblocks">
    Def shader [myShader] using bind group layout [myBindGroupLayout] :: hat {color1}
    Bind shader resource # [0] to variable [input] with settings (Variable usage (storage v) next (Variable usage (read v) :: {color1}) :: {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: {color1}) :: {color1}
    Bind shader resource # [1] to variable [output] with settings (Variable usage (storage v) next (Variable usage (read_write v) :: {color1}) :: {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: {color1}) :: {color1}
    Declare variable (Variable usage (workgroup v) next [] :: {color1}) variable as [sum] with value []: (Create atomic of type (i32 v) :: {color1}) :: {color1}
    Compute shader with workgroup size [\[1\]] {oc}
        Perform operation (atomicStore v) on atomic (Pointer to variable [sum] :: {color1}) with value [0] :: {color1}
        Barrier (workgroupBarrier v) :: {color1}
        Perform operation (atomicAdd v) on atomic (Pointer to variable [sum] :: {color1}) with value (WGSL builtin (i32 v) with args (In object [input] get index (In object [workgroup_id] get property [x] :: {color1}) :: {color1}) :: {color1}) :: {color1}
        Barrier (storageBarrier v) :: {color1}
        Variable (In object [output] get index (In object [workgroup_id] get property [x] :: {color1}) :: {color1}) (= v) (  (WGSL builtin (f32 v) with args (Load atomic (Pointer to variable [sum] :: {color1}) :: {color1}) :: {color1}) / (( WGSL builtin (f32 v) with args (In object [workgroup_id] get property [x] :: {color1}) :: {color1}) + [1.0])  ) :: {color1}
    {cc} :: {color1}
</pre>

<p>That's our shader finished. Now we need to finish the data management side, which isn't too complicated. Right now we have:</p>

<pre class="blocks">
    Create buffer called [input] with size\(in bytes\) ([32] * [4]) and usage flags (Usage (Buffer usage (STORAGE v) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create buffer called [work] with size\(in bytes\) ([32] * [4]) and usage flags (Usage (Buffer usage (STORAGE v) :: {color1}) | (Buffer usage (COPY_SRC v) :: {color1}) :: {color1}) :: {color1}
    Create buffer called [output] with size\(in bytes\) ([32] * [4]) and usage flags (Usage (Buffer usage (MAP_READ v) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create bind group layout called [myBindGroupLayout] {oc}
        Add bind group layout entry with binding [0] for type (buffer v) and descriptor (Buffer layout entry descriptor with usage type (read-only-storage v) :: {color1}) :: {color1} 
        Add bind group layout entry with binding [1] for type (buffer v) and descriptor (Buffer layout entry descriptor with usage type (storage v) :: {color1}) :: {color1} 
    {cc} :: {color1}
    Create bind group called [myBindGroup] using layout [myBindGroupLayout] {oc}
        Add bind group entry with binding [0] of type (buffer v) using resource named [input] :: {color1}
        Add bind group entry with binding [1] of type (buffer v) using resource named [work] :: {color1}
    {cc} :: {color1}
</pre>

<p>Our data is going to be an array of random numbers, which we can make using the turbowarp JSON extension:</p>
<small>I highly recommend using a different extension, this one is really slow because it parses/stringifies the object in every block!</small>

<pre class="blocks">
    set [input data v] to [\[\]]
    repeat [32] {oc}
        set [input data v] to (add (pick random [-15] to [15]) to array (input data) :: #3271D0)
    {cc} :: control
</pre>

<p>Next we can create an arraybuffer and view from this data and copy it to our input buffer:</p>

<pre class="blocks">
    set [input data v] to [\[\]]
    repeat [32] {oc}
        set [input data v] to (add (pick random [-15] to [15]) to array (input data) :: #3271D0)
    {cc} :: control
    Create arraybuffer and view called [data] from array (input data) of type (Float32Array v) :: {color1}
    Write [32] elements of data from arraybuffer [data] to buffer [input] from offset [0] to offset [0] :: {color1}
</pre>

<p>We can add that to our code, along with compiling and running the shader:</p>

<pre class="blocks">
    Create buffer called [input] with size\(in bytes\) ([32] * [4]) and usage flags (Usage (Buffer usage (STORAGE v) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create buffer called [work] with size\(in bytes\) ([32] * [4]) and usage flags (Usage (Buffer usage (STORAGE v) :: {color1}) | (Buffer usage (COPY_SRC v) :: {color1}) :: {color1}) :: {color1}
    Create buffer called [output] with size\(in bytes\) ([32] * [4]) and usage flags (Usage (Buffer usage (MAP_READ v) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create bind group layout called [myBindGroupLayout] {oc}
        Add bind group layout entry with binding [0] for type (buffer v) and descriptor (Buffer layout entry descriptor with usage type (read-only-storage v) :: {color1}) :: {color1} 
        Add bind group layout entry with binding [1] for type (buffer v) and descriptor (Buffer layout entry descriptor with usage type (storage v) :: {color1}) :: {color1} 
    {cc} :: {color1}
    Create bind group called [myBindGroup] using layout [myBindGroupLayout] {oc}
        Add bind group entry with binding [0] of type (buffer v) using resource named [input] :: {color1}
        Add bind group entry with binding [1] of type (buffer v) using resource named [work] :: {color1}
    {cc} :: {color1}
    set [input data v] to [\[\]]
    repeat [32] {oc}
        set [input data v] to (add (pick random [-15] to [15]) to array (input data) :: #3271D0)
    {cc} :: control
    Create arraybuffer and view called [data] from array (input data) of type (Float32Array v) :: {color1}
    Write [32] elements of data from arraybuffer [data] to buffer [input] from offset [0] to offset [0] :: {color1}
    compile shaders :: {color1}
    Run shader [myShader] using bind group [myBindGroup] dimensions x: [32] y: [1] z: [1] :: {color1}
</pre>
<small>You don't need to write the data to a buffer before binding it, hence why our number generation code is right before compiling and running the shader.</small>

<p>Finally we can do the same thing we did in the basic doubling shader where we copy data from the work buffer to the read buffer, and read that:</p>

<pre class="blocks">
    Copy ((32) * (4)) bytes of data from buffer [work] from position [0] to buffer [output] at position [0] :: {color1}
    Read buffer [output] to arraybuffer [outputArrayBuffer] :: {color1}
    View arraybuffer (outputArrayBuffer v) as (Float32Array v) called [outputView] :: {color1}
    set [out v] to (Get view [outputView] as array :: {color1})
</pre>

<p>That's everything finished! If you run this you should see a bunch of weird numbers, here's all the code put together:</p>

<pre class="msmallblocks">
    Def shader [myShader] using bind group layout [myBindGroupLayout] :: hat {color1}
    Bind shader resource # [0] to variable [input] with settings (Variable usage (storage v) next (Variable usage (read v) :: {color1}) :: {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: {color1}) :: {color1}
    Bind shader resource # [1] to variable [output] with settings (Variable usage (storage v) next (Variable usage (read_write v) :: {color1}) :: {color1}) type (Create type (array v) of (Base type (f32 v) :: {color1}), length\(array only!\) [] :: {color1}) :: {color1}
    Declare variable (Variable usage (workgroup v) next [] :: {color1}) variable as [sum] with value []: (Create atomic of type (i32 v) :: {color1}) :: {color1}
    Compute shader with workgroup size [\[1\]] {oc}
        Perform operation (atomicStore v) on atomic (Pointer to variable [sum] :: {color1}) with value [0] :: {color1}
        Barrier (workgroupBarrier v) :: {color1}
        Perform operation (atomicAdd v) on atomic (Pointer to variable [sum] :: {color1}) with value (WGSL builtin (i32 v) with args (In object [input] get index (In object [workgroup_id] get property [x] :: {color1}) :: {color1}) :: {color1}) :: {color1}
        Barrier (storageBarrier v) :: {color1}
        Variable (In object [output] get index (In object [workgroup_id] get property [x] :: {color1}) :: {color1}) (= v) (  (WGSL builtin (f32 v) with args (Load atomic (Pointer to variable [sum] :: {color1}) :: {color1}) :: {color1}) / (( WGSL builtin (f32 v) with args (In object [workgroup_id] get property [x] :: {color1}) :: {color1}) + [1.0])  ) :: {color1}
    {cc} :: {color1}

    when flag clicked
    Create buffer called [input] with size\(in bytes\) ([32] * [4]) and usage flags (Usage (Buffer usage (STORAGE v) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create buffer called [work] with size\(in bytes\) ([32] * [4]) and usage flags (Usage (Buffer usage (STORAGE v) :: {color1}) | (Buffer usage (COPY_SRC v) :: {color1}) :: {color1}) :: {color1}
    Create buffer called [output] with size\(in bytes\) ([32] * [4]) and usage flags (Usage (Buffer usage (MAP_READ v) :: {color1}) | (Buffer usage (COPY_DST v) :: {color1}) :: {color1}) :: {color1}
    Create bind group layout called [myBindGroupLayout] {oc}
        Add bind group layout entry with binding [0] for type (buffer v) and descriptor (Buffer layout entry descriptor with usage type (read-only-storage v) :: {color1}) :: {color1} 
        Add bind group layout entry with binding [1] for type (buffer v) and descriptor (Buffer layout entry descriptor with usage type (storage v) :: {color1}) :: {color1} 
    {cc} :: {color1}
    Create bind group called [myBindGroup] using layout [myBindGroupLayout] {oc}
        Add bind group entry with binding [0] of type (buffer v) using resource named [input] :: {color1}
        Add bind group entry with binding [1] of type (buffer v) using resource named [work] :: {color1}
    {cc} :: {color1}
    set [input data v] to [\[\]]
    repeat [32] {oc}
        set [input data v] to (add (pick random [-15] to [15]) to array (input data) :: #3271D0)
    {cc} :: control
    Create arraybuffer and view called [data] from array (input data) of type (Float32Array v) :: {color1}
    Write [32] elements of data from arraybuffer [data] to buffer [input] from offset [0] to offset [0] :: {color1}
    compile shaders :: {color1}
    Run shader [myShader] using bind group [myBindGroup] dimensions x: [32] y: [1] z: [1] :: {color1}
    Copy ((32) * (4)) bytes of data from buffer [work] from position [0] to buffer [output] at position [0] :: {color1}
    Read buffer [output] to arraybuffer [outputArrayBuffer] :: {color1}
    View arraybuffer (outputArrayBuffer v) as (Float32Array v) called [outputView] :: {color1}
    set [out v] to (Get view [outputView] as array :: {color1})
</pre>