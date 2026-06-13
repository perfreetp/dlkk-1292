import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeftRight, User, MessageCircle, Award } from 'lucide-react';
import { useMessageStore } from '../../stores/messageStore';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { totalUnread } = useMessageStore();

  const navItems = [
    { path: '/', icon: Home, label: '职位广场' },
    { path: '/exchange', icon: ArrowLeftRight, label: '交换' },
    { path: '/profile', icon: User, label: '我的' },
    { path: '/messages', icon: MessageCircle, label: '消息', badge: totalUnread },
    { path: '/credit', icon: Award, label: '信用' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-5 gap-1 p-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                isActive ? 'text-accent' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
