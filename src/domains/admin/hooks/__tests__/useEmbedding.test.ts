import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEmbedding } from '../useEmbedding';
import { api } from '../../../../utils/api';

vi.mock('../../../../utils/api', () => ({
  api: {
    runPipeline: vi.fn(),
    retryPipeline: vi.fn(),
  },
}));

const mockRunPipeline = vi.mocked(api.runPipeline);
const mockRetryPipeline = vi.mocked(api.retryPipeline);

// getPages 헬퍼: pageId → documentId 매핑
const makeGetPages = (ids: string[]) => () =>
  ids.map((id) => ({
    id,
    title: `Page ${id}`,
    embeddingStatus: 'pending' as const,
    updatedAt: null,
    notionUrl: '',
    documentId: `doc-${id}`,
    documentStatus: 'PENDING' as const,
  }));

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
    mockRunPipeline.mockResolvedValueOnce({
      success: true,
      data: { id: 'job-1', documentId: 'doc-p1', status: 'EMBEDDING', chunkCount: null, vectorCount: null, errorMessage: null, createdAt: '', updatedAt: '' },
      meta: {},
    });

    const { result } = renderHook(() =>
      useEmbedding(onStatusUpdate, makeGetPages(['p1'])),
    );
    await act(async () => {
      await result.current.requestEmbedding(['p1']);
    });

    expect(mockRunPipeline).toHaveBeenCalledWith('doc-p1');
    expect(onStatusUpdate).toHaveBeenCalledWith('p1', 'processing');
    expect(result.current.isLoading).toBe(false);
  });

  it('handles embedding request failure with retry fallback', async () => {
    const onStatusUpdate = vi.fn();
    mockRunPipeline.mockRejectedValueOnce(new Error('Conflict'));
    mockRetryPipeline.mockRejectedValueOnce(new Error('Not in FAILED state'));

    const { result } = renderHook(() =>
      useEmbedding(onStatusUpdate, makeGetPages(['p1'])),
    );
    await act(async () => {
      await result.current.requestEmbedding(['p1']);
    });

    expect(onStatusUpdate).toHaveBeenCalledWith('p1', 'failed');
  });

  it('does nothing for empty pageIds', async () => {
    const { result } = renderHook(() => useEmbedding());
    await act(async () => {
      await result.current.requestEmbedding([]);
    });
    expect(mockRunPipeline).not.toHaveBeenCalled();
  });

  it('requests bulk embedding and tracks progress', async () => {
    const onStatusUpdate = vi.fn();
    const pipelineResponse = (docId: string) => ({
      success: true as const,
      data: { id: `job-${docId}`, documentId: docId, status: 'EMBEDDING' as const, chunkCount: null, vectorCount: null, errorMessage: null, createdAt: '', updatedAt: '' },
      meta: {},
    });

    mockRunPipeline
      .mockResolvedValueOnce(pipelineResponse('doc-p1'))
      .mockResolvedValueOnce(pipelineResponse('doc-p2'));

    const { result } = renderHook(() =>
      useEmbedding(onStatusUpdate, makeGetPages(['p1', 'p2'])),
    );
    await act(async () => {
      await result.current.requestBulkEmbedding(['p1', 'p2']);
    });

    expect(onStatusUpdate).toHaveBeenCalledWith('p1', 'processing');
    expect(onStatusUpdate).toHaveBeenCalledWith('p2', 'processing');
    expect(result.current.bulkProgress?.isRunning).toBe(false);
    expect(result.current.bulkProgress?.completed).toBe(2);
  });

  it('handles bulk embedding partial failure', async () => {
    const onStatusUpdate = vi.fn();
    mockRunPipeline.mockRejectedValueOnce(new Error('Fail'));
    mockRetryPipeline.mockRejectedValueOnce(new Error('Fail'));
    mockRunPipeline.mockResolvedValueOnce({
      success: true,
      data: { id: 'job-2', documentId: 'doc-p2', status: 'EMBEDDING' as const, chunkCount: null, vectorCount: null, errorMessage: null, createdAt: '', updatedAt: '' },
      meta: {},
    });

    const { result } = renderHook(() =>
      useEmbedding(onStatusUpdate, makeGetPages(['p1', 'p2'])),
    );
    await act(async () => {
      await result.current.requestBulkEmbedding(['p1', 'p2']);
    });

    expect(onStatusUpdate).toHaveBeenCalledWith('p1', 'failed');
    expect(result.current.bulkProgress?.completed).toBe(2);
    expect(result.current.bulkProgress?.isRunning).toBe(false);
  });
});
