import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type { JsonPatchEntry } from "$models/JsonPatchDocument";
import type PagedResult from "$models/PagedResult";
import type Pagination from "$models/Pagination";
import axios, { type AxiosInstance } from "axios";

import type Chapter from "$models/Chapter";

const BASE_URL = PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/';
export default class chapterManagement {
    private http: AxiosInstance;

    constructor(private token: string,private comicId: string) {
        this.http = axios.create({ 
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }

    async createChapter(chapter : Chapter): Promise<void> {
        const url = new URL(`comics/${this.comicId}/chapters`, BASE_URL);
        this.http.post(url.toString(),chapter);
    }
    
}