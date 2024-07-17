import http from "$lib/http";
import type Tag from "$models/Tag";
import {groupByCategory} from "$utils/TagUtils";

export async function load() {
    let tags: Array<Tag> = await http.get('/tags?size=1000').then(response => response.data?.results ?? []).catch(() => []);
    return {
        categories: groupByCategory(tags)
    }
}