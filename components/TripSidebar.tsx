'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import TripMembersCard from './TripMembersCard';

interface Attendee {
  id: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

interface TripSidebarProps {
  trip: any;
  isOwner: boolean;
}

export default function TripSidebar({ trip, isOwner }: TripSidebarProps) {
  const [attendees, setAttendees] = useState<{ approved: Attendee[] }>({ approved: [] });

  useEffect(() => {
    fetchAttendees();
  }, [trip.id]);

  const fetchAttendees = async () => {
    try {
      const response = await fetch(`/api/trips/${trip.id}/attendees`);
      if (response.ok) {
        const data = await response.json();
        setAttendees({ approved: data.approved || [] });
      }
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };

  // Prepare members list for TripMembersCard
  const allMembers = [
    {
      id: trip.owner.id,
      name: trip.owner.name,
      email: trip.owner.email,
      avatarUrl: trip.owner.avatarUrl,
      isOwner: true,
    },
    ...attendees.approved.map((attendee) => ({
      id: attendee.user.id,
      name: attendee.user.name,
      email: attendee.user.email,
      avatarUrl: attendee.user.avatarUrl,
      isOwner: false,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Trip Members Card */}
      <TripMembersCard 
        members={allMembers}
        currentGroupSize={trip.currentGroupSize}
        requiredGroupSize={trip.requiredGroupSize}
      />
      
      {/* Trip Organizer Card */}
      <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Organizer</h3>
        <div className="flex items-center space-x-4">
          {trip.owner.avatarUrl ? (
            <img
              src={trip.owner.avatarUrl}
              alt={trip.owner.name || 'User'}
              className="h-16 w-16 rounded-full object-cover ring-4 ring-gray-100"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ring-4 ring-gray-100">
              <span className="text-2xl font-bold text-white">
                {trip.owner.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{trip.owner.name}</p>
            <p className="text-sm text-gray-500 mb-2">{trip.owner.email}</p>
            <a
              href={`/profile/${trip.owner.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              View Profile
              <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white shadow-lg">
        <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-100">Created</span>
            <span className="font-semibold">{format(new Date(trip.createdAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-100">Status</span>
            <span className="font-semibold">{trip.status}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-100">Spots Available</span>
            <span className="font-semibold">{trip.requiredGroupSize - trip.currentGroupSize}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

