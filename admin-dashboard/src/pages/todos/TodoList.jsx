import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useTodoStore } from '../../store/todoStore';

const TodoList = () => {
  const { todos, fetchTodos, deleteTodo, toggleTodoComplete, isLoading, error } = useTodoStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'active'
  
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);
  
  // 处理搜索和过滤
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'completed') return matchesSearch && todo.completed;
    if (filter === 'active') return matchesSearch && !todo.completed;
    
    return matchesSearch;
  });
  
  // 处理删除
  const handleDelete = async (id) => {
    if (window.confirm('确定要删除此 TODO 吗？此操作不可撤销。')) {
      try {
        await deleteTodo(id);
      } catch (error) {
        console.error('删除 TODO 失败:', error);
      }
    }
  };
  
  // 处理切换完成状态
  const handleToggleComplete = async (id) => {
    try {
      await toggleTodoComplete(id);
    } catch (error) {
      console.error('切换 TODO 状态失败:', error);
    }
  };
  
  const columns = [
    {
      title: '内容',
      dataIndex: 'text',
      render: (text, todo) => (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggleComplete(todo.id)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-3"
          />
          <Link to={`/todos/${todo.id}`} className={`${todo.completed ? 'line-through text-gray-500' : 'text-primary-600 hover:text-primary-800 font-medium'}`}>
            {text}
          </Link>
        </div>
      ),
    },
    {
      title: '用户',
      dataIndex: 'user',
      render: (user) => (
        user ? (
          <Link to={`/users/${user.id}`} className="text-primary-600 hover:text-primary-800">
            {user.username || '未设置用户名'}
          </Link>
        ) : '未关联用户'
      ),
    },
    {
      title: '状态',
      dataIndex: 'completed',
      render: (completed) => (
        <span className={`px-2 py-1 text-xs rounded-full ${completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {completed ? '已完成' : '进行中'}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      render: (created_at) => new Date(created_at).toLocaleString(),
    },
    {
      title: '操作',
      render: (_, todo) => (
        <div className="flex space-x-2">
          <Link to={`/todos/${todo.id}`}>
            <Button variant="outline" size="sm">
              编辑
            </Button>
          </Link>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(todo.id)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">TODO 管理</h1>
        <Link to="/todos/new">
          <Button variant="primary">
            添加 TODO
          </Button>
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <Card>
        <div className="flex flex-col md:flex-row md:items-center mb-4 space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索 TODO 内容"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-1 border rounded-lg overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setFilter('all')}
            >
              全部
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'active'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setFilter('active')}
            >
              进行中
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'completed'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setFilter('completed')}
            >
              已完成
            </button>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredTodos}
          isLoading={isLoading}
          emptyMessage="暂无 TODO 数据"
        />
      </Card>
    </div>
  );
};

export default TodoList; 