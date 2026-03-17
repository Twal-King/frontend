import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEmbedding } from '../useEmbedding';
import { api } from '../../../../utils/api';

vi.mock('../../../../utils/api', () => ({
  api: {
    requestEmbedding: vi.fn(),
  },
}));

const mockRequestEmbedding = vi.mocked(api.requestEmbedding);

describe('useEmbedding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with idle state', () => {
    const { result } = renderHook(() => useEmbedding());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.bulkProgress).toBeNull();
  });

  it('requests embedding for single page', async () => {
    const onStatusUpdate = vi.fn();
    mockRequestEmbedding.mockResolvedValueOnce([
      { pageId: 'p1', status: 'completed' },
    ]);

    const { result } = renderHook(() => useEmbedding(onStatusUpdate));
    await act(async () => {
      await result.current.requestEmbedding(['p1']);
    });

    expect(onStatusUpdate).toHaveBeenCalledWith('p1', 'processing');
    expect(onStatusUpdate).toHaveBeenCalledWith('p1', 'completed');
    expect(result.current.isLoading).toBe(false);
  });

  it('handles embedding request failure', async () => {
    const onStatusUpdate = vi.fn();
    mockRequestEmbedding.mockRejectedValueOnce(new Error('Server error'));

    const { result } = renderHook(() => useEmbedding(onStatusUpdate));
    await act(async () => {
      await result.current.requestEmbedding(['p1']);
    });

    expect(result.current.error).toBe('Server error');
    expect(onStatusUpdate).toHaveBeenCalledWith('p1', 'failed');
  });

  it('does nothing for empty pageIds', async () => {
    const { result } = renderHook(() => useEmbedding());
    await act(async () => {
      await result.current.requestEmbedding([]);
    });
    expect(mockRequestEmbedding).not.toHaveBeenCalled();
  });

  it('requests bulk embedding and tracks progress', async () => {
    const onStatusUpdate = vi.fn();
    mockRequestEmbedding.mockResolvedValueOnce([
      { pageId: 'p1', status: 'completed' },
      { pageId: 'p2', status: 'completed' },
    ]);

    const { result } = renderHook(() => useEmbedding(onStatusUpdate));
    await act(async () => {
      await result.current.requestBulkEmbedding(['p1', 'p2']);
    });

    expect(onStatusUpdate).toHaveBeenCalledWith('p1', 'processing');
    expect(onStatusUpdate).toHaveBeenCalledWith('p2', 'processing');
    expect(onStatusUpdate).toHaveBeenCalledWith('p1', 'completed');
    expect(onStatusUpdate).toHaveBeenCalledWith('p2', 'completed');
    expect(result.current.bulkProgress?.isRunning).toBe(false);
  });

  it('handles bulk embedding failure', async () => {
    const onStatusUpdate = vi.fn();
    mockRequestEmbedding.mockRejectedValueOnce(new Error('Bulk failed'));

    const { result } = renderHook(() => useEmbedding(onStatusUpdate));
    await act(async () => {
      await result.current.requestBulkEmbedding(['p1', 'p2']);
    });

    expect(result.current.error).toBe('Bulk failed');
    expect(onStatusUpdate).toHaveBeenCalledWith('p1', 'failed');
    expect(onStatusUpdate).toHaveBeenCalledWith('p2', 'failed');
  });
});
