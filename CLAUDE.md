# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 → http://localhost:3000
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
```

## 환경 변수 (`.env.local`)

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `NEXT_PUBLIC_API_URL` | 백엔드 API 주소 | `http://localhost:8080/api` |
| `NEXT_PUBLIC_USE_MOCK` | mock 모드 활성화 | `true` |

`NEXT_PUBLIC_USE_MOCK=false`로 바꾸면 services 레이어가 axios 실 API를 호출한다 (현재 TODO 상태).

## 아키텍처 개요

### Mock ↔ 실API 전환 구조

현재 **mock 모드**로 개발 중이다. 서비스 레이어(`src/services/`)가 mock/실API 분기점이다.

```
페이지(app/) → services/ (분기) → mock: localStorage에서 CRUD
                               → 실API: src/lib/api.ts (axios, Bearer 자동 첨부)
```

- `src/services/placeService.ts` — 장소 CRUD, 필터/정렬/검색 (`NEXT_PUBLIC_USE_MOCK` 분기)
- `src/services/authService.ts` — 로그인·회원가입·프로필·비밀번호 변경 (mock 시 localStorage 저장)
- mock 데이터 원본: `src/mocks/data/places.ts` (12개 샘플 장소)
- mock 모드에서 장소 데이터는 `localStorage['baljakuk_places']`에 영구 저장된다

### 인증 흐름

`AuthContext` (`src/contexts/AuthContext.tsx`) → `useAuth()` 훅으로 전역 접근.  
토큰은 `localStorage['token']`에 저장. 401 응답 시 `api.ts` 인터셉터가 토큰 삭제 후 `/login` 리다이렉트.  
`ClientProviders`(`'use client'` 래퍼)가 `AuthProvider`를 감싸 Server Component인 `RootLayout`에서 사용 가능하게 한다.

mock 테스트 계정:
- `hong@example.com` / `password123` (USER)
- `admin@example.com` / `admin123` (ADMIN)

### 레이아웃 규칙

- 일반 페이지: `<MainLayout>` (Header + Footer 포함)
- 로그인·회원가입: `<AuthLayout>` (화면 중앙 정렬)
- 모든 페이지 컴포넌트는 `'use client'` 지시어를 사용한다

### 페이지 목록

| 경로 | 설명 |
|------|------|
| `/` | 홈 — 통계·최근 방문 장소·카테고리 탐색 |
| `/places` | 장소 목록 — 카테고리 탭·검색·정렬 필터 |
| `/places/[id]` | 장소 상세 — 수정·삭제 |
| `/places/new` | 장소 등록 (`PlaceForm` 컴포넌트) |
| `/places/[id]/edit` | 장소 수정 (`PlaceForm` 컴포넌트) |
| `/login` | 로그인 |
| `/register` | 회원가입 |
| `/mypage` | 프로필 수정·비밀번호 변경 (로그인 필수) |

### 공유 타입 (`src/types/index.ts`)

핵심 타입: `Place`, `PlaceFormData`, `PlaceFilters`, `PlaceSortKey`, `PlaceCategory`, `PlaceStats`, `User`, `LoginRequest`, `RegisterRequest`, `ApiResponse<T>`, `PageResponse<T>`

카테고리 값: `'명소' | '관광지' | '공원' | '공연장' | '극장' | '음식점'`

## 신규 기능 추가 순서 (mock 모드)

1. `src/types/index.ts`에 타입 추가
2. `src/mocks/data/`에 mock 데이터 추가
3. `src/services/`에 서비스 함수 작성 (`USE_MOCK` 분기 포함)
4. `src/app/` 하위에 페이지 생성 → `MainLayout` 또는 `AuthLayout`으로 감싸기

백엔드 연동 시 `services/`의 `USE_MOCK` 분기 내 TODO 주석 위치에 axios 호출로 교체.
