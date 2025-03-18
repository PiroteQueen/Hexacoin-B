import { create } from 'zustand';
import { todoService } from '../services/supabase';

export const useTodoStore = create((set, get) => ({
  todos: [],
  currentTodo: null,
  isLoading: false,
  error: null,
  
  // 获取所有 TODO
  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const todos = await todoService.getAllTodos();
      set({ todos, isLoading: false });
      return todos;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 获取用户的所有 TODO
  fetchUserTodos: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const todos = await todoService.getUserTodos(userId);
      set({ todos, isLoading: false });
      return todos;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 获取单个 TODO
  fetchTodo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const todo = await todoService.getTodoById(id);
      set({ currentTodo: todo, isLoading: false });
      return todo;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 创建 TODO
  createTodo: async (todoData) => {
    set({ isLoading: true, error: null });
    try {
      const newTodo = await todoService.createTodo(todoData);
      set((state) => ({ 
        todos: [...state.todos, newTodo],
        isLoading: false 
      }));
      return newTodo;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 更新 TODO
  updateTodo: async (id, todoData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTodo = await todoService.updateTodo(id, todoData);
      set((state) => ({
        todos: state.todos.map(todo => 
          todo.id === id ? updatedTodo : todo
        ),
        currentTodo: state.currentTodo?.id === id ? updatedTodo : state.currentTodo,
        isLoading: false
      }));
      return updatedTodo;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 删除 TODO
  deleteTodo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await todoService.deleteTodo(id);
      set((state) => ({
        todos: state.todos.filter(todo => todo.id !== id),
        currentTodo: state.currentTodo?.id === id ? null : state.currentTodo,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 切换 TODO 完成状态
  toggleTodoComplete: async (id) => {
    const todo = get().todos.find(todo => todo.id === id);
    if (!todo) return;
    
    return get().updateTodo(id, { completed: !todo.completed });
  },
  
  // 清除错误
  clearError: () => set({ error: null }),
  
  // 清除当前 TODO
  clearCurrentTodo: () => set({ currentTodo: null }),
})); 