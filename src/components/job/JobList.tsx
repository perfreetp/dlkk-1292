import React from 'react';
import { Job } from '../../types';
import { JobCard } from './JobCard';

interface JobListProps {
  jobs: Job[];
}

export const JobList: React.FC<JobListProps> = ({ jobs }) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无职位</h3>
        <p className="text-gray-500">尝试调整筛选条件或稍后再来看看</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {jobs.map((job, index) => (
        <div key={job.id} className={`animate-fadeIn stagger-${Math.min(index + 1, 5)}`}>
          <JobCard job={job} />
        </div>
      ))}
    </div>
  );
};
