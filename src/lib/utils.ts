import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { R2_DOMAIN } from './config';

/**
 * tailwind-merge와 clsx를 결합하여 조건부 클래스 결합 및 
 * 테일윈드 클래스 충돌을 해결해주는 유틸리티 함수입니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (key: string | null) => {
  if (!key) return null;
  if (key.startsWith('http')) return key;
  return `${R2_DOMAIN}/${key}`;
};

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

/**
 * catch(err)에서 잡힌 unknown 값을 안전하게 문자열 메시지로 변환합니다.
 */
export const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error && err.message ? err.message : fallback;