import { getLatestComics, getPopularComics, getRecentComics } from "$utils/comic-utils";

export async function load() {
    const popular = getPopularComics(); // await on client side
    const latest = getLatestComics(); // await on client side
    const recent = getRecentComics(); // await on client side
    return {
        popular,
        latest,
        recent
    }
}