import type Comic from "./Comic";
import type Model from "./Model";
import type Profile from "./Profile";
import type Chapter from "./Chapter";
import type { Reason } from './Reason';

export default interface ChapterReport extends Model {
    chapterId: string;
    readonly chapter: Chapter;
    readonly comic: Comic
    description: string;
    status: string;
    dismissalReason: string;
    reasonId: string;
    reason: Reason;
    readonly reporter: Profile;
    reporterId: string;
    id: string;
}