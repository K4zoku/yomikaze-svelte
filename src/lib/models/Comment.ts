import type Model from "./Model";
import type Profile from "./Profile";

export default interface Comment extends Model {
    content: string;
    readonly author: Profile;
    readonly authorId: string;
    readonly replyToId: string;
}
export interface ComicComment extends Comment{
    readonly comicId: string;
}