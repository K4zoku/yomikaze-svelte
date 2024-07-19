import type Tag from "$models/Tag";
import type TagCategory from "$models/TagCategory";

export interface TagCategoryExtended extends TagCategory {
    tags: Array<Tag>
}

export interface CategorizedTags {
    [key: string]: TagCategoryExtended
}

export function groupByCategory(tags: Array<Tag>) : CategorizedTags {
    let result: CategorizedTags = {};
    for (const tag of tags) {
        const key = tag.category.id.toString();
        if (result[key]) {
            result[key].tags.push(tag);
        } else {
            const category: TagCategoryExtended = {
                ...tag.category,
                tags: [tag]
            }
            result[key] = category
        }
    }
    return result;
}