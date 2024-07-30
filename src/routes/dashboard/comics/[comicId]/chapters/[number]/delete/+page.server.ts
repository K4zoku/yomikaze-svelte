import { getAndVerifyToken } from "$utils/auth-server-utils";
import type { PageServerLoad } from "./$types";
import { getComic, normalizeComic } from '$utils/comic-utils.js';
import { error } from '@sveltejs/kit';

export const load : PageServerLoad = (async ({ cookies,params }) => {
    const token = await getAndVerifyToken(cookies);
    const comicId = params.comicId;
    const comic = getComic(params.comicId, token)
    .then(normalizeComic)
    .catch(e => { throw error(e.response.status, e.response.statusText); });
    return {
        token,
        comicId,
        comic
    };
}) satisfies PageServerLoad;