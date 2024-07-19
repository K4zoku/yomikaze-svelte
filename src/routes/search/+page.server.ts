import http from "$utils/http";
import type Tag from "$models/Tag";
import {groupByCategory} from "$utils/tag-utils";

export async function load() {
    let tags: Array<Tag> = await http.get('/tags?size=1000').then(response => response.data?.results ?? []).catch(() => []);
    return {
        categories: groupByCategory(tags)
    }
}