import type Chapter from '$models/Chapter.js';
import type Comic from '$models/Comic.js';
import { getAndVerifyToken } from '$utils/auth-server-utils.js';
import { trySetBaseUrl } from '$utils/comic-utils.js';
import http from '$utils/http.js';
import { error } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    const number = params.number
    const comicId = params.comicId
    const token = await getAndVerifyToken(cookies).catch(() => undefined);
    if (token) {
        http.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    const comic = await http.get(`/comics/${comicId}`)
        .then(response => response.data as Comic)
        .catch(err => {
            throw error(err.response.status, err.response.statusText)
        });
    const chapter = await http.get(`/comics/${comicId}/chapters/${number}`)
        .then(response => response.data as Chapter)
        .catch(err => {
            throw error(err.response.status, err.response.statusText)
        });
    const chapters = await http.get(`/comics/${comicId}/chapters`)
        .then (response => response.data.results as Array<Chapter>)
        .catch(err => {
            throw error(err.response.status, err.response.statusText)
        });
        chapter.pages = chapter.pages.map(trySetBaseUrl)
    return {
        chapter,
        chapters,
        comic,
        number,
        comicId
    };
}