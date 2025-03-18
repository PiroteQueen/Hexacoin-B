import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' 或 'phone'
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      phone: '',
      password: '',
    }
  });
  
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      clearError();
      
      if (loginMethod === 'email') {
        await login(data.email, data.password);
      } else {
        // 使用手机号登录
        // await loginWithPhone(data.phone, data.password);
        // 注意：这里需要实现手机号登录的逻辑
        console.log('手机号登录暂未实现');
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="flex space-x-1 border rounded-lg overflow-hidden">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              loginMethod === 'email'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setLoginMethod('email')}
          >
            邮箱登录
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              loginMethod === 'phone'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setLoginMethod('phone')}
          >
            手机号登录
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {loginMethod === 'email' ? (
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
        ) : (
          <Input
            label="手机号"
            type="tel"
            {...register('phone', {
              required: '请输入手机号',
              pattern: {
                value: /^1[3-9]\d{9}$/,
                message: '请输入有效的手机号'
              }
            })}
            error={errors.phone?.message}
            placeholder="请输入手机号"
            required
          />
        )}
        
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
        
        {authError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {authError}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              记住我
            </label>
          </div>
          
          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
              忘记密码?
            </Link>
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            登录
          </Button>
        </div>
        
        <div className="text-center text-sm">
          <span className="text-gray-600">还没有账号? </span>
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            立即注册
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 