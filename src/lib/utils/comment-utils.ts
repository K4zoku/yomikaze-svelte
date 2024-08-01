import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type CommentSearch from '$models/CommentSearch';
import type { JsonPatchEntry } from '$models/JsonPatchDocument';
import type PagedResult from '$models/PagedResult';

import type Comment from '$models/Comment';
import type { ComicComment, CommentReaction } from '$models/Comment';
import axios, { type AxiosInstance } from 'axios';
import { appendQueryParams } from './common';

const BASE_URL = PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/';
const COMIC_COMMENT_ENDPOINT = '/comics';

export class ComicCommentManagement {
  http: AxiosInstance;

  constructor(token: string) {
    this.http = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
  }

  async getComicComments(comicId: string, search?: CommentSearch): Promise<PagedResult<Comment>> {
    const url = new URL(`${COMIC_COMMENT_ENDPOINT}/${comicId}/comments`, BASE_URL);
    appendQueryParams(url.searchParams, search);
    const response = await this.http.get(url.toString());
    return response.data;
  }

  async getComicCommentReplies(comicId: string, commentId: string, search?: CommentSearch): Promise<PagedResult<Comment>> {
    const url = new URL(`${COMIC_COMMENT_ENDPOINT}/${comicId}/comments/${commentId}/replies`, BASE_URL);
    appendQueryParams(url.searchParams, search);
    const response = await this.http.get(url.toString());
    return response.data;
  }

  async getComment(comicId: string, commentId: string): Promise<ComicComment> {
    const response = await this.http.get(
      `${COMIC_COMMENT_ENDPOINT}/${comicId}/comments/${commentId}`
    );
    return response.data;
  }

  async createComment(comicId: string, content: string): Promise<ComicComment> {
    const response = await this.http.post(`${COMIC_COMMENT_ENDPOINT}/${comicId}/comments`, { content });
    return response.data;
  }

  async replyComment(comicId: string, commentId: string, content: string): Promise<ComicComment> {
    const response = await this.http.post(`${COMIC_COMMENT_ENDPOINT}/${comicId}/comments/${commentId}/replies`, { content });
    return response.data;
  }

  async updateComment(comment: ComicComment): Promise<ComicComment> {
    const patch: JsonPatchEntry[] = [{ op: 'replace', path: '/content', value: comment.content }];
    const response = await this.http.patch(
      `${COMIC_COMMENT_ENDPOINT}/${comment.comicId}/comments/${comment.id}`,
      patch
    );
    return response.data;
  }

  async deleteComment(comicId: string, commentId: string): Promise<void> {
    await this.http.delete(`${COMIC_COMMENT_ENDPOINT}/${comicId}/comments/${commentId}`);
  }

  async reactComment(comicId: string, commentId: string, react: CommentReaction): Promise<ComicComment> {
    const response = await this.http.post(`${COMIC_COMMENT_ENDPOINT}/${comicId}/comments/${commentId}/react`, react);
    return response.data;
  }

}

export class ChapterCommentManagement {
  private http: AxiosInstance;

  constructor(token: string) {
    this.http = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
  }

  async getChapterComments(comicId: string, number: number, search?: CommentSearch): Promise<PagedResult<Comment>> {
    const url = new URL(`${COMIC_COMMENT_ENDPOINT}/${comicId}/chapters/${number}/comments`, BASE_URL);
    appendQueryParams(url.searchParams, search);
    const response = await this.http.get(url.toString());
    return response.data;
  }

  async getChapterCommentReplies(comicId: string, number: number, commentId: string, search?: CommentSearch): Promise<PagedResult<Comment>> {
    const url = new URL(`${COMIC_COMMENT_ENDPOINT}/${comicId}/chapters/${number}/comments/${commentId}/replies`, BASE_URL);
    appendQueryParams(url.searchParams, search);
    const response = await this.http.get(url.toString());
    return response.data;
  }

  async getComment(comicId: string, number: number, commentId: string): Promise<ComicComment> {
    const response = await this.http.get(
      `${COMIC_COMMENT_ENDPOINT}/${comicId}/chapters/${number}/comments/${commentId}`
    );
    return response.data;
  }

  async createComment(comicId: string, number: number, comments: ComicComment): Promise<ComicComment> {
    const response = await this.http.post(`${COMIC_COMMENT_ENDPOINT}/${comicId}/chapters/${number}/comments`, comments);
    return response.data;
  }

  async replyComment(comicId: string, number: number, commentId: string, comments: ComicComment): Promise<ComicComment> {
    const response = await this.http.post(`${COMIC_COMMENT_ENDPOINT}/${comicId}/chapters/${number}/comments/${commentId}/replies`, comments);
    return response.data;
  }

  async updateComment(comicId: string, number: number, commentId: string, comment: ComicComment): Promise<ComicComment> {
    const patch: JsonPatchEntry[] = [{ op: 'replace', path: '/content', value: comment.content }];
    const response = await this.http.patch(
      `${COMIC_COMMENT_ENDPOINT}/${comicId}/chapters/${number}/comments/${commentId}`,
      patch
    );
    return response.data;
  }

  async deleteComment(comicId: string, number: number, commentId: string): Promise<void> {
    await this.http.delete(`${COMIC_COMMENT_ENDPOINT}/${comicId}/chapters/${number}/comments/${commentId}`);
  }

  async reactComment(comicId: string, number: number, commentId: string, react: CommentReaction): Promise<ComicComment> {
    const response = await this.http.post(`${COMIC_COMMENT_ENDPOINT}/${comicId}/chapters/${number}/comments/${commentId}/react`, react);
    return response.data;
  }

}
