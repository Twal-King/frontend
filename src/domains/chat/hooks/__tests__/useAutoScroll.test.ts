import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAutoScroll } from '../useAutoScroll';

describe('useAutoScroll', () => {
  it('should return a ref object', () => {
    const { result } = renderHook(() => useAutoScroll(['msg1']));
    expect(result.current.bottomRef).toBeDefined();
    expect(result.current.bottomRef.current).toBeNull();
  });

  it('should call scrollIntoView when deps change', () => {
    const scrollIntoViewMock = vi.fn();
    const { result, rerender } = renderHook(
      ({ deps }) => useAutoScroll(deps),
      { initialProps: { deps: ['msg1'] } },
    );

    // Simulate attaching a DOM element to the ref
    Object.defineProperty(result.current.bottomRef, 'current', {
      writable: true,
      value: { scrollIntoView: scrollIntoViewMock },
    });

    rerender({ deps: ['msg1', 'msg2'] });

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});
