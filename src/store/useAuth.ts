import { create } from 'zustand';
import type { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start in loading state until Firebase checks auth
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));
