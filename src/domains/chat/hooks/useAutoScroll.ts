import { useRef, useEffect } from 'react';

export function useAutoScroll<T>(deps: T[]) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [deps]);

  return { bottomRef } as const;
}
