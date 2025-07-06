'use client';
import {useSelector, useDispatch} from 'react-redux';
import {toggleChat} from '@/store/slices/chatSlice';
import {ChatBubbleLeftRightIcon, XMarkIcon} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function ChatButton() {
  const dispatch = useDispatch();
  const {isOpen, messages} = useSelector(state => state.chat);
  const unreadCount = messages.filter(msg => msg.sender === 'bot' && !msg.read).length;

  return (
    <button
      onClick={() => dispatch(toggleChat())}
      className={clsx(
        'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        isOpen
          ? 'bg-gray-600 hover:bg-gray-700 transform rotate-180'
          : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
      )}
    >
      {isOpen ? (
        <XMarkIcon className="w-6 h-6 text-white mx-auto"/>
      ) : (
        <div className="relative">
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white mx-auto"/>
          {unreadCount > 0 && (
            <div
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </div>
      )}
    </button>
  );
}
