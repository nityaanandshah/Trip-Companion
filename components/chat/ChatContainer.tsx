'use client';

import { useState } from 'react';
import { useTripChat } from '@/lib/hooks/useTripChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OnlineUsers from './OnlineUsers';
import TypingIndicator from './TypingIndicator';

interface ChatContainerProps {
  tripId: string;
  tripTitle: string;
  onClose?: () => void;
}

export default function ChatContainer({ tripId, tripTitle, onClose }: ChatContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    messages,
    isLoading,
    error,
    onlineUsers,
    typingUsers,
    sendMessage,
    setTyping,
    isJoined,
  } = useTripChat({ tripId, enabled: true });

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content);
    } catch (err: any) {
      console.error('Error sending message:', err);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    setTyping(isTyping);
  };

  if (!isJoined && !isLoading && !error) {
    return null; // Don't show chat if user doesn't have access
  }

  return (
    <div
      className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4 z-40 transition-all duration-300"
      style={{
        width: isExpanded ? '100%' : '100%',
        height: isExpanded ? '100%' : '500px',
        ...(typeof window !== 'undefined' && window.innerWidth >= 640 && {
          width: isExpanded ? '800px' : '384px',
          height: isExpanded ? '600px' : '500px',
          borderRadius: '2px'
        })
      }}
    >
      <div 
        className="flex h-full flex-col overflow-hidden" 
        style={{ 
          backgroundColor: 'white', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '2px solid #d4c7ad',
          borderRadius: '2px'
        }}
      >
        {/* Header */}
        <div 
          className="flex flex-col px-4 py-3 text-white" 
          style={{ 
            backgroundColor: '#C76D45',
            borderTopLeftRadius: '2px',
            borderTopRightRadius: '2px'
          }}
        >
          {/* Top row: Icon, Title, Controls */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div 
                className="flex-shrink-0 p-2" 
                style={{ borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Trip Chat</h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Expand/Collapse */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 transition-all"
                style={{ borderRadius: '4px' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isExpanded ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  )}
                </svg>
              </button>

              {/* Close */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 transition-all"
                  style={{ borderRadius: '4px' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Close Chat"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Bottom row: Trip name */}
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 flex-shrink-0 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-sm text-white/90 truncate font-medium" title={tripTitle}>
              {tripTitle}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex flex-1 flex-col min-h-0">
              {/* Messages */}
              <div className="flex-1 min-h-0">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div 
                        className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" 
                        style={{ borderColor: '#DAAA63', borderTopColor: 'transparent' }}
                      />
                      <p className="mt-2 text-sm" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>Loading messages...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex h-full items-center justify-center p-4">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12"
                        style={{ color: '#C76D45' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="mt-2 text-sm font-medium" style={{ color: '#33353B' }}>
                        Unable to load chat
                      </p>
                      <p className="mt-1 text-xs" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>{error}</p>
                    </div>
                  </div>
                ) : (
                  <MessageList messages={messages} />
                )}
              </div>

              {/* Typing Indicator */}
              {typingUsers.length > 0 && <TypingIndicator typingUsers={typingUsers} />}

              {/* Input */}
              <MessageInput
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                disabled={!isJoined || !!error}
              />
            </div>

            {/* Online Users Sidebar (only in expanded mode) */}
            {isExpanded && (
              <div 
                className="w-48" 
                style={{ 
                  borderLeft: '1px solid #d4c7ad', 
                  backgroundColor: '#F5EFE3' 
                }}
              >
                <OnlineUsers users={onlineUsers} tripId={tripId} />
              </div>
            )}
          </div>
      </div>
    </div>
  );
}

