import React from 'react';
import { Award, TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';

interface CreditScoreProps {
  score: number;
}

export const CreditScore: React.FC<CreditScoreProps> = ({ score }) => {
  const getScoreConfig = (score: number) => {
    if (score >= 90) return { label: '优秀', color: 'text-green-600', bg: 'bg-green-100', ring: 'ring-green-500' };
    if (score >= 80) return { label: '良好', color: 'text-blue-600', bg: 'bg-blue-100', ring: 'ring-blue-500' };
    if (score >= 70) return { label: '中等', color: 'text-yellow-600', bg: 'bg-yellow-100', ring: 'ring-yellow-500' };
    if (score >= 60) return { label: '及格', color: 'text-orange-600', bg: 'bg-orange-100', ring: 'ring-orange-500' };
    return { label: '较差', color: 'text-red-600', bg: 'bg-red-100', ring: 'ring-red-500' };
  };

  const config = getScoreConfig(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke="#E5E7EB"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke="url(#gradient)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="100%" stopColor="#1E3A5F" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold ${config.color}`}>{score}</span>
          <span className={`text-sm font-medium px-3 py-1 rounded-full mt-2 ${config.bg} ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
};

interface CreditHistoryItemProps {
  record: {
    type: 'success' | 'onTimeFeedback' | 'missedDeadline' | 'report' | 'evaluation';
    score: number;
    reason: string;
    createdAt: number;
    relatedUserName?: string;
    relatedJobTitle?: string;
    relatedCompany?: string;
    rating?: number;
  };
}

export const CreditHistoryItem: React.FC<CreditHistoryItemProps> = ({ record }) => {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'success':
        return { icon: Award, color: 'text-green-600 bg-green-100', label: '内推成功' };
      case 'onTimeFeedback':
        return { icon: TrendingUp, color: 'text-blue-600 bg-blue-100', label: '按时反馈' };
      case 'missedDeadline':
        return { icon: TrendingDown, color: 'text-red-600 bg-red-100', label: '失约' };
      case 'report':
        return { icon: TrendingDown, color: 'text-red-600 bg-red-100', label: '被举报' };
      case 'evaluation':
        return { icon: Star, color: 'text-yellow-600 bg-yellow-100', label: '获得评价' };
      default:
        return { icon: Minus, color: 'text-gray-600 bg-gray-100', label: '其他' };
    }
  };

  const config = getTypeConfig(record.type);
  const Icon = config.icon;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-lg ${config.color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-gray-900">{config.label}</h4>
          <span className={`font-semibold ${record.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {record.score >= 0 ? '+' : ''}{record.score}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">{record.reason}</p>
        <p className="text-xs text-gray-400">{formatDate(record.createdAt)}</p>
      </div>
    </div>
  );
};
