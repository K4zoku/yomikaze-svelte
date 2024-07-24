import { logout } from "$utils/auth-utils";
import type { PageServerLoad } from "./$types";

export const load : PageServerLoad = (async ({ cookies }) => {
    logout(cookies);
    return {

    };
}) satisfies PageServerLoad;