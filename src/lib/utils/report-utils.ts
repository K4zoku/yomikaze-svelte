
import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type HistorySearch from "$models/HistorySearch";
import type { JsonPatchEntry } from "$models/JsonPatchDocument";
import type PagedResult from "$models/PagedResult";
import type Pagination from "$models/Pagination";
import axios, { type AxiosInstance } from "axios";
import { appendQueryParams } from "./common";
import type ComicReport from "$models/ComicReport";

const BASE_URL = PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/';
const COMIC_REPORT_ENDPOINT = '/reports/comics';

export class ComicReportManagement {
    private http: AxiosInstance;

    constructor(private token: string) {
        this.http = axios.create({ 
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }

    async getAllComicReported(pagination?: Pagination): Promise<PagedResult<ComicReport>> {
        const url = new URL(COMIC_REPORT_ENDPOINT, BASE_URL);
        appendQueryParams(url.searchParams, pagination);
        const response = await this.http.get(url.toString());
        return response.data;
    }
    async getComicReportedReason(): Promise<void> {
        const response = await this.http.get(`${COMIC_REPORT_ENDPOINT}/reasons`);
        return response.data;
    }

    async getComicReported(key:string):Promise<void>{
       const response = await this.http.get(`${COMIC_REPORT_ENDPOINT}/${key}`)
       return response.data;
    }
    async reportComic(comicId:string): Promise<ComicReport>{
        const response = await this.http.post(`comics/${comicId}/reports`);
        return response.data;
    }

    async updateComicReported(key: number, pageNumber: number, number:number): Promise<void> {
        const patch: JsonPatchEntry[] = [
            { op: 'replace', path: '/pageNumber', value: `${pageNumber}` },
        ];
        await this.http.patch(`${COMIC_REPORT_ENDPOINT}/comics/${comicId}/chapters/${number}`, patch);
    }

    async updateReportedComic(reportId: ComicReport, status: string): Promise<ComicReport> {
        const patch: JsonPatchEntry[] = [
            { op: 'replace', path: '/pageNumber', value: `` },
        ];
        const response = await this.http.patch(`${CATEGORIES_ENDPOINT}/${category.id}`, patch);
        return response.data;
    }

    async deleteHistory(key: number): Promise<void> {
        await this.http.delete(`${HISTORY_ENDPOINT}/${key}`);
    }
    
}