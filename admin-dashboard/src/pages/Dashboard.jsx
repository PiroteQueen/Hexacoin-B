import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { useUserStore } from '../store/userStore';
import { useTodoStore } from '../store/todoStore';
import { useSMSCodeRecordStore } from '../store/smsCodeRecordStore';

const StatCard = ({ title, value, icon, linkTo, linkText }) => {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <div className="p-2 bg-primary-100 rounded-full">
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      {linkTo && (
        <Link to={linkTo} className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-auto">
          {linkText || '查看详情'} &rarr;
        </Link>
      )}
    </Card>
  );
};

const Dashboard = () => {
  const { users, fetchUsers } = useUserStore();
  const { todos, fetchTodos } = useTodoStore();
  const { records, fetchRecords } = useSMSCodeRecordStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchUsers(),
          fetchTodos(),
          fetchRecords()
        ]);
      } catch (error) {
        console.error('加载仪表盘数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchUsers, fetchTodos, fetchRecords]);

  // 计算统计数据
  const activeUsers = users.filter(user => user.is_active).length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const todoCompletionRate = todos.length > 0 
    ? Math.round((completedTodos / todos.length) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="总用户数" 
          value={users.length} 
          icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          linkTo="/users"
        />
        <StatCard 
          title="活跃用户" 
          value={activeUsers} 
          icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          linkTo="/users"
        />
        <StatCard 
          title="TODO 完成率" 
          value={`${todoCompletionRate}%`} 
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          linkTo="/todos"
        />
        <StatCard 
          title="短信验证码记录" 
          value={records.length} 
          icon="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l-4-4m4 4l4-4"
          linkTo="/sms-records"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="最近添加的用户" footer={<Link to="/users" className="text-primary-600 hover:text-primary-700">查看所有用户</Link>}>
          <div className="space-y-4">
            {users.slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.username || '未设置用户名'}</p>
                  <p className="text-sm text-gray-500">{user.phone_number || '未设置手机号'}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {user.is_active ? '活跃' : '未激活'}
                </span>
              </div>
            ))}
            {users.length === 0 && <p className="text-gray-500">暂无用户数据</p>}
          </div>
        </Card>
        
        <Card title="最近的 TODO" footer={<Link to="/todos" className="text-primary-600 hover:text-primary-700">查看所有 TODO</Link>}>
          <div className="space-y-4">
            {todos.slice(0, 5).map(todo => (
              <div key={todo.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-3 ${todo.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  <p className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{todo.text}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(todo.updated_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {todos.length === 0 && <p className="text-gray-500">暂无 TODO 数据</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 