import type Comic from "./Comic";
import type Model from "./Model";

export default interface ComicReport extends Model{
    description: string;
    images: string;
    categoryId: string;
    reporterId: string;
    readonly comic: Comic;
    
}