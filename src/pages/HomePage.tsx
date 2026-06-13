import React, { useState } from 'react';
import { Plus, TrendingUp, Shield, Users } from 'lucide-react';
import { useJobStore } from '../stores/jobStore';
import { useUserStore } from '../stores/userStore';
import { JobList } from '../components/job/JobList';
import { JobFilters } from '../components/job/JobFilters';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input, Select, Textarea } from '../components/common/Input';
import { cities, industries } from '../utils/mockData';

export const HomePage: React.FC = () => {
  const { filteredJobs } = useJobStore();
  const { currentUser } = useUserStore();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    industry: '',
    city: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
    slots: '1',
  });

  const { publishJob } = useJobStore();

  const handlePublish = () => {
    if (!currentUser) return;

    publishJob({
      publisherId: currentUser.id,
      publisherName: currentUser.nickname,
      publisherAvatar: currentUser.avatar,
      title: newJob.title,
      company: newJob.company,
      industry: newJob.industry,
      city: newJob.city,
      salaryRange: [parseInt(newJob.salaryMin), parseInt(newJob.salaryMax)],
      description: newJob.description,
      requirements: newJob.requirements.split('\n').filter(r => r.trim()),
      slots: parseInt(newJob.slots),
    });

    setShowPublishModal(false);
    setNewJob({
      title: '',
      company: '',
      industry: '',
      city: '',
      salaryMin: '',
      salaryMax: '',
      description: '',
      requirements: '',
      slots: '1',
    });
  };

  const stats = [
    { icon: TrendingUp, label: '成功内推', value: '1,234', color: 'text-green-600' },
    { icon: Users, label: '注册用户', value: '5,678', color: 'text-blue-600' },
    { icon: Shield, label: '信用保障', value: '98.5%', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary via-primary-light to-primary rounded-2xl p-8 text-white">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            发现同城内推机会
          </h1>
          <p className="text-lg text-blue-100 mb-6">
            连接同城求职者和在职员工，建立可信的内推交换网络
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="secondary"
              onClick={() => setShowPublishModal(true)}
              className="bg-white text-primary hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              发布内推职位
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-8 max-w-xl">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color.replace('text-', 'text-white/')}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <JobFilters />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          全部职位
          <span className="ml-2 text-gray-500 font-normal">({filteredJobs.length})</span>
        </h2>
      </div>

      <JobList jobs={filteredJobs} />

      <Modal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="发布内推职位"
        size="lg"
      >
        <div className="p-6 space-y-4">
          <Input
            label="职位名称"
            placeholder="例如：高级前端开发工程师"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="公司名称"
              placeholder="例如：字节跳动"
              value={newJob.company}
              onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
            />
            <Select
              label="行业"
              value={newJob.industry}
              onChange={(e) => setNewJob({ ...newJob, industry: e.target.value })}
              options={[
                { value: '', label: '选择行业' },
                ...industries.map(i => ({ value: i, label: i })),
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="工作城市"
              value={newJob.city}
              onChange={(e) => setNewJob({ ...newJob, city: e.target.value })}
              options={[
                { value: '', label: '选择城市' },
                ...cities.map(c => ({ value: c, label: c })),
              ]}
            />
            <Input
              label="内推名额"
              type="number"
              min="1"
              value={newJob.slots}
              onChange={(e) => setNewJob({ ...newJob, slots: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="最低薪资 (元/月)"
              type="number"
              placeholder="例如：25000"
              value={newJob.salaryMin}
              onChange={(e) => setNewJob({ ...newJob, salaryMin: e.target.value })}
            />
            <Input
              label="最高薪资 (元/月)"
              type="number"
              placeholder="例如：35000"
              value={newJob.salaryMax}
              onChange={(e) => setNewJob({ ...newJob, salaryMax: e.target.value })}
            />
          </div>

          <Textarea
            label="职位描述"
            placeholder="详细描述岗位职责和工作内容..."
            rows={4}
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
          />

          <Textarea
            label="任职要求 (每行一条)"
            placeholder="5年以上前端开发经验&#10;精通React/Vue&#10;熟悉工程化..."
            rows={4}
            value={newJob.requirements}
            onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowPublishModal(false)}>
              取消
            </Button>
            <Button onClick={handlePublish}>
              发布职位
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
