import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePageFilter } from '../usePageFilter';
import type { NotionPage } from '../../types';

const makePage = (overrides: Partial<NotionPage> = {}): NotionPage => ({
  id: 'p1',
  title: 'Test Page',
  embeddingStatus: 'pending',
  updatedAt: null,
  notionUrl: 'https://notion.so/p1',
  ...overrides,
});

const pages: NotionPage[] = [
  makePage({ id: '1', title: 'Project Overview', embeddingStatus: 'completed' }),
  makePage({ id: '2', title: 'API Documentation', embeddingStatus: 'pending' }),
  makePage({ id: '3', title: 'Meeting Notes', embeddingStatus: 'failed' }),
  makePage({ id: '4', title: 'Design Guide', embeddingStatus: 'processing' }),
];

describe('usePageFilter', () => {
  it('starts with all status and empty search', () => {
    const { result } = renderHook(() => usePageFilter(pages));
    expect(result.current.filter).toEqual({ status: 'all', search: '' });
    expect(result.current.filteredPages).toHaveLength(4);
  });

  it('filters by embedding status', () => {
    const { result } = renderHook(() => usePageFilter(pages));
    act(() => result.current.setStatus('completed'));
    expect(result.current.filteredPages).toHaveLength(1);
    expect(result.current.filteredPages[0].id).toBe('1');
  });

  it('filters by search text (case-insensitive)', () => {
    const { result } = renderHook(() => usePageFilter(pages));
    act(() => result.current.setSearch('api'));
    expect(result.current.filteredPages).toHaveLength(1);
    expect(result.current.filteredPages[0].id).toBe('2');
  });

  it('combines status and search filters', () => {
    const { result } = renderHook(() => usePageFilter(pages));
    act(() => result.current.setStatus('pending'));
    act(() => result.current.setSearch('api'));
    expect(result.current.filteredPages).toHaveLength(1);
    expect(result.current.filteredPages[0].id).toBe('2');
  });

  it('returns empty when no match', () => {
    const { result } = renderHook(() => usePageFilter(pages));
    act(() => result.current.setSearch('nonexistent'));
    expect(result.current.filteredPages).toHaveLength(0);
  });

  it('resets filter', () => {
    const { result } = renderHook(() => usePageFilter(pages));
    act(() => {
      result.current.setStatus('failed');
      result.current.setSearch('meeting');
    });
    act(() => result.current.resetFilter());
    expect(result.current.filter).toEqual({ status: 'all', search: '' });
    expect(result.current.filteredPages).toHaveLength(4);
  });
});
