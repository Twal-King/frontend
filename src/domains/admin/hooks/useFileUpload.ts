import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import type { Document } from '../types';

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 50;
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
];
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.md'];

interface UploadResult {
  success: boolean;
  document?: Document;
  error?: string;
  fileName: string;
}

export function useFileUpload(onSuccess?: () => void) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<UploadResult[]>([]);

  const validateFiles = useCallback((files: File[]): string | null => {
    if (files.length === 0) return '파일을 선택해주세요.';
    if (files.length > MAX_FILES) return `최대 ${MAX_FILES}개까지 업로드할 수 있습니다.`;

    for (const file of files) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(ext);
      if (!isValidType) {
        return `지원하지 않는 파일 형식입니다: ${file.name} (PDF, DOCX, TXT, MD만 가능)`;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return `파일 크기가 너무 큽니다: ${file.name} (최대 ${MAX_FILE_SIZE_MB}MB)`;
      }
    }
    return null;
  }, []);

  const upload = useCallback(
    async (files: File[]) => {
      const validationError = validateFiles(files);
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsUploading(true);
      setError(null);
      setResults([]);

      try {
        const res = await api.uploadDocuments(files);
        const uploadResults: UploadResult[] = res.data.results.map((r, i) => ({
          ...r,
          fileName: files[i]?.name ?? 'unknown',
        }));
        setResults(uploadResults);

        const failedCount = uploadResults.filter((r) => !r.success).length;
        if (failedCount > 0) {
          setError(`${failedCount}개 파일 업로드에 실패했습니다.`);
        } else {
          onSuccess?.();
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : '파일 업로드에 실패했습니다.';
        setError(msg);
      } finally {
        setIsUploading(false);
      }
    },
    [validateFiles, onSuccess],
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    isUploading,
    error,
    results,
    upload,
    clearResults,
    acceptedExtensions: ACCEPTED_EXTENSIONS,
    maxFiles: MAX_FILES,
    maxFileSizeMb: MAX_FILE_SIZE_MB,
  } as const;
}
