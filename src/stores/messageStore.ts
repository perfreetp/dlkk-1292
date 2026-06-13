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
  sendMessage: (conversationId: string, content: string, senderId: string) => void;
  markAsRead: (conversationId: string) => void;
  updateApplicationStatus: (applicationId: string, status: ExchangeApplication['status']) => void;
  setFeedbackDeadline: (applicationId: string, deadline: number) => void;
  createConversation: (participantId: string, participantName: string, participantAvatar: string) => string;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  conversations: mockConversations,
  messages: {
    'conv-1': mockMessages.filter(m => m.conversationId === 'conv-1'),
    'conv-2': mockMessages.filter(m => m.conversationId === 'conv-2'),
  },
  applications: mockApplications,
  currentConversationId: null,
  totalUnread: mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0),

  setCurrentConversation: (conversationId: string | null) => {
    set({ currentConversationId: conversationId });
    if (conversationId) {
      get().markAsRead(conversationId);
    }
  },

  sendMessage: (conversationId: string, content: string, senderId: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      content,
      type: 'text',
      createdAt: Date.now(),
    };

    const { messages, conversations } = get();
    const conversationMessages = messages[conversationId] || [];

    set({
      messages: {
        ...messages,
        [conversationId]: [...conversationMessages, newMessage],
      },
      conversations: conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, lastMessage: content, lastMessageTime: Date.now() }
          : conv
      ),
    });
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
  },

  updateApplicationStatus: (applicationId: string, status: ExchangeApplication['status']) => {
    const { applications } = get();
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, status } : app
    );

    set({ applications: updatedApplications });
  },

  setFeedbackDeadline: (applicationId: string, deadline: number) => {
    const { applications } = get();
    const updatedApplications = applications.map(app =>
      app.id === applicationId
        ? { ...app, feedbackDeadline: deadline, status: 'accepted' as const }
        : app
    );

    set({ applications: updatedApplications });
  },

  createConversation: (participantId: string, participantName: string, participantAvatar: string) => {
    const { conversations } = get();
    const existingConv = conversations.find(c => c.participantId === participantId);

    if (existingConv) {
      return existingConv.id;
    }

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      participantId,
      participantName,
      participantAvatar,
      lastMessage: '',
      lastMessageTime: Date.now(),
      unreadCount: 0,
    };

    set({
      conversations: [newConv, ...conversations],
      messages: {
        ...get().messages,
        [newConv.id]: [],
      },
    });

    return newConv.id;
  },
}));
