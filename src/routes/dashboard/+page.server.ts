import { getAndVerifyToken, hasRoles } from "$utils/auth-server-utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

const ALLOWED_ROLES = ['Super', 'Administrator', 'Publisher'];

export const load : PageServerLoad = (async ({ cookies }) => {
   const token: string = await getAndVerifyToken(cookies);
   if (!await hasRoles(token, ALLOWED_ROLES)) {
      throw error(403, 'You do not have permission to access this page');
   } 
   return {
      token,
   };
}) satisfies PageServerLoad;