import { getAndVerifyToken, hasRoles } from "$utils/auth-server-utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load : PageServerLoad = (async ({ cookies }) => {
    const token = await getAndVerifyToken(cookies);
    const hasPermission = await hasRoles(token, ["Publisher", "Administrator"]);
    if (!hasPermission) {
        throw error(403, "You do not have permission to access this page.");
    }
    return {
        token
    };
}) satisfies PageServerLoad;