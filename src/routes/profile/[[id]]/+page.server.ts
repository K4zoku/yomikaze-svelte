import type Profile from "$models/Profile";
import { getAndVerifyToken } from "$utils/auth-server-utils";
import { getProfile } from "$utils/profile-utils";
import type { PageServerLoad } from "./$types";

export const load : PageServerLoad = (async ({ cookies, params }) => {
    let profile: Profile;
    if (params.id) {
        profile = await getProfile({ id: params.id });
    } else {
        const token = await getAndVerifyToken(cookies);
        profile = await getProfile({ token });
    }
    
    return {
        profile
    };
}) satisfies PageServerLoad;