import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useBulkSelection } from '../useBulkSelection';

describe('useBulkSelection', () => {
  it('starts with empty selection', () => {
    const { result } = renderHook(() => useBulkSelection());
    expect(result.current.selectedIds.size).toBe(0);
  });

  it('toggles a single id on', () => {
    const { result } = renderHook(() => useBulkSelection());
    act(() => result.current.toggle('a'));
    expect(result.current.isSelected('a')).toBe(true);
  });

  it('toggles a single id off', () => {
    const { result } = renderHook(() => useBulkSelection());
    act(() => result.current.toggle('a'));
    act(() => result.current.toggle('a'));
    expect(result.current.isSelected('a')).toBe(false);
  });

  it('selects all given ids', () => {
    const { result } = renderHook(() => useBulkSelection());
    act(() => result.current.selectAll(['a', 'b', 'c']));
    expect(result.current.isAllSelected(['a', 'b', 'c'])).toBe(true);
    expect(result.current.selectedIds.size).toBe(3);
  });

  it('clears selection', () => {
    const { result } = renderHook(() => useBulkSelection());
    act(() => result.current.selectAll(['a', 'b']));
    act(() => result.current.clear());
    expect(result.current.selectedIds.size).toBe(0);
  });

  it('isAllSelected returns false for empty ids array', () => {
    const { result } = renderHook(() => useBulkSelection());
    expect(result.current.isAllSelected([])).toBe(false);
  });

  it('isAllSelected returns false when only some are selected', () => {
    const { result } = renderHook(() => useBulkSelection());
    act(() => result.current.toggle('a'));
    expect(result.current.isAllSelected(['a', 'b'])).toBe(false);
  });
});
