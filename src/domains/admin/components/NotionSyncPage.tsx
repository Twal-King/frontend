import { useEffect, useState, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Checkbox } from '../../../components/Checkbox';
import { Spinner } from '../../../components/Spinner';
import { Card } from '../../../components/Card';
import { useWorkspace } from '../hooks/useWorkspace';
import { useBulkSelection } from '../hooks/useBulkSelection';
import { formatRelativeTime } from '../../../utils/format';

export function NotionSyncPage() {
  const {
    pages, isLoading, error, syncResults, isSyncing,
    fetchWorkspacePages, syncPages, importPage, clearSyncResults,
  } = useWorkspace();

  const { selectedIds, toggle, selectAll, clear, isAllSelected } = useBulkSelection();
  const [importId, setImportId] = useState('');
  const [importMsg, setImportMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { fetchWorkspacePages(); }, [fetchWorkspacePages]);

  const handleSync = useCallback(() => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    syncPages(ids);
    clear();
  }, [selectedIds, syncPages, clear]);

  const handleSelectAll = useCallback(() => {
    const allIds = pages.map((p) => p.id);
    isAllSelected(allIds) ? clear() : selectAll(allIds);
  }, [pages, isAllSelected, selectAll, clear]);

  const handleImport = useCallback(async () => {
    const id = importId.trim();
    if (!id) return;
    setImportMsg(null);
    const result = await importPage(id);
    if (result) {
      setImportMsg({ type: 'success', text: `${result.isUpdate ? '업데이트' : '임포트'} 완료` });
      setImportId('');
      fetchWorkspacePages();
    } else {
      setImportMsg({ type: 'error', text: '임포트에 실패했습니다.' });
    }
  }, [importId, importPage, fetchWorkspacePages]);

  return (
    <div className="flex flex-1 flex-col min-w-0 p-6">
      <div className="mx-auto w-full max-w-table flex flex-col gap-6">
        <h1 className="text-xl font-semibold text-primary">Notion 동기화</h1>

        {/* 개별 임포트 */}
        <Card>
          <p className="text-sm text-secondary mb-3">Notion 페이지 ID로 직접 임포트</p>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Notion 페이지 UUID 입력..."
                value={importId}
                onChange={(e) => setImportId(e.target.value)}
              />
            </div>
            <Button variant="primary" onClick={handleImport} disabled={!importId.trim()}>
              임포트
            </Button>
          </div>
          {importMsg && (
            <p className={cn('text-sm mt-2', importMsg.type === 'success' ? 'text-success' : 'text-error')}>
              {importMsg.text}
            </p>
          )}
        </Card>

        {/* 워크스페이스 페이지 목록 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary">워크스페이스 페이지 ({pages.length}개)</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={fetchWorkspacePages} disabled={isLoading}>
              새로고침
            </Button>
            <Button variant="primary" size="sm" onClick={handleSync} disabled={selectedIds.size === 0 || isSyncing}>
              {isSyncing ? '동기화 중...' : `${selectedIds.size}개 동기화`}
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : pages.length === 0 ? (
          <div className="flex justify-center py-16">
            <p className="text-sm text-secondary">워크스페이스에 접근 가능한 페이지가 없습니다</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3">
                    <Checkbox checked={isAllSelected(pages.map((p) => p.id))} onChange={handleSelectAll} />
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-secondary">페이지 제목</th>
                  <th className="px-4 py-3 text-xs font-medium text-secondary">마지막 수정</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id} className="border-b border-border hover:bg-hover transition-colors">
                    <td className="px-4 py-3">
                      <Checkbox checked={selectedIds.has(page.id)} onChange={() => toggle(page.id)} />
                    </td>
                    <td className="px-4 py-3 text-sm text-primary">{page.title}</td>
                    <td className="px-4 py-3 text-xs text-secondary">{formatRelativeTime(page.lastEditedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 동기화 결과 */}
        {syncResults.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-primary">동기화 결과</p>
              <Button variant="ghost" size="sm" onClick={clearSyncResults}>닫기</Button>
            </div>
            <div className="flex flex-col gap-1">
              {syncResults.map((r, i) => (
                <div key={i} className={cn('flex items-center gap-2 rounded-xl px-3 py-2 text-sm', r.success ? 'bg-success/10 text-success' : 'bg-error/10 text-error')}>
                  <span>{r.success ? '✓' : '✕'}</span>
                  <span className="truncate">{r.notionPageId}</span>
                  {r.error && <span className="text-xs ml-auto">{r.error}</span>}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
