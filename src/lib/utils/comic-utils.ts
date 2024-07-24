import type Comic from "$models/Comic";
import http from "./http";
import { PUBLIC_CDN_BASE_URL } from "$env/static/public";
import type Chapter from "$models/Chapter";
import type PagedResult from "$models/PagedResult";
import type Pagination from "$models/Pagination";
import type { ComicStatus } from "$models/Comic";

const CDN_BASE_URL = PUBLIC_CDN_BASE_URL ?? "https://i.yomikaze.org";

export interface GetComicsOptions extends Pagination {
    name?: string; // search by name
    author?: string; // search by author
    publisher?: string; // search by publisher
    status?: string | ComicStatus; // search by status
    includeTags?: Array<string>; // search by tags
    inclusionMode?: "and" | "or"; // search by tags
    excludeTags?: Array<string>; // exclude by tags
    exclusionMode?: "and" | "or"; // exclude by tags
    orderBy?: Array<string>; // order by
}

export async function getComics(options:GetComicsOptions) : Promise<PagedResult<Comic>> {
    let url: URL = new URL("/comics", http.defaults.baseURL);
    for (const [key, value] of Object.entries(options)) {
        if (value === undefined || value === null) continue;
        const pascalCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
        if (value instanceof Array) {
            value.forEach(v => url.searchParams.append(pascalCaseKey, v));
        } else {
            url.searchParams.set(pascalCaseKey, value);
        }
    }
    const response = await http.get(url.href);
    const data = response.data as PagedResult<Comic>;
    data.results = data.results.map(normalizeComic);
    return data;
}

export async function getPopularComics() : Promise<Comic[]> {
    let comics: Comic[] = [];
    let paged = await getComics({ orderBy: ["TotalViewsDesc"], size: 10 })
    comics.push(...paged.results);
    comics = comics.map(normalizeComic);
    return comics;
}

export async function getLatestComics() : Promise<Comic[]> {
    let comics: Comic[] = [];
    let paged = await getComics({ orderBy: ["LastModifiedDesc", "CreationTimeDesc"], size: 24 });
    comics.push(...paged.results);
    comics = comics.map(normalizeComic);
    return comics;
}

export async function getRecentComics() : Promise<Comic[]> {
    let comics: Comic[] = [];
    let paged = await getComics({ orderBy: ["CreationTimeDesc"] });
    comics.push(...paged.results);
    comics = comics.map(normalizeComic);
    return comics;
}

export async function getLatestChapter(comicId: string | bigint) : Promise<Chapter> {
    let url: URL = new URL(`/comics/${comicId}/chapters`, http.defaults.baseURL);
    url.searchParams.append("OrderBy", "NumberDesc");
    url.searchParams.append("OrderBy", "CreationTimeDesc");
    url.searchParams.append("OrderBy", "LastModifiedDesc");
    url.searchParams.set("Size", "1");
    let response = await http.get(url.pathname + url.search);
    let data = response.data as PagedResult<Chapter>;
    if (data.totals === 0) throw new Error("No chapters found");
    return data.results[0];    
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