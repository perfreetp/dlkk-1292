export interface User {
  id: string;
  nickname: string;
  avatar: string;
  role: 'seeker' | 'employee';
  city: string;
  industry: string;
  workYears: number;
  creditScore: number;
  jobIntention?: {
    position: string;
    city: string;
    salaryRange: [number, number];
  };
  resumeSummary?: {
    education: string;
    experience: string[];
    skills: string[];
  };
  isVerified: boolean;
  createdAt: number;
}

export interface Job {
  id: string;
  publisherId: string;
  publisherName: string;
  publisherAvatar: string;
  title: string;
  company: string;
  industry: string;
  city: string;
  salaryRange: [number, number];
  description: string;
  requirements: string[];
  slots: number;
  appliedCount: number;
  status: 'open' | 'closed';
  createdAt: number;
}

export interface ExchangeApplication {
  id: string;
  jobId: string;
  publisherId: string;
  jobTitle: string;
  company: string;
  seekerId: string;
  seekerName: string;
  seekerAvatar: string;
  resumeSummary: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  feedbackDeadline?: number;
  result?: 'success' | 'fail' | 'pending';
  createdAt: number;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  applicationId?: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'system' | 'feedback_约定';
  createdAt: number;
}

export interface CreditRecord {
  id: string;
  userId: string;
  type: 'success' | 'onTimeFeedback' | 'missedDeadline' | 'report' | 'evaluation';
  score: number;
  reason: string;
  relatedUserId?: string;
  relatedUserName?: string;
  relatedApplicationId?: string;
  relatedJobTitle?: string;
  relatedCompany?: string;
  rating?: number;
  createdAt: number;
}

export interface SuccessCase {
  id: string;
  seekerPosition: string;
  seekerIndustry: string;
  companyIndustry: string;
  matchScore: number;
  hiredPeriod: string;
  successRate: number;
}
