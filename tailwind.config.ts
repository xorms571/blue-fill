import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // 1. 폰트 패밀리
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // 2. 폰트 크기 및 줄 간격 (Line Height)
      fontSize: {
        'display-1': ['96px', { lineHeight: '128px' }],
        'display-2': ['68px', { lineHeight: '98px' }],
        'header-1': ['40px', { lineHeight: '62px' }],
        'header-2': ['32px', { lineHeight: '42px' }],
        'header-3': ['24px', { lineHeight: '36px' }],
        'header-4': ['22px', { lineHeight: '34px' }],
        'body-1': ['18px', { lineHeight: '28px' }],
        'body-2': ['16px', { lineHeight: '20px' }],
        'body-3': ['14px', { lineHeight: '20px' }],
        'body-4': ['12px', { lineHeight: '18px' }],
      },
      // 3. 폰트 굵기
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      // 4. 컬러 토큰
      colors: {
        background: {
          main: '#0E0E13', // 화면 배경색
          hovered: '#18181B', // 버튼 배경 호버
        },
        base: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#FFFAEA',
          400: '#D8D7D4',
          500: '#A1A1AA',
          600: '#71717A',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        },
        primary: {
          DEFAULT: '#62F6B5',
          hovered: '#82F8C4',
        },
        secondary: {
          100: '#E6F6F4',
          200: '#C2E9E5',
          300: '#9DDCD5',
          400: '#6FD6CE',
          500: '#53C2B6',
          600: '#37AA9D',
          700: '#2C8880',
          800: '#216662',
        },
        system: {
          success: {
            DEFAULT: '#7ED6F8',
            hovered: '#4DCAFA',
          },
          alert: {
            DEFAULT: '#FFE858',
            hovered: '#FFDD03',
          },
          error: {
            DEFAULT: '#F8834F',
            hovered: '#E96B34',
          },
        },
        accents: {
          neon: '#BBF529',
          orange: '#E96B34',
          pink: '#DE94E2',
          purple: '#9977FF',
          yellow: '#FFDD03',
          blue: '#0090FF',
        },
      },
    },
  },
  plugins: [],
};

export default config;