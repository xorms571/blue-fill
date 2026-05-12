import { create } from 'zustand';

export type AuthView = 'login' | 'signup-step1' | 'signup-step2' | 'signup-success';

interface AuthState {
  isModalOpen: boolean;
  currentView: AuthView;
  openModal: (view?: AuthView) => void;
  closeModal: () => void;
  setView: (view: AuthView) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isModalOpen: false,
  currentView: 'login',
  openModal: (view = 'login') => set({ isModalOpen: true, currentView: view }),
  closeModal: () => set({ isModalOpen: false }),
  setView: (view) => set({ currentView: view }),
}));