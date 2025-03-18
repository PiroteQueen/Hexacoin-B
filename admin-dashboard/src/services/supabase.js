import { createClient } from '@supabase/supabase-js';

// 这些值应该从环境变量中获取，这里仅作为示例
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// 用户相关操作
export const userService = {
  // 获取所有用户
  async getAllUsers() {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('is_deleted', false);
    
    if (error) throw error;
    return data;
  },
  
  // 获取单个用户
  async getUserById(id) {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // 创建用户
  async createUser(userData) {
    const { data, error } = await supabase
      .from('user')
      .insert([userData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // 更新用户
  async updateUser(id, userData) {
    const { data, error } = await supabase
      .from('user')
      .update(userData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // 软删除用户
  async deleteUser(id) {
    const { data, error } = await supabase
      .from('user')
      .update({ is_deleted: true })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }
};

// TODO 相关操作
export const todoService = {
  // 获取所有 TODO
  async getAllTodos() {
    const { data, error } = await supabase
      .from('todo')
      .select('*, user:user_id(*)')
      .eq('is_deleted', false);
    
    if (error) throw error;
    return data;
  },
  
  // 获取用户的所有 TODO
  async getUserTodos(userId) {
    const { data, error } = await supabase
      .from('todo')
      .select('*, user:user_id(*)')
      .eq('user_id', userId)
      .eq('is_deleted', false);
    
    if (error) throw error;
    return data;
  },
  
  // 获取单个 TODO
  async getTodoById(id) {
    const { data, error } = await supabase
      .from('todo')
      .select('*, user:user_id(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // 创建 TODO
  async createTodo(todoData) {
    const { data, error } = await supabase
      .from('todo')
      .insert([todoData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // 更新 TODO
  async updateTodo(id, todoData) {
    const { data, error } = await supabase
      .from('todo')
      .update(todoData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // 软删除 TODO
  async deleteTodo(id) {
    const { data, error } = await supabase
      .from('todo')
      .update({ is_deleted: true })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }
};

// 短信验证码记录相关操作
export const smsCodeRecordService = {
  // 获取所有短信验证码记录
  async getAllSMSCodeRecords() {
    const { data, error } = await supabase
      .from('smscoderecord')
      .select('*')
      .eq('is_deleted', false);
    
    if (error) throw error;
    return data;
  },
  
  // 获取单个短信验证码记录
  async getSMSCodeRecordById(id) {
    const { data, error } = await supabase
      .from('smscoderecord')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // 创建短信验证码记录
  async createSMSCodeRecord(recordData) {
    const { data, error } = await supabase
      .from('smscoderecord')
      .insert([recordData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // 更新短信验证码记录
  async updateSMSCodeRecord(id, recordData) {
    const { data, error } = await supabase
      .from('smscoderecord')
      .update(recordData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // 软删除短信验证码记录
  async deleteSMSCodeRecord(id) {
    const { data, error } = await supabase
      .from('smscoderecord')
      .update({ is_deleted: true })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }
}; 