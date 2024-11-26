<script>
    import { page } from "$app/stores"

    export let project = "DoublingDemo"
    export let title = "Doubling shader(gpu.sb3)"
    console.log($page.url.origin+"/"+project)
</script>

<div>
    <iframe src={"https://turbowarp.org/embed?autoplay&project_url="+encodeURI($page.url.origin+"/"+project)} title={project}></iframe>
    <h3>{title}</h3>
</div>




<style>
    iframe {
        width: 30vw;
        height: calc(30vw / (4/3));
    }
</style>