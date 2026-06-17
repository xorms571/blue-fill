import type { User } from '../store/useAuthStore';
import { api } from './api';
import { BASE_URL } from './config';
import { getAccessToken, getPublicIdFromToken } from './token';

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
 * 특정 유저 프로필 정보 조회
 */
export const getUserProfile = async (publicId: string) => {
  const response = await api.get<{ data: User }>(`/users/${publicId}`);
  return response.data;
};

/**
 * 내 프로필 정보 조회
 */
export const getMyProfile = async () => {
  const token = getAccessToken();
  if (!token) throw new Error("No access token found");
  
  const publicId = getPublicIdFromToken(token);
  if (!publicId) throw new Error("Failed to extract publicId from token");

  const response = await api.get<{ data: User }>(`/users/${publicId}`);
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
 * @param userId 미전달 시 백엔드 기본값(1) 사용
 */
export const getDevToken = async (userId?: number) => {
  const query = userId !== undefined ? `?userId=${userId}` : '';
  const response = await api.post<{ data: { accessToken: string } }>(`/dev/token${query}`);
  return response.data;
};

/**
 * 회원 탈퇴
 */
export const withdrawUser = async (data?: { deleteReason?: string }) => {
  return api.delete('/user/me', { data });
};

/**
 * 구독 플랜 변경
 */
export const updateSubscriptionPlan = async (subscriptionPlan: string) => {
  return api.patch('/users/me/plan', { subscriptionPlan });
};

/**
 * 내 프로필 공개 여부 변경
 */
export const updateProfileVisibility = async (isPublic: boolean) => {
  return api.patch('/users/me/visibility', { isPublic });
};
