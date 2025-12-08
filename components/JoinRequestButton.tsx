'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface JoinRequestButtonProps {
  tripId: string;
  tripStatus: string;
  isOwner: boolean;
  currentGroupSize: number;
  requiredGroupSize: number;
  onRequestSent?: () => void;
}

export default function JoinRequestButton({
  tripId,
  tripStatus,
  isOwner,
  currentGroupSize,
  requiredGroupSize,
  onRequestSent,
}: JoinRequestButtonProps) {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (authStatus === 'authenticated' && !isOwner) {
      fetchRequestStatus();
    }
  }, [authStatus, tripId, isOwner]);

  const fetchRequestStatus = async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}/join-request`);
      if (response.ok) {
        const data = await response.json();
        setRequestStatus(data.status);
      }
    } catch (err) {
      console.error('Error fetching request status:', err);
    }
  };

  const handleRequest = async () => {
    if (authStatus !== 'authenticated') {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/trips/${tripId}/join-request`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setRequestStatus('pending');
        setSuccess('Join request sent successfully!');
        onRequestSent?.();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to send request');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err) {
      setError('Failed to send request. Please try again.');
      setTimeout(() => setError(''), 5000);
      console.error('Error sending join request:', err);
    } finally {
      setLoading(false);
    }
  };

  // Don't show button if user is owner
  if (isOwner) {
    return null;
  }

  // Show login prompt if not authenticated
  if (authStatus === 'unauthenticated') {
    return (
      <button
        onClick={() => router.push('/auth/login')}
        className="px-8 py-3 text-sm font-semibold text-white hover:scale-105 transition-all"
        style={{ 
          borderRadius: '2px',
          background: 'linear-gradient(to right, #C76D45, #DAAA63)'
        }}
      >
        Login to Join Trip
      </button>
    );
  }

  // Show status-based UI
  if (requestStatus === 'approved') {
    return (
      <div 
        className="px-6 py-3 text-sm font-semibold inline-flex items-center justify-center whitespace-nowrap border-2"
        style={{ 
          borderRadius: '2px',
          backgroundColor: 'rgba(43, 95, 94, 0.1)',
          borderColor: '#2B5F5E',
          color: '#2B5F5E'
        }}
      >
        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
        You're Going!
      </div>
    );
  }

  if (requestStatus === 'pending') {
    return (
      <div 
        className="px-6 py-3 text-sm font-semibold inline-flex items-center justify-center whitespace-nowrap border-2"
        style={{ 
          borderRadius: '2px',
          backgroundColor: '#F5EFE3',
          borderColor: '#DAAA63',
          color: '#DAAA63'
        }}
      >
        <svg className="h-5 w-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        Request Pending
      </div>
    );
  }

  if (requestStatus === 'rejected') {
    return (
      <div 
        className="px-6 py-3 text-sm font-semibold inline-flex items-center justify-center whitespace-nowrap border-2"
        style={{ 
          borderRadius: '2px',
          backgroundColor: 'rgba(199, 109, 69, 0.1)',
          borderColor: '#C76D45',
          color: '#C76D45'
        }}
      >
        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>
        Request Declined
      </div>
    );
  }

  // Check if trip is not accepting requests
  if (tripStatus !== 'open') {
    return (
      <div 
        className="px-6 py-3 text-sm font-semibold text-center whitespace-nowrap border-2"
        style={{ 
          borderRadius: '2px',
          backgroundColor: 'rgba(51, 53, 59, 0.1)',
          borderColor: 'rgba(51, 53, 59, 0.3)',
          color: 'rgba(51, 53, 59, 0.7)'
        }}
      >
        Not Accepting Requests
      </div>
    );
  }

  // Check if trip is full
  if (currentGroupSize >= requiredGroupSize) {
    return (
      <div 
        className="px-6 py-3 text-sm font-semibold text-center whitespace-nowrap border-2"
        style={{ 
          borderRadius: '2px',
          backgroundColor: 'rgba(51, 53, 59, 0.1)',
          borderColor: 'rgba(51, 53, 59, 0.3)',
          color: 'rgba(51, 53, 59, 0.7)'
        }}
      >
        Trip is Full
      </div>
    );
  }

  // Show request button
  return (
    <div>
      {error && (
        <div 
          className="mb-4 p-3 text-sm border-2"
          style={{ 
            borderRadius: '2px',
            backgroundColor: 'rgba(199, 109, 69, 0.1)',
            borderColor: '#C76D45',
            color: '#C76D45'
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div 
          className="mb-4 p-3 text-sm border-2"
          style={{ 
            borderRadius: '2px',
            backgroundColor: 'rgba(43, 95, 94, 0.1)',
            borderColor: '#2B5F5E',
            color: '#2B5F5E'
          }}
        >
          {success}
        </div>
      )}
      <button
        onClick={handleRequest}
        disabled={loading}
        className="px-6 py-3 text-sm font-semibold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center justify-center whitespace-nowrap"
        style={{ 
          borderRadius: '2px',
          background: 'linear-gradient(to right, #C76D45, #DAAA63)'
        }}
      >
        {loading ? (
          <>
            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
            Sending...
          </>
        ) : (
          <>
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Request to Join
          </>
        )}
      </button>
    </div>
  );
}

