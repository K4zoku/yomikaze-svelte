import http from "$utils/http";
import type Tag from "$models/Tag";
import {groupByCategory} from "$utils/tag-utils";

export async function load() {
    let tags: Array<Tag> = await http.get('/tags?size=1000').then(response => response.data?.results ?? []).catch(() => []);
    let tagMap = new Map<string, Tag>();
    tags.forEach(tag => tagMap.set(tag.id, tag));
    return {
        tagMap,
        categories: groupByCategory(tags)
    }
}