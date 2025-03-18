import { supabase } from './supabase';

export const authService = {
  // 获取当前登录用户
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  // 使用邮箱和密码登录
  async loginWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // 使用手机号和密码登录
  async loginWithPhone(phone, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      phone,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // 注册新用户
  async register(email, password, userData) {
    // 1. 创建认证用户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) throw authError;
    
    // 2. 创建用户资料
    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('user')
        .insert([{
          ...userData,
          id: authData.user.id, // 使用认证 ID 作为用户 ID
        }])
        .select();
      
      if (profileError) throw profileError;
      return { auth: authData, profile: profileData[0] };
    }
    
    return authData;
  },
  
  // 退出登录
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  // 重置密码
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },
  
  // 更新密码
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) throw error;
    return data;
  },
  
  // 更新用户信息
  async updateUserInfo(updates) {
    const { data, error } = await supabase.auth.updateUser(updates);
    
    if (error) throw error;
    return data;
  },
}; 