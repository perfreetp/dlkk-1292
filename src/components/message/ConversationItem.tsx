import React from 'react';
import { useMessageStore } from '../../stores/messageStore';
import { Conversation } from '../../types';
import { Avatar } from '../common/Avatar';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  const { applications } = useMessageStore();

  const relatedApplication = conversation.applicationId
    ? applications.find(app => app.id === conversation.applicationId)
    : undefined;

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-all ${
        isActive
          ? 'bg-accent bg-opacity-10 border-l-4 border-accent'
          : 'hover:bg-gray-50 border-l-4 border-transparent'
      }`}
    >
      <div className="relative">
        <Avatar src={conversation.participantAvatar} alt={conversation.participantName} size="md" />
        {conversation.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {conversation.unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <p className={`text-sm font-medium truncate ${isActive ? 'text-accent' : 'text-gray-900'}`}>
            {conversation.participantName}
          </p>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        {relatedApplication && (
          <p className="text-xs text-purple-600 mb-0.5 truncate">
            {relatedApplication.jobTitle}
          </p>
        )}
        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage || '暂无消息'}</p>
      </div>
    </button>
  );
};
