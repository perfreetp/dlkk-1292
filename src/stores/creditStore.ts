import { create } from 'zustand';
import { CreditRecord, SuccessCase } from '../types';
import { mockCreditRecords, mockSuccessCases } from '../utils/mockData';

interface CreditStore {
  records: CreditRecord[];
  successCases: SuccessCase[];
  addRecord: (record: Omit<CreditRecord, 'id' | 'createdAt'>) => void;
  reportUser: (reporterId: string, reportedUserId: string, reason: string) => void;
  initEventListeners: () => void;
}

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn('Failed to save to localStorage');
  }
};

const initialRecords = loadFromStorage('creditRecords', mockCreditRecords);

export const useCreditStore = create<CreditStore>((set, get) => ({
  records: initialRecords,
  successCases: mockSuccessCases,

  addRecord: (recordData) => {
    const newRecord: CreditRecord = {
      ...recordData,
      id: `cr-${Date.now()}`,
      createdAt: Date.now(),
    };

    const updatedRecords = [newRecord, ...get().records];
    set({ records: updatedRecords });
    saveToStorage('creditRecords', updatedRecords);

    const event = new CustomEvent('creditChanged', {
      detail: {
        userId: recordData.userId,
        scoreChange: recordData.score,
      }
    });
    window.dispatchEvent(event);
  },

  reportUser: (reporterId: string, reportedUserId: string, reason: string) => {
    const { records } = get();

    const newRecord: CreditRecord = {
      id: `cr-${Date.now()}`,
      userId: reportedUserId,
      type: 'report',
      score: -30,
      reason: `被举报：${reason}`,
      relatedUserId: reporterId,
      createdAt: Date.now(),
    };

    const updatedRecords = [newRecord, ...records];
    set({ records: updatedRecords });
    saveToStorage('creditRecords', updatedRecords);

    const event = new CustomEvent('creditChanged', {
      detail: {
        userId: reportedUserId,
        scoreChange: -30,
      }
    });
    window.dispatchEvent(event);
  },

  initEventListeners: () => {
    window.addEventListener('submitFeedback', ((event: CustomEvent) => {
      const { application, result } = event.detail;
      const { records } = get();

      const newRecords: CreditRecord[] = [];

      if (result === 'success') {
        const seekerRecord: CreditRecord = {
          id: `cr-${Date.now()}-seeker-success`,
          userId: application.seekerId,
          type: 'success',
          score: 10,
          reason: `内推成功入职 ${application.company}`,
          relatedUserId: application.publisherId,
          createdAt: Date.now(),
        };
        newRecords.push(seekerRecord);

        const publisherRecord: CreditRecord = {
          id: `cr-${Date.now()}-publisher-success`,
          userId: application.publisherId,
          type: 'success',
          score: 10,
          reason: `成功内推 ${application.seekerName}`,
          relatedUserId: application.seekerId,
          createdAt: Date.now(),
        };
        newRecords.push(publisherRecord);

        const updatedRecords = [...newRecords, ...records];
        set({ records: updatedRecords });
        saveToStorage('creditRecords', updatedRecords);

        const seekerEvent = new CustomEvent('creditChanged', {
          detail: {
            userId: application.seekerId,
            scoreChange: 10,
          }
        });
        window.dispatchEvent(seekerEvent);

        const publisherEvent = new CustomEvent('creditChanged', {
          detail: {
            userId: application.publisherId,
            scoreChange: 10,
          }
        });
        window.dispatchEvent(publisherEvent);
      } else if (result === 'fail') {
        const seekerRecord: CreditRecord = {
          id: `cr-${Date.now()}-seeker-fail`,
          userId: application.seekerId,
          type: 'missedDeadline',
          score: 0,
          reason: `内推未成功 ${application.company}`,
          relatedUserId: application.publisherId,
          createdAt: Date.now(),
        };
        newRecords.push(seekerRecord);

        const publisherRecord: CreditRecord = {
          id: `cr-${Date.now()}-publisher-fail`,
          userId: application.publisherId,
          type: 'missedDeadline',
          score: 0,
          reason: `${application.seekerName} 内推未成功`,
          relatedUserId: application.seekerId,
          createdAt: Date.now(),
        };
        newRecords.push(publisherRecord);

        const updatedRecords = [...newRecords, ...records];
        set({ records: updatedRecords });
        saveToStorage('creditRecords', updatedRecords);
      }
    }) as EventListener);

    window.addEventListener('addEvaluation', ((event: CustomEvent) => {
      const { application, rating, comment } = event.detail;
      const { records } = get();

      const scoreChange = rating >= 4 ? 5 : rating >= 3 ? 2 : rating >= 2 ? 0 : -5;

      const record: CreditRecord = {
        id: `cr-${Date.now()}-evaluation`,
        userId: application.publisherId,
        type: 'success',
        score: scoreChange,
        reason: `获得评价：${comment} (${rating}星)`,
        relatedUserId: application.seekerId,
        createdAt: Date.now(),
      };

      const updatedRecords = [record, ...records];
      set({ records: updatedRecords });
      saveToStorage('creditRecords', updatedRecords);

      const evalEvent = new CustomEvent('creditChanged', {
        detail: {
          userId: application.publisherId,
          scoreChange: scoreChange,
        }
      });
      window.dispatchEvent(evalEvent);
    }) as EventListener);
  },
}));
