// 백엔드 DocumentStatus와 매핑
export type DocumentStatus =
  | 'PENDING'
  | 'PREPROCESSING'
  | 'CHUNKING'
  | 'EMBEDDING'
  | 'STORING'
  | 'SYNCING'
  | 'COMPLETED'
  | 'FAILED';

export type SourceType = 'FILE_UPLOAD' | 'NOTION';

// 프론트엔드 UI용 간소화 상태
export type EmbeddingStatus = 'pending' | 'processing' | 'completed' | 'failed';

// 백엔드 DocumentStatus → 프론트 EmbeddingStatus 변환
export function toEmbeddingStatus(status: DocumentStatus): EmbeddingStatus {
  switch (status) {
    case 'COMPLETED':
      return 'completed';
    case 'FAILED':
      return 'failed';
    case 'PENDING':
      return 'pending';
    default:
      return 'processing';
  }
}

// 프론트 EmbeddingStatus → 백엔드 DocumentStatus 변환 (필터용)
export function toDocumentStatus(status: EmbeddingStatus): DocumentStatus | undefined {
  switch (status) {
    case 'completed':
      return 'COMPLETED';
    case 'failed':
      return 'FAILED';
    case 'pending':
      return 'PENDING';
    case 'processing':
      return 'EMBEDDING'; // 대표값
    default:
      return undefined;
  }
}

// 백엔드 Document 스키마
export interface Document {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  sourceType: SourceType;
  status: DocumentStatus;
  s3Key: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotionSource {
  id: string;
  notionPageId: string;
  pageTitle: string;
  lastEditedAt: string;
  lastSyncedAt: string;
}

export interface DocumentChunk {
  id: string;
  chunkIndex: number;
  content: string;
  sectionTitle: string | null;
  tokenCount: number;
}

export interface DocumentDetail extends Document {
  notionSource: NotionSource | null;
  chunks: DocumentChunk[];
}

export interface PipelineJob {
  id: string;
  documentId: string;
  status: DocumentStatus;
  chunkCount: number | null;
  vectorCount: number | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

// 프론트엔드 UI용 NotionPage (기존 컴포넌트 호환)
export interface NotionPage {
  id: string;
  title: string;
  embeddingStatus: EmbeddingStatus;
  updatedAt: string | null;
  notionUrl: string;
  documentId: string; // 백엔드 document ID (파이프라인 실행용)
  documentStatus: DocumentStatus; // 원본 상태
}

// DocumentDetail → NotionPage 변환
export function toNotionPage(doc: DocumentDetail): NotionPage {
  return {
    id: doc.notionSource?.notionPageId ?? doc.id,
    title: doc.notionSource?.pageTitle ?? doc.fileName,
    embeddingStatus: toEmbeddingStatus(doc.status),
    updatedAt: doc.updatedAt,
    notionUrl: doc.notionSource
      ? `https://notion.so/${doc.notionSource.notionPageId.replace(/-/g, '')}`
      : '',
    documentId: doc.id,
    documentStatus: doc.status,
  };
}

export interface PageFilter {
  status: EmbeddingStatus | 'all';
  search: string;
}

export interface AdminState {
  pages: NotionPage[];
  filter: PageFilter;
  selectedIds: Set<string>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  bulkProgress: {
    isRunning: boolean;
    completed: number;
    total: number;
  } | null;
}

// Notion 워크스페이스 페이지 (동기화 전)
export interface WorkspacePage {
  id: string;
  title: string;
  lastEditedAt: string;
}

export interface ChunkingConfig {
  id: number;
  maxTokens: number;
  overlapTokens: number;
  updatedAt: string;
}
