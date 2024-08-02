
import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type HistorySearch from "$models/HistorySearch";
import type { JsonPatchEntry } from "$models/JsonPatchDocument";
import type PagedResult from "$models/PagedResult";
import type Pagination from "$models/Pagination";
import axios, { type AxiosInstance } from "axios";
import { appendQueryParams } from "./common";
import type ComicReport from "$models/ComicReport";
import type ChapterReport from "$models/ChapterReport";
import type { Reason } from "$models/Reason"
import type Comic from "$models/Comic";

const BASE_URL = PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/';
const COMIC_REPORT_ENDPOINT = '/reports/comics';
const CHAPTER_REPORT_ENDPOINT = '/reports/chapter';

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

    async getComicReported(key: string): Promise<void> {
        const response = await this.http.get(`${COMIC_REPORT_ENDPOINT}/${key}`)
        return response.data;
    }
    async reportComic(comicId: string): Promise<ComicReport> {
        const response = await this.http.post(`comics/${comicId}/reports`);
        return response.data;
    }

    async updateComicReported(key: number, pageNumber: number, number: number): Promise<void> {
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

export class ChapterReportManagement {
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

    async getAllReasons(): Promise<Reason[]> {
        const response = await this.http.get('/reports/chapter/reasons');
        return response.data;
    }

    async getComic(comicId: string): Promise<Comic> {
        const response = await this.http.get(`/comics/${comicId}`);
        return response.data;
    }

    async getAllChapterReports(): Promise<PagedResult<ChapterReport>> {
        const response = await this.http.get('/reports/chapter'); // Thay đổi endpoint nếu cần
        return response.data;
    }

    async getChapterReportsWithReasons(): Promise<PagedResult<ChapterReport>> {
        const pagedReports: PagedResult<ChapterReport> = await this.getAllChapterReports();
        const reasons: Reason[] = await this.getAllReasons();

        // Fetch and update comic data for each report
        const updatedReports = await Promise.all(pagedReports.results.map(async (report) => {
            const reason = reasons.find(r => r.id === report.reasonId) || { content: 'Unknown reason', id: report.reasonId, creationTime: '' };
            const comic = await this.getComic(report.chapter.comicId);

            return {
                ...report,
                reason,
                comic
            };
        }));

        return {
            ...pagedReports,
            results: updatedReports
        };
    }

    async updateChapterReported(reportId: string, status: string, dismissalReason?: string): Promise<ChapterReport> {
        const patch: JsonPatchEntry[] = [
            { op: 'replace', path: '/status', value: status }
        ];

        if (status === 'Dismissed' && dismissalReason) {
            patch.push({ op: 'replace', path: '/dismissalReason', value: dismissalReason });
        }

        const response = await this.http.patch(`${CHAPTER_REPORT_ENDPOINT}/${reportId}`, patch);
        return response.data;
    }
}
