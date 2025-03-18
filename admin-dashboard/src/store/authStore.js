import { create } from 'zustand';
import { authService } from '../services/auth';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  // 初始化用户状态
  initAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // 登录
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.loginWithEmail(email, password);
      set({ user, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 手机号登录
  loginWithPhone: async (phone, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.loginWithPhone(phone, password);
      set({ user, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 注册
  register: async (email, password, userData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.register(email, password, userData);
      set({ user: result.auth.user, isLoading: false });
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 退出登录
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 重置密码
  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(email);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 更新用户信息
  updateUserInfo: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.updateUserInfo(updates);
      set({ user, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 清除错误
  clearError: () => set({ error: null }),
})); 