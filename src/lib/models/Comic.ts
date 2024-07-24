import type Model from "./Model";
import type Profile from "./Profile";
import type Tag from "./Tag";

export default interface Comic extends Model {
    name: string,
    aliases?: Array<string>,
    description?: string,
    cover?: string,
    banner?: string,
    publicationDate?: string | Date,
    authors: Array<string>
    status: string | ComicStatus,
    tags: Array<Tag>,
    publisher: Profile,
    tagIds?: Array<string | bigint>,
    readonly totalChapters?: number,
    readonly totalViews?: number,
    readonly averageRating?: number,
    readonly totalRatings?: number,
    readonly totalFollows?: number,
    readonly totalComments?: number,
    readonly isFollowing?: boolean,
    readonly isRated?: boolean,
    readonly myRating?: number
}

export enum ComicStatus {
    OnGoing = 'OnGoing', 
    Completed = 'Completed', 
    Hiatus = 'Hiatus', 
    Cancelled = 'Cancelled'
}