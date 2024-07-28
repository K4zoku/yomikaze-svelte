export default interface PagedResult<T> {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totals: number;
    results: Array<T>;
}