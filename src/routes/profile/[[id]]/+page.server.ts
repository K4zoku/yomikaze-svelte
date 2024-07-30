import type Profile from "$models/Profile";
import { getAndVerifyToken } from "$utils/auth-server-utils";
import { getProfile } from "$utils/profile-utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load : PageServerLoad = (async ({ cookies, params }) => {
    let profile: Profile;
    const token = await getAndVerifyToken(cookies).catch(() => null);
    if (params.id) {
        profile = await getProfile({ id: params.id });
    } else {
        if (!token) {
            throw error(401, "You must be logged in to view your profile");
        }
        profile = await getProfile({ token });
    }
    
    return {
        token,
        profile
    };
}) satisfies PageServerLoad;