import { Checkbox } from '../../../components/Checkbox';
import { Spinner } from '../../../components/Spinner';
import { PageRow } from './PageRow';
import type { NotionPage } from '../types';

interface PageTableProps {
  pages: NotionPage[];
  selectedIds: Set<string>;
  isAllSelected: boolean;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onEmbed: (id: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function PageTable({
  pages,
  selectedIds,
  isAllSelected,
  onToggle,
  onSelectAll,
  onEmbed,
  isLoading,
  error,
}: PageTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-error">{error}</p>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-secondary">표시할 페이지가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 py-3">
              <Checkbox checked={isAllSelected} onChange={onSelectAll} />
            </th>
            <th className="px-4 py-3 text-xs font-medium text-secondary">페이지 제목</th>
            <th className="px-4 py-3 text-xs font-medium text-secondary">상태</th>
            <th className="px-4 py-3 text-xs font-medium text-secondary">업데이트</th>
            <th className="px-4 py-3 text-xs font-medium text-secondary">액션</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <PageRow
              key={page.id}
              page={page}
              selected={selectedIds.has(page.id)}
              onToggle={onToggle}
              onEmbed={onEmbed}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
