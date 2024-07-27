import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type { JsonPatchEntry } from '$models/JsonPatchDocument';
import type PagedResult from '$models/PagedResult';
import type ChapterSearch from '$models/ChapterSearch';

import { appendQueryParams } from './common';
import axios, { type AxiosInstance } from 'axios';
import type Chapter from '$models/Chapter';
import type { ChapterComment, CommentReaction } from '$models/Chapter';

const BASE_URL = PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/';
const CHAPTER_COMMENT_ENDPOINT = '/chaptercomment'

export class ChapterCommentManagement {
  private http: AxiosInstance;

  constructor(private token: string) {
    this.http = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
  }
  async getChapterComments(comicId: string, chapterId: number, commentId: string, search?: ChapterSearch): Promise<PagedResult<Chapter>> {
    const url = new URL(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterId}/${commentId}`, BASE_URL);
    appendQueryParams(url, search);
    const response = await this.http.get(url.toString());
    return response.data;
  }

  async getChapterCommentReplies(comicId: string, chapterId: number, commentId: string, search?: ChapterSearch): Promise<PagedResult<Chapter>> {
    const url = new URL(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterId}/${commentId}/replies`, BASE_URL);
    appendQueryParams(url, search);
    const response = await this.http.get(url.toString());
    return response.data;
  }

  async getComment(comicId: string, chapterId: number, commentId: string): Promise<ChapterComment> {
    const response = await this.http.get(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterId}/${commentId}`
    );
    return response.data;
  }

  async createChapterComment(comicId: string, chapterId: number, comments: ChapterComment): Promise<ChapterComment> {
    const response = await this.http.post(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterId}/comments`, comments);
    return response.data;
  }

  async replyChapterComment(comicId: string, chapterId: number, commentId: string, comments: ChapterComment): Promise<ChapterComment> {
    const response = await this.http.post(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterId}/${commentId}/replies`, comments);
    return response.data;
  }

  async updateChapterComment(chapterId: string, comment: ChapterComment): Promise<ChapterComment> {
    const patch: JsonPatchEntry[] = [{ op: 'replace', path: '/content', value: comment.content }];
    const response = await this.http.patch(`${CHAPTER_COMMENT_ENDPOINT}/${comment.comicId}/chapters/${chapterId}/comments/${comment.id}`,
      patch
    );
    return response.data;
  }

  async deleteComment(comicId: string, chapterId: string, commentId: string): Promise<void> {
    await this.http.delete(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterId}/comments/${commentId}`);
  }

  async reactComment(comicId: string, chapterId:string, commentId: string,data: CommentReaction): Promise<ChapterComment> {
    const response = await this.http.post(`${CHAPTER_COMMENT_ENDPOINT}/${comicId}/chapters/${chapterId}/comments/${commentId}/react`,data );
    return response.data;
  }
}
