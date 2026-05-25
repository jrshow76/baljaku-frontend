# 발자국 (BalJaKuk) — Frontend

다녀온 장소를 기록하고 관리하는 웹 애플리케이션의 프론트엔드입니다.

## 기술 스택

- **Next.js 15** (App Router)
- **MUI v6** (Material UI)
- **TypeScript 5**
- **axios**

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# ESLint 검사
npm run lint
```

## 환경 변수

`.env.example`을 복사해 `.env.local`을 생성합니다.

```bash
cp .env.example .env.local
```

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `NEXT_PUBLIC_API_URL` | 백엔드 API 주소 | `http://localhost:8080/api` |
| `NEXT_PUBLIC_USE_MOCK` | mock 모드 활성화 | `true` |

## 주요 기능

- **장소 기록** — 명소·관광지·공원·공연장·극장·음식점 6개 카테고리
- **장소 관리** — 목록·상세·등록·수정·삭제, 카테고리·키워드·정렬 필터
- **회원 기능** — 회원가입, 로그인, 프로필 수정, 비밀번호 변경

## Mock 모드

백엔드 없이 프론트엔드를 독립적으로 실행할 수 있습니다.  
`NEXT_PUBLIC_USE_MOCK=true`(기본값) 상태에서는 `localStorage`에 데이터를 저장하며, 아래 계정으로 로그인할 수 있습니다.

| 이메일 | 비밀번호 | 권한 |
|--------|----------|------|
| `hong@example.com` | `password123` | USER |
| `admin@example.com` | `admin123` | ADMIN |

백엔드 연동 시 `NEXT_PUBLIC_USE_MOCK=false`로 변경하면 `src/services/`가 실제 API를 호출합니다.

## 페이지 구조

| 경로 | 설명 |
|------|------|
| `/` | 홈 — 통계 및 최근 방문 장소 |
| `/places` | 장소 목록 |
| `/places/new` | 장소 등록 |
| `/places/[id]` | 장소 상세 |
| `/places/[id]/edit` | 장소 수정 |
| `/login` | 로그인 |
| `/register` | 회원가입 |
| `/mypage` | 마이페이지 |

## 관련 저장소

- **Backend**: Spring Boot 4.0 + MyBatis + PostgreSQL (별도 저장소)
