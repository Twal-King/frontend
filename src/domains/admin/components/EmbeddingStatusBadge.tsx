import { cn } from '../../../utils/cn';
import type { EmbeddingStatus } from '../types';

const STATUS_CONFIG: Record<EmbeddingStatus, { label: string; className: string }> = {
  pending: { label: '대기', className: 'bg-secondary/10 text-secondary' },
  processing: { label: '진행 중', className: 'bg-warning/10 text-warning' },
  completed: { label: '완료', className: 'bg-success/10 text-success' },
  failed: { label: '실패', className: 'bg-error/10 text-error' },
};

export function EmbeddingStatusBadge({ status }: { status: EmbeddingStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium', config.className)}>
      {config.label}
    </span>
  );
}
