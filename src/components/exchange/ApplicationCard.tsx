import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, XCircle, Calendar, MessageCircle, Star } from 'lucide-react';
import { ExchangeApplication } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { useMessageStore } from '../../stores/messageStore';
import { useUserStore } from '../../stores/userStore';
import { Modal } from '../common/Modal';

interface ApplicationCardProps {
  application: ExchangeApplication;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { createConversation } = useMessageStore();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState<'success' | 'fail' | ''>('');

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: '待处理',
          variant: 'warning' as const,
          color: 'text-yellow-600 bg-yellow-50',
        };
      case 'accepted':
        return {
          icon: CheckCircle,
          text: '已接受',
          variant: 'success' as const,
          color: 'text-green-600 bg-green-50',
        };
      case 'rejected':
        return {
          icon: XCircle,
          text: '已拒绝',
          variant: 'danger' as const,
          color: 'text-red-600 bg-red-50',
        };
      case 'completed':
        return {
          icon: CheckCircle,
          text: '已完成',
          variant: 'success' as const,
          color: 'text-green-600 bg-green-50',
        };
      default:
        return {
          icon: Clock,
          text: '未知',
          variant: 'default' as const,
          color: 'text-gray-600 bg-gray-50',
        };
    }
  };

  const formatDeadline = (timestamp?: number) => {
    if (!timestamp) return '未约定';
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN');
  };

  const handleContact = () => {
    if (!currentUser) return;
    createConversation(
      application.seekerId,
      application.seekerName,
      application.seekerAvatar
    );
    navigate(`/messages`);
  };

  const handleFeedback = () => {
    if (!feedbackResult) return;
    setShowFeedbackModal(false);
  };

  const statusConfig = getStatusConfig(application.status);

  return (
    <>
      <Card className="mb-4">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{application.jobTitle}</h3>
                <Badge variant={statusConfig.variant}>{statusConfig.text}</Badge>
              </div>
              <p className="text-gray-600">{application.company}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <Avatar src={application.seekerAvatar} alt={application.seekerName} size="md" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{application.seekerName}</p>
              <p className="text-xs text-gray-500">申请者</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">简历摘要：</p>
            <p className="text-sm text-gray-600">{application.resumeSummary}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>反馈时间：{formatDeadline(application.feedbackDeadline)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={handleContact}>
              <MessageCircle className="w-4 h-4 mr-1" />
              沟通
            </Button>

            {application.status === 'pending' && (
              <>
                <Button size="sm" onClick={() => setShowFeedbackModal(true)}>
                  接受申请
                </Button>
              </>
            )}

            {application.status === 'accepted' && (
              <Button size="sm" onClick={() => setShowFeedbackModal(true)}>
                <Star className="w-4 h-4 mr-1" />
                提交结果
              </Button>
            )}

            {application.status === 'completed' && (
              <Link to={`/job/${application.jobId}`}>
                <Button variant="secondary" size="sm">
                  查看职位
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title="内推结果反馈"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-gray-600">请选择内推结果：</p>

          <div className="space-y-2">
            <button
              onClick={() => setFeedbackResult('success')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                feedbackResult === 'success'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CheckCircle className="w-5 h-5 inline mr-2" />
              内推成功，候选人通过面试
            </button>

            <button
              onClick={() => setFeedbackResult('fail')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                feedbackResult === 'fail'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <XCircle className="w-5 h-5 inline mr-2" />
              内推未成功，未通过面试
            </button>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
              取消
            </Button>
            <Button onClick={handleFeedback} disabled={!feedbackResult}>
              确认提交
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
