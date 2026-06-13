import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Building2, DollarSign, Clock, Users, CheckCircle, Send } from 'lucide-react';
import { useJobStore } from '../stores/jobStore';
import { useUserStore } from '../stores/userStore';
import { useMessageStore } from '../stores/messageStore';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';
import { Textarea } from '../components/common/Input';
import { Card } from '../components/common/Card';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, incrementAppliedCount, favorites, toggleFavorite } = useJobStore();
  const { currentUser } = useUserStore();
  const { createConversation, createApplication } = useMessageStore();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumeSummary, setResumeSummary] = useState('');
  const [applied, setApplied] = useState(false);

  const job = jobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">职位不存在</h2>
        <p className="text-gray-500 mb-4">该职位可能已下架或不存在</p>
        <Button onClick={() => navigate('/')}>返回职位广场</Button>
      </div>
    );
  }

  const isFavorite = favorites.includes(job.id);

  const formatSalary = (range: [number, number]) => {
    return `${(range[0] / 1000).toFixed(0)}k-${(range[1] / 1000).toFixed(0)}k/月`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN');
  };

  const handleApply = () => {
    if (!currentUser) return;

    incrementAppliedCount(job.id);
    createConversation(
      job.publisherId,
      job.publisherName,
      job.publisherAvatar
    );

    createApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      seekerId: currentUser.id,
      seekerName: currentUser.nickname,
      seekerAvatar: currentUser.avatar,
      resumeSummary: resumeSummary,
    });

    setApplied(true);
    setShowApplyModal(false);
    setResumeSummary('');
    navigate(`/exchange`);
  };

  const handleContact = () => {
    if (!currentUser) return;
    createConversation(
      job.publisherId,
      job.publisherName,
      job.publisherAvatar
    );
    navigate(`/messages`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        返回
      </button>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-light p-8 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <Badge variant="success" className="bg-white text-green-700">热招中</Badge>
              </div>
              <div className="flex items-center space-x-2 text-blue-100 mb-4">
                <Building2 className="w-5 h-5" />
                <span className="text-lg font-medium">{job.company}</span>
                <span className="text-blue-200">|</span>
                <Badge variant="default" className="bg-white/20 text-white">{job.industry}</Badge>
              </div>
            </div>
            <button
              onClick={() => toggleFavorite(job.id)}
              className={`p-3 rounded-full transition-all ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <svg className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm text-blue-200">工作地点</span>
              </div>
              <p className="text-xl font-semibold">{job.city}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm text-blue-200">薪资范围</span>
              </div>
              <p className="text-xl font-semibold text-accent">{formatSalary(job.salaryRange)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm text-blue-200">内推名额</span>
              </div>
              <p className="text-xl font-semibold">{job.appliedCount}/{job.slots}人</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm text-blue-200">发布时间</span>
              </div>
              <p className="text-xl font-semibold">{formatTime(job.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">职位描述</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">任职要求</h2>
            <ul className="space-y-3">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">发布者信息</h2>
            <div className="flex items-center space-x-4">
              <Avatar src={job.publisherAvatar} alt={job.publisherName} size="lg" />
              <div>
                <p className="text-lg font-medium text-gray-900">{job.publisherName}</p>
                <p className="text-gray-500">内推发布者 · 平台认证</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            {applied ? (
              <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">已申请，请等待回复</span>
              </div>
            ) : (
              <Button className="flex-1" size="lg" onClick={() => setShowApplyModal(true)}>
                <Send className="w-5 h-5 mr-2" />
                申请内推
              </Button>
            )}
            <Button variant="secondary" size="lg" onClick={handleContact}>
              联系发布者
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="申请内推"
        size="md"
      >
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              申请 <strong>{job.title}</strong> 职位，发布者：<strong>{job.publisherName}</strong>
            </p>
          </div>

          <Textarea
            label="简历摘要"
            placeholder="简要介绍您的背景和优势，让发布者快速了解您..."
            rows={6}
            value={resumeSummary}
            onChange={(e) => setResumeSummary(e.target.value)}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
              取消
            </Button>
            <Button onClick={handleApply} disabled={!resumeSummary.trim()}>
              提交申请
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
