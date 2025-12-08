'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { format, isToday, isYesterday } from 'date-fns';

interface Message {
  id: string;
  tripId: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef(messages.length);

  // Format timestamp like WhatsApp
  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'h:mm a'); // "8:51 PM"
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d'); // "Dec 5"
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > previousMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    previousMessageCountRef.current = messages.length;
  }, [messages.length]);

  // Scroll to bottom on initial load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, []);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16"
            style={{ color: 'rgba(51, 53, 59, 0.2)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="mt-4 text-sm font-medium" style={{ color: '#33353B' }}>No messages yet</p>
          <p className="mt-1 text-xs" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
            Be the first to start the conversation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-y-auto p-4 space-y-4"
      style={{ scrollBehavior: 'smooth' }}
    >
      {messages.map((message, index) => {
        const isOwnMessage = message.user.id === session?.user?.id;
        const showAvatar =
          index === 0 || messages[index - 1].user.id !== message.user.id;
        const showName =
          index === 0 || messages[index - 1].user.id !== message.user.id;

        return (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {showAvatar ? (
                message.user.avatarUrl ? (
                  <img
                    src={message.user.avatarUrl}
                    alt={message.user.name || 'User'}
                    className="h-8 w-8 rounded-full object-cover"
                    style={{ border: '2px solid #d4c7ad' }}
                  />
                ) : (
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                    style={{ 
                      background: 'linear-gradient(to bottom right, #2B5F5E, #DAAA63)',
                      border: '2px solid #d4c7ad' 
                    }}
                  >
                    {(message.user.name?.[0] || 'U').toUpperCase()}
                  </div>
                )
              ) : (
                <div className="h-8 w-8" /> // Spacer for alignment
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}
            >
              {/* Name */}
              {showName && !isOwnMessage && (
                <span 
                  className="mb-1 px-3 text-xs font-medium" 
                  style={{ color: 'rgba(51, 53, 59, 0.7)' }}
                >
                  {message.user.name || 'Anonymous'}
                </span>
              )}

              {/* Bubble */}
              <div
                className="px-4 py-2"
                style={{
                  borderRadius: '8px',
                  ...(isOwnMessage ? {
                    backgroundColor: '#C76D45',
                    color: 'white',
                    borderBottomRightRadius: '2px'
                  } : {
                    backgroundColor: 'rgba(51, 53, 59, 0.08)',
                    color: '#33353B',
                    borderBottomLeftRadius: '2px'
                  })
                }}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>

              {/* Timestamp */}
              <span
                className={`mt-1 px-3 text-xs ${isOwnMessage ? 'text-right' : 'text-left'}`}
                style={{ color: 'rgba(51, 53, 59, 0.5)' }}
              >
                {formatMessageTime(new Date(message.createdAt))}
              </span>
            </div>
          </div>
        );
      })}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}

