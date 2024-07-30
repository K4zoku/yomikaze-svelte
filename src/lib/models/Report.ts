import type Model from "./Model";

export default interface Report extends Model {
    reasonId: string;
    description: string;
}

export interface ReportReason extends Model {
    content: string;
}
