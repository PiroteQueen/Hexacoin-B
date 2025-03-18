import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { useTodoStore } from '../../store/todoStore';
import { useUserStore } from '../../store/userStore';

const TodoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewTodo = id === 'new';
  const { currentTodo, fetchTodo, createTodo, updateTodo, clearCurrentTodo, error } = useTodoStore();
  const { users, fetchUsers } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchUsers();
        
        if (!isNewTodo) {
          await fetchTodo(id);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    return () => {
      clearCurrentTodo();
    };
  }, [id, isNewTodo, fetchTodo, fetchUsers, clearCurrentTodo]);
  
  useEffect(() => {
    if (currentTodo && !isNewTodo) {
      reset({
        text: currentTodo.text || '',
        completed: currentTodo.completed || false,
        user_id: currentTodo.user_id || '',
        description: currentTodo.description || '',
      });
    }
  }, [currentTodo, reset, isNewTodo]);
  
  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      if (isNewTodo) {
        await createTodo({
          ...data,
          completed: Boolean(data.completed),
        });
        navigate('/todos');
      } else {
        await updateTodo(id, {
          ...data,
          completed: Boolean(data.completed),
        });
      }
    } catch (error) {
      console.error('保存 TODO 失败:', error);
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
          {isNewTodo ? '添加 TODO' : '编辑 TODO'}
        </h1>
        <Link to="/todos">
          <Button variant="secondary">
            返回 TODO 列表
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
          <Card title="TODO 信息">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="内容"
                {...register('text', {
                  required: '请输入 TODO 内容',
                })}
                error={errors.text?.message}
                placeholder="请输入 TODO 内容"
                required
              />
              
              <div className="flex items-center">
                <input
                  id="completed"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  {...register('completed')}
                />
                <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
                  已完成
                </label>
              </div>
              
              <div>
                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
                  关联用户
                </label>
                <select
                  id="user_id"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  {...register('user_id', {
                    required: '请选择关联用户',
                  })}
                >
                  <option value="">请选择用户</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username || '未设置用户名'} {user.phone_number ? `(${user.phone_number})` : ''}
                    </option>
                  ))}
                </select>
                {errors.user_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_id.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入 TODO 描述"
                  {...register('description')}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/todos')}
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
        
        {!isNewTodo && (
          <div>
            <Card title="TODO 信息">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">创建时间</p>
                  <p className="font-medium">
                    {currentTodo?.created_at ? new Date(currentTodo.created_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">最后更新时间</p>
                  <p className="font-medium">
                    {currentTodo?.updated_at ? new Date(currentTodo.updated_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">TODO ID</p>
                  <p className="font-medium text-xs break-all">
                    {currentTodo?.id || '-'}
                  </p>
                </div>
                
                {currentTodo?.user && (
                  <div>
                    <p className="text-sm text-gray-500">关联用户</p>
                    <Link to={`/users/${currentTodo.user.id}`} className="text-primary-600 hover:text-primary-700">
                      {currentTodo.user.username || '未设置用户名'}
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoDetail;