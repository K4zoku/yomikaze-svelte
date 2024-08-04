import type Model from "$models/Model";
import type Profile from "$models/Profile";
import type { Reason } from "$models/Reason";
import type Comment from "$models/Comment";

export default interface CommentReport extends Model {
    comment: Comment;
    commentId: string;
    reasonId: string;
    description: string;
    author: Profile;
    status: string;
    dismissalReason: string;
    reason: Reason;
    reporter: Profile;
    reporterId: string;
    id: string;
  }