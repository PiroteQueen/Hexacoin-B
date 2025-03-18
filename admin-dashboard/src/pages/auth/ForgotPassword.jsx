import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';

const ForgotPassword = () => {
  const { resetPassword, error: authError, clearError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
    }
  });
  
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      clearError();
      
      await resetPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('重置密码请求失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">重置密码邮件已发送</h3>
        <p className="mt-1 text-sm text-gray-500">
          我们已向您的邮箱发送了重置密码的链接，请查收邮件并按照指示操作。
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            返回登录
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="邮箱"
          type="email"
          {...register('email', {
            required: '请输入邮箱',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '请输入有效的邮箱地址'
            }
          })}
          error={errors.email?.message}
          placeholder="请输入您的账号邮箱"
          required
        />
        
        {authError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {authError}
          </div>
        )}
        
        <div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            发送重置密码邮件
          </Button>
        </div>
        
        <div className="text-center text-sm">
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            返回登录
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;