'use client';

import { useSocket } from '@/lib/socket-context';

interface SocketStatusProps {
  position?: 'top-right' | 'bottom-right' | 'inline';
  showLabel?: boolean;
}

export default function SocketStatus({ position = 'top-right', showLabel = false }: SocketStatusProps) {
  const { isConnected, isConnecting } = useSocket();

  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'inline': '',
  };

  if (!isConnecting && !isConnected) {
    return null; // Don't show if not attempting to connect
  }

  return (
    <div className={`${positionClasses[position]} flex items-center gap-2`}>
      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5  border border-sand-dark">
        {/* Status Indicator */}
        <div className="relative flex items-center">
          {isConnecting ? (
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse" />
          ) : isConnected ? (
            <>
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <div className="absolute h-2.5 w-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
            </>
          ) : (
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          )}
        </div>

        {/* Status Label */}
        {showLabel && (
          <span className="text-xs font-medium text-gray-700">
            {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
          </span>
        )}
      </div>
    </div>
  );
}

