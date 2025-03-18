import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { useSMSCodeRecordStore } from '../../store/smsCodeRecordStore';

const SMSRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewRecord = id === 'new';
  const { currentRecord, fetchRecord, createRecord, updateRecord, clearCurrentRecord, error } = useSMSCodeRecordStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  
  useEffect(() => {
    const loadData = async () => {
      if (!isNewRecord) {
        setIsLoading(true);
        try {
          await fetchRecord(id);
        } catch (error) {
          console.error('加载短信验证码记录失败:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      clearCurrentRecord();
    };
  }, [id, isNewRecord, fetchRecord, clearCurrentRecord]);
  
  useEffect(() => {
    if (currentRecord && !isNewRecord) {
      reset({
        phone_number: currentRecord.phone_number || '',
        sms_code: currentRecord.sms_code || '',
        expire_time: currentRecord.expire_time ? new Date(currentRecord.expire_time).toISOString().slice(0, 16) : '',
        description: currentRecord.description || '',
      });
    } else if (isNewRecord) {
      // 设置默认过期时间为当前时间 + 5 分钟
      const defaultExpireTime = new Date(new Date().getTime() + 5 * 60000);
      setValue('expire_time', defaultExpireTime.toISOString().slice(0, 16));
    }
  }, [currentRecord, reset, isNewRecord, setValue]);
  
  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const recordData = {
        ...data,
        sms_code: parseInt(data.sms_code, 10),
        expire_time: new Date(data.expire_time).toISOString(),
      };
      
      if (isNewRecord) {
        await createRecord(recordData);
        navigate('/sms-records');
      } else {
        await updateRecord(id, recordData);
      }
    } catch (error) {
      console.error('保存短信验证码记录失败:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // 检查验证码是否已过期
  const isExpired = (expireTime) => {
    return expireTime && new Date(expireTime) < new Date();
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
          {isNewRecord ? '添加短信验证码记录' : '查看短信验证码记录'}
        </h1>
        <Link to="/sms-records">
          <Button variant="secondary">
            返回短信验证码记录列表
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
          <Card title="短信验证码记录信息">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="手机号"
                {...register('phone_number', {
                  required: '请输入手机号',
                  pattern: {
                    value: /^1[3-9]\d{9}$/,
                    message: '请输入有效的手机号'
                  }
                })}
                error={errors.phone_number?.message}
                placeholder="请输入手机号"
                required
              />
              
              <Input
                label="验证码"
                type="number"
                {...register('sms_code', {
                  required: '请输入验证码',
                  min: {
                    value: 100000,
                    message: '验证码必须是6位数字'
                  },
                  max: {
                    value: 999999,
                    message: '验证码必须是6位数字'
                  }
                })}
                error={errors.sms_code?.message}
                placeholder="请输入6位数字验证码"
                required
              />
              
              <Input
                label="过期时间"
                type="datetime-local"
                {...register('expire_time', {
                  required: '请选择过期时间'
                })}
                error={errors.expire_time?.message}
                required
              />
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入描述"
                  {...register('description')}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/sms-records')}
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
        
        {!isNewRecord && (
          <div>
            <Card title="记录信息">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">状态</p>
                  <p className={`font-medium ${isExpired(currentRecord?.expire_time) ? 'text-red-600' : 'text-green-600'}`}>
                    {isExpired(currentRecord?.expire_time) ? '已过期' : '有效'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">创建时间</p>
                  <p className="font-medium">
                    {currentRecord?.created_at ? new Date(currentRecord.created_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">最后更新时间</p>
                  <p className="font-medium">
                    {currentRecord?.updated_at ? new Date(currentRecord.updated_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">记录 ID</p>
                  <p className="font-medium text-xs break-all">
                    {currentRecord?.id || '-'}
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

export default SMSRecordDetail; 