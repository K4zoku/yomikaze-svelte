import type Pagination from "./Pagination";

export default interface LibraryEntrySearch extends Pagination {
    name?: string | null;
    orderBy?: string | string[] | LibraryEntrySearchOrderBy[] | null;
}

export enum LibraryEntrySearchOrderBy {
    Name = 'Name',
    NameDesc = 'NameDesc',
    CreationTime = 'CreationTime',
    CreationTimeDesc = 'CreationTimeDesc',
}