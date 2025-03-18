import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, error: authError, clearError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      username: '',
      email: '',
      phone_number: '',
      password: '',
      confirmPassword: '',
    }
  });
  
  const password = watch('password');
  
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      clearError();
      
      const userData = {
        username: data.username,
        phone_number: data.phone_number,
        is_active: true,
      };
      
      await registerUser(data.email, data.password, userData);
      navigate('/login');
    } catch (error) {
      console.error('注册失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="用户名"
          {...register('username', {
            required: '请输入用户名',
            minLength: {
              value: 3,
              message: '用户名长度不能少于3个字符'
            }
          })}
          error={errors.username?.message}
          placeholder="请输入用户名"
          required
        />
        
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
          placeholder="请输入邮箱"
          required
        />
        
        <Input
          label="手机号"
          type="tel"
          {...register('phone_number', {
            pattern: {
              value: /^1[3-9]\d{9}$/,
              message: '请输入有效的手机号'
            }
          })}
          error={errors.phone_number?.message}
          placeholder="请输入手机号（选填）"
        />
        
        <Input
          label="密码"
          type="password"
          {...register('password', {
            required: '请输入密码',
            minLength: {
              value: 6,
              message: '密码长度不能少于6个字符'
            }
          })}
          error={errors.password?.message}
          placeholder="请输入密码"
          required
        />
        
        <Input
          label="确认密码"
          type="password"
          {...register('confirmPassword', {
            required: '请确认密码',
            validate: value => value === password || '两次输入的密码不一致'
          })}
          error={errors.confirmPassword?.message}
          placeholder="请再次输入密码"
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
            注册
          </Button>
        </div>
        
        <div className="text-center text-sm">
          <span className="text-gray-600">已有账号? </span>
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            立即登录
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register; 