import { getPopularComics } from "$utils/comic-utils";

export async function load() {
    return {
        popular: getPopularComics(),
    }
}