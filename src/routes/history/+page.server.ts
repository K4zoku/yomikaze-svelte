import { getToken } from "$utils/auth-server-utils";
import type { PageServerLoad } from "./$types";

export const load : PageServerLoad = (async ({ cookies }) => {
    const token = await getToken(cookies);
    
    return {
        token
    };
}) satisfies PageServerLoad;