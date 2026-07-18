import { create } from 'zustand';
import { setAccessToken } from '../lib/token';

export type AuthView = 'login' | 'signup-step1' | 'signup-step2' | 'signup-success';

export interface User {
  publicId: string;
  nickname: string;
  profileImageUrl: string | null;
  email: string;
  planName: string | null;
  isPublic: boolean;
  characterCount: number;
  postCount: number;
}

interface AuthState {
  isModalOpen: boolean;
  currentView: AuthView;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
  openModal: (view?: AuthView) => void;
  closeModal: () => void;
  setView: (view: AuthView) => void;
  setAuthenticated: (value: boolean, user?: User | null) => void;
  setInitialized: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isModalOpen: false,
  currentView: 'login',
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  openModal: (view = 'login') => set({ isModalOpen: true, currentView: view }),
  closeModal: () => set({ isModalOpen: false }),
  setView: (view) => set({ currentView: view }),
  setAuthenticated: (value, user = null) => set({ isAuthenticated: value, user, isInitialized: true }),
  setInitialized: (value) => set({ isInitialized: value }),
  logout: () => {
    // 쿠키 삭제는 백엔드 API(/auth/logout)에서 처리하도록 하고, 프론트에서는 토큰 및 상태 초기화
    setAccessToken(null);
    set({ isAuthenticated: false, isModalOpen: false, user: null, isInitialized: true });
  },
}));