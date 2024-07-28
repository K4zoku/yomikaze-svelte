import type Chapter from "$models/Chapter";
import http from "$utils/http";
import { error } from "@sveltejs/kit";

export const ssr = false;

export async function load({ params }) {
    const { comicId, number } = params;
    const chapter = await http.get(`/comics/${comicId}/chapters/${number}`)
    .then((res) => res.data as Chapter)
    .catch((err) => {
        const { response } = err;
        throw error(response.status, response.statusText);
    });
    return { 
        comicId, number, chapter
    };
}