import { invalidateAll } from "$app/navigation";
import { logout } from "$utils/auth-utils";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load : PageServerLoad = (async ({ cookies }) => {
    logout(cookies);
    invalidateAll();
    throw redirect(302, '/');
}) satisfies PageServerLoad;