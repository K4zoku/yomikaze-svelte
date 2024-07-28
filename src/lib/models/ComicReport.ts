import type Comic from "./Comic";
import type Model from "./Model";
import type Profile from "./Profile";

export default interface ComicReport extends Model{
    description: string;
    images: string;
    categoryId: string;
    reporterId: string;
    reason: string;
    status: string;
    readonly comic: Comic;
    readonly reporter: Profile;
}
