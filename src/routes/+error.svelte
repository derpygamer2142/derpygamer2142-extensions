<script>
    import { page } from '$app/stores';
    import SoupCat from "$lib/assets/images/soup-cat.gif"
</script>

<main>
    <h1>{$page.status} {$page.error.message}</h1>

    <img src={"https://http.cat/" + page.status} alt="HTTP cat" width=500 height=500>
    <!-- <h3>Enjoy this gif of a cat eating soup as an apology:</h3>

    <img src={SoupCat} alt="I apologize deeply for you not being able to see this gif. It is a wonderful gif, and changed my life." width=500 height=500> -->
</main>


<style>
main {
    text-align: center 
}
</style>