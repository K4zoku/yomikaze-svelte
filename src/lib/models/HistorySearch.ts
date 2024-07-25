import type Pagination from './Pagination';

export default interface HistorySearch extends Pagination {
  name?: string | null;
  orderBy?: string | string[] | HistorySearchOrderBy[] | null;
}

export enum HistorySearchOrderBy {
  PageNumber = 'PageNumber',
  PageNumberDesc = 'PageNumberDesc',
  CreationTime = 'CreationTime',
  CreationTimeDesc = 'CreationTimeDesc',
  LastModified = 'LastModified',
  LastModifiedDesc = 'LastModifiedDesc'
}
