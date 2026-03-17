# 구현 계획: Notion 검색 챗봇 + 임베딩 관리 백오피스

## 개요

React + Tailwind CSS + TypeScript 기반의 Notion 검색 챗봇과 임베딩 관리 백오피스 프론트엔드를 구현한다. 공통 디자인 시스템 → 유틸리티 → 챗봇 도메인 → 백오피스 도메인 → 라우팅 순서로 점진적으로 구축한다. 테스트는 Vitest + React Testing Library + fast-check를 사용한다.

## 태스크

- [x] 1. 프로젝트 초기 설정
  - [x] 1.1 React + TypeScript + Vite 프로젝트 생성 및 의존성 설치
    - Vite 기반 React + TypeScript 프로젝트 초기화
    - Tailwind CSS v3, clsx, tailwind-merge 설치 및 설정
    - Vitest, @testing-library/react, @testing-library/jest-dom, fast-check, jsdom 설치
    - 설계 문서의 디렉토리 구조에 맞게 폴더 생성
    - _Requirements: 11.1_

  - [x] 1.2 Tailwind CSS 커스텀 설정
    - tailwind.config.ts에 커스텀 컬러 팔레트 정의 (main, card, input, hover, primary, secondary, disabled, accent, success, warning, error, border)
    - 커스텀 borderRadius (xl: 12px, 2xl: 16px) 정의
    - 커스텀 fontFamily (Inter 기반 시스템 폰트 스택) 정의
    - 커스텀 fontSize (xs, sm, xl) 정의
    - 커스텀 width (sidebar: 260px), maxWidth (chat: 768px, table: 1200px) 정의
    - index.css에 Tailwind 디렉티브 및 글로벌 스타일 작성
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.8, 10.1, 10.2, 11.1, 11.2_

  - [x] 1.3 Vitest 설정 및 테스트 환경 구성
    - vitest.config.ts 작성 (jsdom 환경, 경로 alias 설정)
    - 테스트 setup 파일 작성 (@testing-library/jest-dom 확장)
    - _Requirements: 11.3_

- [x] 2. 공통 유틸리티 및 타입 정의
  - [x] 2.1 cn 유틸리티 함수 구현
    - src/utils/cn.ts에 clsx + tailwind-merge 조합 유틸리티 작성
    - _Requirements: 11.3_

  - [x] 2.2 API 클라이언트 구현
    - src/utils/api.ts에 fetch 기반 API 클라이언트 작성
    - SearchRequest, SearchResponse, SessionListResponse, PageListRequest, PageListResponse, EmbeddingRequest, EmbeddingStatusResponse 타입 정의
    - AbortController 기반 30초 타임아웃 처리
    - _Requirements: 1.1, 1.5, 3.2_

  - [x] 2.3 날짜/텍스트 포맷 유틸리티 구현
    - src/utils/format.ts에 상대 시간 포맷 함수 (예: "2시간 전") 작성
    - _Requirements: 3.3, 8.2_

  - [x] 2.4 공통 타입 정의
    - src/types/index.ts에 공통 타입 정의
    - src/domains/chat/types.ts에 Message, Source, Session, ChatState 타입 정의
    - src/domains/admin/types.ts에 EmbeddingStatus, NotionPage, PageFilter, AdminState 타입 정의
    - _Requirements: 1.1, 1.2, 2.1, 3.1, 3.3, 4.1_

  - [x] 2.5 useApi 공통 훅 구현
    - src/hooks/useApi.ts에 data, isLoading, error, execute를 반환하는 범용 API 훅 작성
    - 에러 처리 패턴 (try/catch, finally) 적용
    - _Requirements: 1.3, 1.5, 3.4, 3.6_

