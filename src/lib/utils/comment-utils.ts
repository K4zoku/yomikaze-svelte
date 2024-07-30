import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type CommentSearch from '$models/CommentSearch';
import type PagedResult from '$models/PagedResult';
import type { JsonPatchEntry } from '$models/JsonPatchDocument';

import { appendQueryParams } from './common';
import axios, { type AxiosInstance } from 'axios';
import type { ComicComment, CommentReaction } from '$models/Comment';

const BASE_URL = PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/';
const COMIC_COMMENT_ENDPOINT = '/comics';

export class ComicCommentManagement {
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

  async getComicComments(comicId: string, search?: CommentSearch): Promise<PagedResult<Comment>> {
    const url = new URL(`${COMIC_COMMENT_ENDPOINT}/${comicId}/comments`, BASE_URL);
    appendQueryParams(url, search);
    const response = await this.http.get(url.toString());
    return response.data;
  }

  async getComicCommentReplies(comicId: string, commentId: string, search?: CommentSearch): Promise<PagedResult<Comment>> {
    const url = new URL(`${COMIC_COMMENT_ENDPOINT}/${comicId}/comments/${commentId}/replies`,BASE_URL);
    appendQueryParams(url, search);
    const response = await this.http.get(url.toString());
    return response.data;
  }

  async getComment(comicId: string, commentId: string): Promise<ComicComment> {
    const response = await this.http.get(
      `${COMIC_COMMENT_ENDPOINT}/${comicId}/comments/${commentId}`
    );
    return response.data;
  }

  async createComment(comicId: string, comments: ComicComment): Promise<ComicComment> {
    const response = await this.http.post(`${COMIC_COMMENT_ENDPOINT}/${comicId}/comments`,comments);
    return response.data;
  }

  async replyComment(comicId: string, commentId: string, comments: ComicComment): Promise<ComicComment> {
    const response = await this.http.post(`${COMIC_COMMENT_ENDPOINT}/${comicId}/comments/${commentId}/replies`, comments);
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

  async reactComment(comicId: string,commentId: string,data: CommentReaction): Promise<ComicComment> {
    const response = await this.http.post(`${COMIC_COMMENT_ENDPOINT}/${comicId}/comments/${commentId}/react`,data );
    return response.data;
  }

}
