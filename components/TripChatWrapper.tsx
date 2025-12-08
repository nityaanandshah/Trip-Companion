'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatContainer from './chat/ChatContainer';

interface TripChatWrapperProps {
  tripId: string;
  tripTitle: string;
  isApprovedMember: boolean;
}

export default function TripChatWrapper({
  tripId,
  tripTitle,
  isApprovedMember,
}: TripChatWrapperProps) {
  const searchParams = useSearchParams();
  const openChat = searchParams.get('openChat');
  const [showChat, setShowChat] = useState(openChat === 'true');
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/chat/unread-counts');
        if (response.ok) {
          const data = await response.json();
          const tripData = data.unreadCounts.find((t: any) => t.tripId === tripId);
          setUnreadCount(tripData?.unreadCount || 0);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    if (isApprovedMember && !showChat) {
      fetchUnreadCount();
      // Poll every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isApprovedMember, tripId, showChat]);

  // Clear unread count when chat is opened
  useEffect(() => {
    if (showChat) {
      setUnreadCount(0);
    }
  }, [showChat]);

  // Only show chat button if user is approved member or owner
  if (!isApprovedMember) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white transition-all"
          style={{
            backgroundColor: '#C76D45',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = 'none';
            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(43, 95, 94, 0.3)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          title="Open Trip Chat"
          aria-label="Open trip chat"
        >
          <svg
            className="h-6 w-6"
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
          {/* Unread message badge */}
          {unreadCount > 0 && (
            <div 
              className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ 
                backgroundColor: '#C76D45',
                border: '2px solid white' 
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>
      )}

      {/* Chat Container */}
      {showChat && (
        <ChatContainer
          tripId={tripId}
          tripTitle={tripTitle}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
}