- [x] 3. 디자인 시스템 공통 컴포넌트 구현
  - [x] 3.1 Button 컴포넌트 구현
    - primary, secondary, ghost 3가지 variant 지원
    - sm, md 2가지 size 지원
    - disabled 상태 스타일 (opacity-40, cursor-not-allowed)
    - _Requirements: 6.5, 6.6, 9.1_

  - [x] 3.2 Button 컴포넌트 단위 테스트 작성
    - variant별 올바른 클래스 적용 검증
    - disabled 상태 검증
    - _Requirements: 9.1_

  - [x] 3.3 Input 컴포넌트 구현
    - 다크 배경 + 은은한 보더 스타일
    - 포커스 시 포인트 블루 보더 전환
    - 선택적 label 지원
    - _Requirements: 9.2_

  - [x] 3.4 Card 컴포넌트 구현
    - 둥근 모서리 (rounded-2xl), 은은한 보더, 패널 배경색
    - _Requirements: 6.5, 9.3_

  - [x] 3.5 Modal 컴포넌트 구현
    - open/close 상태 제어
    - 반투명 오버레이 (bg-black/60) 클릭 시 닫기
    - 카드 스타일 패널, 선택적 title
    - _Requirements: 9.6_

  - [x] 3.6 Modal 컴포넌트 단위 테스트 작성
    - open/close 상태별 렌더링 검증
    - 오버레이 클릭 시 onClose 콜백 호출 검증
    - _Requirements: 9.6_

  - [x] 3.7 Sidebar 컴포넌트 구현
    - 260px 고정 너비, 카드 배경, 우측 보더
    - 세로 네비게이션 구조
    - _Requirements: 9.4_

  - [x] 3.8 Tabs 컴포넌트 구현
    - 활성 탭에 포인트 블루 하단 보더 인디케이터
    - 비활성 탭 호버 시 텍스트 색상 변경
    - _Requirements: 9.5_

  - [x] 3.9 Badge, Checkbox, Spinner 컴포넌트 구현
    - Badge: 상태별 색상 변형 지원
    - Checkbox: 체크/미체크 상태 토글
    - Spinner: 로딩 애니메이션
    - _Requirements: 6.5, 6.6_

  - [x] 3.10 Layout 컴포넌트 구현
    - Sidebar + 콘텐츠 영역 조합 레이아웃
    - 챗봇/백오피스 네비게이션 링크 포함
    - bg-main 전체 배경 적용
    - _Requirements: 7.1, 8.3, 10.3, 10.4, 10.5_

- [x] 4. 체크포인트 - 디자인 시스템 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

- [ ] 5. 챗봇 도메인 구현
  - [x] 5.1 챗봇 커스텀 훅 구현
    - src/domains/chat/hooks/useChat.ts: 메시지 전송, 응답 수신, 로딩/에러 상태 관리
    - src/domains/chat/hooks/useSessions.ts: 세션 목록 조회, 새 세션 생성, 세션 전환
    - src/domains/chat/hooks/useAutoScroll.ts: 새 메시지 추가 시 자동 스크롤
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 2.3, 2.4, 7.4_

  - [x] 5.2 Property 1 속성 기반 테스트: 질문 전송 후 응답 메시지 추가
    - **Property 1: 질문 전송 후 메시지 리스트 길이 2 증가**
    - 임의의 문자열 질문과 기존 메시지 배열에 대해, 전송 후 길이가 2 증가하는지 검증
    - **Validates: Requirements 1.1, 1.2**

  - [x] 5.3 Property 4 속성 기반 테스트: 새 대화 생성 시 빈 메시지 리스트
    - **Property 4: 새 대화 생성 후 빈 메시지 리스트 + 세션 목록 길이 1 증가**
    - 임의의 기존 Session 배열에 대해 검증
    - **Validates: Requirements 2.2**

  - [x] 5.4 Property 6 속성 기반 테스트: 세션 전환 시 올바른 메시지 로드
    - **Property 6: 세션 전환 시 모든 메시지의 sessionId가 선택된 세션 ID와 일치**
    - 임의의 sessionId와 Message 배열에 대해 검증
    - **Validates: Requirements 2.4**

  - [x] 5.5 MessageBubble 컴포넌트 구현
    - 사용자 메시지: 우측 정렬, 포인트 블루 배경
    - AI 응답: 좌측 정렬, 카드 배경 + 보더
    - 출처 링크 목록 렌더링
    - 타임스탬프 표시
    - _Requirements: 7.3, 7.5_

  - [ ]* 5.6 Property 15 속성 기반 테스트: 메시지 role에 따른 시각적 구분
    - **Property 15: role이 'user'이면 우측 정렬 + 블루 배경, 'assistant'이면 좌측 정렬 + 카드 배경**
    - 임의의 Message (user/assistant)에 대해 검증
    - **Validates: Requirements 7.3**

  - [ ]* 5.7 Property 16 속성 기반 테스트: 출처 링크 완전 표시
    - **Property 16: sources 배열의 모든 항목에 대한 링크가 렌더링에 포함**
    - 임의의 sources 배열을 가진 Message에 대해 검증
    - **Validates: Requirements 7.5**

  - [x] 5.8 MessageList 컴포넌트 구현
    - 메시지 배열을 시간순으로 렌더링
    - 로딩 인디케이터 (점 3개 애니메이션) 표시
    - 에러 메시지 + 재시도 버튼 표시
    - 빈 검색 결과 안내 메시지 표시
    - _Requirements: 1.3, 1.4, 1.5, 2.1, 7.3_

  - [ ]* 5.9 Property 2 속성 기반 테스트: 로딩 상태 인디케이터 표시
    - **Property 2: isLoading이 true이면 인디케이터 렌더링, false이면 미렌더링**
    - 임의의 boolean에 대해 검증
    - **Validates: Requirements 1.3**

  - [ ]* 5.10 Property 3 속성 기반 테스트: 메시지 시간순 정렬
    - **Property 3: 화면에 표시되는 메시지 순서가 createdAt 기준 오름차순**
    - 임의의 createdAt을 가진 Message 배열에 대해 검증
    - **Validates: Requirements 2.1**

  - [x] 5.11 ChatInput 컴포넌트 구현
    - 텍스트 입력 + 전송 버튼
    - 빈 입력 전송 방지
    - Enter 키 전송 지원
    - 하단 고정 배치
    - _Requirements: 7.2_

  - [ ]* 5.12 ChatInput 단위 테스트 작성
    - 빈 입력 전송 방지 검증
    - Enter 키 전송 검증
    - _Requirements: 7.2_

  - [x] 5.13 SourceLink 컴포넌트 구현
    - Notion 페이지 출처 링크 렌더링
    - 새 탭에서 열기 (target="_blank", rel="noopener noreferrer")
    - _Requirements: 7.5_

  - [x] 5.14 SessionSidebar 컴포넌트 구현
    - 새 대화 버튼
    - 세션 목록 (날짜별 그룹핑)
    - 세션 클릭 시 전환
    - _Requirements: 2.2, 2.3, 2.4_

  - [ ]* 5.15 Property 5 속성 기반 테스트: 세션 목록 완전 표시
    - **Property 5: 사이드바에 렌더링되는 세션 항목 수 = 세션 배열 길이**
    - 임의의 Session 배열에 대해 검증
    - **Validates: Requirements 2.3**

  - [x] 5.16 ChatPage 컴포넌트 구현
    - SessionSidebar + MessageList + ChatInput 조합
    - 전체 챗봇 화면 레이아웃 완성
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 6. 체크포인트 - 챗봇 도메인 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

