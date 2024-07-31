import type Comic from "./Comic";
import type LibraryCategory from "./LibraryCategory";
import type Model from "./Model";

export default interface LibraryEntry extends Model {
    comic: Comic;
    categories: LibraryCategory[];
}

export interface LibraryEntryCreate {
    comicId: string;
    categoryIds?: string[];
}