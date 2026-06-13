import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, User, Shield, Zap } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { Button } from '../components/common/Button';
import { mockUsers } from '../utils/mockData';
import { Avatar } from '../components/common/Avatar';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUserStore();
  const [selectedUser, setSelectedUser] = useState<string>('');

  const handleLogin = () => {
    if (selectedUser) {
      login(selectedUser);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ArrowLeftRight className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">内推交换</h1>
          <p className="text-blue-200 text-lg">同城求职内推机会平台</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">选择登录账户</h2>

          <div className="grid gap-4 mb-6">
            {mockUsers.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all ${
                  selectedUser === user.id
                    ? 'border-accent bg-accent bg-opacity-5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Avatar src={user.avatar} alt={user.nickname} size="lg" />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">{user.nickname}</p>
                  <p className="text-sm text-gray-500">
                    {user.role === 'seeker' ? '求职者' : '在职员工'} · {user.city} · {user.industry}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${
                    user.creditScore >= 80 ? 'text-green-600' : user.creditScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    信用 {user.creditScore}
                  </div>
                  <div className="text-xs text-gray-400">
                    {user.workYears}年经验
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={handleLogin}
            disabled={!selectedUser}
            className="w-full"
            size="lg"
          >
            登录
          </Button>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Demo 模式说明</p>
                <p>选择一个账户登录体验完整功能。我们使用预设的 Mock 数据来演示所有功能。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center text-blue-200">
          <div>
            <Zap className="w-6 h-6 mx-auto mb-1" />
            <p className="text-sm">智能匹配</p>
          </div>
          <div>
            <Shield className="w-6 h-6 mx-auto mb-1" />
            <p className="text-sm">信用保障</p>
          </div>
          <div>
            <User className="w-6 h-6 mx-auto mb-1" />
            <p className="text-sm">同城信任</p>
          </div>
        </div>
      </div>
    </div>
  );
};
