import { useEffect } from 'react';
import { Card } from '../../../components/Card';
import { Spinner } from '../../../components/Spinner';
import { useGuide } from '../hooks/useGuide';

export function GuidePage() {
  const { guide, isLoading, error, fetchGuide } = useGuide();

  useEffect(() => { fetchGuide(); }, [fetchGuide]);

  return (
    <div className="flex flex-1 flex-col min-w-0 p-6">
      <div className="mx-auto w-full max-w-chat flex flex-col gap-6">
        <h1 className="text-xl font-semibold text-primary">임베딩 가이드</h1>

        {error && <p className="text-sm text-error">{error}</p>}

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : guide && (
          <>
            {/* 지원 포맷 */}
            <Card>
              <h2 className="text-sm font-semibold text-primary mb-3">지원 파일 형식</h2>
              <p className="text-xs text-secondary mb-3">파일당 최대 {guide.maxFileSizeMb}MB</p>
              <div className="flex flex-col gap-2">
                {guide.supportedFormats.map((f) => (
                  <div key={f.extension} className="flex items-center gap-3 rounded-xl bg-input px-3 py-2">
                    <span className="text-xs font-medium text-accent w-12">{f.extension}</span>
                    <span className="text-sm text-primary">{f.description}</span>
                    <span className="text-xs text-secondary ml-auto">{f.mimeType}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* 권장 구조 */}
            <Card>
              <h2 className="text-sm font-semibold text-primary mb-3">권장 문서 구조</h2>
              <div className="flex flex-col gap-1.5">
                {guide.recommendedStructure.map((item, i) => (
                  <p key={i} className="text-sm text-primary">• {item}</p>
                ))}
              </div>
            </Card>

            {/* 최적화 팁 */}
            <Card>
              <h2 className="text-sm font-semibold text-primary mb-3">최적화 팁</h2>
              <div className="flex flex-col gap-1.5">
                {guide.optimizationTips.map((tip, i) => (
                  <p key={i} className="text-sm text-success">✓ {tip}</p>
                ))}
              </div>
            </Card>

            {/* 안티패턴 */}
            <Card>
              <h2 className="text-sm font-semibold text-primary mb-3">피해야 할 패턴</h2>
              <div className="flex flex-col gap-1.5">
                {guide.antiPatterns.map((item, i) => (
                  <p key={i} className="text-sm text-error">✕ {item}</p>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
