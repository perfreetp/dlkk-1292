import React from 'react';
import { Message } from '../../types';
import { Avatar } from '../common/Avatar';
import { useUserStore } from '../../stores/userStore';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { currentUser } = useUserStore();
  const isOwn = message.senderId === currentUser?.id;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (message.type === 'feedback_约定') {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm text-blue-700">
          <span className="font-medium">约定反馈时间</span>
        </div>
      </div>
    );
  }

  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-600">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-end space-x-2 mb-4 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {!isOwn && <Avatar src={currentUser?.avatar || ''} alt="对方" size="sm" />}
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isOwn
              ? 'bg-accent text-white rounded-br-md'
              : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-gray-400 mt-1 px-1">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};
