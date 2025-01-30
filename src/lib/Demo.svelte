<script>
    import { page } from "$app/stores"

    export let project = "DoublingDemo"
    export let title = "Doubling shader(gpu.sb3)"
    console.log($page.url.origin+"/"+project)
</script>

<div>
    <iframe src={"https://turbowarp.org/embed?autoplay&project_url="+encodeURI($page.url.origin+"/"+project)} title={project}></iframe>
    <h3>{title}</h3>
    <button on:click="{() => {window.open($page.url.origin+"/"+project, "_blank")}}">Download</button>
</div>




<style>
    iframe {
        width: 30vw;
        height: calc(30vw / (4/5));
    }

    button {
        width: 10vw;
        height: 3vw;
        font-size: 90%;
    }
</style>