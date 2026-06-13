import React, { useState } from 'react';
import { Target, Briefcase, TrendingUp } from 'lucide-react';
import { useJobStore } from '../stores/jobStore';
import { useUserStore } from '../stores/userStore';
import { useMessageStore } from '../stores/messageStore';
import { MatchCard } from '../components/exchange/MatchCard';
import { ApplicationCard } from '../components/exchange/ApplicationCard';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

type TabType = 'recommendations' | 'applications' | 'received';

export const ExchangePage: React.FC = () => {
  const { jobs } = useJobStore();
  const { currentUser } = useUserStore();
  const { applications } = useMessageStore();
  const [activeTab, setActiveTab] = useState<TabType>('recommendations');

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">请先登录</p>
      </div>
    );
  }

  const recommendations = jobs
    .filter(job => job.status === 'open' && job.city === currentUser.city)
    .map(job => ({
      job,
      matchScore: Math.floor(70 + Math.random() * 30),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);

  const myApplications = applications.filter(app => app.seekerId === currentUser.id);
  const receivedApplications = applications.filter(app => {
    const job = jobs.find(j => j.id === app.jobId);
    return job?.publisherId === currentUser.id;
  });

  const tabs = [
    { id: 'recommendations' as const, label: '推荐匹配', icon: Target, count: recommendations.length },
    { id: 'applications' as const, label: '我的申请', icon: Briefcase, count: myApplications.length },
    { id: 'received' as const, label: '收到的申请', icon: TrendingUp, count: receivedApplications.length },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">智能匹配大厅</h1>
        <p className="text-purple-100 text-lg">
          基于您的求职意向和所在城市，智能推荐最适合您的内推机会
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 transition-all ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                <Badge variant={isActive ? 'primary' : 'default'} className={isActive ? '' : 'bg-gray-100'}>
                  {tab.count}
                </Badge>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">为您推荐的内推机会</h2>
                <p className="text-sm text-gray-500">
                  根据您在 {currentUser.city} 的求职意向推荐
                </p>
              </div>

              {recommendations.length === 0 ? (
                <Card className="text-center py-12">
                  <Target className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无推荐</h3>
                  <p className="text-gray-500 mb-4">
                    设置您的求职意向，获取更精准的推荐
                  </p>
                  <Button onClick={() => window.location.href = '/profile'}>
                    去设置求职意向
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {recommendations.map(({ job, matchScore }) => (
                    <MatchCard key={job.id} job={job} matchScore={matchScore} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">我的内推申请</h2>

              {myApplications.length === 0 ? (
                <Card className="text-center py-12">
                  <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无申请记录</h3>
                  <p className="text-gray-500">去职位广场看看有哪些内推机会吧</p>
                </Card>
              ) : (
                <div>
                  {myApplications.map(app => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'received' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">收到的内推申请</h2>

              {receivedApplications.length === 0 ? (
                <Card className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无申请</h3>
                  <p className="text-gray-500">发布内推职位，吸引求职者申请</p>
                </Card>
              ) : (
                <div>
                  {receivedApplications.map(app => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
