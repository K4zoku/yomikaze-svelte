import type Model from "./Model";
import type Profile from "./Profile";

export default interface Comment extends Model {
    content: string;
    readonly author: Profile;
    readonly authorId: string;
    readonly replyToId: string;
    totalLikes: number;
    totalDislikes: number;
    totalReplies: number;
    isReacted: boolean;
    myReaction: Reaction | undefined;
}
export interface ComicComment extends Comment {
    readonly comicId: string;
}
export interface ChapterComment extends ComicComment {
    number: number;
}
export interface CommentReaction {
    type: Reaction;
}
export enum Reaction {
    Like = "Like",
    Dislike = 'Dislike'
}