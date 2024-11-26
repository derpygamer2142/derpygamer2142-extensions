<script>
    import { assets } from "$lib/assets/images/assetList.js"

    export let project = "DoublingDemo"
</script>

<iframe src={"https://turbowarp.org/embed?project_url="+encodeURI("/"+project)} title={project}></iframe>

<style>
    iframe {
        width: 15vw;
    }
</style>