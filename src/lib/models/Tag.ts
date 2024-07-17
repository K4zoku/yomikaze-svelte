import type BaseModel from "./BaseModel";
import type TagCategory from "./TagCategory";

export default interface Tag extends BaseModel {
    name: string,
    description?: string,
    readonly category: TagCategory,

    categoryId?: string | bigint,
    
    // using for tri state swap
    searchState?: number
}