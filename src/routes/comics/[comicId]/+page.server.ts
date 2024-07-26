import { getAndVerifyToken } from "$utils/auth-server-utils.js";
import { getComic } from "$utils/comic-utils.js";
import { error } from '@sveltejs/kit';

export async function load  ({ params, cookies }) {
    const token = await getAndVerifyToken(cookies).catch(() => undefined);
    const comicId = params.comicId;
    const comic = await getComic(comicId, token)
        .catch(e => { throw error(e.response.status, e.response.statusText); });
    return {
        comicId,
        comic
    }
}