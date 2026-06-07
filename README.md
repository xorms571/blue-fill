# Project Blue-Pill (Client)

Project Blue-Pill의 프론트엔드 클라이언트 프로젝트입니다. 디자인 시스템 파운데이션과 현대적인 스택을 기반으로 구축되었습니다.

## 🛠 Tech Stack

### Core
- **React 19**: 최신 React 기능을 활용한 컴포넌트 기반 UI 개발
- **Vite 6**: 초고속 빌드 도구 및 개발 서버
- **TypeScript**: 정적 타이핑을 통한 코드 안정성 확보
- **React Router Dom 7**: 클라이언트 사이드 라우팅 및 보호된 경로 처리

### Styling & Design System
- **Tailwind CSS v4**: 최신 v4 엔진 및 `@tailwindcss/vite` 플러그인 연동
- **Design Tokens**: `tailwind.config.ts`를 통한 커스텀 파운데이션 설정 (Typography, Color Palette 등)
- **High-Fidelity UI**: 다크 모드 기반의 세련되고 인터랙티브한 사용자 경험

### State Management
- **Zustand 5**: 가볍고 유연한 상태 관리 (인증, 모달 상태 등)

## ✨ Key Features

### 1. Character Library & Creation
- 유저가 직접 캐릭터를 설계하고 생성할 수 있는 인터페이스 제공
- 생성된 캐릭터 카드 목록 조회 및 관리

### 2. Log Rooms (New)
- **Log Room List**: 참여 중인 로그방 목록을 고해상도 카드 인터페이스로 확인 (스켈레톤 로딩 적용)
- **Log Room Creation**: 실시간 미리보기(Live Preview) 기능을 지원하는 2단 레이아웃 기반의 생성 폼
- **Character Integration**: 라이브러리의 캐릭터를 선택하여 로그방의 페르소나로 지정

### 3. Authentication & Security
- **OAuth2 연동**: Google, Discord 로그인을 통한 손쉬운 가입 및 접속
- **Protected Routes**: 인증되지 않은 사용자의 특정 페이지 접근을 제한하고 자동 로그인 유도
- **Session Persistence**: 새로고침 시에도 중단 없는 인증 상태 유지 (깜빡임 현상 최적화)

## 📁 Project Structure

```text
src/
├── assets/          # 정적 에셋 (이미지, 디자인 리소스)
├── components/      # 공통 컴포넌트 및 도메인별 컴포넌트
│   ├── auth/        # 인증 관련 (Login Modal, ProtectedRoute 등)
│   ├── common/      # 공용 UI (Button, SearchBar, TextInput 등)
│   └── layout/      # 레이아웃 구성 (Sidebar, PageLayout)
├── hooks/           # 커스텀 훅 (API 연동 및 로직 재사용)
├── lib/             # 라이브러리 설정 및 공통 유틸리티 (API Fetcher 등)
├── pages/           # 주요 페이지 컴포넌트
│   ├── library/     # 캐릭터 라이브러리
│   ├── character-creation/ # 캐릭터 생성
│   ├── log-rooms/   # 로그방 목록 및 생성
│   └── profile/     # 마이페이지
├── store/           # Zustand 전역 상태 저장소
└── App.tsx          # 애플리케이션 루트 및 라우팅 설정
```

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 🎨 Design Foundation
`/design-system` 경로에서 프로젝트에 설정된 모든 디자인 토큰(컬러, 타이포그래피)과 공통 컴포넌트의 가이드를 시각적으로 확인할 수 있는 **Foundation Guide**를 제공합니다.
