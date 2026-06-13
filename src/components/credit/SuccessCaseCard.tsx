import React from 'react';
import { TrendingUp, Clock, Target, Zap } from 'lucide-react';
import { SuccessCase } from '../../types';

interface SuccessCaseCardProps {
  caseData: SuccessCase;
}

export const SuccessCaseCard: React.FC<SuccessCaseCardProps> = ({ caseData }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-accent" />
          <span className="text-sm text-gray-500">匹配度</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(caseData.matchScore)}`}>
          {caseData.matchScore}%
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">求职者</p>
          <p className="font-medium text-gray-900">{caseData.seekerPosition}</p>
          <p className="text-sm text-gray-600">{caseData.seekerIndustry}</p>
        </div>

        <div className="flex items-center justify-center py-3">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">入职周期</p>
          <p className="text-lg font-bold text-accent">{caseData.hiredPeriod}</p>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">成功率</span>
            <span className="font-semibold text-green-600">{caseData.successRate}%</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${caseData.successRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SuccessCaseStats: React.FC = () => {
  const stats = [
    { icon: Target, label: '总匹配数', value: '1,234', color: 'text-blue-600 bg-blue-100' },
    { icon: Clock, label: '平均周期', value: '18天', color: 'text-purple-600 bg-purple-100' },
    { icon: TrendingUp, label: '成功率', value: '85%', color: 'text-green-600 bg-green-100' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${stat.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};
