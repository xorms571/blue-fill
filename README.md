# Project Blue-Pill (Client)

Project Blue-Pill의 프론트엔드 클라이언트 프로젝트입니다. 디자인 시스템 파운데이션과 현대적인 스택을 기반으로 구축되었습니다.

## 🛠 Tech Stack

### Core
- **React 19**: 최신 React 기능을 활용한 컴포넌트 기반 UI 개발
- **Vite 8**: 초고속 빌드 도구 및 개발 서버
- **TypeScript**: 정적 타이핑을 통한 코드 안정성 확보

### Styling & Design System
- **Tailwind CSS v4**: 최신 v4 엔진 및 `@tailwindcss/vite` 플러그인 연동
- **Design Tokens**: `tailwind.config.ts`를 통한 커스텀 파운데이션 설정
  - **Typography**: Display, Header, Body 계층 구조 (10단계)
  - **Color Palette**: Primary(Mint), Base(Grayscale), Secondary, Accents, System Status
  - **Font**: Inter & sans-serif

### State Management
- **Zustand 5**: 가볍고 유연한 상태 관리 라이브러리

## 📁 Project Structure

```text
src/
├── assets/          # 정적 에셋 (이미지, SVG 등)
├── index.css        # Tailwind v4 @import 및 전역 스타일
├── main.tsx         # 애플리케이션 진입점
└── App.tsx          # 메인 컴포넌트 및 디자인 시스템 가이드
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
현재 `App.tsx`에서 프로젝트에 설정된 모든 디자인 토큰(컬러, 타이포그래피)을 시각적으로 확인할 수 있는 **Foundation Guide**를 제공하고 있습니다.
