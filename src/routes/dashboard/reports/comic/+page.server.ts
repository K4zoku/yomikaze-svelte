import { getAndVerifyToken } from "$utils/auth-server-utils";
import type { PageServerLoad } from "./$types";

export const load : PageServerLoad = (async ({ cookies }) => {
    const token = await getAndVerifyToken(cookies);
    
    return {
        token
    };
}) satisfies PageServerLoad;