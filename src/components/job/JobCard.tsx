import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, DollarSign, Users, Clock, Heart } from 'lucide-react';
import { Job } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { useJobStore } from '../../stores/jobStore';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { favorites, toggleFavorite } = useJobStore();
  const isFavorite = favorites.includes(job.id);

  const formatSalary = (range: [number, number]) => {
    return `${(range[0] / 1000).toFixed(0)}k-${(range[1] / 1000).toFixed(0)}k`;
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    return `${Math.floor(days / 7)}周前`;
  };

  return (
    <Card hover className="group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-accent transition-colors">
                <Link to={`/job/${job.id}`}>{job.title}</Link>
              </h3>
              <Badge variant="success">热招</Badge>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 text-sm mb-3">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{job.company}</span>
              <span className="text-gray-300">|</span>
              <Badge variant="default">{job.industry}</Badge>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(job.id);
            }}
            className={`p-2 rounded-full transition-all ${
              isFavorite
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center space-x-1.5 text-gray-600 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{job.city}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-accent font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>{formatSalary(job.salaryRange)}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.requirements.slice(0, 3).map((req, index) => (
            <span key={index} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {req}
            </span>
          ))}
          {job.requirements.length > 3 && (
            <span className="px-2.5 py-1 text-gray-500 text-xs">
              +{job.requirements.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Avatar src={job.publisherAvatar} alt={job.publisherName} size="sm" />
            <div>
              <p className="text-sm font-medium text-gray-900">{job.publisherName}</p>
              <p className="text-xs text-gray-500">内推发布者</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{job.appliedCount}/{job.slots}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(job.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
