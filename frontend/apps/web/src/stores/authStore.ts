import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  username: string | null;

  login: (token: string, userId: string, username: string) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  userId: null,
  username: null,

  login: (token: string, userId: string, username: string) => {
    localStorage.setItem('access_token', token);
    set({
      isAuthenticated: true,
      token,
      userId,
      username,
    });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({
      isAuthenticated: false,
      token: null,
      userId: null,
      username: null,
    });
  },

  initAuth: () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      set({
        isAuthenticated: true,
        token,
      });
    }
  },
}));
