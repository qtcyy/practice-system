import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  username: string | null;

  login: (token: string, userId: string, username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 初始状态
      isAuthenticated: false,
      token: null,
      userId: null,
      username: null,

      // 登录方法
      login: (token: string, userId: string, username: string) => {
        // 保留单独的 access_token 用于向后兼容（AuthInterceptor 依赖）
        localStorage.setItem('access_token', token);

        set({
          isAuthenticated: true,
          token,
          userId,
          username,
        });
        // persist 中间件会自动保存到 localStorage
      },

      // 增强的退出登录方法
      logout: () => {
        // 清除所有认证相关的 localStorage 项
        localStorage.removeItem('access_token');
        localStorage.removeItem('remembered_username');

        set({
          isAuthenticated: false,
          token: null,
          userId: null,
          username: null,
        });
        // persist 中间件会自动清除 localStorage
      },
    }),
    {
      name: 'auth-storage', // localStorage 键名

      // 使用 localStorage 作为存储引擎
      storage: createJSONStorage(() => localStorage),

      // 选择性持久化：只持久化状态字段，不持久化方法
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        userId: state.userId,
        username: state.username,
      }),

      // 版本管理（未来升级时可用）
      version: 1,
    }
  )
);
