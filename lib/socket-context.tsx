'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isConnecting: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Only connect if user is authenticated
    if (status !== 'authenticated' || !session?.user?.id) {
      return;
    }

    // Prevent duplicate connections
    if (socket?.connected) {
      console.log('✅ Socket already connected, reusing existing connection');
      return;
    }

    setIsConnecting(true);

    // Initialize socket connection with forceNew to prevent duplicates
    const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      auth: {
        userId: session.user.id,
        userName: session.user.name || 'Anonymous',
      },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      forceNew: false, // Reuse existing connection if possible
      multiplex: true, // Share connection across multiple Socket instances
    });

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
      setIsConnected(true);
      setIsConnecting(false);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
      setIsConnecting(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnecting(false);
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      setIsConnecting(false);
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
      setIsConnecting(true);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed');
      setIsConnecting(false);
    });

    // Error handler
    socketInstance.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up socket connection');
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
      setIsConnecting(false);
    };
  }, [session?.user?.id, session?.user?.name, status]);

  const value = {
    socket,
    isConnected,
    isConnecting,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

