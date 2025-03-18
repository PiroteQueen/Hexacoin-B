import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useSMSCodeRecordStore } from '../../store/smsCodeRecordStore';

const SMSRecordList = () => {
  const { records, fetchRecords, deleteRecord, isLoading, error } = useSMSCodeRecordStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);
  
  // 处理搜索
  const filteredRecords = records.filter(record => {
    return record.phone_number.includes(searchTerm);
  });
  
  // 处理删除
  const handleDelete = async (id) => {
    if (window.confirm('确定要删除此短信验证码记录吗？此操作不可撤销。')) {
      try {
        await deleteRecord(id);
      } catch (error) {
        console.error('删除短信验证码记录失败:', error);
      }
    }
  };
  
  // 检查验证码是否已过期
  const isExpired = (expireTime) => {
    return new Date(expireTime) < new Date();
  };
  
  const columns = [
    {
      title: '手机号',
      dataIndex: 'phone_number',
      render: (phone_number, record) => (
        <Link to={`/sms-records/${record.id}`} className="text-primary-600 hover:text-primary-800 font-medium">
          {phone_number}
        </Link>
      ),
    },
    {
      title: '验证码',
      dataIndex: 'sms_code',
    },
    {
      title: '状态',
      dataIndex: 'expire_time',
      render: (expire_time) => (
        <span className={`px-2 py-1 text-xs rounded-full ${isExpired(expire_time) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {isExpired(expire_time) ? '已过期' : '有效'}
        </span>
      ),
    },
    {
      title: '过期时间',
      dataIndex: 'expire_time',
      render: (expire_time) => new Date(expire_time).toLocaleString(),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      render: (created_at) => new Date(created_at).toLocaleString(),
    },
    {
      title: '操作',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Link to={`/sms-records/${record.id}`}>
            <Button variant="outline" size="sm">
              查看
            </Button>
          </Link>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(record.id)}
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
        <h1 className="text-2xl font-bold text-gray-900">短信验证码记录</h1>
        <Link to="/sms-records/new">
          <Button variant="primary">
            添加记录
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
            placeholder="搜索手机号"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Table
          columns={columns}
          data={filteredRecords}
          isLoading={isLoading}
          emptyMessage="暂无短信验证码记录"
        />
      </Card>
    </div>
  );
};

export default SMSRecordList; 