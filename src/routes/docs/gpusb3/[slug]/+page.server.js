import { error } from "@sveltejs/kit"
import { pages } from "../pages.js"

// async function get(u, fetch) {
//     const a = await fetch(`/docs/gpusb3/${u}.svelte`)
//     if (!a.ok) throw error(a.status)
//     const r = await a.text()
//     console.log(r)
//     return r
// }
export async function load({ fetch, params }) {
    if (!pages.includes(params.slug)) throw error(404)
    return {
        data: params.slug
    }//await get(params.slug, fetch)
}