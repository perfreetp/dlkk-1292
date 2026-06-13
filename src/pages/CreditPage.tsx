import React, { useState } from 'react';
import { Award, AlertTriangle, Shield, Info } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useCreditStore } from '../stores/creditStore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Textarea } from '../components/common/Input';
import { CreditScore, CreditHistoryItem } from '../components/credit/CreditScore';
import { SuccessCaseCard, SuccessCaseStats } from '../components/credit/SuccessCaseCard';

export const CreditPage: React.FC = () => {
  const { currentUser } = useUserStore();
  const { records, successCases, reportUser } = useCreditStore();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">请先登录</p>
      </div>
    );
  }

  const userRecords = records.filter(r => r.userId === currentUser.id);

  const stats = {
    totalSuccess: userRecords.filter(r => r.type === 'success').length,
    totalOnTime: userRecords.filter(r => r.type === 'onTimeFeedback').length,
    totalMissed: userRecords.filter(r => r.type === 'missedDeadline' || r.type === 'report').length,
  };

  const creditLevel = currentUser.creditScore >= 80 ? '优秀' : currentUser.creditScore >= 60 ? '良好' : '需改进';

  const handleReport = () => {
    if (!reportReason.trim()) return;
    reportUser(currentUser.id, reportReason);
    setShowReportModal(false);
    setReportReason('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="w-8 h-8" />
          <h1 className="text-2xl font-bold">信用中心</h1>
        </div>
        <p className="text-yellow-100">查看您的信用评分和记录，维护平台信任环境</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 p-6">
          <CreditScore score={currentUser.creditScore} />

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">信用等级</span>
              <Badge variant={currentUser.creditScore >= 80 ? 'success' : currentUser.creditScore >= 60 ? 'warning' : 'danger'}>
                {creditLevel}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">内推成功</span>
              <span className="font-semibold text-green-600">{stats.totalSuccess}次</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">按时反馈</span>
              <span className="font-semibold text-blue-600">{stats.totalOnTime}次</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">失约/举报</span>
              <span className="font-semibold text-red-600">{stats.totalMissed}次</span>
            </div>
          </div>

          {currentUser.creditScore < 60 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">信用受限</p>
                  <p className="text-xs text-red-600 mt-1">
                    您的信用分低于60分，无法发起新的交换申请
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                信用规则说明
              </h3>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">加分项</h4>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      <span>内推成功入职：+10分</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      <span>按时反馈：+5分</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      <span>主动沟通：+2分</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">减分项</h4>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      <span>失约未反馈：-20分</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      <span>被举报：-30分</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      <span>恶意行为：-50分</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">低信用限制</p>
                    <ul className="text-blue-700 mt-2 space-y-1">
                      <li>• 信用分 &lt; 60：禁止发起新申请</li>
                      <li>• 信用分 &lt; 40：禁止发布职位</li>
                      <li>• 信用分 &lt; 20：限制发言功能</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">信用记录</h3>
            </div>
            <div className="p-6">
              {userRecords.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">暂无信用记录</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userRecords.map(record => (
                    <CreditHistoryItem key={record.id} record={record} />
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">平台成功案例</h3>
        </div>
        <div className="p-6">
          <SuccessCaseStats />
          <div className="grid md:grid-cols-3 gap-4">
            {successCases.map(successCase => (
              <SuccessCaseCard key={successCase.id} caseData={successCase} />
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">遇到问题？</h3>
            <p className="text-gray-600 mb-4">
              如果您遇到了失约、欺诈或其他违规行为，欢迎向我们举报。我们会认真处理每一条举报信息。
            </p>
            <Button variant="secondary" onClick={() => setShowReportModal(true)}>
              举报违规行为
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="举报违规行为"
        size="md"
      >
        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              请提供详细的举报信息，我们将尽快核实处理。恶意举报将会被扣除信用分。
            </p>
          </div>

          <Textarea
            label="举报原因"
            placeholder="请详细描述违规行为..."
            rows={6}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowReportModal(false)}>
              取消
            </Button>
            <Button onClick={handleReport} disabled={!reportReason.trim()}>
              提交举报
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
