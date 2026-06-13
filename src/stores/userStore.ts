import { create } from 'zustand';
import { User } from '../types';
import { mockUsers } from '../utils/mockData';

interface UserStore {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updateJobIntention: (intention: User['jobIntention']) => void;
  updateResumeSummary: (resume: User['resumeSummary']) => void;
  addCreditScore: (score: number) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: mockUsers[0],
  users: mockUsers,
  isAuthenticated: true,

  login: (userId: string) => {
    const user = get().users.find(u => u.id === userId);
    if (user) {
      set({ currentUser: user, isAuthenticated: true });
    }
  },

  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },

  updateProfile: (updates: Partial<User>) => {
    const { currentUser, users } = get();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);

    set({
      currentUser: updatedUser,
      users: updatedUsers,
    });

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  },

  updateJobIntention: (intention: User['jobIntention']) => {
    const { currentUser, users } = get();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, jobIntention: intention };
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);

    set({
      currentUser: updatedUser,
      users: updatedUsers,
    });
  },

  updateResumeSummary: (resume: User['resumeSummary']) => {
    const { currentUser, users } = get();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, resumeSummary: resume };
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);

    set({
      currentUser: updatedUser,
      users: updatedUsers,
    });
  },

  addCreditScore: (score: number) => {
    const { currentUser, users } = get();
    if (!currentUser) return;

    const newScore = Math.max(0, Math.min(100, currentUser.creditScore + score));
    const updatedUser = { ...currentUser, creditScore: newScore };
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);

    set({
      currentUser: updatedUser,
      users: updatedUsers,
    });
  },
}));
