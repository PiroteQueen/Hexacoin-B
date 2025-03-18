import { create } from 'zustand';
import { userService } from '../services/supabase';

export const useUserStore = create((set, get) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  
  // 获取所有用户
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await userService.getAllUsers();
      set({ users, isLoading: false });
      return users;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 获取单个用户
  fetchUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.getUserById(id);
      set({ currentUser: user, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 创建用户
  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await userService.createUser(userData);
      set((state) => ({ 
        users: [...state.users, newUser],
        isLoading: false 
      }));
      return newUser;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 更新用户
  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userService.updateUser(id, userData);
      set((state) => ({
        users: state.users.map(user => 
          user.id === id ? updatedUser : user
        ),
        currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
        isLoading: false
      }));
      return updatedUser;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 删除用户
  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await userService.deleteUser(id);
      set((state) => ({
        users: state.users.filter(user => user.id !== id),
        currentUser: state.currentUser?.id === id ? null : state.currentUser,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 清除错误
  clearError: () => set({ error: null }),
  
  // 清除当前用户
  clearCurrentUser: () => set({ currentUser: null }),
})); 