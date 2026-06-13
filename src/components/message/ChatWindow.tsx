import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Calendar } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useMessageStore } from '../../stores/messageStore';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { MessageBubble } from './MessageBubble';
import { Conversation } from '../../types';

interface ChatWindowProps {
  conversation: Conversation;
  onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onBack }) => {
  const { currentUser } = useUserStore();
  const { messages, sendMessage, setFeedbackDeadline, applications } = useMessageStore();
  const [newMessage, setNewMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationMessages = messages[conversation.id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const handleSend = () => {
    if (!newMessage.trim() || !currentUser) return;
    sendMessage(conversation.id, newMessage, currentUser.id);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleConfirmDate = () => {
    if (!selectedDate || !currentUser) return;

    const application = applications.find(app => app.seekerId === conversation.participantId);
    if (application) {
      const deadline = new Date(selectedDate).getTime();
      setFeedbackDeadline(application.id, deadline);
      sendMessage(
        conversation.id,
        `已约定反馈时间：${new Date(deadline).toLocaleDateString('zh-CN')}`,
        currentUser.id,
        'feedback_约定'
      );
    }
    setShowDatePicker(false);
    setSelectedDate('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center space-x-4 px-6 py-4 border-b border-gray-200">
        <button onClick={onBack} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <Avatar src={conversation.participantAvatar} alt={conversation.participantName} size="md" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{conversation.participantName}</h3>
          <p className="text-sm text-gray-500">在线</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          <Calendar className="w-4 h-4 mr-1" />
          约定时间
        </Button>
      </div>

      {showDatePicker && (
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <p className="text-sm text-blue-800 mb-2">设置反馈时间提醒：</p>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-sm"
              min={new Date().toISOString().split('T')[0]}
            />
            <Button size="sm" onClick={handleConfirmDate} disabled={!selectedDate}>
              确认
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setShowDatePicker(false)}>
              取消
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {conversationMessages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
          />
          <Button onClick={handleSend} disabled={!newMessage.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
