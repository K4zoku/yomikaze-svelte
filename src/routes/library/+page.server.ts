import http from '$utils/http';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type LibraryEntry from '$models/LibraryEntry';
import { getToken } from '$utils/auth-server-utils';

export const load : PageServerLoad = (async ({ cookies }) => {
    const token = await getToken(cookies);
    const libraryEntries: LibraryEntry[] = await http.get('/library', { headers: { Authorization: `Bearer ${token}` }})
        .then(response => response.data);
    return {
        libraryEntries
    };
}) satisfies PageServerLoad;