import http from '$utils/http';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {
        libraryEntries: http.get('/library')
    };
}) satisfies PageServerLoad;