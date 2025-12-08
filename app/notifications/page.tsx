'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';
import { format } from 'date-fns';
import ConfirmModal from '@/components/ConfirmModal';

interface Notification {
  id: string;
  type: string;
  referenceId: string | null;
  message: string;
  read: boolean;
  createdAt: string;
  tripId?: string;
  userId?: string;
  userName?: string;
  userAvatarUrl?: string | null;
}

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | null;
    attendeeId: string | null;
    message: string;
  }>({
    isOpen: false,
    type: null,
    attendeeId: null,
    message: '',
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotifications();
    }
  }, [status]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
      });
      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
      });
      if (response.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleApprove = async () => {
    if (!confirmModal.attendeeId) return;

    const attendeeId = confirmModal.attendeeId;
    const notificationId = notifications.find(n => n.referenceId === attendeeId)?.id;
    
    setConfirmModal({ isOpen: false, type: null, attendeeId: null, message: '' });
    setProcessingId(attendeeId);

    try {
      // Extract tripId from attendee
      const attendee = await fetch(`/api/trips/attendee/${attendeeId}`).then(r => r.json());
      
      const response = await fetch(`/api/trips/${attendee.tripId}/attendees/${attendeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });

      if (response.ok) {
        // Remove notification after approval
        if (notificationId) {
          await deleteNotification(notificationId);
        }
        fetchNotifications();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!confirmModal.attendeeId) return;

    const attendeeId = confirmModal.attendeeId;
    const notificationId = notifications.find(n => n.referenceId === attendeeId)?.id;
    
    setConfirmModal({ isOpen: false, type: null, attendeeId: null, message: '' });
    setProcessingId(attendeeId);

    try {
      // Extract tripId from attendee
      const attendee = await fetch(`/api/trips/attendee/${attendeeId}`).then(r => r.json());
      
      const response = await fetch(`/api/trips/${attendee.tripId}/attendees/${attendeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });

      if (response.ok) {
        // Remove notification after rejection
        if (notificationId) {
          await deleteNotification(notificationId);
        }
        fetchNotifications();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  if (status === 'unauthenticated') {
    redirect('/auth/login');
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5EFE3' }}>
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent" style={{ borderColor: '#DAAA63', borderRightColor: 'transparent' }}></div>
            <p className="mt-2" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE3' }}>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold" style={{ color: '#33353B' }}>Notifications</h1>
            <p className="mt-2 text-lg" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 border"
              style={{ borderRadius: '2px', backgroundColor: '#DAAA63', color: '#33353B', borderColor: 'rgba(43, 95, 94, 0.15)' }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => {
              // Determine the trip link based on notification type
              const getTripLink = () => {
                if (notification.type === 'join_request') {
                  // For join requests, we need to get the tripId from the attendee
                  return null; // Will handle with API call
                }
                if (notification.type === 'new_chat_message') {
                  // For chat messages, referenceId is the tripId, add openChat param
                  return notification.referenceId ? `/trips/${notification.referenceId}?openChat=true` : null;
                }
                return notification.referenceId ? `/trips/${notification.referenceId}` : null;
              };

              const tripLink = getTripLink();

              return (
                <div
                  key={notification.id}
                  className="bg-white border-2 transition-all"
                  style={{
                    borderRadius: '2px',
                    borderColor: notification.read ? '#d4c7ad' : '#DAAA63',
                    backgroundColor: notification.read ? 'white' : 'rgba(245, 239, 227, 0.3)',
                    cursor: tripLink ? 'pointer' : 'default'
                  }}
                  onClick={() => {
                    if (tripLink) {
                      markAsRead(notification.id);
                      window.location.href = tripLink;
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (tripLink) {
                      e.currentTarget.style.borderColor = '#2B5F5E';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!notification.read && tripLink) {
                      e.currentTarget.style.borderColor = '#DAAA63';
                    } else if (notification.read && tripLink) {
                      e.currentTarget.style.borderColor = '#d4c7ad';
                    }
                  }}
                  title={tripLink ? 'Click to view trip' : ''}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Icon/Avatar based on type */}
                      {notification.type === 'join_request' ? (
                        // Show user avatar for join requests
                        <div className="flex-shrink-0">
                          {notification.userAvatarUrl ? (
                            <img
                              src={notification.userAvatarUrl}
                              alt={notification.userName || 'User'}
                              className="h-12 w-12 rounded-full object-cover ring-2"
                              style={{ ringColor: '#DAAA63' }}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold ring-2" style={{ backgroundColor: '#DAAA63', ringColor: '#F5EFE3' }}>
                              {notification.userName?.[0]?.toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                      ) : (
                        // Show icon for other notification types
                        <div className="flex-shrink-0 rounded-full p-2" style={{
                          backgroundColor: 
                            notification.type === 'request_approved' ? 'rgba(43, 95, 94, 0.1)' :
                            notification.type === 'request_rejected' ? 'rgba(199, 109, 69, 0.1)' :
                            notification.type === 'trip_full' ? '#F5EFE3' :
                            notification.type === 'new_chat_message' ? '#EBDCC4' :
                            '#EBDCC4'
                        }}>
                          {notification.type === 'join_request' && (
                            <svg className="h-5 w-5" style={{ color: '#DAAA63' }} viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z"/>
                            </svg>
                          )}
                        {notification.type === 'request_approved' && (
                          <svg className="h-5 w-5" style={{ color: '#2B5F5E' }} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                          </svg>
                        )}
                        {notification.type === 'request_rejected' && (
                          <svg className="h-5 w-5" style={{ color: '#C76D45' }} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"/>
                          </svg>
                        )}
                        {notification.type === 'trip_full' && (
                          <svg className="h-5 w-5" style={{ color: '#DAAA63' }} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd"/>
                          </svg>
                        )}
                          {notification.type === 'new_chat_message' && (
                            <svg className="h-5 w-5" style={{ color: '#C76D45' }} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.783.783 0 01.642-.413 41.102 41.102 0 003.55-.414c1.437-.231 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zM6.75 6a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 2.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clipRule="evenodd"/>
                            </svg>
                          )}
                        </div>
                      )}
                      
                      {!notification.read && (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: '#DAAA63' }}>
                          New
                        </span>
                      )}
          </div>

                    <p className="text-lg mb-2" style={{ color: '#33353B' }}>{notification.message}</p>
                    <p className="text-sm" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
                      {format(new Date(notification.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
                    </p>

                    {/* Actions for join requests */}
                    {notification.type === 'join_request' && notification.referenceId && (
                      <>
                        <div className="mt-4 flex gap-3 items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmModal({
                                isOpen: true,
                                type: 'approve',
                                attendeeId: notification.referenceId!,
                                message: notification.message,
                              });
                            }}
                            disabled={processingId === notification.referenceId}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: '#2B5F5E' }}
                          >
                            {processingId === notification.referenceId ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmModal({
                                isOpen: true,
                                type: 'reject',
                                attendeeId: notification.referenceId!,
                                message: notification.message,
                              });
                            }}
                            disabled={processingId === notification.referenceId}
                            className="rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ borderColor: '#C76D45', color: '#C76D45' }}
                          >
                            Reject
                          </button>
                          
                          <div className="ml-auto flex gap-3">
                            {notification.userId && (
                              <a
                                href={`/profile/${notification.userId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center text-sm font-semibold hover:underline hover:opacity-80"
                                style={{ color: '#DAAA63' }}
                              >
                                View Profile
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                            {notification.tripId && (
                              <a
                                href={`/trips/${notification.tripId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center text-sm font-semibold hover:underline hover:opacity-80"
                                style={{ color: '#C76D45' }}
                              >
                                View Trip
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Link to trip for approved/rejected/full/chat */}
                    {(notification.type === 'request_approved' || notification.type === 'request_rejected' || notification.type === 'trip_full' || notification.type === 'new_chat_message') && notification.referenceId && (
                      <div className="mt-4">
                        <span className="inline-flex items-center text-sm font-medium" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
                          <svg className="h-4 w-4 mr-1.5" style={{ color: '#DAAA63' }} viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
                            <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                          </svg>
                          Click card to view trip{notification.type === 'new_chat_message' ? ' and open chat' : ' in My Trips'}
                        </span>
                      </div>
                    )}
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="ml-4 transition-opacity hover:opacity-70"
                        style={{ color: 'rgba(51, 53, 59, 0.4)' }}
                        title="Delete notification"
                        onMouseEnter={(e) => e.currentTarget.style.color = '#C76D45'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(51, 53, 59, 0.4)'}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
              <div className="mb-6 mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5EFE3' }}>
                <svg className="h-8 w-8" style={{ color: '#DAAA63' }} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-display font-bold mb-3" style={{ color: '#33353B' }}>All Caught Up!</h3>
              <p className="mb-8" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>You'll see notifications here when someone requests to join your trips, when your requests are processed, or when you receive new chat messages.</p>
              <Link
                href="/trips"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ borderRadius: '2px', backgroundColor: '#C76D45' }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                Browse Trips
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'approve' ? 'Approve Join Request' : 'Reject Join Request'}
        message={
          confirmModal.type === 'approve'
            ? 'Are you sure you want to approve this join request?\n\nNote: A group chat will be created where you can communicate and reconfirm with all attendees.'
            : 'Are you sure you want to reject this join request?'
        }
        confirmText={confirmModal.type === 'approve' ? 'Approve' : 'Reject'}
        cancelText="Cancel"
        confirmButtonClass={
          confirmModal.type === 'approve'
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-red-600 hover:bg-red-700'
        }
        onConfirm={confirmModal.type === 'approve' ? handleApprove : handleReject}
        onCancel={() => setConfirmModal({ isOpen: false, type: null, attendeeId: null, message: '' })}
      />
    </div>
  );
}
