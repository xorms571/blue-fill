import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { reissueToken } from '../../lib/authApi';

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthenticated, openModal, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 즉시 토큰 재발급 호출 (withCredentials: true 는 apiFetch에 설정됨)
        const response = await reissueToken();
        
        // 로그인 성공 처리
        setAuthenticated(true);

        if (response.isNewUser) {
          // 최초 로그인인 경우 회원가입 모달(약관 동의 단계) 표시
          openModal('signup-step1');
        }

        // 메인 페이지로 이동
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Authentication failed:', error);
        // 실패 시 로그아웃 처리 및 로그인 화면으로 유도
        logout();
        openModal('login');
        navigate('/', { replace: true });
      }
    };

    initAuth();
  }, [navigate, setAuthenticated, openModal, logout]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background-main">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-base-200 typo-body-2 animate-pulse">인증 중입니다...</p>
      </div>
    </div>
  );
};

export default CallbackPage;
