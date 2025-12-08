'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ConfirmModal from '@/components/ConfirmModal';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';
import { format } from 'date-fns';

interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: string;
  isTentative: boolean;
  budgetMin: number | null;
  budgetMax: number | null;
  requiredGroupSize: number;
  currentGroupSize: number;
  images: { imageUrl: string }[];
  isOrganizer?: boolean;
  attendeeStatus?: 'pending' | 'approved' | 'rejected';
  attendeeId?: string;
  _count: {
    bookmarks: number;
    attendees: number;
  };
}

export default function MyTripsPage() {
  const { data: session, status } = useSession();
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [removeModal, setRemoveModal] = useState<{ tripId: string; attendeeId: string; tripTitle: string } | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTrips();
    }
  }, [status]);

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips/my-trips');
      if (response.ok) {
        const data = await response.json();
        setAllTrips(data);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter trips based on selected tab
  const trips = allTrips.filter(trip => {
    if (filter === 'all') return true;
    if (filter === 'organized') return trip.isOrganizer;
    if (filter === 'attending') return !trip.isOrganizer;
    return true;
  });

  const handleRemoveTrip = async () => {
    if (!removeModal) return;
    
    const { tripId, attendeeId } = removeModal;
    setRemoveModal(null);
    
    try {
      const response = await fetch(`/api/trips/${tripId}/attendees/${attendeeId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAllTrips(allTrips.filter(trip => trip.id !== tripId));
      }
    } catch (error) {
      console.error('Error removing trip:', error);
    }
  };

  const handleDelete = async (tripId: string) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAllTrips(allTrips.filter(trip => trip.id !== tripId));
        setDeleteModal(null);
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE3' }}>
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-display font-bold flex items-center gap-3" style={{ color: '#33353B' }}>
                My Trips
                <svg className="h-10 w-10" style={{ color: '#C76D45' }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 003 5.5v2.879a2.5 2.5 0 00.732 1.767l6.5 6.5a2.5 2.5 0 003.536 0l2.878-2.878a2.5 2.5 0 000-3.536l-6.5-6.5A2.5 2.5 0 008.38 3H5.5zM6 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
              </h1>
              <p className="mt-3 text-lg" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
                Manage your travel plans and adventures
              </p>
            </div>
            <Link
              href="/trips/create"
              className="px-6 py-3 text-sm font-semibold border transition-opacity hover:opacity-90"
              style={{ borderRadius: '2px', backgroundColor: '#DAAA63', color: '#33353B', borderColor: 'rgba(43, 95, 94, 0.15)' }}
            >
              + Create New Trip
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div className="bg-white p-8 border transition-shadow hover:shadow-md" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Total Trips</p>
            <p className="mt-3 text-4xl font-display font-bold" style={{ color: '#33353B' }}>{allTrips.length}</p>
          </div>
          <div className="bg-white p-8 border transition-shadow hover:shadow-md" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Open</p>
            <p className="mt-3 text-4xl font-bold" style={{ color: '#2B5F5E' }}>
              {allTrips.filter(t => t.status === 'open').length}
            </p>
          </div>
          <div className="bg-white p-8 border transition-shadow hover:shadow-md" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Drafts</p>
            <p className="mt-3 text-4xl font-bold" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
              {allTrips.filter(t => t.status === 'draft').length}
            </p>
          </div>
          <div className="bg-white p-8 border transition-shadow hover:shadow-md" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Completed</p>
            <p className="mt-3 text-4xl font-bold" style={{ color: '#DAAA63' }}>
              {allTrips.filter(t => t.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-4 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 text-sm font-semibold transition-all whitespace-nowrap`}
            style={{
              borderRadius: '2px',
              backgroundColor: filter === 'all' ? '#DAAA63' : 'white',
              color: filter === 'all' ? 'white' : 'rgba(51, 53, 59, 0.9)',
              border: filter === 'all' ? '1px solid rgba(43, 95, 94, 0.15)' : '1px solid rgba(43, 95, 94, 0.08)'
            }}
          >
            All Trips ({allTrips.length})
          </button>
          <button
            onClick={() => setFilter('organized')}
            className={`px-6 py-3 text-sm font-semibold transition-all whitespace-nowrap inline-flex items-center gap-2`}
            style={{
              borderRadius: '2px',
              backgroundColor: filter === 'organized' ? '#DAAA63' : 'white',
              color: filter === 'organized' ? 'white' : 'rgba(51, 53, 59, 0.9)',
              border: filter === 'organized' ? '1px solid rgba(43, 95, 94, 0.15)' : '1px solid rgba(43, 95, 94, 0.08)'
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
            </svg>
            Organized by Me ({allTrips.filter(t => t.isOrganizer).length})
          </button>
          <button
            onClick={() => setFilter('attending')}
            className={`px-6 py-3 text-sm font-semibold transition-all whitespace-nowrap inline-flex items-center gap-2`}
            style={{
              borderRadius: '2px',
              backgroundColor: filter === 'attending' ? '#DAAA63' : 'white',
              color: filter === 'attending' ? 'white' : 'rgba(51, 53, 59, 0.9)',
              border: filter === 'attending' ? '1px solid rgba(43, 95, 94, 0.15)' : '1px solid rgba(43, 95, 94, 0.08)'
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
            Requested by Me ({allTrips.filter(t => !t.isOrganizer).length})
          </button>
        </div>

        {/* Trips Grid */}
        {trips.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="group overflow-hidden bg-white border transition-all hover:shadow-md"
                style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}
              >
                {/* Trip Image */}
                <Link href={`/trips/${trip.id}`}>
                  <div className="aspect-video overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #F5EFE3, #EBDCC4)' }}>
                    {trip.images.length > 0 ? (
                      <img
                        src={trip.images[0].imageUrl}
                        alt={trip.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg className="h-16 w-16" style={{ color: 'rgba(51, 53, 59, 0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Trip Info */}
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    {/* Role Badge */}
                    {trip.isOrganizer ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: '#F5EFE3', color: '#2B5F5E' }}>
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                        </svg>
                        Organizer
                      </span>
                    ) : trip.attendeeStatus === 'approved' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: 'rgba(43, 95, 94, 0.1)', color: '#2B5F5E' }}>
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                        </svg>
                        You're Going!
                      </span>
                    ) : trip.attendeeStatus === 'pending' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: '#F5EFE3', color: '#DAAA63' }}>
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd"/>
                        </svg>
                        Request Pending
                      </span>
                    ) : trip.attendeeStatus === 'rejected' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: 'rgba(199, 109, 69, 0.1)', color: '#C76D45' }}>
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"/>
                        </svg>
                        Rejected
                      </span>
                    ) : null}
                    
                    {/* Trip Status Badge */}
                    <span className="inline-flex rounded-md px-3 py-1 text-xs font-semibold border" style={{
                      backgroundColor: trip.status === 'open' ? '#2B5F5E' : 'white',
                      color: trip.status === 'open' ? 'white' : '#33353B',
                      borderColor: '#2B5F5E'
                    }}>
                      {trip.status}
                    </span>
                    {trip.isTentative && (
                      <span className="inline-flex rounded-md px-3 py-1 text-xs font-semibold border" style={{ backgroundColor: 'white', color: '#C76D45', borderColor: '#C76D45' }}>
                        Flexible
                      </span>
                    )}
                  </div>

                  <Link href={`/trips/${trip.id}`}>
                    <h3 className="text-xl font-bold transition-colors line-clamp-2 hover:opacity-80" style={{ color: '#33353B' }}>
                      {trip.title}
                    </h3>
                  </Link>

                  <div className="mt-3 space-y-2 text-sm" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4" style={{ color: '#DAAA63' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {trip.destination}
                    </div>
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4" style={{ color: '#C76D45' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4" style={{ color: '#2B5F5E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {trip.currentGroupSize}/{trip.requiredGroupSize} people
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-2">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="flex-1 rounded-lg px-4 py-2 text-center text-sm font-semibold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#DAAA63', color: '#33353B' }}
                    >
                      View
                    </Link>
                    {trip.isOrganizer ? (
                      <>
                        <Link
                          href={`/trips/${trip.id}/edit`}
                          className="rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all hover:opacity-80"
                          style={{ borderColor: '#d4c7ad', color: 'rgba(51, 53, 59, 0.9)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#DAAA63';
                            e.currentTarget.style.color = '#DAAA63';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#d4c7ad';
                            e.currentTarget.style.color = 'rgba(51, 53, 59, 0.9)';
                          }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteModal(trip.id)}
                          className="rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all"
                          style={{ borderColor: '#d4c7ad', color: '#C76D45', backgroundColor: 'white' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#C76D45';
                            e.currentTarget.style.backgroundColor = 'rgba(199, 109, 69, 0.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#d4c7ad';
                            e.currentTarget.style.backgroundColor = 'white';
                          }}
                        >
                          Delete
                        </button>
                      </>
                    ) : trip.attendeeStatus === 'rejected' && trip.attendeeId ? (
                      <button
                        onClick={() => setRemoveModal({ tripId: trip.id, attendeeId: trip.attendeeId!, tripTitle: trip.title })}
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#C76D45' }}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
              <div className="mb-6 mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5EFE3' }}>
                <svg className="h-8 w-8" style={{ color: '#DAAA63' }} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#33353B' }}>{`No ${filter !== 'all' ? filter : ''} Trips Yet`}</h3>
              <p className="mb-8" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>{filter === 'all' 
                ? "You haven't created any trips yet. Start planning your next adventure!"
                : `You don't have any ${filter} trips. Try changing the filter or create a new trip.`}</p>
              <Link
                href="/trips/create"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ borderRadius: '2px', backgroundColor: '#C76D45' }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                Create Your First Trip
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md w-full bg-white p-8 shadow-2xl" style={{ borderRadius: '2px' }}>
            <h3 className="text-2xl font-bold" style={{ color: '#33353B' }}>Delete Trip?</h3>
            <p className="mt-3" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
              Are you sure you want to delete this trip? This action cannot be undone.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 border-2 px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ borderRadius: '2px', borderColor: '#d4c7ad', color: 'rgba(51, 53, 59, 0.9)', backgroundColor: 'white' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                className="flex-1 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ borderRadius: '2px', backgroundColor: '#C76D45' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Trip Confirmation Modal */}
      <ConfirmModal
        isOpen={removeModal !== null}
        title="Remove Trip from My List"
        message={`Are you sure you want to remove "${removeModal?.tripTitle}" from your trips list?`}
        confirmText="Remove"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        onConfirm={handleRemoveTrip}
        onCancel={() => setRemoveModal(null)}
      />
    </div>
  );
}
