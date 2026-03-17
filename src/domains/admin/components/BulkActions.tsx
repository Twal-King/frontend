import { cn } from '../../../utils/cn';
import { Button } from '../../../components/Button';

interface BulkActionsProps {
  selectedCount: number;
  onBulkEmbed: () => void;
  bulkProgress: {
    isRunning: boolean;
    completed: number;
    total: number;
  } | null;
}

export function BulkActions({ selectedCount, onBulkEmbed, bulkProgress }: BulkActionsProps) {
  const isRunning = bulkProgress?.isRunning ?? false;

  if (selectedCount === 0 && !isRunning) {
    return null;
  }

  const progressPercent = isRunning && bulkProgress
    ? Math.round((bulkProgress.completed / bulkProgress.total) * 100)
    : 0;

  return (
    <div className={cn('flex items-center gap-4 rounded-xl bg-card border border-border px-4 py-3')}>
      <span className="text-sm text-primary">
        {selectedCount}개 선택됨
      </span>

      <Button
        variant="primary"
        size="sm"
        onClick={onBulkEmbed}
        disabled={selectedCount === 0 || isRunning}
      >
        일괄 임베딩
      </Button>

      {isRunning && bulkProgress && (
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-1 h-2 rounded-full bg-input overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-secondary whitespace-nowrap">
            {progressPercent}%
          </span>
        </div>
      )}
    </div>
  );
}
