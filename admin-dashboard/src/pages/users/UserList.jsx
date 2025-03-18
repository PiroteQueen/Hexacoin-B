import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useUserStore } from '../../store/userStore';

const UserList = () => {
  const { users, fetchUsers, deleteUser, isLoading, error } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // 处理搜索
  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(searchTermLower)) ||
      (user.phone_number && user.phone_number.includes(searchTerm)) ||
      (user.shortid && user.shortid.toLowerCase().includes(searchTermLower))
    );
  });
  
  // 处理删除
  const handleDelete = async (id) => {
    if (window.confirm('确定要删除此用户吗？此操作不可撤销。')) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error('删除用户失败:', error);
      }
    }
  };
  
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      render: (_, user) => (
        <Link to={`/users/${user.id}`} className="text-primary-600 hover:text-primary-800 font-medium">
          {user.username || '未设置用户名'}
        </Link>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone_number',
      render: (phone_number) => phone_number || '未设置',
    },
    {
      title: '短 ID',
      dataIndex: 'shortid',
      render: (shortid) => shortid || '未设置',
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      render: (is_active) => (
        <span className={`px-2 py-1 text-xs rounded-full ${is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {is_active ? '活跃' : '未激活'}
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
      render: (_, user) => (
        <div className="flex space-x-2">
          <Link to={`/users/${user.id}`}>
            <Button variant="outline" size="sm">
              编辑
            </Button>
          </Link>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(user.id)}
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
        <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
        <Link to="/users/new">
          <Button variant="primary">
            添加用户
          </Button>
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <Card>
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜索用户名、手机号或短 ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Table
          columns={columns}
          data={filteredUsers}
          isLoading={isLoading}
          emptyMessage="暂无用户数据"
        />
      </Card>
    </div>
  );
};

export default UserList;