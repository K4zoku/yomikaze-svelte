import type Pagination from "./Pagination";

export default interface ChapterSearch extends Pagination {
    orderBy?: string | string[] | CommentOrderBy[] | null; 
}
export enum CommentOrderBy {
    CreationTime= 'CreationTime', 
    CreationTimeDesc= 'CreationTimeDesc',
    LastModified ='LastModified',
    LastModifiedDesc='LastModifiedDesc'
}
