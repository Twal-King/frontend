# Notion 검색 챗봇 & 임베딩 관리 백오피스

Notion 페이지 콘텐츠를 자연어로 검색할 수 있는 챗봇 인터페이스와, Notion 페이지의 임베딩 생성 및 상태를 관리하는 백오피스 시스템의 프론트엔드입니다.

## 기술 스택

- React 19 + TypeScript 5.9
- Vite 8 (빌드 도구)
- Tailwind CSS (다크 테마 커스텀 디자인 시스템)
- React Router v7 (SPA 라우팅)
- Vitest + React Testing Library + fast-check (테스트)
- clsx + tailwind-merge (유틸리티)

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 린트
npm run lint

# 테스트 실행
npm run test

# 테스트 워치 모드
npm run test:watch
```

## 프로젝트 구조

```
src/
├── app/                    # 앱 엔트리 및 라우팅
│   ├── App.tsx             # RouterProvider 설정
│   └── routes.tsx          # 라우트 정의 (/, /admin, /admin/notion, /admin/documents, /admin/settings, /admin/guide)
├── components/             # 공통 디자인 시스템 컴포넌트
│   ├── Button.tsx          # primary / secondary / ghost 변형
│   ├── Input.tsx           # 다크 테마 입력 필드
│   ├── Card.tsx            # 둥근 모서리 카드 패널
│   ├── Modal.tsx           # 반투명 오버레이 모달
│   ├── Sidebar.tsx         # 260px 고정 사이드바
│   ├── Tabs.tsx            # 블루 하단 보더 탭
│   ├── Badge.tsx           # 상태 뱃지
│   ├── Checkbox.tsx        # 체크박스
│   ├── Spinner.tsx         # 로딩 스피너
│   ├── Logo.tsx            # Twal-King 브랜드 로고 (SVG 아이콘 + 텍스트)
│   ├── HealthIndicator.tsx # 서버 헬스체크 인디케이터 (30초 자동 체크)
│   └── Layout.tsx          # 사이드바(로고 + 네비게이션 + 헬스체크) + 상단 헤더 + 콘텐츠
├── domains/
│   ├── chat/               # 챗봇 도메인
│   │   ├── components/
│   │   │   ├── ChatPage.tsx       # 챗봇 메인 페이지
│   │   │   ├── SessionSidebar.tsx # 대화 세션 목록
│   │   │   ├── MessageList.tsx    # 메시지 리스트 + 로딩/에러 상태
│   │   │   ├── MessageBubble.tsx  # 사용자/AI 메시지 버블
│   │   │   ├── ChatInput.tsx      # 메시지 입력 + 전송
│   │   │   └── SourceLink.tsx     # Notion 출처 링크
│   │   ├── hooks/
│   │   │   ├── useChat.ts         # 메시지 전송/수신, 세션별 히스토리 로드, 로딩/에러 관리
│   │   │   ├── useSessions.ts     # 세션 CRUD (서버 연동), 세션 전환, optimistic update
│   │   │   └── useAutoScroll.ts   # 새 메시지 자동 스크롤
│   │   └── types.ts               # Message, Source, Session, ChatState
│   └── admin/              # 백오피스 도메인
│       ├── components/
│       │   ├── AdminPage.tsx          # 임베딩 관리 메인 페이지
│       │   ├── NotionSyncPage.tsx     # Notion 워크스페이스 동기화 페이지
│       │   ├── DocumentsPage.tsx      # 문서 관리 페이지 (상세/삭제/미리보기/이력)
│       │   ├── SettingsPage.tsx       # 청킹 설정 페이지
│       │   ├── GuidePage.tsx          # 임베딩 가이드 페이지
│       │   ├── FilterBar.tsx          # 상태 필터 + 검색 + 일괄 임베딩
│       │   ├── PageTable.tsx          # 페이지 목록 테이블
│       │   ├── PageRow.tsx            # 개별 페이지 행
│       │   ├── BulkActions.tsx        # 일괄 임베딩 액션 바
│       │   ├── EmbeddingStatusBadge.tsx # 임베딩 상태 뱃지
│       │   ├── FileUpload.tsx         # 파일 드래그앤드롭 업로드 (PDF, DOCX, TXT, MD)
│       │   └── Pagination.tsx         # 페이지네이션
│       ├── hooks/
│       │   ├── usePages.ts            # 페이지 목록 조회, 페이지네이션
│       │   ├── useEmbedding.ts        # 개별/일괄 임베딩 요청
│       │   ├── useBulkSelection.ts    # 체크박스 선택 관리
│       │   ├── usePageFilter.ts       # 상태/텍스트 필터링
│       │   ├── useFileUpload.ts       # 파일 업로드 (검증, 업로드, 결과 관리)
│       │   ├── useWorkspace.ts        # Notion 워크스페이스 조회/동기화/임포트
│       │   ├── useDocuments.ts        # 문서 CRUD, 상세, 파이프라인 이력, 미리보기
│       │   ├── useChunkingConfig.ts   # 청킹 설정 조회/수정
│       │   └── useGuide.ts           # 임베딩 가이드 조회
│       └── types.ts                   # EmbeddingStatus, NotionPage, PageFilter, AdminState
├── hooks/
│   └── useApi.ts           # 범용 API 훅 (data, isLoading, error, execute)
├── utils/
│   ├── api.ts              # fetch 기반 API 클라이언트 (30초 타임아웃)
│   ├── cn.ts               # clsx + tailwind-merge 유틸리티
│   └── format.ts           # 상대 시간 포맷 ("2시간 전")
├── types/
│   └── index.ts            # 공통 타입
├── index.css               # Tailwind 디렉티브 + 글로벌 스타일
└── main.tsx                # React 렌더링 엔트리포인트
```

## 주요 기능

### 챗봇 인터페이스 (`/`)

- 자연어 질문으로 Notion 페이지 콘텐츠 검색
- 대화 세션 관리 (서버 연동: 생성, 전환, 삭제)
- 세션 전환 시 서버에서 메시지 히스토리 자동 로드
- 세션 없이 메시지 전송 시 자동 세션 생성
- 세션 삭제 (hover 시 ✕ 버튼, optimistic update)
- AI 응답에 Notion 출처 링크 표시
- 로딩 인디케이터 및 에러 처리 (재시도 지원)
- 새 메시지 자동 스크롤

### 임베딩 관리 (`/admin`)

- Notion 페이지 목록 조회 및 임베딩 상태 관리
- 파일 업로드로 문서 임베딩 (드래그앤드롭, PDF/DOCX/TXT/MD, 최대 10개·50MB)
- 임베딩 상태별 필터링 (대기, 진행 중, 완료, 실패)
- 페이지 제목 텍스트 검색, 개별/일괄 임베딩, 페이지네이션

### Notion 동기화 (`/admin/notion`)

- Notion 워크스페이스 페이지 목록 조회
- 체크박스 선택 후 일괄 동기화 (최대 20개)
- Notion 페이지 UUID로 개별 임포트

### 문서 관리 (`/admin/documents`)

- 전체 문서 목록 (소스 타입별 필터: 파일 업로드 / Notion)
- 문서 상세 모달 (메타데이터, 청크 목록, Notion 소스 정보)
- 청킹 미리보기 (예상 청크 수, 품질 점수, 최적화 제안)
- 파이프라인 처리 이력 조회
- 문서 삭제

### 청킹 설정 (`/admin/settings`)

- 청킹 설정 조회/수정 (maxTokens 100~2000, overlapTokens ≤ 50%)

### 임베딩 가이드 (`/admin/guide`)

- 지원 파일 형식, 권장 문서 구조, 최적화 팁, 안티패턴 표시

### 공통

- 사이드바 하단 서버 헬스체크 인디케이터 (30초 자동 체크)
- 상단 헤더 로그인/회원가입 버튼 (UI만, 인증 미연결)

## 디자인 시스템

"Quiet Confidence" 컨셉의 다크 테마 UI:

- 배경: `#0A0A0F` (메인), `#141419` (카드/패널)
- 텍스트: `#E5E5EA` (기본), `#6E6E80` (보조)
- 포인트: `#4A7CFF` (블루 계열 1가지만 사용)
- 상태: `#34C759` (성공), `#FFB340` (경고), `#FF453A` (오류)
- 큰 border-radius (12px~16px), 얇은 보더, 넓은 여백
- Inter 기반 시스템 폰트 스택

