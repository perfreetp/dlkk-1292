import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useMessageStore } from '../stores/messageStore';
import { ConversationItem } from '../components/message/ConversationItem';
import { ChatWindow } from '../components/message/ChatWindow';

export const MessagesPage: React.FC = () => {
  const { conversations, currentConversationId, setCurrentConversation } = useMessageStore();
  const [searchParams] = useSearchParams();
  const [showChat, setShowChat] = useState(false);

  const participantParam = searchParams.get('participant');

  const activeConversation = conversations.find(c => c.id === currentConversationId);

  useEffect(() => {
    if (participantParam) {
      const conv = conversations.find(c => c.participantId === participantParam);
      if (conv) {
        setCurrentConversation(conv.id);
        setShowChat(true);
      }
    }
  }, [participantParam, conversations, setCurrentConversation]);

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversation(conversationId);
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
  };

  const sidebarClass = showChat
    ? 'hidden md:flex md:w-80 border-r border-gray-200 flex-col'
    : 'flex-1 w-full md:w-80 border-r border-gray-200 flex-col';

  const chatClass = showChat ? 'flex-1 w-full md:flex-1' : 'hidden md:flex md:flex-1';

  return (
    <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-160px)]">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex overflow-hidden">
        <div className={sidebarClass}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MessageCircle className="w-6 h-6 mr-2 text-accent" />
              消息中心
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {conversations.length} 个对话
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无消息</h3>
                <p className="text-sm text-gray-500">
                  开始浏览职位，与发布者沟通吧
                </p>
              </div>
            ) : (
              conversations.map(conv => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={currentConversationId === conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                />
              ))
            )}
          </div>
        </div>

        <div className={chatClass}>
          {showChat && activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              onBack={handleBack}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">选择一个对话</h3>
                <p className="text-sm text-gray-500">从左侧列表选择一个对话开始聊天</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
