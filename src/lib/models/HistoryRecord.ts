import type Comic from "./Comic";
import type Model from "./Model";

export default interface HistoryRecord extends Model{
    pageNumber: number;
    readonly chapter: Comic;
    readonly comic: Comic;
}