import { create } from 'zustand';

export type AuthView = 'login' | 'signup-step1' | 'signup-step2' | 'signup-success';

export interface User {
  publicId: string;
  nickname: string;
  profileImageUrl: string | null;
  email: string;
  planId: number | null;
  isPublic: boolean;
  characterCnt: number;
  postCnt: number;
}

interface AuthState {
  isModalOpen: boolean;
  currentView: AuthView;
  isAuthenticated: boolean;
  user: User | null;
  openModal: (view?: AuthView) => void;
  closeModal: () => void;
  setView: (view: AuthView) => void;
  setAuthenticated: (value: boolean, user?: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isModalOpen: false,
  currentView: 'login',
  isAuthenticated: false,
  user: null,
  openModal: (view = 'login') => set({ isModalOpen: true, currentView: view }),
  closeModal: () => set({ isModalOpen: false }),
  setView: (view) => set({ currentView: view }),
  setAuthenticated: (value, user = null) => set({ isAuthenticated: value, user }),
  logout: () => {
    // 쿠키 삭제는 백엔드 API(/auth/logout)에서 처리하도록 함
    set({ isAuthenticated: false, isModalOpen: false, user: null });
  },
}));