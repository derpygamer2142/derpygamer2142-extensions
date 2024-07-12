<script>
    import { assets } from "$lib/assets/images/assetList.js"
    import { goto } from "$app/navigation"
    export let imgsrc = "SoupCat"
    export let name = "Soup cat"
    export let description = "This is placeholder test because you didn't define a description. You should probably do that."
    export let link = "/docs/404"
    const img = assets[imgsrc]

    function go(e) {
        goto(link)
    }
</script>

<button on:click={go}>
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