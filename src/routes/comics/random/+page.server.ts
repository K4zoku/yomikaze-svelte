import http from '$utils/http';
import type Comic from '$models/Comic';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const response = await http.get('/comics/random');
    const comic = response.data as Comic;
    throw redirect(303, `/comics/${comic.id}`);
};