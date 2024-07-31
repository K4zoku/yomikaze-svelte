import { getChapters, getComic, normalizeComic } from '$utils/comic-utils.js';
import { LibraryManagement } from '$utils/library-utils.js';
import { getTagCategories } from '$utils/tag-utils';
import { error } from '@sveltejs/kit';
 
export const ssr = false;

export async function load({ data }) {
    const comic = await getComic(data.comicId, data.token)
    .then(normalizeComic)
    .catch(e => { throw error(e.response.status, e.response.statusText); });
    const chapters = await getChapters(data.comicId, data.token);
    // const comments = getComments(data.comicId);
    const tagCategories = await getTagCategories().catch(() => []);
    let resutls = {...data, comic, chapters, tagCategories};
    if (data.token) {
        const libraryManager = new LibraryManagement(data.token);
        const libraryEntry = libraryManager.getEntry(data.comicId).catch(() => null);
        return {
            ...resutls,
            libraryManager,
            libraryEntry
        }
    }
    return {
        ...resutls,
        libraryManager: null
    }
}