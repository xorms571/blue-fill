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
