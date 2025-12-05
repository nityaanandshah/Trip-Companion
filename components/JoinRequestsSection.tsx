'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ConfirmModal from './ConfirmModal';

interface Attendee {
  id: string;
  status: string;
  requestedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

interface JoinRequestsSectionProps {
  tripId: string;
  isOwner: boolean;
}

export default function JoinRequestsSection({ tripId, isOwner }: JoinRequestsSectionProps) {
  const [pendingRequests, setPendingRequests] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | null;
    attendeeId: string | null;
    userName: string | null;
  }>({
    isOpen: false,
    type: null,
    attendeeId: null,
    userName: null,
  });

  useEffect(() => {
    if (isOwner) {
      fetchPendingRequests();
    }
  }, [tripId, isOwner]);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/trips/${tripId}/attendees`);
      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data.pending || []);
      }
    } catch (error) {
      console.error('Error fetching attendees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirmModal.attendeeId) return;

    const attendeeId = confirmModal.attendeeId;
    setConfirmModal({ isOpen: false, type: null, attendeeId: null, userName: null });
    setProcessingRequest(attendeeId);

    try {
      const response = await fetch(`/api/trips/${tripId}/attendees/${attendeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });

      if (response.ok) {
        fetchPendingRequests();
        // Refresh page to update group size
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleReject = async () => {
    if (!confirmModal.attendeeId) return;

    const attendeeId = confirmModal.attendeeId;
    setConfirmModal({ isOpen: false, type: null, attendeeId: null, userName: null });
    setProcessingRequest(attendeeId);

    try {
      const response = await fetch(`/api/trips/${tripId}/attendees/${attendeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });

      if (response.ok) {
        fetchPendingRequests();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    } finally {
      setProcessingRequest(null);
    }
  };

  const openApproveModal = (attendeeId: string, userName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'approve',
      attendeeId,
      userName,
    });
  };

  const openRejectModal = (attendeeId: string, userName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'reject',
      attendeeId,
      userName,
    });
  };

  const closeModal = () => {
    setConfirmModal({
      isOpen: false,
      type: null,
      attendeeId: null,
      userName: null,
    });
  };

  if (!isOwner || pendingRequests.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg border-2 border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">
            🤝
          </span>
          Join Requests
        </h2>
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
          {pendingRequests.length}
        </span>
      </div>

      <div className="space-y-4">
        {pendingRequests.map((attendee) => (
          <div
            key={attendee.id}
            className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              {attendee.user.avatarUrl ? (
                <img
                  src={attendee.user.avatarUrl}
                  alt={attendee.user.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ring-2 ring-gray-200">
                  <span className="text-lg font-bold text-white">
                    {attendee.user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{attendee.user.name}</p>
                  <a
                    href={`/profile/${attendee.user.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
                  >
                    View Profile
                    <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <p className="text-sm text-gray-500">{attendee.user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Requested {format(new Date(attendee.requestedAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openApproveModal(attendee.id, attendee.user.name)}
                disabled={processingRequest === attendee.id}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingRequest === attendee.id ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => openRejectModal(attendee.id, attendee.user.name)}
                disabled={processingRequest === attendee.id}
                className="rounded-lg border-2 border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'approve' ? 'Approve Join Request' : 'Reject Join Request'}
        message={
          confirmModal.type === 'approve'
            ? `Are you sure you want to approve ${confirmModal.userName}'s request to join this trip?\n\nNote: A group chat will be created where you can communicate and reconfirm with all attendees.`
            : `Are you sure you want to reject ${confirmModal.userName}'s request to join this trip?`
        }
        confirmText={confirmModal.type === 'approve' ? 'Approve' : 'Reject'}
        cancelText="Cancel"
        confirmButtonClass={
          confirmModal.type === 'approve'
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-red-600 hover:bg-red-700'
        }
        onConfirm={confirmModal.type === 'approve' ? handleApprove : handleReject}
        onCancel={closeModal}
      />
    </div>
  );
}

