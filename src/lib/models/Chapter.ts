import type Model from './Model';

export default interface Chapter extends Model {
  readonly view: number;
  readonly hasLock: boolean;
  comicId: string;
  number: number;
  name: string;
  pages: Array<string>;
  price: number;
  isRead: boolean;
  readonly isUnlocked: boolean;
  readonly totalComments: number;
}
