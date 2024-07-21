import type Comic from "$models/Comic.js";
import http from "$utils/http";
import { error } from '@sveltejs/kit';

export async function load  ({ params }) {
    const comicId = params.comicId;
    const comic = await http.get(`/comics/${comicId}`)
        .then(response => response.data as Comic)
        .catch(e => {
            throw error(e.response.status, e.response.statusText);
        });
    return {
        comicId,
        comic
    }
}