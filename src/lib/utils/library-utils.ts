
import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type LibraryCategory from "$models/LibraryCategory";
import type PagedResult from "$models/PagedResult";
import type Pagination from "$models/Pagination";
import axios, { type AxiosInstance } from "axios";
import { appendQueryParams } from "./common";
import type LibraryEntry from "$models/LibraryEntry";
import type LibraryEntrySearch from "$models/LibraryEntrySearch";
import type { LibraryCategoryCreate } from "$models/LibraryCategory";
import type { JsonPatchEntry } from "$models/JsonPatchDocument";
import type { LibraryEntryCreate } from "$models/LibraryEntry";

const BASE_URL = PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/';
const LIBRARY_ENDPOINT = '/library';
const CATEGORIES_ENDPOINT = '/library/categories';

export class LibraryManagement {
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

    async getCategories(pagination?: Pagination): Promise<PagedResult<LibraryCategory>> {
        const url = new URL(CATEGORIES_ENDPOINT, BASE_URL);
        appendQueryParams(url.searchParams, pagination);
        const response = await this.http.get(url.toString());
        return response.data;
    }

    async getEntriesByCategory(categoryId?: string, search?: LibraryEntrySearch): Promise<PagedResult<LibraryEntry>> {
        categoryId = categoryId ?? 'default'; // get uncategorized by default
        const url = new URL(`${LIBRARY_ENDPOINT}/category/${categoryId}`, BASE_URL);
        appendQueryParams(url.searchParams, search);
        const response = await this.http.get(url.toString());
        return response.data;
    }

    async getAllEntries(search?: LibraryEntrySearch): Promise<PagedResult<LibraryEntry>> {
        const url = new URL(LIBRARY_ENDPOINT, BASE_URL);
        appendQueryParams(url.searchParams, search);
        const response = await this.http.get(url.toString());
        return response.data;
    }

    async getEntry(entryId: string): Promise<LibraryEntry> {
        const response = await this.http.get(`${LIBRARY_ENDPOINT}/${entryId}`);
        return response.data;
    }

    // CUD for library categories
    async createCategory(category: LibraryCategoryCreate): Promise<LibraryCategory> {
        const response = await this.http.post(CATEGORIES_ENDPOINT, category);
        return response.data;
    }

    async updateCategory(category: LibraryCategory): Promise<LibraryCategory> {
        const patch: JsonPatchEntry[] = [
            { op: 'replace', path: '/name', value: category.name },
        ];
        const response = await this.http.patch(`${CATEGORIES_ENDPOINT}/${category.id}`, patch);
        return response.data;
    }

    async deleteCategory(categoryId: string): Promise<void> {
        await this.http.delete(`${CATEGORIES_ENDPOINT}/${categoryId}`);
    }

    // CUD for library entries
    async createEntry(entry: LibraryEntryCreate): Promise<LibraryEntry> {
        const response = await this.http.post(LIBRARY_ENDPOINT, entry);
        return response.data;
    }

    async addEntryToCategories(comicId: string, categoryIds: string[]): Promise<LibraryCategory[]> {
        const response = await this.http.post(`${LIBRARY_ENDPOINT}/${comicId}/categories`, categoryIds);
        return response.data;
    }

    async addEntryToCategory(comicId: string, categoryId: string): Promise<boolean> {
        const added = await this.addEntryToCategories(comicId, [categoryId]);
        return added.length == 1;
    }

    async removeEntryFromCategories(comicId: string, categoryIds: string[]): Promise<LibraryCategory[]> {
        const response = await this.http.delete(`${LIBRARY_ENDPOINT}/${comicId}/categories`, { data: categoryIds });
        return response.data;
    }

    async removeEntryFromCategory(comicId: string, categoryId: string): Promise<boolean> {
        const removed = await this.removeEntryFromCategories(comicId, [categoryId]);
        return removed.length == 1;
    }
}