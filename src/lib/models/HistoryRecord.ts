import type Comic from "./Comic";
import type Model from "./Model";

export default interface HistoryRecord extends Model{
    pageNumber: number;
    chapter: Comic;
    comic: Comic;
}