- [ ] 7. 백오피스 도메인 구현
  - [x] 7.1 백오피스 커스텀 훅 구현
    - src/domains/admin/hooks/usePages.ts: 페이지 목록 조회, 페이지네이션
    - src/domains/admin/hooks/useEmbedding.ts: 개별/일괄 임베딩 요청, 상태 갱신
    - src/domains/admin/hooks/useBulkSelection.ts: 체크박스 선택 상태 관리 (개별 토글, 전체 선택)
    - src/domains/admin/hooks/usePageFilter.ts: 상태 필터 + 텍스트 검색 필터 로직
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4_

  - [ ]* 7.2 Property 10 속성 기반 테스트: 상태 필터 적용
    - **Property 10: 필터 적용 후 모든 페이지의 embeddingStatus가 선택된 필터 값과 일치**
    - 임의의 NotionPage 배열과 EmbeddingStatus에 대해 검증
    - **Validates: Requirements 4.2**

  - [ ]* 7.3 Property 11 속성 기반 테스트: 텍스트 검색 필터 적용
    - **Property 11: 검색 필터 적용 후 모든 페이지의 title이 검색 문자열을 포함 (대소문자 무시)**
    - 임의의 NotionPage 배열과 검색 문자열에 대해 검증
    - **Validates: Requirements 4.3**

  - [ ]* 7.4 Property 12 속성 기반 테스트: 체크박스 선택 상태 관리
    - **Property 12: 개별 토글 시 selectedIds에 추가/제거, 전체 선택 시 모든 ID 포함**
    - 임의의 pageId 배열과 토글 대상에 대해 검증
    - **Validates: Requirements 5.1, 5.3**

  - [ ]* 7.5 Property 13 속성 기반 테스트: 일괄 임베딩 요청 시 선택된 모든 페이지 ID 전송
    - **Property 13: 일괄 임베딩 실행 시 API 요청의 pageIds가 selectedIds와 동일**
    - 임의의 selectedIds 집합에 대해 검증
    - **Validates: Requirements 5.2**

  - [ ]* 7.6 Property 14 속성 기반 테스트: 일괄 처리 진행률 계산
    - **Property 14: 진행률 퍼센트 = Math.round((completed / total) * 100)**
    - 임의의 양의 정수 completed, total에 대해 검증
    - **Validates: Requirements 5.4**

  - [x] 7.7 EmbeddingStatusBadge 컴포넌트 구현
    - pending, processing, completed, failed 4가지 상태별 라벨 + 색상 스타일
    - _Requirements: 3.3, 3.4, 3.5_

  - [ ]* 7.8 Property 9 속성 기반 테스트: 임베딩 상태 변경 시 UI 갱신
    - **Property 9: 상태 업데이트 시 뱃지가 새로운 상태를 반영**
    - 임의의 NotionPage와 EmbeddingStatus에 대해 검증
    - **Validates: Requirements 3.4, 3.5**

  - [ ]* 7.9 EmbeddingStatusBadge 단위 테스트 작성
    - 4가지 상태별 올바른 라벨과 스타일 렌더링 검증
    - _Requirements: 3.3_

  - [x] 7.10 FilterBar 컴포넌트 구현
    - 상태별 탭 필터 (전체, 대기, 진행 중, 완료, 실패)
    - 텍스트 검색 입력
    - 일괄 임베딩 버튼
    - _Requirements: 4.1, 4.2, 4.3, 8.1_

  - [ ]* 7.11 FilterBar 단위 테스트 작성
    - 필터 탭 클릭 시 콜백 호출 검증
    - _Requirements: 4.2_

  - [x] 7.12 PageRow 컴포넌트 구현
    - 체크박스, 페이지 제목, 임베딩 상태 뱃지, 최종 업데이트 일시, 액션 버튼 (임베딩/재시도)
    - _Requirements: 3.1, 3.2, 3.3, 3.6, 8.2_

  - [ ]* 7.13 Property 7 속성 기반 테스트: 페이지 행 필수 정보 표시
    - **Property 7: 렌더된 행에 제목, 상태 뱃지, 업데이트 일시, 액션 버튼 모두 포함**
    - 임의의 NotionPage 객체에 대해 검증
    - **Validates: Requirements 3.1, 3.3, 8.2**

  - [ ]* 7.14 Property 8 속성 기반 테스트: 임베딩 요청 시 올바른 페이지 ID 전송
    - **Property 8: 임베딩 버튼 클릭 시 해당 페이지 ID가 API 요청에 포함**
    - 임의의 pageId에 대해 검증
    - **Validates: Requirements 3.2**

  - [x] 7.15 PageTable 컴포넌트 구현
    - 테이블 헤더 (전체 선택 체크박스 포함)
    - PageRow 목록 렌더링
    - 빈 상태 / 에러 상태 표시
    - _Requirements: 3.1, 5.1, 5.3, 8.1, 8.2_

  - [x] 7.16 Pagination 컴포넌트 구현
    - 이전/다음 버튼, 페이지 번호 표시
    - 현재 페이지 하이라이트
    - _Requirements: 8.4_

  - [ ]* 7.17 Property 17 속성 기반 테스트: 페이지네이션 계산
    - **Property 17: 총 페이지 수 = Math.ceil(total / pageSize)**
    - 임의의 양의 정수 total, pageSize에 대해 검증
    - **Validates: Requirements 8.4**

  - [x] 7.18 BulkActions 컴포넌트 구현
    - 선택된 페이지 수 표시
    - 일괄 임베딩 실행 버튼
    - 진행률 표시 (진행 중일 때)
    - _Requirements: 5.2, 5.4_

  - [x] 7.19 AdminPage 컴포넌트 구현
    - FilterBar + BulkActions + PageTable + Pagination 조합
    - 전체 백오피스 화면 레이아웃 완성
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 8. 체크포인트 - 백오피스 도메인 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

