import { getAndVerifyToken } from "$utils/auth-server-utils.js";

export async function load  ({ params, cookies }) {
    const token = await getAndVerifyToken(cookies).catch(() => undefined);
    const comicId = params.comicId;
    return {
        token,
        comicId,
    }
}