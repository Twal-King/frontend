import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePages } from '../usePages';
import { api } from '../../../../utils/api';

vi.mock('../../../../utils/api', () => ({
  api: {
    getPages: vi.fn(),
  },
}));

const mockGetPages = vi.mocked(api.getPages);

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
    const mockPages = [
      { id: '1', title: 'Page 1', embeddingStatus: 'pending' as const, updatedAt: null, notionUrl: 'https://notion.so/1' },
    ];
    mockGetPages.mockResolvedValueOnce({ pages: mockPages, total: 1 });

    const { result } = renderHook(() => usePages());
    await act(async () => {
      await result.current.fetchPages();
    });

    expect(result.current.pages).toEqual(mockPages);
    expect(result.current.total).toBe(1);
    expect(result.current.isLoading).toBe(false);
  });

  it('handles fetch error', async () => {
    mockGetPages.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => usePages());
    await act(async () => {
      await result.current.fetchPages();
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.pages).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it('passes filter params to API', async () => {
    mockGetPages.mockResolvedValueOnce({ pages: [], total: 0 });

    const { result } = renderHook(() => usePages({ pageSize: 10 }));
    await act(async () => {
      await result.current.fetchPages({ status: 'completed', search: 'test', page: 2 });
    });

    expect(mockGetPages).toHaveBeenCalledWith({
      status: 'completed',
      search: 'test',
      page: 2,
      pageSize: 10,
    });
  });

  it('updates page status locally', async () => {
    const mockPages = [
      { id: '1', title: 'Page 1', embeddingStatus: 'pending' as const, updatedAt: null, notionUrl: 'https://notion.so/1' },
    ];
    mockGetPages.mockResolvedValueOnce({ pages: mockPages, total: 1 });

    const { result } = renderHook(() => usePages());
    await act(async () => {
      await result.current.fetchPages();
    });

    act(() => result.current.updatePageStatus('1', 'completed'));
    expect(result.current.pages[0].embeddingStatus).toBe('completed');
  });

  it('calculates totalPages correctly', async () => {
    mockGetPages.mockResolvedValueOnce({ pages: [], total: 45 });

    const { result } = renderHook(() => usePages({ pageSize: 20 }));
    await act(async () => {
      await result.current.fetchPages();
    });

    expect(result.current.totalPages).toBe(3);
  });
});
