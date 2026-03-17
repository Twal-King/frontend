import { cn } from '../../../utils/cn';
import { formatRelativeTime } from '../../../utils/format';
import { Checkbox } from '../../../components/Checkbox';
import { Button } from '../../../components/Button';
import { EmbeddingStatusBadge } from './EmbeddingStatusBadge';
import type { NotionPage } from '../types';

interface PageRowProps {
  page: NotionPage;
  selected: boolean;
  onToggle: (id: string) => void;
  onEmbed: (id: string) => void;
}

export function PageRow({ page, selected, onToggle, onEmbed }: PageRowProps) {
  const isActionDisabled = page.embeddingStatus === 'processing' || page.embeddingStatus === 'completed';
  const actionLabel = page.embeddingStatus === 'failed' ? '재시도' : '임베딩';

  return (
    <tr className={cn('border-b border-border transition-colors hover:bg-hover')}>
      <td className="px-4 py-3">
        <Checkbox
          checked={selected}
          onChange={() => onToggle(page.id)}
        />
      </td>
      <td className="px-4 py-3 text-sm text-primary">{page.title}</td>
      <td className="px-4 py-3">
        <EmbeddingStatusBadge status={page.embeddingStatus} />
      </td>
      <td className="px-4 py-3 text-xs text-secondary">
        {page.updatedAt ? formatRelativeTime(page.updatedAt) : '--'}
      </td>
      <td className="px-4 py-3">
        <Button
          size="sm"
          variant="secondary"
          disabled={isActionDisabled}
          onClick={() => onEmbed(page.id)}
        >
          {actionLabel}
        </Button>
      </td>
    </tr>
  );
}
