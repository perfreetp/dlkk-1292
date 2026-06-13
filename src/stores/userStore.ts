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
  updateCreditScore: (userId: string, score: number) => void;
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

const storedUser = loadFromStorage<User | null>('currentUser', null);

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: storedUser,
  users: mockUsers,
  isAuthenticated: storedUser !== null,

  login: (userId: string) => {
    const user = get().users.find(u => u.id === userId);
    if (user) {
      const updatedUser = { ...user };
      const storedUsers = loadFromStorage<User[]>('users', mockUsers);
      const updatedUsers = storedUsers.map(u => u.id === userId ? updatedUser : u);
      
      set({ currentUser: updatedUser, users: updatedUsers, isAuthenticated: true });
      saveToStorage('currentUser', updatedUser);
      saveToStorage('users', updatedUsers);
    }
  },

  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
    localStorage.removeItem('currentUser');
  },

  updateProfile: (updates: Partial<User>) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    const storedUsers = loadFromStorage<User[]>('users', mockUsers);
    const updatedUsers = storedUsers.map(u => u.id === currentUser.id ? updatedUser : u);

    set({
      currentUser: updatedUser,
      users: updatedUsers,
    });

    saveToStorage('currentUser', updatedUser);
    saveToStorage('users', updatedUsers);
  },

  updateJobIntention: (intention: User['jobIntention']) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, jobIntention: intention };
    const storedUsers = loadFromStorage<User[]>('users', mockUsers);
    const updatedUsers = storedUsers.map(u => u.id === currentUser.id ? updatedUser : u);

    set({
      currentUser: updatedUser,
      users: updatedUsers,
    });

    saveToStorage('currentUser', updatedUser);
    saveToStorage('users', updatedUsers);
  },

  updateResumeSummary: (resume: User['resumeSummary']) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, resumeSummary: resume };
    const storedUsers = loadFromStorage<User[]>('users', mockUsers);
    const updatedUsers = storedUsers.map(u => u.id === currentUser.id ? updatedUser : u);

    set({
      currentUser: updatedUser,
      users: updatedUsers,
    });

    saveToStorage('currentUser', updatedUser);
    saveToStorage('users', updatedUsers);
  },

  addCreditScore: (score: number) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const newScore = Math.max(0, Math.min(100, currentUser.creditScore + score));
    const updatedUser = { ...currentUser, creditScore: newScore };
    const storedUsers = loadFromStorage<User[]>('users', mockUsers);
    const updatedUsers = storedUsers.map(u => u.id === currentUser.id ? updatedUser : u);

    set({
      currentUser: updatedUser,
      users: updatedUsers,
    });

    saveToStorage('currentUser', updatedUser);
    saveToStorage('users', updatedUsers);
  },

  updateCreditScore: (userId: string, newScore: number) => {
    const { currentUser } = get();
    
    const storedUsers = loadFromStorage<User[]>('users', mockUsers);
    const updatedUsers = storedUsers.map(u => 
      u.id === userId ? { ...u, creditScore: Math.max(0, Math.min(100, newScore)) } : u
    );

    const updatedCurrentUser = currentUser && currentUser.id === userId 
      ? { ...currentUser, creditScore: Math.max(0, Math.min(100, newScore)) }
      : currentUser;

    set({
      currentUser: updatedCurrentUser,
      users: updatedUsers,
    });

    if (currentUser && currentUser.id === userId) {
      saveToStorage('currentUser', updatedCurrentUser);
    }
    saveToStorage('users', updatedUsers);
  },

  initEventListeners: () => {
    window.addEventListener('creditChanged', ((event: CustomEvent) => {
      const { userId, scoreChange } = event.detail;
      const { currentUser } = get();
      
      const storedUsers = loadFromStorage<User[]>('users', mockUsers);
      const user = storedUsers.find(u => u.id === userId);
      
      if (user) {
        const newScore = Math.max(0, Math.min(100, user.creditScore + scoreChange));
        const updatedUsers = storedUsers.map(u => 
          u.id === userId ? { ...u, creditScore: newScore } : u
        );
        
        const updatedCurrentUser = currentUser && currentUser.id === userId
          ? { ...currentUser, creditScore: newScore }
          : currentUser;
        
        set({
          currentUser: updatedCurrentUser,
          users: updatedUsers,
        });
        
        if (currentUser && currentUser.id === userId) {
          saveToStorage('currentUser', updatedCurrentUser);
        }
        saveToStorage('users', updatedUsers);
      }
    }) as EventListener);
  },
}));
