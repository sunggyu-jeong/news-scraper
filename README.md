# ![Image](https://github.com/user-attachments/assets/cbe42540-59af-4e8d-8f59-eb22f0159870)

Vue + Vuex 기반의 프론트엔드 프로젝트.

## 📌 기술 스택

- **Vue.js**: 사용자 인터페이스를 구축하기 위한 프레임워크
- **Vue CLI**: Vue 프로젝트를 쉽게 설정하고 관리할 수 있는 도구
- **Vuex**: 상태 관리를 위한 중앙 저장소
- **Vue Router**: SPA(Single Page Application) 라우팅 처리
- **Axios**: API 통신을 위한 HTTP 클라이언트
- **ESLint + Prettier**: 코드 스타일 통일 및 린팅

## 🚀 프로젝트 기능

- 로그인 (JWT 기반 인증 시스템 적용)
- 사용자의 검색기록을 불러와 리스트 및 상세 페이지 제공
- 검색 키워드 등록/삭제 기능
- Vuex를 활용한 전역 상태 관리
- 반응형 UI 적용

## 🛠️ 시작하기

### 📌 요구 사항
- Node.js (최소 v14 이상)
- npm 또는 yarn

### 📥 설치
```bash
# 1. 프로젝트 클론
git clone https://github.com/sunggyu-jeong/news-scraper.git
cd news-scraper

# 2. 의존성 설치
npm install
# 또는
yarn install
```

### ⚙️ 환경 변수 설정
`.env` 파일을 프로젝트 루트에 생성하고 아래 내용을 추가
```env
VUE_APP_API_BASE_URL='http://localhost:3000/api'
```

### ▶️ 개발 서버 실행
```bash
npm run serve
# 또는
yarn serve
```
서버가 실행되면 `http://localhost:8080` 에서 확인할 수 있다.

### 🔧 빌드
```bash
npm run build
# 또는
yarn build
```

## 📌 폴더 구조

```
/vue-frontend
│
├── /public            # 정적 파일
├── /src               # 소스 코드
│   ├── /shared         # 유틸리티 함수 및 API 통신 모듈
│   ├── /renderer         # 유틸리티 함수 및 API 통신 모듈
│       ├── /assets        # 이미지 및 스타일 파일
│       ├── /components    # 재사용 가능한 컴포넌트
│       ├── /views         # 페이지 단위 컴포넌트
│       ├── /store         # Vuex 상태 관리
│       │   ├── index.js   # Vuex 설정 파일
│       │   ├── auth.js    # 인증 관련 상태 관리
│       │   ├── news.js    # 뉴스 관련 상태 관리
│       │   ├── loading.js # 로딩 관련 상태 관리
│       │   ├── keyword.js # 검색어 관련 상태 관리
│       ├── /router        # Vue Router 설정
│   ├── main.js        # 진입점
├── .env               # 환경 변수 파일
├── package.json       # 프로젝트 의존성 및 스크립트
└── README.md          # 프로젝트 설명 파일
```

## 📌 주요 기능 설명

### 1️⃣ 회원 인증
- 로그인 / 회원가입 기능 제공
- JWT 기반으로 인증 처리
- Vuex를 활용한 사용자 상태 관리

### 2️⃣ 뉴스 검색 및 키워드 관리
- 검색하려는 검색어를 저장한 후에 검색할 수 있음
- API를 통해 뉴스 데이터를 가져와 리스트 및 상세 페이지 제공, 엑셀 다운로드 기능 제공

## 📝 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.
