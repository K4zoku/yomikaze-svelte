import { getToken, hasRoles } from "$utils/auth-server-utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

const ALLOWED_ROLES = ['Super', 'Administrator', 'Publisher'];

export const load : PageServerLoad = (async ({ cookies }) => {
   const token: string | false = await getToken(cookies).catch(() => false);
   if (!token) {
      throw error(401, 'You are not logged in');
   }
   if (await hasRoles(token, ALLOWED_ROLES)) {
      throw error(403, 'Forbidden');
   }
   return {};
}) satisfies PageServerLoad;