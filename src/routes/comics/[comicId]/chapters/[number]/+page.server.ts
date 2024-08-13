import type Chapter from '$models/Chapter.js';
import type Comic from '$models/Comic.js';
import { getAndVerifyToken } from '$utils/auth-server-utils.js';
import { trySetBaseUrl } from '$utils/comic-utils.js';
import http from '$utils/http.js';
import { error } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    const number = parseInt(params.number)
    if (isNaN(number)) {
        throw error(404, 'Chapter not found')
    }
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
    const chapters = await http.get(`/comics/${comicId}/chapters`)
        .then(response => response.data.results as Array<Chapter>)
        .catch(err => {
            throw error(err.response.status, err.response.statusText)
        });
    const chapter: Chapter | false = await http.get(`/comics/${comicId}/chapters/${number}`)
        .then(response => response.data as Chapter)
        .catch(err => {
            if (err.response.status === 403) {
                return chapters.find(chapter => chapter.number === number) || false
            }
            throw error(err.response.status, err.response.statusText)
        });
    if (chapter) {
        if (chapter.hasLock && !token) {
            throw error(401, 'This chapter is locked, you must be logged in to unlock it');
        }
        chapter.pages = chapter.pages.map(trySetBaseUrl)
    }
    return {
        chapter,
        chapters,
        comic,
        number,
        comicId,
        token
    };
}