import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { useUserStore } from '../../store/userStore';
import { useTodoStore } from '../../store/todoStore';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewUser = id === 'new';
  const { currentUser, fetchUser, createUser, updateUser, clearCurrentUser, error } = useUserStore();
  const { todos, fetchUserTodos } = useTodoStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  useEffect(() => {
    const loadData = async () => {
      if (!isNewUser) {
        setIsLoading(true);
        try {
          await fetchUser(id);
          await fetchUserTodos(id);
        } catch (error) {
          console.error('加载用户数据失败:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      clearCurrentUser();
    };
  }, [id, isNewUser, fetchUser, fetchUserTodos, clearCurrentUser]);
  
  useEffect(() => {
    if (currentUser && !isNewUser) {
      reset({
        username: currentUser.username || '',
        phone_number: currentUser.phone_number || '',
        shortid: currentUser.shortid || '',
        is_active: currentUser.is_active,
        is_superuser: currentUser.is_superuser,
        description: currentUser.description || '',
      });
    }
  }, [currentUser, reset, isNewUser]);
  
  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      if (isNewUser) {
        await createUser({
          ...data,
          is_active: Boolean(data.is_active),
          is_superuser: Boolean(data.is_superuser),
        });
        navigate('/users');
      } else {
        await updateUser(id, {
          ...data,
          is_active: Boolean(data.is_active),
          is_superuser: Boolean(data.is_superuser),
        });
      }
    } catch (error) {
      console.error('保存用户失败:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNewUser ? '添加用户' : '编辑用户'}
        </h1>
        <Link to="/users">
          <Button variant="secondary">
            返回用户列表
          </Button>
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="用户信息">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="用户名"
                {...register('username', {
                  required: '请输入用户名',
                })}
                error={errors.username?.message}
                placeholder="请输入用户名"
                required
              />
              
              <Input
                label="手机号"
                {...register('phone_number')}
                error={errors.phone_number?.message}
                placeholder="请输入手机号"
              />
              
              <Input
                label="短 ID"
                {...register('shortid')}
                error={errors.shortid?.message}
                placeholder="请输入短 ID"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    id="is_active"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    {...register('is_active')}
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    账号激活
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="is_superuser"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    {...register('is_superuser')}
                  />
                  <label htmlFor="is_superuser" className="ml-2 block text-sm text-gray-900">
                    超级管理员
                  </label>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入用户描述"
                  {...register('description')}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/users')}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  disabled={isSaving}
                >
                  保存
                </Button>
              </div>
            </form>
          </Card>
        </div>
        
        {!isNewUser && (
          <div>
            <Card title="用户 TODO 列表">
              <div className="space-y-4">
                {todos.length > 0 ? (
                  todos.map(todo => (
                    <div key={todo.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-3 ${todo.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        <p className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{todo.text}</p>
                      </div>
                      <Link to={`/todos/${todo.id}`} className="text-primary-600 hover:text-primary-700 text-sm">
                        查看
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">该用户暂无 TODO</p>
                )}
              </div>
              
              <div className="mt-4">
                <Link to="/todos/new" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  为该用户添加 TODO &rarr;
                </Link>
              </div>
            </Card>
            
            <Card title="账号信息" className="mt-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">创建时间</p>
                  <p className="font-medium">
                    {currentUser?.created_at ? new Date(currentUser.created_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">最后更新时间</p>
                  <p className="font-medium">
                    {currentUser?.updated_at ? new Date(currentUser.updated_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">用户 ID</p>
                  <p className="font-medium text-xs break-all">
                    {currentUser?.id || '-'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail; 