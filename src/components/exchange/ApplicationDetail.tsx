import React from 'react';
import { CheckCircle, Clock, XCircle, Calendar, ThumbsUp, Briefcase, MessageCircle } from 'lucide-react';
import { ExchangeApplication } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { useCreditStore } from '../../stores/creditStore';
import { useMessageStore } from '../../stores/messageStore';

interface ApplicationDetailProps {
  application: ExchangeApplication;
}

export const ApplicationDetail: React.FC<ApplicationDetailProps> = ({ application }) => {
  const { records } = useCreditStore();
  const { messages } = useMessageStore();

  const applicationRecords = records.filter(
    r => r.relatedApplicationId === application.id
  );

  const conversation = messages[application.id];
  const hasMessages = conversation && conversation.length > 0;

  const timeline = [
    {
      id: 'created',
      icon: Briefcase,
      title: '提交申请',
      description: `申请 ${application.company} - ${application.jobTitle}`,
      time: new Date(application.createdAt).toLocaleDateString('zh-CN'),
      status: 'completed',
    },
    {
      id: 'accepted',
      icon: CheckCircle,
      title: '接受申请',
      description: application.status !== 'pending' ? '职位发布者已接受您的申请' : '等待发布者处理',
      time: application.status !== 'pending' ? new Date(application.createdAt + 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN') : undefined,
      status: application.status !== 'pending' ? 'completed' : 'pending',
    },
    {
      id: 'deadline',
      icon: Calendar,
      title: '约定反馈时间',
      description: application.feedbackDeadline 
        ? `约定 ${new Date(application.feedbackDeadline).toLocaleDateString('zh-CN')} 前反馈`
        : '尚未约定反馈时间',
      time: application.feedbackDeadline ? new Date(application.feedbackDeadline).toLocaleDateString('zh-CN') : undefined,
      status: application.feedbackDeadline ? 'completed' : 'pending',
    },
    {
      id: 'result',
      icon: application.result === 'success' ? CheckCircle : application.result === 'fail' ? XCircle : Clock,
      title: '提交内推结果',
      description: application.result === 'success' 
        ? '内推成功，候选人通过面试' 
        : application.result === 'fail' 
        ? '内推未成功' 
        : '等待发布结果',
      status: application.result ? 'completed' : 'pending',
    },
    {
      id: 'evaluation',
      icon: ThumbsUp,
      title: '互相评价',
      description: applicationRecords.length > 0 
        ? `共 ${applicationRecords.length} 条评价` 
        : '尚未评价',
      status: applicationRecords.length > 0 ? 'completed' : 'pending',
    },
  ];

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {application.jobTitle}
              </h2>
              <p className="text-gray-600 mb-3">{application.company}</p>
              <div className="flex items-center space-x-2 flex-wrap">
                <Badge 
                  variant={
                    application.status === 'completed' ? 'success' :
                    application.status === 'accepted' ? 'success' :
                    application.status === 'rejected' ? 'danger' : 'warning'
                  }
                >
                  {application.status === 'pending' ? '待处理' :
                   application.status === 'accepted' ? '已接受' :
                   application.status === 'rejected' ? '已拒绝' : '已完成'}
                </Badge>
                {application.result === 'success' && (
                  <Badge variant="success">内推成功</Badge>
                )}
                {application.result === 'fail' && (
                  <Badge variant="danger">未成功</Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-2">
                申请时间：{formatTime(application.createdAt)}
              </p>
              {application.feedbackDeadline && (
                <p className="text-sm text-blue-600">
                  约定反馈：{formatTime(application.feedbackDeadline)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar 
              src={application.seekerAvatar} 
              alt={application.seekerName} 
              size="lg" 
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{application.seekerName}</p>
              <p className="text-sm text-gray-500">求职者</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">简历摘要：</p>
              <p className="text-sm text-gray-700 mt-1">{application.resumeSummary}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-accent" />
              申请进度
            </h3>
            
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {timeline.map((item) => {
                  const Icon = item.icon;
                  
                  return (
                    <div key={item.id} className="relative flex items-start space-x-4">
                      <div 
                        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                          item.status === 'completed' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 pt-2">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-semibold ${
                            item.status === 'completed' ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {item.title}
                          </h4>
                          {item.time && (
                            <span className="text-sm text-gray-500">
                              {item.time}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${
                          item.status === 'completed' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {item.description}
                        </p>
                        
                        {item.id === 'evaluation' && applicationRecords.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {applicationRecords.map(record => (
                              <div key={record.id} className="bg-blue-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Avatar 
                                      src="" 
                                      alt={record.relatedUserName || '未知'} 
                                      size="sm" 
                                    />
                                    <span className="text-sm font-medium text-gray-900">
                                      {record.relatedUserName}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <span 
                                        key={i} 
                                        className={`text-sm ${
                                          i < (record.rating || 0) ? 'text-yellow-500' : 'text-gray-300'
                                        }`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">{record.reason}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatTime(record.createdAt)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {hasMessages && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-accent" />
                沟通记录
              </h3>
              <p className="text-sm text-gray-600">
                共 {conversation.length} 条消息
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
