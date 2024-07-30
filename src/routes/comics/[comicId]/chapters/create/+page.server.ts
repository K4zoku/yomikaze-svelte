import { getAndVerifyToken } from "$utils/auth-server-utils";
import type { PageServerLoad } from "./$types";

export const load : PageServerLoad = (async ({ cookies,params }) => {
    const token = await getAndVerifyToken(cookies);
    const comicId = params.comicId;
    return {
        token,
        comicId
    };
}) satisfies PageServerLoad;