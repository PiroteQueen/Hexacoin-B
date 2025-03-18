import { create } from 'zustand';
import { smsCodeRecordService } from '../services/supabase';

export const useSMSCodeRecordStore = create((set, get) => ({
  records: [],
  currentRecord: null,
  isLoading: false,
  error: null,
  
  // 获取所有短信验证码记录
  fetchRecords: async () => {
    set({ isLoading: true, error: null });
    try {
      const records = await smsCodeRecordService.getAllSMSCodeRecords();
      set({ records, isLoading: false });
      return records;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 获取单个短信验证码记录
  fetchRecord: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const record = await smsCodeRecordService.getSMSCodeRecordById(id);
      set({ currentRecord: record, isLoading: false });
      return record;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 创建短信验证码记录
  createRecord: async (recordData) => {
    set({ isLoading: true, error: null });
    try {
      const newRecord = await smsCodeRecordService.createSMSCodeRecord(recordData);
      set((state) => ({ 
        records: [...state.records, newRecord],
        isLoading: false 
      }));
      return newRecord;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 更新短信验证码记录
  updateRecord: async (id, recordData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedRecord = await smsCodeRecordService.updateSMSCodeRecord(id, recordData);
      set((state) => ({
        records: state.records.map(record => 
          record.id === id ? updatedRecord : record
        ),
        currentRecord: state.currentRecord?.id === id ? updatedRecord : state.currentRecord,
        isLoading: false
      }));
      return updatedRecord;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 删除短信验证码记录
  deleteRecord: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await smsCodeRecordService.deleteSMSCodeRecord(id);
      set((state) => ({
        records: state.records.filter(record => record.id !== id),
        currentRecord: state.currentRecord?.id === id ? null : state.currentRecord,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // 清除错误
  clearError: () => set({ error: null }),
  
  // 清除当前记录
  clearCurrentRecord: () => set({ currentRecord: null }),
})); 