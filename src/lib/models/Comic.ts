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
    status: ComicStatus | ComicStatus.Cancelled | ComicStatus.Completed | ComicStatus.Hiatus | ComicStatus.OnGoing,
    tags: Array<Tag>,
    publisher: Profile,
    tagIds?: Array<string | bigint>,
    totalChapters?: number,
    totalViews?: number,
    averageRating?: number,
    totalRatings?: number,
    totalFollows?: number,
    totalComments?: number,
    isFollowing?: boolean,
    isRated?: boolean,
    myRating?: number
}

export interface ComicCreate {
    name: string,
    aliases: Array<string>,
    description: string,
    cover: string,
    banner?: string,
    publicationDate: string | Date,
    authors: Array<string>,
    status: ComicStatus | ComicStatus.Cancelled | ComicStatus.Completed | ComicStatus.Hiatus | ComicStatus.OnGoing,
    tagIds: string[],
}

export enum ComicStatus {
    OnGoing = 'OnGoing', 
    Completed = 'Completed', 
    Hiatus = 'Hiatus', 
    Cancelled = 'Cancelled'
}