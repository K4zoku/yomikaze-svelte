import type {PageServerLoad, RouteParams} from "./$types";

export async function load  ({ params }) {
    const comicId = params.comicId;
    return {
        comicId
    }
}