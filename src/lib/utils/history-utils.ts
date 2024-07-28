
import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type HistorySearch from "$models/HistorySearch";
import type { JsonPatchEntry } from "$models/JsonPatchDocument";
import type PagedResult from "$models/PagedResult";
import type Pagination from "$models/Pagination";
import axios, { type AxiosInstance } from "axios";
import { appendQueryParams } from "./common";

const BASE_URL = PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/';
const HISTORY_ENDPOINT = '/history';

export default class HistoryManagement {
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

    async getHistories(pagination?: Pagination): Promise<PagedResult<HistorySearch>> {
        const url = new URL(HISTORY_ENDPOINT, BASE_URL);
        appendQueryParams(url, pagination);
        const response = await this.http.get(url.toString());
        return response.data;
    }

    async updateHistory(comicId: number, pageNumber: number, number:number): Promise<void> {
        const patch: JsonPatchEntry[] = [
            { op: 'replace', path: '/pageNumber', value: `${pageNumber}` },
        ];
        await this.http.patch(`${HISTORY_ENDPOINT}/comics/${comicId}/chapters/${number}`, patch);
    }

    async deleteHistory(key: number): Promise<void> {
        await this.http.delete(`${HISTORY_ENDPOINT}/${key}`);
    }
    async deleteAllHistory(): Promise<void> {
        await this.http.delete(`${HISTORY_ENDPOINT}`);
    }
    
}