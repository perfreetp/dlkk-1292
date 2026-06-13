import { create } from 'zustand';
import { CreditRecord, SuccessCase } from '../types';
import { mockCreditRecords, mockSuccessCases } from '../utils/mockData';

interface CreditStore {
  records: CreditRecord[];
  successCases: SuccessCase[];
  addRecord: (record: Omit<CreditRecord, 'id' | 'createdAt'>) => void;
  reportUser: (userId: string, reason: string) => void;
}

export const useCreditStore = create<CreditStore>((set, get) => ({
  records: mockCreditRecords,
  successCases: mockSuccessCases,

  addRecord: (recordData) => {
    const newRecord: CreditRecord = {
      ...recordData,
      id: `cr-${Date.now()}`,
      createdAt: Date.now(),
    };

    set({ records: [newRecord, ...get().records] });
  },

  reportUser: (userId: string, reason: string) => {
    const { records } = get();
    const newRecord: CreditRecord = {
      id: `cr-${Date.now()}`,
      userId,
      type: 'report',
      score: -30,
      reason: `被举报：${reason}`,
      createdAt: Date.now(),
    };

    set({ records: [newRecord, ...records] });
  },
}));
