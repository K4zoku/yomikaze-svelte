import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type { JsonPatchEntry } from '$models/JsonPatchDocument';
import type PagedResult from '$models/PagedResult';
import type ChapterSearch from '$models/ChapterSearch';

import { appendQueryParams } from './common';
import axios, { type AxiosInstance } from 'axios';
import type { ChapterComment, CommentReaction } from '$models/Comment';

const BASE_URL = PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/';
const CHAPTER_COMMENT_ENDPOINT = '/comics';

export class ChapterCommentManagement {
  http: AxiosInstance;

  constructor(private token: string) {
    this.http = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
  }
  async getComments(comicId: string, chapterNumber: number, search?: ChapterSearch): Promise<PagedResult<ChapterComment>> {
    const url = new URL(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterNumber}/comments`, BASE_URL);
    appendQueryParams(url.searchParams, search);
    const response = await this.http.get(url.toString());
    return response.data;
  }

  async getCommentReplies(comicId: string, chapterNumber: number, commentId: string, search?: ChapterSearch): Promise<PagedResult<ChapterComment>> {
    const url = new URL(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterNumber}/comments/${commentId}/replies`, BASE_URL);
    appendQueryParams(url.searchParams, search);
    const response = await this.http.get(url.toString());
    return response.data;
  }

  async getComment(comicId: string, chapterNumber: number, commentId: string): Promise<ChapterComment> {
    const response = await this.http.get(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterNumber}/comments/${commentId}`
    );
    return response.data;
  }

  async createComment(comicId: string, chapterNumber: number, content: string): Promise<ChapterComment> {
    const response = await this.http.post(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterNumber}/comments`, { content });
    return response.data;
  }

  async replyComment(comicId: string, chapterNumber: number, commentId: string, content: string): Promise<ChapterComment> {
    const response = await this.http.post(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterNumber}/comments/${commentId}/replies`, { content });
    return response.data;
  }

  async updateComment(comicId: string, chapterNumber: number, commentId: string, content: string): Promise<ChapterComment> {
    const patch: JsonPatchEntry[] = [{ op: 'replace', path: '/content', value: content }];
    const response = await this.http.patch(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterNumber}/comments/${commentId}`,
      patch
    );
    return response.data;
  }

  async deleteComment(comicId: string, chapterNumber: number, commentId: string): Promise<void> {
    await this.http.delete(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterNumber}/comments/${commentId}`);
  }

  async reactComment(comicId: string, chapterNumber: number, commentId: string, data: CommentReaction): Promise<ChapterComment> {
    const response = await this.http.post(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterNumber}/comments/${commentId}/react`, data);
    return response.data;
  }
}
