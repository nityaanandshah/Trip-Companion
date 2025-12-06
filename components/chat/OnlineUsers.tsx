'use client';

import { useSession } from 'next-auth/react';

interface OnlineUser {
  userId: string;
  userName: string;
  avatarUrl?: string | null;
}

interface OnlineUsersProps {
  users: OnlineUser[];
}

export default function OnlineUsers({ users }: OnlineUsersProps) {
  const { data: session } = useSession();

  // Sort: current user first, then alphabetically
  const sortedUsers = [...users].sort((a, b) => {
    if (a.userId === session?.user?.id) return -1;
    if (b.userId === session?.user?.id) return 1;
    return a.userName.localeCompare(b.userName);
  });

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-3">
        <h4 className="text-sm font-semibold text-gray-900">
          Online ({users.length})
        </h4>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sortedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              className="h-10 w-10 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-2 text-xs text-gray-500">No one online</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sortedUsers.map((user) => {
              const isCurrentUser = user.userId === session?.user?.id;

              return (
                <div
                  key={user.userId}
                  className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${
                    isCurrentUser
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.userName}
                        className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold border-2 border-gray-200">
                        {(user.userName[0] || 'U').toUpperCase()}
                      </div>
                    )}
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-50" />
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {isCurrentUser ? 'You' : user.userName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