- [x] 9. 라우팅 및 통합
  - [x] 9.1 React Router 설정
    - src/app/routes.tsx에 라우트 정의 (/ → 챗봇, /admin → 백오피스)
    - src/app/App.tsx에 RouterProvider 설정
    - Layout 컴포넌트로 공통 사이드바 네비게이션 적용
    - _Requirements: 7.1, 8.3_

  - [x] 9.2 도메인 index.ts 배럴 파일 작성
    - src/domains/chat/index.ts, src/domains/admin/index.ts에 public export 정리
    - _Requirements: 7.1, 8.1_

  - [x] 9.3 앱 엔트리포인트 완성
    - src/index.tsx에 React 렌더링 설정
    - 전체 앱 동작 확인을 위한 통합 연결
    - _Requirements: 7.1, 8.3_

- [x] 10. 최종 체크포인트 - 전체 통합 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

## 참고 사항

- `*` 표시된 태스크는 선택 사항이며, 빠른 MVP를 위해 건너뛸 수 있다.
- 각 태스크는 추적 가능성을 위해 특정 요구사항을 참조한다.
- 체크포인트는 점진적 검증을 보장한다.
- 속성 기반 테스트는 보편적 정확성 속성을 검증하고, 단위 테스트는 특정 예시와 엣지 케이스를 검증한다.
- 모든 속성 기반 테스트는 fast-check 라이브러리를 사용하며, 최소 100회 이상 반복한다.
- 각 속성 기반 테스트에는 `Feature: notion-search-chatbot, Property {번호}: {속성 설명}` 형식의 태그 주석을 포함한다.
