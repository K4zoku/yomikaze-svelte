import type Pagination from "./Pagination";

export default interface ComicReportSearch extends Pagination {
    name?: string | null;
    orderBy?: string | string[] | ComicReportSearchOrderBy[] | null;
}

export enum ComicReportSearchOrderBy {
    CreationTime = 'CreationTime',
    CreationTimeDesc = 'CreationTimeDesc',
}