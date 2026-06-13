import { create } from 'zustand';
import { Job } from '../types';
import { mockJobs } from '../utils/mockData';

interface JobFilters {
  city?: string;
  industry?: string;
  salaryRange?: [number, number];
  keyword?: string;
}

interface JobStore {
  jobs: Job[];
  filteredJobs: Job[];
  filters: JobFilters;
  favorites: string[];
  myPublishedJobs: Job[];
  setFilters: (filters: JobFilters) => void;
  clearFilters: () => void;
  publishJob: (job: Omit<Job, 'id' | 'appliedCount' | 'status' | 'createdAt'>) => void;
  closeJob: (jobId: string) => void;
  incrementAppliedCount: (jobId: string) => void;
  toggleFavorite: (jobId: string) => void;
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: mockJobs,
  filteredJobs: mockJobs,
  filters: {},
  favorites: [],
  myPublishedJobs: [],

  setFilters: (filters: JobFilters) => {
    const { jobs } = get();
    const { city, industry, salaryRange, keyword } = filters;

    let filtered = jobs.filter(job => job.status === 'open');

    if (city) {
      filtered = filtered.filter(job => job.city === city);
    }

    if (industry) {
      filtered = filtered.filter(job => job.industry === industry);
    }

    if (salaryRange) {
      filtered = filtered.filter(
        job => job.salaryRange[0] >= salaryRange[0] && job.salaryRange[1] <= salaryRange[1]
      );
    }

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(lowerKeyword) ||
          job.company.toLowerCase().includes(lowerKeyword) ||
          job.description.toLowerCase().includes(lowerKeyword)
      );
    }

    set({ filters, filteredJobs: filtered });
  },

  clearFilters: () => {
    const { jobs } = get();
    set({
      filters: {},
      filteredJobs: jobs.filter(job => job.status === 'open'),
    });
  },

  publishJob: (jobData) => {
    const { jobs, myPublishedJobs } = get();
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      appliedCount: 0,
      status: 'open',
      createdAt: Date.now(),
    };

    set({
      jobs: [newJob, ...jobs],
      filteredJobs: [newJob, ...jobs].filter(j => j.status === 'open'),
      myPublishedJobs: [newJob, ...myPublishedJobs],
    });
  },

  closeJob: (jobId: string) => {
    const { jobs, myPublishedJobs } = get();
    const updatedJobs = jobs.map(job =>
      job.id === jobId ? { ...job, status: 'closed' as const } : job
    );
    const updatedPublished = myPublishedJobs.map(job =>
      job.id === jobId ? { ...job, status: 'closed' as const } : job
    );

    set({
      jobs: updatedJobs,
      filteredJobs: updatedJobs.filter(j => j.status === 'open'),
      myPublishedJobs: updatedPublished,
    });
  },

  incrementAppliedCount: (jobId: string) => {
    const { jobs } = get();
    const updatedJobs = jobs.map(job =>
      job.id === jobId ? { ...job, appliedCount: job.appliedCount + 1 } : job
    );

    set({
      jobs: updatedJobs,
      filteredJobs: updatedJobs.filter(j => j.status === 'open'),
    });
  },

  toggleFavorite: (jobId: string) => {
    const { favorites } = get();
    const newFavorites = favorites.includes(jobId)
      ? favorites.filter(id => id !== jobId)
      : [...favorites, jobId];

    set({ favorites: newFavorites });
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  },
}));
