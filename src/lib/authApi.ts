import type { User } from '../store/useAuthStore';
import { api } from './api';
import { BASE_URL } from './config';

export const SOCIAL_LOGIN_URLS = {
  google: `${BASE_URL}/oauth2/authorization/google`,
  discord: `${BASE_URL}/oauth2/authorization/discord`,
};

/**
 * 로그아웃
 */
export const logout = async () => {
  return api.post('/auth/logout');
};

/**
 * 토큰 재발급
 */
export const reissueToken = async () => {
  const response = await api.post<{ data: { accessToken: string; isNewUser: boolean } }>('/auth/reissue');
  return response.data;
};

/**
 * 내 프로필 정보 조회
 */
export const getMyProfile = async () => {
  const response = await api.get<{ data: User }>('/users/me');
  return response.data;
};

/**
 * 내 프로필 정보 수정
 */
export const updateProfile = async (data: { nickname: string; profileImageUrl?: string | null }) => {
  return api.patch('/users/me', data);
};

/**
 * [테스트용] 액세스 토큰 발급
 */
export const getDevToken = async () => {
  return api.post('/dev/token');
};

/**
 * 회원 탈퇴
 */
export const withdrawUser = async () => {
  return api.delete('/user/me');
};
