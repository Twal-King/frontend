export type EmbeddingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface NotionPage {
  id: string;
  title: string;
  embeddingStatus: EmbeddingStatus;
  updatedAt: string | null;
  notionUrl: string;
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
