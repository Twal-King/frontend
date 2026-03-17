import type { Message, Session } from '../domains/chat/types';
import type {
  DocumentStatus,
  DocumentDetail,
  PipelineJob,
  WorkspacePage,
  ChunkingConfig,
  Document,
} from '../domains/admin/types';

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

// --- Backend API response wrapper ---
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: Record<string, unknown>;
}

interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// --- API client ---

const API_BASE = '/api/v1';
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
      const body = await res.json().catch(() => null);
      const msg = body?.error?.message ?? `요청 실패: ${res.status}`;
      throw new Error(msg);
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
  // --- Chat ---
  search(data: SearchRequest) {
    return request<SearchResponse>('/search', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getSessions() {
    return request<SessionListResponse>('/sessions');
  },

  createSession(title?: string) {
    return request<ApiResponse<{ session: Session }>>('/sessions', {
      method: 'POST',
      body: JSON.stringify({ title: title ?? '새 대화' }),
    });
  },

  getSessionMessages(sessionId: string) {
    return request<ApiResponse<{ messages: Message[] }>>(`/sessions/${sessionId}/messages`);
  },

  deleteSession(sessionId: string) {
    return request<ApiResponse<{ message: string }>>(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  // --- Health ---
  health() {
    return request<ApiResponse<{ status: string; service: string }>>('/health');
  },

  // --- Notion Pages ---
  getNotionPages(params: { status?: DocumentStatus; page?: number; limit?: number }) {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    qs.set('page', String(params.page ?? 1));
    qs.set('limit', String(params.limit ?? 20));
    return request<ApiResponse<{ documents: DocumentDetail[] }> & { meta: PaginatedMeta }>(
      `/notion/pages?${qs}`,
    );
  },

  importNotionPage(notionPageId: string) {
    return request<ApiResponse<{ document: DocumentDetail; isUpdate: boolean }>>(
      '/notion/pages',
      { method: 'POST', body: JSON.stringify({ notionPageId }) },
    );
  },

  // --- Notion Workspace ---
  getWorkspacePages() {
    return request<ApiResponse<{ pages: WorkspacePage[] }>>('/notion/workspace');
  },

  syncWorkspacePages(pageIds: string[]) {
    return request<ApiResponse<{ results: Array<{ notionPageId: string; success: boolean; document?: Document; error?: string }> }>>(
      '/notion/workspace/sync',
      { method: 'POST', body: JSON.stringify({ pageIds }) },
    );
  },

  // --- Documents ---
  getDocuments(params: { status?: DocumentStatus; sourceType?: string; page?: number; limit?: number }) {
    const qs = new URLSearchParams();
    if (params.status) qs.set('status', params.status);
    if (params.sourceType) qs.set('sourceType', params.sourceType);
    qs.set('page', String(params.page ?? 1));
    qs.set('limit', String(params.limit ?? 20));
    return request<ApiResponse<{ documents: Document[] }> & { meta: PaginatedMeta }>(
      `/documents?${qs}`,
    );
  },

  getDocument(id: string) {
    return request<ApiResponse<DocumentDetail>>(`/documents/${id}`);
  },

  deleteDocument(id: string) {
    return request<ApiResponse<{ message: string }>>(`/documents/${id}`, { method: 'DELETE' });
  },

  previewDocument(id: string) {
    return request<ApiResponse<{ documentId: string; estimatedChunks: number; qualityScore: number; optimizationSuggestions: string[] }>>(
      `/documents/${id}/preview`,
      { method: 'POST' },
    );
  },

  // --- Pipeline ---
  runPipeline(documentId: string) {
    return request<ApiResponse<PipelineJob>>(`/pipeline/${documentId}/run`, { method: 'POST' });
  },

  retryPipeline(documentId: string) {
    return request<ApiResponse<PipelineJob>>(`/pipeline/${documentId}/retry`, { method: 'POST' });
  },

  getPipelineJobs(documentId: string) {
    return request<ApiResponse<{ jobs: PipelineJob[] }>>(`/pipeline/${documentId}/jobs`);
  },

  // --- Chunking Config ---
  getChunkingConfig() {
    return request<ApiResponse<ChunkingConfig>>('/chunking-config');
  },

  updateChunkingConfig(config: { maxTokens: number; overlapTokens: number }) {
    return request<ApiResponse<ChunkingConfig>>('/chunking-config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  },

  // --- Document Upload ---
  async uploadDocuments(files: File[]) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? `업로드 실패: ${res.status}`);
      }

      return (await res.json()) as ApiResponse<{
        results: Array<{
          success: boolean;
          document?: Document;
          error?: string;
        }>;
      }>;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('업로드 시간이 초과되었습니다.');
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  },

  // --- Guide ---
  getGuide() {
    return request<ApiResponse<{ supportedFormats: Array<{ mimeType: string; extension: string; description: string }>; maxFileSizeMb: number; recommendedStructure: string[]; optimizationTips: string[]; antiPatterns: string[] }>>(
      '/guide',
    );
  },
};
