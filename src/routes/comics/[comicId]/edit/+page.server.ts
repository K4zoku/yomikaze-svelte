import { getAndVerifyToken, getUserId, hasRoles } from "$utils/auth-server-utils";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import type Tag from "$models/Tag";
import http from "$utils/http";
import { groupByCategory } from "$utils/tag-utils";

export const load : PageServerLoad = (async ({ cookies, params }) => {
    const token = await getAndVerifyToken(cookies);
    let hasPermission = await hasRoles(token, ['Publisher', 'Administrator']);
    if (!hasPermission) {
        throw error(403, 'You do not have permission to access this page');
    }
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
    const tags: Tag[] = await http.get('/tags?size=1000').then(response => response.data?.results ?? []).catch(() => []);
    const tagsMap = new Map(tags.map(tag => [tag.id, tag]));
    const comicId = params.comicId;
    const comic = await http.get(`/comics/${comicId}`).then(response => response.data).catch(() => {
        throw error(404, 'Comic not found');
    });
    const uid = await getUserId(token);
    if (comic.publisher.id !== uid && !await hasRoles(token, ['Administrator'])) {
        throw error(403, 'You are not the publisher of this comic');
    }
    const chapters = await http.get(`/comics/${comicId}/chapters`).then(response => response.data).catch(() => []);

    return {
        comicId,
        comic,
        chapters,
        tagsMap,
        categorizedTags: groupByCategory(tags),
        token,
    };
}) satisfies PageServerLoad;