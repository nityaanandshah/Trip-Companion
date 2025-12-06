'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '@/lib/socket-context';
import { useSession } from 'next-auth/react';

interface ChatMessage {
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

interface OnlineUser {
  userId: string;
  userName: string;
  avatarUrl?: string | null;
}

interface TypingUser {
  userId: string;
  userName: string;
}

interface UseTripChatOptions {
  tripId: string;
  enabled?: boolean;
}

interface UseTripChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onlineUsers: OnlineUser[];
  typingUsers: TypingUser[];
  sendMessage: (content: string) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
  refetchMessages: () => Promise<void>;
  isJoined: boolean;
}

export const useTripChat = ({ tripId, enabled = true }: UseTripChatOptions): UseTripChatReturn => {
  const { socket, isConnected } = useSocket();
  const { data: session } = useSession();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isJoined, setIsJoined] = useState(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasJoinedRef = useRef(false);

  // Mark chat as read
  const markAsRead = useCallback(async () => {
    if (!tripId) return;

    try {
      await fetch(`/api/chat/${tripId}/mark-read`, {
        method: 'POST',
      });
    } catch (err) {
      console.error('Error marking chat as read:', err);
    }
  }, [tripId]);

  // Fetch message history from API
  const fetchMessages = useCallback(async () => {
    if (!tripId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/chat/${tripId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
      
      // Mark as read after fetching messages
      markAsRead();
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [tripId, markAsRead]);

  // Join trip chat room
  useEffect(() => {
    if (!socket || !isConnected || !tripId || !enabled || hasJoinedRef.current) {
      return;
    }

    console.log(`📨 Joining trip chat: ${tripId}`);
    socket.emit('join-trip-chat', { tripId });
    hasJoinedRef.current = true;

    // Fetch initial messages
    fetchMessages();

    return () => {
      if (hasJoinedRef.current) {
        console.log(`📤 Leaving trip chat: ${tripId}`);
        socket.emit('leave-trip-chat', { tripId });
        hasJoinedRef.current = false;
        setIsJoined(false);
      }
    };
  }, [socket, isConnected, tripId, enabled, fetchMessages]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !enabled) return;

    // Joined room successfully
    const handleJoinedTripChat = ({ tripId: joinedTripId, onlineUsers: users }: { tripId: string; onlineUsers: OnlineUser[] }) => {
      if (joinedTripId === tripId) {
        console.log(`✅ Joined trip chat: ${tripId}`, users);
        setIsJoined(true);
        setOnlineUsers(users);
      }
    };

    // New message received
    const handleMessage = (message: ChatMessage) => {
      if (message.tripId === tripId) {
        console.log('📩 New message:', message);
        setMessages((prev) => [...prev, message]);
        
        // Mark as read if message is from someone else (we're viewing the chat)
        if (message.user.id !== session?.user?.id) {
          markAsRead();
        }
      }
    };

    // User joined
    const handleUserJoined = ({ userId, userName, onlineUsers: users }: { userId: string; userName: string; onlineUsers: OnlineUser[] }) => {
      console.log(`👋 ${userName} joined the chat`);
      setOnlineUsers(users);
    };

    // User left
    const handleUserLeft = ({ userId, userName, onlineUsers: users }: { userId: string; userName: string; onlineUsers: OnlineUser[] }) => {
      console.log(`👋 ${userName} left the chat`);
      setOnlineUsers(users);
      
      // Remove from typing users if they were typing
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    };

    // Typing indicator
    const handleUserTyping = ({ userId, userName, isTyping }: { userId: string; userName: string; isTyping: boolean }) => {
      if (userId === session?.user?.id) return; // Ignore own typing

      setTypingUsers((prev) => {
        if (isTyping) {
          // Add to typing users if not already there
          if (!prev.find((u) => u.userId === userId)) {
            return [...prev, { userId, userName }];
          }
          return prev;
        } else {
          // Remove from typing users
          return prev.filter((u) => u.userId !== userId);
        }
      });
    };

    // Error handler
    const handleError = ({ message }: { message: string }) => {
      console.error('Socket error:', message);
      setError(message);
    };

    // Register listeners
    socket.on('joined-trip-chat', handleJoinedTripChat);
    socket.on('message', handleMessage);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('user-typing', handleUserTyping);
    socket.on('error', handleError);

    // Cleanup listeners
    return () => {
      socket.off('joined-trip-chat', handleJoinedTripChat);
      socket.off('message', handleMessage);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('user-typing', handleUserTyping);
      socket.off('error', handleError);
    };
  }, [socket, tripId, enabled, session?.user?.id, markAsRead]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!socket || !isConnected || !isJoined) {
      throw new Error('Not connected to chat');
    }

    if (!content || content.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    if (content.length > 1000) {
      throw new Error('Message too long (max 1000 characters)');
    }

    // Emit message to server
    socket.emit('send-message', { tripId, content: content.trim() });

    // Stop typing indicator
    setTyping(false);
  }, [socket, isConnected, isJoined, tripId]);

  // Set typing indicator
  const setTyping = useCallback((isTyping: boolean) => {
    if (!socket || !isConnected || !isJoined) return;

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    // Emit typing status
    socket.emit('typing', { tripId, isTyping });

    // Auto-stop typing after 3 seconds
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { tripId, isTyping: false });
      }, 3000);
    }
  }, [socket, isConnected, isJoined, tripId]);

  return {
    messages,
    isLoading,
    error,
    onlineUsers,
    typingUsers,
    sendMessage,
    setTyping,
    refetchMessages: fetchMessages,
    isJoined,
  };
};

