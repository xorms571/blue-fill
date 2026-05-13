import type { User } from '../store/useAuthStore';
import { api } from './api';

const BACK_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const SOCIAL_LOGIN_URLS = {
  google: `${BACK_URL}/oauth2/authorization/google`,
  discord: `${BACK_URL}/oauth2/authorization/discord`,
};

// [소셜 로그인] 유저는 버튼 클릭 시 SOCIAL_LOGIN_URLS 중 하나로 window.location.href 이동

// [로그아웃] 유저 /auth/logout POST
export const logout = async () => {
  return api.post('/auth/logout');
};

// [토큰 재발급] 유저 /auth/reissue POST
export const reissueToken = async () => {
  const response = await api.post<{ data: { accessToken: string; isNewUser: boolean } }>('/auth/reissue');
  return response.data;
};

// [내 정보 조회] 유저 /users/me GET
export const getMyProfile = async () => {
  const response = await api.get<{ data: User }>('/users/me');
  return response.data;
};

// [내 정보 수정] 유저 /users/me PATCH
export const updateProfile = async (data: { nickname: string; profileImageUrl?: string | null }) => {
  return api.patch('/users/me', data);
};

// [테스트용 액세스 토큰 발급] 관리자 /dev/token POST
export const getDevToken = async () => {
  return api.post('/dev/token');
};

// [회원 탈퇴] 유저 /user/me DELETE
export const withdrawUser = async () => {
  return api.delete('/user/me');
};
