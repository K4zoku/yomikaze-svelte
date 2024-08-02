import type Model from './Model';

export default interface Chapter extends Model {
  readonly views: number;
  readonly hasLock: boolean;
  comicId: string;
  number: number;
  name: string;
  pages: string[];
  price: number;
  isRead: boolean;
  readonly isUnlocked: boolean;
  readonly totalComments: number;
}

export interface ChapterCreate {
  number: number;
  name: string;
  price: number;
  pages: string[];
}