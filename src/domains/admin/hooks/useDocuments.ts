import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import type { Document, DocumentDetail, DocumentStatus, PipelineJob } from '../types';

export function useDocuments(pageSize = 20) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 상세
  const [detail, setDetail] = useState<DocumentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 파이프라인 이력
  const [jobs, setJobs] = useState<PipelineJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  // 미리보기
  const [preview, setPreview] = useState<{ estimatedChunks: number; qualityScore: number; suggestions: string[] } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const fetchDocuments = useCallback(async (params?: { status?: DocumentStatus; sourceType?: string; page?: number }) => {
    const targetPage = params?.page ?? page;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getDocuments({ status: params?.status, sourceType: params?.sourceType, page: targetPage, limit: pageSize });
      setDocuments(res.data.documents);
      setTotal(res.meta.total);
      setPage(targetPage);
    } catch (e) {
      setError(e instanceof Error ? e.message : '문서 목록을 불러올 수 없습니다.');
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  const fetchDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await api.getDocument(id);
      setDetail(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '문서 상세를 불러올 수 없습니다.');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (id: string) => {
    try {
      await api.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      setTotal((prev) => prev - 1);
      if (detail?.id === id) setDetail(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : '문서 삭제에 실패했습니다.');
    }
  }, [detail]);

  const fetchJobs = useCallback(async (documentId: string) => {
    setJobsLoading(true);
    try {
      const res = await api.getPipelineJobs(documentId);
      setJobs(res.data.jobs);
    } catch (e) {
      setError(e instanceof Error ? e.message : '파이프라인 이력을 불러올 수 없습니다.');
    } finally {
      setJobsLoading(false);
    }
  }, []);

  const fetchPreview = useCallback(async (documentId: string) => {
    setPreviewLoading(true);
    setPreview(null);
    try {
      const res = await api.previewDocument(documentId);
      setPreview({ estimatedChunks: res.data.estimatedChunks, qualityScore: res.data.qualityScore, suggestions: res.data.optimizationSuggestions });
    } catch (e) {
      setError(e instanceof Error ? e.message : '미리보기에 실패했습니다.');
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => { setDetail(null); setJobs([]); setPreview(null); }, []);
  const goToPage = useCallback((p: number) => setPage(p), []);
  const totalPages = Math.ceil(total / pageSize);

  return {
    documents, total, page, totalPages, isLoading, error,
    detail, detailLoading, jobs, jobsLoading, preview, previewLoading,
    fetchDocuments, fetchDetail, deleteDocument, fetchJobs, fetchPreview,
    closeDetail, goToPage,
  } as const;
}
