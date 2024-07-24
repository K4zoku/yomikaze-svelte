import type Model from "./Model";

export default interface LibraryCategory extends Model {
    name: string;
    readonly userId: string;
}

export interface LibraryCategoryCreate {
    name: string;
}