import React, { useState } from 'react';
import { User, MapPin, Briefcase, Award, Edit2, Eye, EyeOff, Check } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useJobStore } from '../stores/jobStore';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input, Select, Textarea } from '../components/common/Input';
import { cities, industries } from '../utils/mockData';

type EditTab = 'profile' | 'intention' | 'resume';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile, updateJobIntention, updateResumeSummary } = useUserStore();
  const { jobs, favorites } = useJobStore();
  const [activeTab, setActiveTab] = useState<EditTab>('profile');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [showSensitive, setShowSensitive] = useState(false);

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">请先登录</p>
      </div>
    );
  }

  const myPublishedJobs = jobs.filter(job => job.publisherId === currentUser.id);
  const myFavoritedJobs = jobs.filter(job => favorites.includes(job.id));

  const handleEditProfile = () => {
    setEditData({
      nickname: currentUser.nickname,
      city: currentUser.city,
      industry: currentUser.industry,
      workYears: currentUser.workYears,
    });
    setShowEditModal(true);
  };

  const handleEditIntention = () => {
    setEditData({
      position: currentUser.jobIntention?.position || '',
      city: currentUser.jobIntention?.city || '',
      salaryMin: currentUser.jobIntention?.salaryRange?.[0] || '',
      salaryMax: currentUser.jobIntention?.salaryRange?.[1] || '',
    });
    setShowEditModal(true);
  };

  const handleEditResume = () => {
    setEditData({
      education: currentUser.resumeSummary?.education || '',
      experience: currentUser.resumeSummary?.experience?.join('\n') || '',
      skills: currentUser.resumeSummary?.skills?.join(', ') || '',
    });
    setShowEditModal(true);
  };

  const handleSave = () => {
    switch (activeTab) {
      case 'profile':
        updateProfile({
          nickname: editData.nickname,
          city: editData.city,
          industry: editData.industry,
          workYears: parseInt(editData.workYears),
        });
        break;
      case 'intention':
        updateJobIntention({
          position: editData.position,
          city: editData.city,
          salaryRange: [parseInt(editData.salaryMin), parseInt(editData.salaryMax)],
        });
        break;
      case 'resume':
        updateResumeSummary({
          education: editData.education,
          experience: editData.experience.split('\n').filter((e: string) => e.trim()),
          skills: editData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s),
        });
        break;
    }
    setShowEditModal(false);
  };

  const tabs = [
    { id: 'profile' as const, label: '基础信息', icon: User },
    { id: 'intention' as const, label: '求职意向', icon: Briefcase },
    { id: 'resume' as const, label: '简历摘要', icon: Award },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-light p-8">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar src={currentUser.avatar} alt={currentUser.nickname} size="xl" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-bold mb-2">{currentUser.nickname}</h1>
              <div className="flex items-center space-x-4 text-blue-100 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{currentUser.city}</span>
                </div>
                <span>·</span>
                <span>{currentUser.industry}</span>
                <span>·</span>
                <span>{currentUser.workYears}年工作经验</span>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="success" className="bg-white text-green-700">
                  信用 {currentUser.creditScore}
                </Badge>
                <Badge variant="default" className="bg-white/20 text-white">
                  {currentUser.isVerified ? '已认证' : '未认证'}
                </Badge>
                <Badge variant="default" className="bg-white/20 text-white">
                  {currentUser.role === 'seeker' ? '求职者' : '在职员工'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{myPublishedJobs.length}</div>
            <div className="text-sm text-gray-500">发布的职位</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{myFavoritedJobs.length}</div>
            <div className="text-sm text-gray-500">收藏的职位</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{currentUser.creditScore}</div>
            <div className="text-sm text-gray-500">信用评分</div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">编辑资料</h3>
            </div>
            <div className="p-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">基础信息</h3>
                    <Button variant="secondary" size="sm" onClick={handleEditProfile}>
                      <Edit2 className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">昵称</p>
                      <p className="font-medium text-gray-900">{currentUser.nickname}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">所在城市</p>
                      <p className="font-medium text-gray-900">{currentUser.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">所属行业</p>
                      <p className="font-medium text-gray-900">{currentUser.industry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">工作年限</p>
                      <p className="font-medium text-gray-900">{currentUser.workYears}年</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'intention' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">求职意向</h3>
                    <Button variant="secondary" size="sm" onClick={handleEditIntention}>
                      <Edit2 className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                  </div>
                  {currentUser.jobIntention ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">期望职位</p>
                        <p className="font-medium text-gray-900">{currentUser.jobIntention.position}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">期望城市</p>
                        <p className="font-medium text-gray-900">{currentUser.jobIntention.city}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 mb-1">期望薪资</p>
                        <p className="font-medium text-gray-900 text-accent">
                          {(currentUser.jobIntention.salaryRange[0] / 1000).toFixed(0)}k-{(currentUser.jobIntention.salaryRange[1] / 1000).toFixed(0)}k/月
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">尚未设置求职意向</p>
                      <Button onClick={handleEditIntention}>立即设置</Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'resume' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">简历摘要</h3>
                      <button
                        onClick={() => setShowSensitive(!showSensitive)}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                      >
                        {showSensitive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        <span className="ml-1">{showSensitive ? '显示' : '隐藏'}</span>
                      </button>
                    </div>
                    <Button variant="secondary" size="sm" onClick={handleEditResume}>
                      <Edit2 className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                  </div>
                  {currentUser.resumeSummary ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">教育背景</p>
                        <p className="text-gray-900">{showSensitive ? currentUser.resumeSummary.education : '********'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">工作经历</p>
                        <ul className="space-y-1">
                          {currentUser.resumeSummary.experience.map((exp, index) => (
                            <li key={index} className="text-gray-900">
                              {showSensitive ? exp : '********'}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">技能标签</p>
                        <div className="flex flex-wrap gap-2">
                          {currentUser.resumeSummary.skills.map((skill, index) => (
                            <Badge key={index} variant="primary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">尚未填写简历摘要</p>
                      <Button onClick={handleEditResume}>立即填写</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`编辑${tabs.find(t => t.id === activeTab)?.label}`}
        size="md"
      >
        <div className="p-6 space-y-4">
          {activeTab === 'profile' && (
            <>
              <Input
                label="昵称"
                value={editData.nickname || ''}
                onChange={(e) => setEditData({ ...editData, nickname: e.target.value })}
              />
              <Select
                label="所在城市"
                value={editData.city || ''}
                onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                options={[{ value: '', label: '选择城市' }, ...cities.map(c => ({ value: c, label: c }))]}
              />
              <Select
                label="所属行业"
                value={editData.industry || ''}
                onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                options={[{ value: '', label: '选择行业' }, ...industries.map(i => ({ value: i, label: i }))]}
              />
              <Input
                label="工作年限"
                type="number"
                min="0"
                value={editData.workYears || ''}
                onChange={(e) => setEditData({ ...editData, workYears: e.target.value })}
              />
            </>
          )}

          {activeTab === 'intention' && (
            <>
              <Input
                label="期望职位"
                value={editData.position || ''}
                onChange={(e) => setEditData({ ...editData, position: e.target.value })}
              />
              <Select
                label="期望城市"
                value={editData.city || ''}
                onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                options={[{ value: '', label: '选择城市' }, ...cities.map(c => ({ value: c, label: c }))]}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="最低薪资 (元/月)"
                  type="number"
                  value={editData.salaryMin || ''}
                  onChange={(e) => setEditData({ ...editData, salaryMin: e.target.value })}
                />
                <Input
                  label="最高薪资 (元/月)"
                  type="number"
                  value={editData.salaryMax || ''}
                  onChange={(e) => setEditData({ ...editData, salaryMax: e.target.value })}
                />
              </div>
            </>
          )}

          {activeTab === 'resume' && (
            <>
              <Input
                label="教育背景"
                value={editData.education || ''}
                onChange={(e) => setEditData({ ...editData, education: e.target.value })}
              />
              <Textarea
                label="工作经历 (每行一条)"
                rows={4}
                value={editData.experience || ''}
                onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
              />
              <Input
                label="技能标签 (逗号分隔)"
                value={editData.skills || ''}
                onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
              />
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
