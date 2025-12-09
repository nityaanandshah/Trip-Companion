'use client';

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
  if (isOwner) {
    return (
      <Link
        href={`/trips/${tripId}/edit`}
        className="rounded-card bg-mustard px-6 py-3 text-sm font-semibold text-charcoal hover:bg-mustard-dark  transition-colors"
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
      />
    </div>
  );
}

