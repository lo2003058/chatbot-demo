// src/components/ChatBot/MessageList.js
'use client';
import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {UserIcon, CpuChipIcon} from '@heroicons/react/24/outline';
import moment from 'moment';
import Typed from 'typed.js';
import clsx from 'clsx';

export default function MessageList() {
  const {messages, isLoading} = useSelector(state => state.chat);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  const formatTimestamp = (timestamp) => {
    const now = moment();
    const messageTime = moment(timestamp);

    if (now.diff(messageTime, 'minutes') < 1) {
      return 'Just now';
    } else if (now.diff(messageTime, 'hours') < 1) {
      return messageTime.fromNow(); // "2 minutes ago"
    } else if (now.isSame(messageTime, 'day')) {
      return messageTime.format('h:mm A'); // "2:30 PM"
    } else if (now.diff(messageTime, 'days') < 7) {
      return messageTime.format('ddd h:mm A'); // "Mon 2:30 PM"
    } else {
      return messageTime.format('MMM D, h:mm A'); // "Jan 15, 2:30 PM"
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <CpuChipIcon className="w-12 h-12 mx-auto mb-2 text-gray-300"/>
          <p>Start a conversation!</p>
          <p className="text-sm">Ask me about your facts.</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={clsx(
              'flex gap-3',
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            <div className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
              message.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            )}>
              {message.sender === 'user' ? (
                <UserIcon className="w-4 h-4"/>
              ) : (
                <CpuChipIcon className="w-4 h-4"/>
              )}
            </div>

            <div className={clsx(
              'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
              message.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            )}>
              <div className="flex items-start gap-2">
                {message.sender === 'bot' ? (
                  <TypedMessage
                    message={message}
                    isStreaming={message.isStreaming}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                )}
              </div>

              {message.citedFacts && message.citedFacts.length > 0 && !message.isStreaming && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <p className="text-xs text-gray-600 font-medium">Referenced facts:</p>
                  <ul className="text-xs text-gray-600 mt-1">
                    {message.citedFacts.map((fact, index) => (
                      <li key={index}>• {fact.title}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-xs mt-1 opacity-70">
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))
      )}

      <div ref={messagesEndRef}/>
    </div>
  );
}

// Separate component for typed messages
function TypedMessage({message, isStreaming}) {
  const typedElementRef = useRef(null);
  const typedInstanceRef = useRef(null);

  useEffect(() => {
    // Only start typing effect for non-streaming bot messages with text
    if (!isStreaming && message.text && typedElementRef.current && !typedInstanceRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (typedElementRef.current) {
          typedInstanceRef.current = new Typed(typedElementRef.current, {
            strings: [message.text],
            typeSpeed: 1000,        // Slower typing speed (was 30)
            showCursor: false,     // Show cursor so you can see the effect
            startDelay: 2000,      // Longer delay before starting (was 100)
            onComplete: () => {
              // Hide cursor after typing is complete
              if (typedInstanceRef.current) {
                typedInstanceRef.current.cursor.remove();
              }
            }
          });
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        if (typedInstanceRef.current) {
          typedInstanceRef.current.destroy();
          typedInstanceRef.current = null;
        }
      };
    }

    // Cleanup on unmount or when message changes
    return () => {
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
        typedInstanceRef.current = null;
      }
    };
  }, [message.text, isStreaming]);

  // Show streaming indicator for streaming messages
  if (isStreaming) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        {/*{*/}
        {/*  !message.text ? (*/}
        {/*    <div className="flex space-x-1">*/}
        {/*      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>*/}
        {/*      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>*/}
        {/*      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>*/}
        {/*    </div>*/}
        {/*  ) : null*/}
        {/*}*/}
      </div>
    );
  }

  // Show typed effect for completed messages
  return (
    <p className="text-sm whitespace-pre-wrap">
      <span ref={typedElementRef}></span>
    </p>
  );
}
