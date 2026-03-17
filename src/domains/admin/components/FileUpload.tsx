import { useState, useRef, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import { Button } from '../../../components/Button';
import { Spinner } from '../../../components/Spinner';
import { useFileUpload } from '../hooks/useFileUpload';

interface FileUploadProps {
  onUploadComplete?: () => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    isUploading,
    error,
    results,
    upload,
    clearResults,
    acceptedExtensions,
    maxFiles,
    maxFileSizeMb,
  } = useFileUpload(onUploadComplete);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const fileArray = Array.from(files).slice(0, maxFiles);
      setSelectedFiles(fileArray);
      clearResults();
    },
    [maxFiles, clearResults],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    await upload(selectedFiles);
    setSelectedFiles([]);
  }, [selectedFiles, upload]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 드래그 앤 드롭 영역 */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-colors',
          dragOver
            ? 'border-accent bg-accent/5'
            : 'border-border hover:border-border-focus hover:bg-hover/50',
        )}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-secondary">
          <path d="M12 16V4m0 0L8 8m4-4l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="text-center">
          <p className="text-sm text-primary">파일을 드래그하거나 클릭하여 선택</p>
          <p className="text-xs text-secondary mt-1">
            PDF, DOCX, TXT, MD · 최대 {maxFiles}개 · 파일당 {maxFileSizeMb}MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedExtensions.join(',')}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* 선택된 파일 목록 */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-secondary">{selectedFiles.length}개 파일 선택됨</p>
          <div className="flex flex-col gap-1">
            {selectedFiles.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center justify-between rounded-xl bg-card border border-border px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-accent shrink-0">
                    {file.name.split('.').pop()?.toUpperCase()}
                  </span>
                  <span className="text-sm text-primary truncate">{file.name}</span>
                  <span className="text-xs text-secondary shrink-0">{formatFileSize(file.size)}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="text-secondary hover:text-error transition-colors ml-2 shrink-0"
                  aria-label={`${file.name} 제거`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Spinner /> 업로드 중...
              </span>
            ) : (
              `${selectedFiles.length}개 파일 업로드`
            )}
          </Button>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}

      {/* 업로드 결과 */}
      {results.length > 0 && (
        <div className="flex flex-col gap-1">
          {results.map((r, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2 text-sm',
                r.success ? 'bg-success/10 text-success' : 'bg-error/10 text-error',
              )}
            >
              <span>{r.success ? '✓' : '✕'}</span>
              <span className="truncate">{r.fileName}</span>
              {r.error && <span className="text-xs ml-auto shrink-0">{r.error}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
