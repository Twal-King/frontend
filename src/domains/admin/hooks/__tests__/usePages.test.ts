import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePages } from '../usePages';
import { api } from '../../../../utils/api';

vi.mock('../../../../utils/api', () => ({
  api: {
    getNotionPages: vi.fn(),
  },
}));

const mockGetNotionPages = vi.mocked(api.getNotionPages);

// 백엔드 응답 형식으로 mock 데이터 생성
function makeDocumentDetail(overrides: Record<string, unknown> = {}) {
  return {
    id: 'doc-1',
    fileName: 'page.md',
    fileSize: 1024,
    mimeType: 'text/markdown',
    sourceType: 'NOTION' as const,
    status: 'PENDING' as const,
    s3Key: null,
    errorMessage: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    notionSource: {
      id: 'ns-1',
      notionPageId: '1',
      pageTitle: 'Page 1',
      lastEditedAt: '2024-01-01T00:00:00.000Z',
      lastSyncedAt: '2024-01-01T00:00:00.000Z',
    },
    chunks: [],
    ...overrides,
  };
}

describe('usePages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with empty state', () => {
    const { result } = renderHook(() => usePages());
    expect(result.current.pages).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.page).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetches pages successfully', async () => {
    mockGetNotionPages.mockResolvedValueOnce({
      success: true,
      data: { documents: [makeDocumentDetail()] },
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    });

    const { result } = renderHook(() => usePages());
    await act(async () => {
      await result.current.fetchPages();
    });

    expect(result.current.pages).toHaveLength(1);
    expect(result.current.pages[0].title).toBe('Page 1');
    expect(result.current.pages[0].embeddingStatus).toBe('pending');
    expect(result.current.total).toBe(1);
    expect(result.current.isLoading).toBe(false);
  });

  it('handles fetch error', async () => {
    mockGetNotionPages.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => usePages());
    await act(async () => {
      await result.current.fetchPages();
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.pages).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it('passes filter params to API', async () => {
    mockGetNotionPages.mockResolvedValueOnce({
      success: true,
      data: { documents: [] },
      meta: { page: 2, limit: 10, total: 0, totalPages: 0 },
    });

    const { result } = renderHook(() => usePages({ pageSize: 10 }));
    await act(async () => {
      await result.current.fetchPages({ status: 'completed', search: 'test', page: 2 });
    });

    expect(mockGetNotionPages).toHaveBeenCalledWith({
      status: 'COMPLETED',
      page: 2,
      limit: 10,
    });
  });

  it('updates page status locally', async () => {
    mockGetNotionPages.mockResolvedValueOnce({
      success: true,
      data: { documents: [makeDocumentDetail()] },
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    });

    const { result } = renderHook(() => usePages());
    await act(async () => {
      await result.current.fetchPages();
    });

    act(() => result.current.updatePageStatus('1', 'completed'));
    expect(result.current.pages[0].embeddingStatus).toBe('completed');
  });

  it('calculates totalPages correctly', async () => {
    mockGetNotionPages.mockResolvedValueOnce({
      success: true,
      data: { documents: [] },
      meta: { page: 1, limit: 20, total: 45, totalPages: 3 },
    });

    const { result } = renderHook(() => usePages({ pageSize: 20 }));
    await act(async () => {
      await result.current.fetchPages();
    });

    expect(result.current.totalPages).toBe(3);
  });
});