## API 엔드포인트

백엔드 OpenAPI 명세 기반 (`/api/v1`):

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/v1/search` | 챗봇 자연어 검색 |
| GET | `/api/v1/sessions` | 대화 세션 목록 조회 |
| POST | `/api/v1/sessions` | 새 대화 세션 생성 |
| GET | `/api/v1/sessions/{id}/messages` | 세션별 메시지 히스토리 조회 |
| DELETE | `/api/v1/sessions/{id}` | 대화 세션 삭제 |
| GET | `/api/v1/health` | 서비스 헬스 체크 |
| GET | `/api/v1/notion/pages` | Notion 연동 문서 목록 (필터/페이지네이션) |
| POST | `/api/v1/notion/pages` | Notion 페이지 임포트 |
| GET | `/api/v1/notion/workspace` | Notion 워크스페이스 페이지 목록 |
| POST | `/api/v1/notion/workspace/sync` | Notion 페이지 일괄 동기화 (최대 20개) |
| GET | `/api/v1/documents` | 문서 목록 조회 (필터/페이지네이션) |
| GET | `/api/v1/documents/{id}` | 문서 상세 조회 |
| DELETE | `/api/v1/documents/{id}` | 문서 삭제 |
| POST | `/api/v1/documents/{id}/preview` | 문서 분석 미리보기 |
| POST | `/api/v1/pipeline/{documentId}/run` | 임베딩 파이프라인 실행 |
| POST | `/api/v1/pipeline/{documentId}/retry` | 실패한 파이프라인 재시도 |
| GET | `/api/v1/pipeline/{documentId}/jobs` | 파이프라인 작업 이력 |
| GET | `/api/v1/chunking-config` | 청킹 설정 조회 |
| PUT | `/api/v1/chunking-config` | 청킹 설정 변경 |
| GET | `/api/v1/guide` | 임베딩 가이드 정보 |

챗봇 API와 관리 API 모두 `/api/v1` 프리픽스를 사용합니다.

## 테스트

Vitest + React Testing Library + fast-check 기반 테스트:

```bash
# 전체 테스트 실행
npm run test

# 워치 모드
npm run test:watch
```

테스트 범위:
- 공통 컴포넌트 단위 테스트 (Button, Modal)
- 도메인 컴포넌트 테스트 (ChatPage, SessionSidebar, MessageBubble 등)
- 커스텀 훅 테스트 (useChat, useSessions, usePages 등)
- fast-check 속성 기반 테스트 (세션 전환, 메시지 정렬, 필터링 등)
