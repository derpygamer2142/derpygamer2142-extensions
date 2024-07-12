<script>
    import { assets } from "$lib/assets/images/assetList.js"
    export let imgsrc = "SoupCat"
    export let name = "Soup cat"
    export let description = "This is placeholder test because you didn't define a description. You should probably do that."
    export let file = "Rickroll"
    const img = assets[imgsrc]

    function download(e) {
        const a = document.createElement("a")
        a.href = assets[file]
        a.download = name
        a.target = "_blank"
        a.click()
    }
</script>

<button on:click={download}>
    <img src={img} alt={imgsrc}>
    <p>{name}</p>
    <p id="desc">{description}</p>
</button>



<style>
    button {
        width: fit-content;
        height: fit-content;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        font-size: 25px;
        border-radius: 10px;
        margin-bottom: 15px;
    }
    img {
        width: 15vw;
        height: 8vw;
        border-radius: 3px;
    }
    p {
        margin: 0;
        max-width: 15vw;
        color: var(--font-color)
    }
    #desc {
        font-size: 15px !important;
    }
</style>