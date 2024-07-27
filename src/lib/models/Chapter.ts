import type Model from './Model';

export default interface Chapter extends Model {
  readonly view: number;
  readonly hasLock: boolean;
  comicId: string;
  number: number;
  name: string;
  pages: number;
  price: number;
  isRead: boolean;
  readonly isUnlocked: boolean;
  readonly totalComments: number;
}

export interface ChapterComment extends Chapter {
  content: string;
}

export interface CommentReaction {
  type: Reaction;
}
export enum Reaction{
  Like = "Like",
  Dislike = 'Dislike'
}