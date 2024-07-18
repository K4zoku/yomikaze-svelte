import type Comic from "$models/Comic";
import http from "./http";
import { PUBLIC_CDN_BASE_URL } from "$env/static/public";

const CDN_BASE_URL = PUBLIC_CDN_BASE_URL ?? "https://i.yomikaze.org";

export async function getPopularComics() : Promise<Comic[]> {
    let comics: Comic[] = [];
    let url: URL = new URL("/comics", http.defaults.baseURL);
    url.searchParams.set("Size", "10");
    url.searchParams.append("OrderBy", "TotalViewsDesc");
    let response = await http.get(url.pathname + url.search);
    if (response.status === 200) {
        comics.push(...response.data.results);
    }
    comics = comics.map(comic => normalizeComic(comic));
    console.log(comics);
    return comics;
}

export function normalizeComic(comic: Comic) : Comic {
    if (comic.cover) comic.cover = trySetBaseUrl(comic.cover);
    if (comic.banner) comic.banner = trySetBaseUrl(comic.banner);
    return comic;
}

function trySetBaseUrl(url: string) : string {
    let result: URL;
    try {
        result = new URL(url);
    } catch(e) {
        result = new URL(url, CDN_BASE_URL);
    }
    return result.href;
}