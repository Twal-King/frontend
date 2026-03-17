import { useEffect, useState } from 'react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Card } from '../../../components/Card';
import { Spinner } from '../../../components/Spinner';
import { useChunkingConfig } from '../hooks/useChunkingConfig';
import { formatRelativeTime } from '../../../utils/format';

export function SettingsPage() {
  const { config, isLoading, isSaving, error, success, fetchConfig, updateConfig, clearSuccess } = useChunkingConfig();
  const [maxTokens, setMaxTokens] = useState('');
  const [overlapTokens, setOverlapTokens] = useState('');

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  useEffect(() => {
    if (config) {
      setMaxTokens(String(config.maxTokens));
      setOverlapTokens(String(config.overlapTokens));
    }
  }, [config]);

  const handleSave = () => {
    const max = parseInt(maxTokens, 10);
    const overlap = parseInt(overlapTokens, 10);
    if (isNaN(max) || isNaN(overlap)) return;
    clearSuccess();
    updateConfig(max, overlap);
  };

  const maxVal = parseInt(maxTokens, 10);
  const overlapVal = parseInt(overlapTokens, 10);
  const isValid = !isNaN(maxVal) && maxVal >= 100 && maxVal <= 2000
    && !isNaN(overlapVal) && overlapVal >= 0 && overlapVal <= maxVal * 0.5;

  return (
    <div className="flex flex-1 flex-col min-w-0 p-6">
      <div className="mx-auto w-full max-w-chat flex flex-col gap-6">
        <h1 className="text-xl font-semibold text-primary">청킹 설정</h1>

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : (
          <Card>
            <div className="flex flex-col gap-5">
              <div>
                <Input
                  label="최대 토큰 수 (100~2000)"
                  type="number"
                  min={100}
                  max={2000}
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(e.target.value)}
                />
                <p className="text-xs text-secondary mt-1">청크당 최대 토큰 수입니다.</p>
              </div>

              <div>
                <Input
                  label="오버랩 토큰 수"
                  type="number"
                  min={0}
                  value={overlapTokens}
                  onChange={(e) => setOverlapTokens(e.target.value)}
                />
                <p className="text-xs text-secondary mt-1">
                  청크 간 겹치는 토큰 수입니다. 최대 토큰의 50% 이하여야 합니다.
                  {maxVal > 0 && ` (최대 ${Math.floor(maxVal * 0.5)})`}
                </p>
              </div>

              {error && <p className="text-sm text-error">{error}</p>}
              {success && <p className="text-sm text-success">설정이 저장되었습니다.</p>}

              <div className="flex items-center justify-between">
                <div className="text-xs text-secondary">
                  {config?.updatedAt && `마지막 수정: ${formatRelativeTime(config.updatedAt)}`}
                </div>
                <Button variant="primary" onClick={handleSave} disabled={!isValid || isSaving}>
                  {isSaving ? '저장 중...' : '저장'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
