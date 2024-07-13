<script>
    import { assets } from "$lib/assets/images/assetList.js"
    import { onMount } from "svelte"
    export let imgsrc = "SoupCat"
    export let name = "Soup cat"
    export let description = "This is placeholder test because you didn't define a description. You should probably do that."
    export let file = "https://rickroll.it/rickroll.mp4"
    const img = assets[imgsrc]

    // https://plainenglish.io/blog/how-to-download-a-file-using-javascript-fec4685c0a22

    let client = false;
    onMount(() => {
        client = true
    })
    function download(e) {
        console.log(file)
        fetch(file/*, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' }*/)
        .then(res => res.blob())
        .then(res => {
            const a = document.createElement("a")
            const href = URL.createObjectURL(res);
            a.href = href
            a.download = name
            a.target = "_blank"
            if (client) {
                a.click();
            }
            
            URL.revokeObjectURL(href);
        });

        // const a = document.createElement("a")
        // a.href = file
        // a.download = name
        // a.target = "_blank"
        // a.click()
    }
</script>

<button on:click={download}>
    <img src={img} alt={imgsrc}>
    <p class="notdoc">{name}</p>
    <p id="desc" class="notdoc">{description}</p>
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