import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ChannelView, ErrorView, PostInput, PostView } from './post.model';

/** Zugriff auf die UI-API des UI-Service. Keine Business-Logik. */
@Injectable({ providedIn: 'root' })
export class PostApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/ui-api';

  listPosts(status?: string): Observable<PostView[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<PostView[]>(`${this.baseUrl}/posts`, { params });
  }

  listChannels(): Observable<ChannelView[]> {
    return this.http.get<ChannelView[]>(`${this.baseUrl}/channels`);
  }

  createPost(input: PostInput): Observable<PostView> {
    return this.http.post<PostView>(`${this.baseUrl}/posts`, input);
  }

  updatePost(id: number, input: PostInput): Observable<PostView> {
    return this.http.put<PostView>(`${this.baseUrl}/posts/${id}`, input);
  }

  changeStatus(id: number, targetStatus: string): Observable<PostView> {
    return this.http.post<PostView>(`${this.baseUrl}/posts/${id}/status`, { targetStatus });
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/posts/${id}`);
  }
}

/** Liest die Fehlermeldung des Backends aus einer HTTP-Fehlerantwort. */
export function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as Partial<ErrorView> | null;
    if (body?.message) {
      return body.message;
    }
    if (error.status === 0) {
      return 'Der UI-Service ist nicht erreichbar.';
    }
    return `Fehler ${error.status}`;
  }
  return 'Unbekannter Fehler';
}
