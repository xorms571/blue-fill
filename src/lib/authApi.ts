import { api } from './api';

// [소셜 로그인] 유저 /oauth2/authorization/{google/discord} POST
export const loginWithSocial = async (provider: 'google' | 'discord') => {
  try {
    const response = await api.post<any>(`/oauth2/authorization/${provider}`);
    if (response && response.redirectUrl) {
      window.location.href = response.redirectUrl;
    }
    return response;
  } catch (error) {
    console.error(`${provider} login failed:`, error);
    throw error;
  }
};

// [로그아웃] 유저 /auth/logout POST
export const logout = async () => {
  return api.post('/auth/logout');
};

// [토큰 재발급] 유저 /auth/reissue POST
export const reissueToken = async () => {
  return api.post('/auth/reissue');
};

// [테스트용 액세스 토큰 발급] 관리자 /dev/token POST
export const getDevToken = async () => {
  return api.post('/dev/token');
};

// [회원 탈퇴] 유저 /user/me DELETE
export const withdrawUser = async () => {
  return api.delete('/user/me');
};
