import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Zap, ArrowRight } from 'lucide-react';
import { Job } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';

interface MatchCardProps {
  job: Job;
  matchScore: number;
}

export const MatchCard: React.FC<MatchCardProps> = ({ job, matchScore }) => {
  const formatSalary = (range: [number, number]) => {
    return `${(range[0] / 1000).toFixed(0)}k-${(range[1] / 1000).toFixed(0)}k`;
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  return (
    <Card hover className="group overflow-hidden">
      <div className="relative">
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(matchScore)}`}>
          <Zap className="w-4 h-4 inline mr-1" />
          {matchScore}% 匹配
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="font-medium">{job.company}</span>
              <span className="text-gray-300">·</span>
              <Badge variant="default">{job.industry}</Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1.5 text-gray-600 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{job.city}</span>
            </div>
            <div className="text-accent font-semibold">
              {formatSalary(job.salaryRange)}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Avatar src={job.publisherAvatar} alt={job.publisherName} size="sm" />
              <span className="text-sm text-gray-700">{job.publisherName}</span>
            </div>
            <Link
              to={`/job/${job.id}`}
              className="flex items-center text-accent hover:text-accent-dark font-medium text-sm"
            >
              查看详情
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
