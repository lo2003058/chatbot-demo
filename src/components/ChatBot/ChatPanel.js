'use client';
import {useSelector} from 'react-redux';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import clsx from 'clsx';

export default function ChatPanel() {
  const {isOpen} = useSelector(state => state.chat);

  return (
    <div className={clsx(
      'fixed bottom-24 right-6 z-40 w-[500px] h-[700px] bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col transition-all duration-300 ease-out',
      'md:w-[600px] md:h-[750px]', // Even larger on medium+ screens
      'lg:w-[700px] lg:h-[800px]', // Maximum size on large screens
      isOpen
        ? 'transform translate-y-0 opacity-100 visible'
        : 'transform translate-y-full opacity-0 invisible'
    )}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
        <h3 className="text-lg font-semibold">Pocket Knowledge Bot</h3>
        <p className="text-sm text-blue-100">Ask me about your facts</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList/>
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200">
        <MessageInput/>
      </div>
    </div>
  );
}
