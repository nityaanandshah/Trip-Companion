'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-2 text-lg text-gray-600">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg"
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
                  className={`rounded-2xl bg-white shadow-lg border-2 transition-all ${
                    notification.read ? 'border-gray-200' : 'border-blue-300 bg-blue-50/30'
                  } ${tripLink ? 'hover:shadow-xl hover:scale-[1.01] hover:border-blue-400 cursor-pointer' : ''}`}
                  onClick={() => {
                    if (tripLink) {
                      markAsRead(notification.id);
                      window.location.href = tripLink;
                    }
                  }}
                  title={tripLink ? 'Click to view trip' : ''}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Icon based on type */}
                      <div className={`flex-shrink-0 rounded-full p-2 ${
                        notification.type === 'join_request' ? 'bg-blue-100' :
                        notification.type === 'request_approved' ? 'bg-green-100' :
                        notification.type === 'request_rejected' ? 'bg-red-100' :
                        notification.type === 'trip_full' ? 'bg-amber-100' :
                        notification.type === 'new_chat_message' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                        {notification.type === 'join_request' && <span className="text-xl">🤝</span>}
                        {notification.type === 'request_approved' && <span className="text-xl">✅</span>}
                        {notification.type === 'request_rejected' && <span className="text-xl">❌</span>}
                        {notification.type === 'trip_full' && <span className="text-xl">🎉</span>}
                        {notification.type === 'new_chat_message' && <span className="text-xl">💬</span>}
                      </div>
                      
                      {!notification.read && (
                        <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                          New
                        </span>
                      )}
          </div>

                    <p className="text-lg text-gray-900 mb-2">{notification.message}</p>
                    <p className="text-sm text-gray-500">
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
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="rounded-lg border-2 border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
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
                                className="inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline"
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
                        <span className="inline-flex items-center text-sm font-medium text-gray-500">
                          💡 Click card to view trip{notification.type === 'new_chat_message' ? ' and open chat' : ' in My Trips'}
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
                        className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete notification"
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
          <div className="rounded-2xl bg-white p-16 text-center shadow-lg">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6">
              <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">No notifications yet</h2>
            <p className="mt-3 text-gray-600 max-w-md mx-auto">
              You'll see notifications here when someone requests to join your trips or when your requests are processed.
            </p>
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
