import http from '$utils/http';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {
        historyEntries: http.get('/history')
    };
}) satisfies PageServerLoad;