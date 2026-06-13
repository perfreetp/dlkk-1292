import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeftRight, User, MessageCircle, Award, Bell } from 'lucide-react';
import { useMessageStore } from '../../stores/messageStore';
import { useUserStore } from '../../stores/userStore';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

export const Header: React.FC = () => {
  const location = useLocation();
  const { totalUnread } = useMessageStore();
  const { currentUser } = useUserStore();

  const navItems = [
    { path: '/', icon: Home, label: '职位广场' },
    { path: '/exchange', icon: ArrowLeftRight, label: '交换大厅' },
    { path: '/profile', icon: User, label: '个人主页' },
    { path: '/messages', icon: MessageCircle, label: '消息中心', badge: totalUnread },
    { path: '/credit', icon: Award, label: '信用中心' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">内推交换</h1>
              <p className="text-xs text-gray-500">同城求职内推平台</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {currentUser && (
              <div className="flex items-center space-x-3">
                <Avatar
                  src={currentUser.avatar}
                  alt={currentUser.nickname}
                  size="sm"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{currentUser.nickname}</p>
                  <div className="flex items-center space-x-1">
                    <Badge variant={currentUser.creditScore >= 80 ? 'success' : currentUser.creditScore >= 60 ? 'warning' : 'danger'}>
                      信用 {currentUser.creditScore}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
