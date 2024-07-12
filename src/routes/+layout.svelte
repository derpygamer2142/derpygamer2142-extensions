<!--
layout.svelte and styles.css are from a different project of mine which is under the mit license
i just like the look, didn't want to redo it

deploy: npm run build
wrangler pages deploy .svelte-kit/cloudflare --branch=master
-->
<script>
	import './styles.css';
	import Navbar from '$lib/Navbar.svelte';
</script>


<div class="app">
    <Navbar/>
    <main>
        <slot/>
    </main>
</div>


<style>
    :global(html, body) {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        text-align: center;
    }
    .app {
        --bg-color: rgb(37, 37, 37);
        --font-color: rgb(230, 230, 230);
        --accent-light: rgb(66, 66, 66);
        --accent-hover: rgb(53, 53, 53);
        --accent-dark: rgb(31, 31, 31);
        --redirect-color: rgb(29, 93, 233);

        background-color: var(--bg-color);
        color: var(--font-color);

        min-height: 100vh;
        height: fit-content;
        width: 100vw;
        margin: 0 auto;
        overflow: hidden;
        
    }
    
</style>