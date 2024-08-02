import type Model from "./Model";
import type Profile from "./Profile";
import type { Reason } from "./Reason";

export default interface CommentReport extends Model {
    comment: Comment;
    commentId: string;
    reasonId: string;
    description: string;
    author: Profile;
    status: 'Pending' | 'Resolved' | 'Dismissed';
    dismissalReason: string;
    reason: Reason;
    reporter: Profile;
    reporterId: string;
    id: string;
  }