'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface TripStatusBadgesProps {
  tripId: string;
  isOwner: boolean;
}

export default function TripStatusBadges({ tripId, isOwner }: TripStatusBadgesProps) {
  const { data: session, status } = useSession();
  const [bookmarked, setBookmarked] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && !isOwner) {
      fetchStatuses();
    }
  }, [status, tripId, isOwner]);

  const fetchStatuses = async () => {
    try {
      // Fetch bookmark status
      const bookmarkResponse = await fetch(`/api/trips/${tripId}/bookmark`);
      if (bookmarkResponse.ok) {
        const bookmarkData = await bookmarkResponse.json();
        setBookmarked(bookmarkData.bookmarked);
      }

      // Fetch join request status
      const requestResponse = await fetch(`/api/trips/${tripId}/join-request`);
      if (requestResponse.ok) {
        const requestData = await requestResponse.json();
        setRequestStatus(requestData.status);
      }
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  if (isOwner) {
    return null;
  }

  return (
    <>
      {bookmarked && (
        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          Saved
        </span>
      )}
    </>
  );
}

