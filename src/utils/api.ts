import type { Message, Session } from '../domains/chat/types';
import type { EmbeddingStatus, NotionPage } from '../domains/admin/types';

// --- Request / Response types ---

export interface SearchRequest {
  sessionId: string;
  query: string;
}

export interface SearchResponse {
  message: Message;
}

export interface SessionListResponse {
  sessions: Session[];
}

export interface PageListRequest {
  status?: EmbeddingStatus;
  search?: string;
  page: number;
  pageSize: number;
}

export interface PageListResponse {
  pages: NotionPage[];
  total: number;
}

export interface EmbeddingRequest {
  pageIds: string[];
}

export interface EmbeddingStatusResponse {
  pageId: string;
  status: EmbeddingStatus;
}

// --- API client ---

const API_BASE = '/api';
const TIMEOUT_MS = 30_000;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`요청 실패: ${res.status}`);
    }

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  search(data: SearchRequest) {
    return request<SearchResponse>('/search', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getSessions() {
    return request<SessionListResponse>('/sessions');
  },

  getPages(params: PageListRequest) {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.search) qs.set('search', params.search);
    qs.set('page', String(params.page));
    qs.set('pageSize', String(params.pageSize));
    return request<PageListResponse>(`/pages?${qs}`);
  },

  requestEmbedding(data: EmbeddingRequest) {
    return request<EmbeddingStatusResponse[]>('/embeddings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
