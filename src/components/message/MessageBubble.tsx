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
    const dateMatch = message.content.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    let highlightDate = '';
    if (dateMatch) {
      highlightDate = `${dateMatch[1]}年${dateMatch[2]}月${dateMatch[3]}日`;
    }

    return (
      <div className="flex justify-center my-4">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl px-6 py-4 text-white shadow-lg max-w-md">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold">约定反馈时间</span>
          </div>
          {highlightDate && (
            <div className="text-2xl font-bold text-center py-2 bg-white/20 rounded-lg mb-2">
              {highlightDate}
            </div>
          )}
          <p className="text-sm text-blue-100 text-center">{message.content}</p>
          <p className="text-xs text-blue-200 text-center mt-2">
            {formatTime(message.createdAt)}
          </p>
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
