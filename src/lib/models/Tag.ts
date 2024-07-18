import type Model from "./Model";
import type TagCategory from "./TagCategory";

export default interface Tag extends Model {
    name: string,
    description?: string,
    readonly category: TagCategory,

    categoryId?: string | bigint,
    
    // using for tri state swap
    searchState?: number
}