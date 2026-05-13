import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { reissueToken, getMyProfile } from '../../lib/authApi';
import { setAccessToken } from '../../lib/api';

/**
 * 앱이 처음 로드될 때 쿠키를 이용해 세션을 복구하는 컴포넌트
 */
const AuthInitializer: React.FC = () => {
  const { setAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // 새로고침 시 토큰 재발급 시도 (성공하면 로그인 유지)
        const response = await reissueToken();
        const token = response.accessToken;
        
        // API 요청 시 사용할 토큰 설정
        setAccessToken(token);
        
        // 유저 정보 가져오기
        const userData = await getMyProfile();
        setAuthenticated(true, userData);
      } catch (error) {
        // 실패 시 세션 없음 (비로그인 상태 유지)
        console.error('Session restore failed:', error);
        setAccessToken(null);
        logout();
      }
    };

    checkSession();
  }, [setAuthenticated, logout]);

  return null; // UI를 렌더링하지 않음
};

export default AuthInitializer;
