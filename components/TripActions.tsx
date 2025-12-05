'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import JoinRequestButton from './JoinRequestButton';

interface TripActionsProps {
  tripId: string;
  tripStatus: string;
  isOwner: boolean;
  currentGroupSize: number;
  requiredGroupSize: number;
}

export default function TripActions({ 
  tripId, 
  tripStatus, 
  isOwner, 
  currentGroupSize, 
  requiredGroupSize 
}: TripActionsProps) {
  const [, setRefresh] = useState(0);

  const handleRequestSent = () => {
    // Trigger refresh
    setRefresh(prev => prev + 1);
  };

  if (isOwner) {
    return (
      <Link
        href={`/trips/${tripId}/edit`}
        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 shadow-lg transition-colors"
      >
        Edit Trip
      </Link>
    );
  }

  return (
    <div style={{ minWidth: '200px' }}>
      <JoinRequestButton
        tripId={tripId}
        tripStatus={tripStatus}
        isOwner={isOwner}
        currentGroupSize={currentGroupSize}
        requiredGroupSize={requiredGroupSize}
        onRequestSent={handleRequestSent}
      />
    </div>
  );
}

