import type LibraryCategory from '$models/LibraryCategory';
import type LibraryEntry from '$models/LibraryEntry';
import type LibraryEntrySearch from '$models/LibraryEntrySearch';
import { LibraryEntrySearchOrderBy } from '$models/LibraryEntrySearch';
import type PagedResult from '$models/PagedResult';
import { getAndVerifyToken } from '$utils/auth-server-utils';
import { LibraryManagement } from '$utils/library-utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ cookies, url }) => {
    const token = await getAndVerifyToken(cookies);
    let tab = url.searchParams.get('tab') ?? 'all';
    const page = url.searchParams.get('page');
    if (page && isNaN(parseInt(page))) {
        throw error(400, 'Invalid page number');
    }
    const size = 28;
    const name = url.searchParams.get('search');
    const orderBy = url.searchParams.get('orderBy');
    if (orderBy && !Object.keys(LibraryEntrySearchOrderBy).includes(orderBy)) {
        throw error(400, 'Invalid orderBy parameter');
    }
    const search: LibraryEntrySearch = {
        name,
        orderBy: orderBy as LibraryEntrySearchOrderBy,
        page: page ? parseInt(page) : 1,
        size,
    }

    const libraryManagement = new LibraryManagement(token);
    // Get all categories
    const categories: LibraryCategory[] =
        await libraryManagement.getCategories({ page: 1, size: 100 })
            .then(data => data.results)
            .catch(err => {
                throw error(err.response.status, err.response.statusText);
            });

    let entries: PagedResult<LibraryEntry>;
    switch (tab) {
        case 'default':
            entries = await libraryManagement.getEntriesByCategory(undefined, search);
            break;
        case 'all':
            entries = await libraryManagement.getAllEntries(search);
            break;
        default: {
            const categoryId = categories.find(c => c.name === tab)?.id;
            if (!categoryId) {
                throw error(404, 'Category not found');
            }
            entries = await libraryManagement.getEntriesByCategory(categoryId, search);
            break;
        }
    }

    return {
        token,
        categories,
        entries,
        search,
        tab,
    };
}) satisfies PageServerLoad;