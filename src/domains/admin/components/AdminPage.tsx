import { useState, useEffect, useCallback } from 'react';
import { usePages } from '../hooks/usePages';
import { useEmbedding } from '../hooks/useEmbedding';
import { useBulkSelection } from '../hooks/useBulkSelection';
import { usePageFilter } from '../hooks/usePageFilter';
import { FilterBar } from './FilterBar';
import { BulkActions } from './BulkActions';
import { PageTable } from './PageTable';
import { Pagination } from './Pagination';
import { FileUpload } from './FileUpload';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';

export function AdminPage() {
  const [showUpload, setShowUpload] = useState(false);

  const {
    pages,
    page,
    totalPages,
    isLoading,
    error,
    fetchPages,
    goToPage,
    updatePageStatus,
  } = usePages();

  const { filter, filteredPages, setStatus, setSearch } = usePageFilter(pages);

  const {
    selectedIds,
    toggle,
    selectAll,
    clear,
    isAllSelected,
  } = useBulkSelection();

  const getPages = useCallback(() => pages, [pages]);

  const { bulkProgress, requestEmbedding, requestBulkEmbedding } =
    useEmbedding(updatePageStatus, getPages);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      goToPage(newPage);
      fetchPages({ page: newPage, status: filter.status === 'all' ? undefined : filter.status, search: filter.search });
      clear();
    },
    [goToPage, fetchPages, filter, clear],
  );

  const handleStatusChange = useCallback(
    (status: Parameters<typeof setStatus>[0]) => {
      setStatus(status);
      clear();
    },
    [setStatus, clear],
  );

  const handleEmbed = useCallback(
    (id: string) => {
      requestEmbedding([id]);
    },
    [requestEmbedding],
  );

  const handleBulkEmbed = useCallback(() => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    requestBulkEmbedding(ids);
    clear();
  }, [selectedIds, requestBulkEmbedding, clear]);

  const handleSelectAll = useCallback(() => {
    const allIds = filteredPages.map((p) => p.id);
    if (isAllSelected(allIds)) {
      clear();
    } else {
      selectAll(allIds);
    }
  }, [filteredPages, isAllSelected, selectAll, clear]);

  return (
    <div className="flex flex-1 flex-col min-w-0 p-6">
      <div className="mx-auto w-full max-w-table flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-primary">임베딩 관리</h1>
          <Button
            variant={showUpload ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setShowUpload((v) => !v)}
          >
            {showUpload ? '닫기' : '📄 파일 업로드'}
          </Button>
        </div>

        {showUpload && (
          <Card>
            <FileUpload
              onUploadComplete={() => {
                fetchPages();
                setShowUpload(false);
              }}
            />
          </Card>
        )}

        <FilterBar
          filter={filter}
          onStatusChange={handleStatusChange}
          onSearchChange={setSearch}
          onBulkEmbed={handleBulkEmbed}
          selectedCount={selectedIds.size}
        />

        <BulkActions
          selectedCount={selectedIds.size}
          onBulkEmbed={handleBulkEmbed}
          bulkProgress={bulkProgress}
        />

        <PageTable
          pages={filteredPages}
          selectedIds={selectedIds}
          isAllSelected={isAllSelected(filteredPages.map((p) => p.id))}
          onToggle={toggle}
          onSelectAll={handleSelectAll}
          onEmbed={handleEmbed}
          isLoading={isLoading}
          error={error}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
