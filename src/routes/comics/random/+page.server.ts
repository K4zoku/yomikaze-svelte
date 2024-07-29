import http from '$utils/http';
import type Comic from '$models/Comic';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const response = await http.get('/comics/random');
    const comic = response.data as Comic;
    return {
        redirect: `/comics/${comic.id}`
    }
};