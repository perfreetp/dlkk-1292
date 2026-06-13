import { create } from 'zustand';
import { Conversation, Message, ExchangeApplication } from '../types';
import { mockConversations, mockMessages, mockApplications } from '../utils/mockData';

interface MessageStore {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  applications: ExchangeApplication[];
  currentConversationId: string | null;
  totalUnread: number;
  setCurrentConversation: (conversationId: string | null) => void;
  sendMessage: (conversationId: string, content: string, senderId: string, type?: Message['type']) => void;
  markAsRead: (conversationId: string) => void;
  updateApplicationStatus: (applicationId: string, status: ExchangeApplication['status']) => void;
  setFeedbackDeadline: (applicationId: string, deadline: number) => void;
  acceptApplication: (applicationId: string) => void;
  createConversation: (participantId: string, participantName: string, participantAvatar: string, applicationId?: string) => string;
  getConversationByApplication: (applicationId: string) => Conversation | undefined;
  createApplication: (applicationData: Omit<ExchangeApplication, 'id' | 'createdAt' | 'status'>) => ExchangeApplication;
  submitFeedback: (applicationId: string, result: 'success' | 'fail') => void;
  addEvaluation: (applicationId: string, rating: number, comment: string, evaluatorId: string, evaluatorName: string) => void;
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

const initialApplications = loadFromStorage('applications', mockApplications);

export const useMessageStore = create<MessageStore>((set, get) => ({
  conversations: loadFromStorage('conversations', mockConversations),
  messages: loadFromStorage('messages', {
    'conv-1': mockMessages.filter(m => m.conversationId === 'conv-1'),
    'conv-2': mockMessages.filter(m => m.conversationId === 'conv-2'),
  }),
  applications: initialApplications,
  currentConversationId: null,
  totalUnread: loadFromStorage('conversations', mockConversations).reduce((sum, conv) => sum + conv.unreadCount, 0),

  setCurrentConversation: (conversationId: string | null) => {
    set({ currentConversationId: conversationId });
    if (conversationId) {
      get().markAsRead(conversationId);
    }
  },

  sendMessage: (conversationId: string, content: string, senderId: string, type: Message['type'] = 'text') => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      content,
      type,
      createdAt: Date.now(),
    };

    const { messages, conversations } = get();
    const conversationMessages = messages[conversationId] || [];
    const updatedMessages = {
      ...messages,
      [conversationId]: [...conversationMessages, newMessage],
    };
    const updatedConversations = conversations.map(conv =>
      conv.id === conversationId
        ? { ...conv, lastMessage: content, lastMessageTime: Date.now() }
        : conv
    );

    set({
      messages: updatedMessages,
      conversations: updatedConversations,
    });

    saveToStorage('messages', updatedMessages);
    saveToStorage('conversations', updatedConversations);
  },

  markAsRead: (conversationId: string) => {
    const { conversations } = get();
    const updatedConversations = conversations.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    );

    set({
      conversations: updatedConversations,
      totalUnread: updatedConversations.reduce((sum, conv) => sum + conv.unreadCount, 0),
    });

    saveToStorage('conversations', updatedConversations);
  },

  updateApplicationStatus: (applicationId: string, status: ExchangeApplication['status']) => {
    const { applications } = get();
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, status } : app
    );

    set({ applications: updatedApplications });
    saveToStorage('applications', updatedApplications);
  },

  setFeedbackDeadline: (applicationId: string, deadline: number) => {
    const { applications } = get();
    const updatedApplications = applications.map(app =>
      app.id === applicationId
        ? { ...app, feedbackDeadline: deadline }
        : app
    );

    set({ applications: updatedApplications });
    saveToStorage('applications', updatedApplications);
  },

  acceptApplication: (applicationId: string) => {
    const { applications } = get();
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, status: 'accepted' as const } : app
    );

    set({ applications: updatedApplications });
    saveToStorage('applications', updatedApplications);
  },

  getConversationByApplication: (applicationId: string) => {
    const { conversations } = get();
    return conversations.find(c => c.applicationId === applicationId);
  },

  createConversation: (participantId: string, participantName: string, participantAvatar: string, applicationId?: string) => {
    const { conversations, messages } = get();

    if (applicationId) {
      const existingConv = conversations.find(c => c.applicationId === applicationId);
      if (existingConv) {
        return existingConv.id;
      }
    }

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      participantId,
      participantName,
      participantAvatar,
      applicationId,
      lastMessage: '',
      lastMessageTime: Date.now(),
      unreadCount: 0,
    };

    const updatedConversations = [newConv, ...conversations];
    const updatedMessages = {
      ...messages,
      [newConv.id]: [],
    };

    set({
      conversations: updatedConversations,
      messages: updatedMessages,
    });

    saveToStorage('conversations', updatedConversations);
    saveToStorage('messages', updatedMessages);

    return newConv.id;
  },

  createApplication: (applicationData) => {
    const { applications } = get();
    const newApplication: ExchangeApplication = {
      ...applicationData,
      id: `app-${Date.now()}`,
      status: 'pending',
      createdAt: Date.now(),
    };

    const updatedApplications = [newApplication, ...applications];
    set({ applications: updatedApplications });
    saveToStorage('applications', updatedApplications);

    return newApplication;
  },

  submitFeedback: (applicationId: string, result: 'success' | 'fail') => {
    const { applications } = get();
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    const updatedApplications = applications.map(app =>
      app.id === applicationId
        ? { ...app, status: 'completed' as const, result }
        : app
    );

    set({ applications: updatedApplications });
    saveToStorage('applications', updatedApplications);

    const event = new CustomEvent('submitFeedback', {
      detail: {
        applicationId,
        application,
        result,
      }
    });
    window.dispatchEvent(event);
  },

  addEvaluation: (applicationId: string, rating: number, comment: string, evaluatorId: string, evaluatorName: string) => {
    const { applications } = get();
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    const event = new CustomEvent('addEvaluation', {
      detail: {
        applicationId,
        application,
        rating,
        comment,
        evaluatorId,
        evaluatorName,
      }
    });
    window.dispatchEvent(event);
  },
}));
