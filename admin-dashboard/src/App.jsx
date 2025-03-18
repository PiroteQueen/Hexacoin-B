import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// 布局
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// 页面
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import UserList from './pages/users/UserList';
import UserDetail from './pages/users/UserDetail';
import TodoList from './pages/todos/TodoList';
import TodoDetail from './pages/todos/TodoDetail';
import SMSRecordList from './pages/sms-records/SMSRecordList';
import SMSRecordDetail from './pages/sms-records/SMSRecordDetail';
import NotFound from './pages/NotFound';

// 临时移除路由保护，直接显示内容
const ProtectedRoute = ({ children }) => {
  return children;
};

function App() {
  const { initAuth } = useAuthStore();
  
  useEffect(() => {
    // 仍然初始化认证，但不强制要求登录
    initAuth();
  }, [initAuth]);
  
  return (
    <Routes>
      {/* 认证路由 */}
      <Route path="/login" element={
        <AuthLayout title="登录" subtitle="欢迎回来，请登录您的账号">
          <Login />
        </AuthLayout>
      } />
      <Route path="/register" element={
        <AuthLayout title="注册" subtitle="创建一个新账号">
          <Register />
        </AuthLayout>
      } />
      <Route path="/forgot-password" element={
        <AuthLayout title="忘记密码" subtitle="我们将向您发送重置密码的链接">
          <ForgotPassword />
        </AuthLayout>
      } />
      
      {/* 仪表盘路由 - 已移除保护 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      } />
      
      {/* 用户管理路由 - 已移除保护 */}
      <Route path="/users" element={
        <DashboardLayout>
          <UserList />
        </DashboardLayout>
      } />
      <Route path="/users/:id" element={
        <DashboardLayout>
          <UserDetail />
        </DashboardLayout>
      } />
      
      {/* TODO 管理路由 - 已移除保护 */}
      <Route path="/todos" element={
        <DashboardLayout>
          <TodoList />
        </DashboardLayout>
      } />
      <Route path="/todos/:id" element={
        <DashboardLayout>
          <TodoDetail />
        </DashboardLayout>
      } />
      
      {/* 短信验证码记录路由 - 已移除保护 */}
      <Route path="/sms-records" element={
        <DashboardLayout>
          <SMSRecordList />
        </DashboardLayout>
      } />
      <Route path="/sms-records/:id" element={
        <DashboardLayout>
          <SMSRecordDetail />
        </DashboardLayout>
      } />
      
      {/* 404 页面 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App; 