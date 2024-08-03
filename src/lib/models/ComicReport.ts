import type Comic from "./Comic";
import type Model from "./Model";
import type Profile from "./Profile";

export default interface ComicReport extends Model{
    description: string;
    images: string;
    categoryId: string;
    reporterId: string;
    reasonId: string;
    reason: string;
    dismissalReason: string;
    status: string;
    readonly comic: Comic;
    readonly reporter: Profile;
}
