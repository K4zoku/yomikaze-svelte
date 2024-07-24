import type Comic from "./Comic";
import type Model from "./Model";

export default interface LibraryEntry extends Model {
    comic: Comic;
}

export interface LibraryEntryCreate {
    comicId: string;
    categoryIds?: string[];
}