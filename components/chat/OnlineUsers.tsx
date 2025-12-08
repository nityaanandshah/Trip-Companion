'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface OnlineUser {
  userId: string;
  userName: string;
  avatarUrl?: string | null;
}

interface OnlineUsersProps {
  users: OnlineUser[];
  tripId: string;
}

interface TripMember {
  userId: string;
  userName: string;
  avatarUrl?: string | null;
}

export default function OnlineUsers({ users, tripId }: OnlineUsersProps) {
  const { data: session } = useSession();
  const [allMembers, setAllMembers] = useState<TripMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all trip members (owner + approved attendees)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Fetch trip details to get owner
        const tripResponse = await fetch(`/api/trips/${tripId}`);
        // Fetch attendees
        const attendeesResponse = await fetch(`/api/trips/${tripId}/attendees`);
        
        if (tripResponse.ok && attendeesResponse.ok) {
          const tripData = await tripResponse.json();
          const attendeesData = await attendeesResponse.json();
          
          // Combine owner and approved attendees
          const members: TripMember[] = [
            // Add owner first
            {
              userId: tripData.owner.id,
              userName: tripData.owner.name,
              avatarUrl: tripData.owner.avatarUrl
            },
            // Add approved attendees
            ...attendeesData.approved.map((attendee: any) => ({
              userId: attendee.user.id,
              userName: attendee.user.name,
              avatarUrl: attendee.user.avatarUrl
            }))
          ];
          
          setAllMembers(members);
        }
      } catch (error) {
        console.error('Error fetching trip members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [tripId]);

  // Sort: current user first, then alphabetically
  const sortedOnlineUsers = [...users].sort((a, b) => {
    if (a.userId === session?.user?.id) return -1;
    if (b.userId === session?.user?.id) return 1;
    return a.userName.localeCompare(b.userName);
  });

  // Get offline users (members who are not in the online list)
  const onlineUserIds = new Set(users.map(u => u.userId));
  const offlineUsers = allMembers
    .filter(member => !onlineUserIds.has(member.userId))
    .sort((a, b) => {
      if (a.userId === session?.user?.id) return -1;
      if (b.userId === session?.user?.id) return 1;
      return a.userName.localeCompare(b.userName);
    });

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div 
        className="p-3" 
        style={{ borderBottom: '1px solid #d4c7ad' }}
      >
        <h4 className="text-sm font-semibold" style={{ color: '#33353B' }}>
          Online ({users.length})
        </h4>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sortedOnlineUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              className="h-10 w-10"
              style={{ color: 'rgba(51, 53, 59, 0.2)' }}
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
            <p className="mt-2 text-xs" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>No one online</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sortedOnlineUsers.map((user) => {
              const isCurrentUser = user.userId === session?.user?.id;

              return (
                <div
                  key={user.userId}
                  className="flex items-center gap-2 p-2 transition-colors"
                  style={{
                    borderRadius: '4px',
                    backgroundColor: isCurrentUser ? '#F5EFE3' : 'transparent',
                    border: isCurrentUser ? '2px solid #2B5F5E' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrentUser) e.currentTarget.style.backgroundColor = '#F5EFE3';
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrentUser) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.userName}
                        className="h-8 w-8 rounded-full object-cover"
                        style={{ border: '2px solid #2B5F5E' }}
                      />
                    ) : (
                      <div 
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        style={{ 
                          background: 'linear-gradient(to bottom right, #2B5F5E, #DAAA63)',
                          border: '2px solid #2B5F5E' 
                        }}
                      >
                        {(user.userName[0] || 'U').toUpperCase()}
                      </div>
                    )}
                    {/* Online indicator */}
                    <div 
                      className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full" 
                      style={{ 
                        backgroundColor: '#2B5F5E',
                        border: '2px solid white' 
                      }}
                    />
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: '#33353B' }}>
                      {isCurrentUser ? 'You' : user.userName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Offline Users Section */}
        {!loading && offlineUsers.length > 0 && (
          <>
            {/* Divider */}
            <div 
              className="my-3" 
              style={{ borderTop: '1px solid #d4c7ad' }}
            />
            
            {/* Offline Header */}
            <div className="mb-2 px-1">
              <h4 className="text-xs font-semibold" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
                Offline ({offlineUsers.length})
              </h4>
            </div>

            {/* Offline Users List */}
            <div className="space-y-1">
              {offlineUsers.map((user) => {
                const isCurrentUser = user.userId === session?.user?.id;

                return (
                  <div
                    key={user.userId}
                    className="flex items-center gap-2 p-2 transition-colors"
                    style={{
                      borderRadius: '4px',
                      backgroundColor: isCurrentUser ? 'rgba(199, 109, 69, 0.1)' : 'transparent',
                      border: isCurrentUser ? '2px solid #C76D45' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrentUser) e.currentTarget.style.backgroundColor = 'rgba(199, 109, 69, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrentUser) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.userName}
                          className="h-8 w-8 rounded-full object-cover"
                          style={{ border: '2px solid #C76D45', opacity: 0.7 }}
                        />
                      ) : (
                        <div 
                          className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                          style={{ 
                            background: 'linear-gradient(to bottom right, #2B5F5E, #DAAA63)',
                            border: '2px solid #C76D45',
                            opacity: 0.7
                          }}
                        >
                          {(user.userName[0] || 'U').toUpperCase()}
                        </div>
                      )}
                      {/* Offline indicator */}
                      <div 
                        className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full" 
                        style={{ 
                          backgroundColor: 'rgba(51, 53, 59, 0.5)',
                          border: '2px solid white' 
                        }}
                      />
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
                        {isCurrentUser ? 'You' : user.userName}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

