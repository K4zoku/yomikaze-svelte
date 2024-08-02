import { getAndVerifyToken, hasRoles } from "$utils/auth-server-utils";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import type Tag from "$models/Tag";
import http from "$utils/http";
import { groupByCategory } from "$utils/tag-utils";

export const load : PageServerLoad = (async ({ cookies }) => {
    const token = await getAndVerifyToken(cookies);
    const hasPermission = await hasRoles(token, ['Publisher', 'Administrator']);
    if (!hasPermission) {
        throw error(403, 'You do not have permission to access this page');
    }
    let tags: Tag[] = await http.get('/tags?size=1000').then(response => response.data?.results ?? []).catch(() => []);
    return {
        categorizedTags: groupByCategory(tags),
        token,
    };
}) satisfies PageServerLoad;