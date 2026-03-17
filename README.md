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
│   └── routes.tsx          # 라우트 정의 (/ → 챗봇, /admin → 백오피스)
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
│   └── Layout.tsx          # 사이드바(로고 + 네비게이션) + 상단 헤더(로그인/회원가입) + 콘텐츠 공통 레이아웃
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
│   │   │   ├── useChat.ts         # 메시지 전송/수신, 로딩/에러 관리
│   │   │   ├── useSessions.ts     # 세션 CRUD, 세션 전환
│   │   │   └── useAutoScroll.ts   # 새 메시지 자동 스크롤
│   │   └── types.ts               # Message, Source, Session, ChatState
│   └── admin/              # 백오피스 도메인
│       ├── components/
│       │   ├── AdminPage.tsx          # 백오피스 메인 페이지
│       │   ├── FilterBar.tsx          # 상태 필터 + 검색 + 일괄 임베딩
│       │   ├── PageTable.tsx          # 페이지 목록 테이블
│       │   ├── PageRow.tsx            # 개별 페이지 행
│       │   ├── BulkActions.tsx        # 일괄 임베딩 액션 바
│       │   ├── EmbeddingStatusBadge.tsx # 임베딩 상태 뱃지
│       │   └── Pagination.tsx         # 페이지네이션
│       ├── hooks/
│       │   ├── usePages.ts            # 페이지 목록 조회, 페이지네이션
│       │   ├── useEmbedding.ts        # 개별/일괄 임베딩 요청
│       │   ├── useBulkSelection.ts    # 체크박스 선택 관리
│       │   └── usePageFilter.ts       # 상태/텍스트 필터링
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
- 대화 세션 관리 (생성, 전환, 이력 조회)
- AI 응답에 Notion 출처 링크 표시
- 로딩 인디케이터 및 에러 처리 (재시도 지원)
- 새 메시지 자동 스크롤

### 백오피스 (`/admin`)

- Notion 페이지 목록 조회 및 임베딩 상태 관리
- 임베딩 상태별 필터링 (대기, 진행 중, 완료, 실패)
- 페이지 제목 텍스트 검색
- 개별/일괄 임베딩 생성 요청
- 일괄 처리 진행률 표시
- 페이지네이션

## 디자인 시스템

"Quiet Confidence" 컨셉의 다크 테마 UI:

- 배경: `#0A0A0F` (메인), `#141419` (카드/패널)
- 텍스트: `#E5E5EA` (기본), `#6E6E80` (보조)
- 포인트: `#4A7CFF` (블루 계열 1가지만 사용)
- 상태: `#34C759` (성공), `#FFB340` (경고), `#FF453A` (오류)
- 큰 border-radius (12px~16px), 얇은 보더, 넓은 여백
- Inter 기반 시스템 폰트 스택

## API 엔드포인트

프론트엔드가 사용하는 백엔드 API:

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/search` | 자연어 검색 요청 |
| GET | `/api/sessions` | 대화 세션 목록 조회 |
| GET | `/api/pages` | Notion 페이지 목록 조회 (필터/페이지네이션) |
| POST | `/api/embeddings` | 임베딩 생성 요청 |

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
