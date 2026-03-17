import { useEffect, useState, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import { Button } from '../../../components/Button';
import { Spinner } from '../../../components/Spinner';
import { Card } from '../../../components/Card';
import { Tabs } from '../../../components/Tabs';
import { Modal } from '../../../components/Modal';
import { Pagination } from './Pagination';
import { useDocuments } from '../hooks/useDocuments';
import { formatRelativeTime } from '../../../utils/format';
import type { DocumentStatus } from '../types';

const SOURCE_TABS = [
  { key: 'all', label: '전체' },
  { key: 'FILE_UPLOAD', label: '파일 업로드' },
  { key: 'NOTION', label: 'Notion' },
];

const STATUS_LABELS: Record<DocumentStatus, { label: string; className: string }> = {
  PENDING: { label: '대기', className: 'bg-secondary/10 text-secondary' },
  PREPROCESSING: { label: '전처리', className: 'bg-warning/10 text-warning' },
  CHUNKING: { label: '청킹', className: 'bg-warning/10 text-warning' },
  EMBEDDING: { label: '임베딩', className: 'bg-warning/10 text-warning' },
  STORING: { label: '저장', className: 'bg-warning/10 text-warning' },
  SYNCING: { label: '동기화', className: 'bg-warning/10 text-warning' },
  COMPLETED: { label: '완료', className: 'bg-success/10 text-success' },
  FAILED: { label: '실패', className: 'bg-error/10 text-error' },
};

export function DocumentsPage() {
  const {
    documents, page, totalPages, isLoading, error,
    detail, detailLoading, jobs, jobsLoading, preview, previewLoading,
    fetchDocuments, fetchDetail, deleteDocument, fetchJobs, fetchPreview,
    closeDetail, goToPage,
  } = useDocuments();

  const [sourceFilter, setSourceFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const handleSourceChange = useCallback((key: string) => {
    setSourceFilter(key);
    fetchDocuments({ sourceType: key === 'all' ? undefined : key, page: 1 });
  }, [fetchDocuments]);

  const handlePageChange = useCallback((p: number) => {
    goToPage(p);
    fetchDocuments({ sourceType: sourceFilter === 'all' ? undefined : sourceFilter, page: p });
  }, [goToPage, fetchDocuments, sourceFilter]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteDocument(deleteTarget);
    setDeleteTarget(null);
  }, [deleteTarget, deleteDocument]);

  const handleViewDetail = useCallback((id: string) => {
    fetchDetail(id);
    fetchJobs(id);
  }, [fetchDetail, fetchJobs]);

  return (
    <div className="flex flex-1 flex-col min-w-0 p-6">
      <div className="mx-auto w-full max-w-table flex flex-col gap-6">
        <h1 className="text-xl font-semibold text-primary">문서 관리</h1>

        <Tabs tabs={SOURCE_TABS} activeKey={sourceFilter} onChange={handleSourceChange} />

        {error && <p className="text-sm text-error">{error}</p>}

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : documents.length === 0 ? (
          <div className="flex justify-center py-16">
            <p className="text-sm text-secondary">문서가 없습니다</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-medium text-secondary">파일명</th>
                  <th className="px-4 py-3 text-xs font-medium text-secondary">소스</th>
                  <th className="px-4 py-3 text-xs font-medium text-secondary">상태</th>
                  <th className="px-4 py-3 text-xs font-medium text-secondary">업데이트</th>
                  <th className="px-4 py-3 text-xs font-medium text-secondary">액션</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => {
                  const st = STATUS_LABELS[doc.status];
                  return (
                    <tr key={doc.id} className="border-b border-border hover:bg-hover transition-colors">
                      <td className="px-4 py-3 text-sm text-primary truncate max-w-[300px]">{doc.fileName}</td>
                      <td className="px-4 py-3 text-xs text-secondary">{doc.sourceType === 'NOTION' ? 'Notion' : '파일'}</td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium', st.className)}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-secondary">{formatRelativeTime(doc.updatedAt)}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDetail(doc.id)}>상세</Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(doc.id)}>삭제</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />

        {/* 삭제 확인 모달 */}
        <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="문서 삭제">
          <p className="text-sm text-secondary mb-4">이 문서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>취소</Button>
            <Button variant="primary" size="sm" onClick={handleDelete} className="bg-error hover:bg-error/80">삭제</Button>
          </div>
        </Modal>

        {/* 문서 상세 모달 */}
        <Modal open={!!detail} onClose={closeDetail} title={detail?.fileName ?? '문서 상세'}>
          {detailLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : detail && (
            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-secondary">소스:</span> <span className="text-primary">{detail.sourceType === 'NOTION' ? 'Notion' : '파일'}</span></div>
                <div><span className="text-secondary">상태:</span> <span className={cn('inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium', STATUS_LABELS[detail.status].className)}>{STATUS_LABELS[detail.status].label}</span></div>
                <div><span className="text-secondary">크기:</span> <span className="text-primary">{(detail.fileSize / 1024).toFixed(1)}KB</span></div>
                <div><span className="text-secondary">타입:</span> <span className="text-primary">{detail.mimeType}</span></div>
                {detail.errorMessage && <div className="col-span-2 text-error text-sm">에러: {detail.errorMessage}</div>}
              </div>

              {detail.notionSource && (
                <Card className="p-3">
                  <p className="text-xs text-secondary mb-1">Notion 소스</p>
                  <p className="text-sm text-primary">{detail.notionSource.pageTitle}</p>
                  <p className="text-xs text-secondary mt-1">마지막 동기화: {formatRelativeTime(detail.notionSource.lastSyncedAt)}</p>
                </Card>
              )}

              {/* 미리보기 */}
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => fetchPreview(detail.id)} disabled={previewLoading}>
                  {previewLoading ? '분석 중...' : '청킹 미리보기'}
                </Button>
              </div>
              {preview && (
                <Card className="p-3">
                  <div className="flex gap-4 text-sm mb-2">
                    <span className="text-secondary">예상 청크: <span className="text-primary">{preview.estimatedChunks}개</span></span>
                    <span className="text-secondary">품질 점수: <span className="text-primary">{(preview.qualityScore * 100).toFixed(0)}%</span></span>
                  </div>
                  {preview.suggestions.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-secondary">최적화 제안:</p>
                      {preview.suggestions.map((s, i) => (
                        <p key={i} className="text-xs text-primary">• {s}</p>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* 청크 목록 */}
              {detail.chunks.length > 0 && (
                <div>
                  <p className="text-xs text-secondary mb-2">청크 ({detail.chunks.length}개)</p>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {detail.chunks.map((chunk) => (
                      <Card key={chunk.id} className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-secondary">#{chunk.chunkIndex}{chunk.sectionTitle && ` · ${chunk.sectionTitle}`}</span>
                          <span className="text-xs text-secondary">{chunk.tokenCount} tokens</span>
                        </div>
                        <p className="text-xs text-primary line-clamp-3">{chunk.content}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* 파이프라인 이력 */}
              <div>
                <p className="text-xs text-secondary mb-2">파이프라인 이력</p>
                {jobsLoading ? (
                  <Spinner />
                ) : jobs.length === 0 ? (
                  <p className="text-xs text-secondary">이력이 없습니다</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {jobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between rounded-xl bg-input px-3 py-2">
                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium', STATUS_LABELS[job.status].className)}>
                          {STATUS_LABELS[job.status].label}
                        </span>
                        <div className="flex gap-3 text-xs text-secondary">
                          {job.chunkCount != null && <span>{job.chunkCount} chunks</span>}
                          {job.vectorCount != null && <span>{job.vectorCount} vectors</span>}
                          <span>{formatRelativeTime(job.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
