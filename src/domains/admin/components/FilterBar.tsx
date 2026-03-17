import { cn } from '../../../utils/cn';
import { Tabs } from '../../../components/Tabs';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import type { EmbeddingStatus } from '../types';

const STATUS_TABS = [
  { key: 'all', label: '전체' },
  { key: 'pending', label: '대기' },
  { key: 'processing', label: '진행 중' },
  { key: 'completed', label: '완료' },
  { key: 'failed', label: '실패' },
] as const;

interface FilterBarProps {
  filter: {
    status: EmbeddingStatus | 'all';
    search: string;
  };
  onStatusChange: (status: EmbeddingStatus | 'all') => void;
  onSearchChange: (search: string) => void;
  onBulkEmbed: () => void;
  selectedCount: number;
}

export function FilterBar({
  filter,
  onStatusChange,
  onSearchChange,
  onBulkEmbed,
  selectedCount,
}: FilterBarProps) {
  return (
    <div className={cn('flex flex-col gap-4')}>
      <Tabs
        tabs={STATUS_TABS.map((t) => ({ key: t.key, label: t.label }))}
        activeKey={filter.status}
        onChange={(key) => onStatusChange(key as EmbeddingStatus | 'all')}
      />
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            placeholder="페이지 검색..."
            value={filter.search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button
          variant="primary"
          onClick={onBulkEmbed}
          disabled={selectedCount === 0}
        >
          일괄 임베딩
        </Button>
      </div>
    </div>
  );
}
