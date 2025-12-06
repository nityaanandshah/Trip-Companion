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
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [removeModal, setRemoveModal] = useState<{ tripId: string; attendeeId: string; tripTitle: string } | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTrips();
    }
  }, [status, filter]);

  const fetchTrips = async () => {
    try {
      const url = filter === 'all' 
        ? '/api/trips/my-trips' 
        : `/api/trips/my-trips?filter=${filter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTrip = async () => {
    if (!removeModal) return;
    
    const { tripId, attendeeId } = removeModal;
    setRemoveModal(null);
    
    try {
      const response = await fetch(`/api/trips/${tripId}/attendees/${attendeeId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTrips(trips.filter(trip => trip.id !== tripId));
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
        setTrips(trips.filter(trip => trip.id !== tripId));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                My Trips ✈️
              </h1>
              <p className="mt-3 text-lg text-gray-600">
                Manage your travel plans and adventures
              </p>
            </div>
            <Link
              href="/trips/create"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              + Create New Trip
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <p className="text-sm font-medium text-gray-500">Total Trips</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{trips.length}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <p className="text-sm font-medium text-gray-500">Open</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {trips.filter(t => t.status === 'open').length}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <p className="text-sm font-medium text-gray-500">Drafts</p>
            <p className="mt-2 text-3xl font-bold text-gray-600">
              {trips.filter(t => t.status === 'draft').length}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {trips.filter(t => t.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-xl px-6 py-3 text-sm font-semibold transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            All Trips ({trips.length})
          </button>
          <button
            onClick={() => setFilter('organized')}
            className={`rounded-xl px-6 py-3 text-sm font-semibold transition-all whitespace-nowrap ${
              filter === 'organized'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            🎯 Organized by Me ({trips.filter(t => t.isOrganizer).length})
          </button>
          <button
            onClick={() => setFilter('attending')}
            className={`rounded-xl px-6 py-3 text-sm font-semibold transition-all whitespace-nowrap ${
              filter === 'attending'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            ✈️ Requested by Me ({trips.filter(t => !t.isOrganizer).length})
          </button>
        </div>

        {/* Trips Grid */}
        {trips.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                {/* Trip Image */}
                <Link href={`/trips/${trip.id}`}>
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                    {trip.images.length > 0 ? (
                      <img
                        src={trip.images[0].imageUrl}
                        alt={trip.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg className="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        🎯 Organizer
                      </span>
                    ) : trip.attendeeStatus === 'approved' ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        ✅ You're Going!
                      </span>
                    ) : trip.attendeeStatus === 'pending' ? (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        ⏳ Request Pending
                      </span>
                    ) : trip.attendeeStatus === 'rejected' ? (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                        ❌ Rejected
                      </span>
                    ) : null}
                    
                    {/* Trip Status Badge */}
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      trip.status === 'open' ? 'bg-green-100 text-green-800' :
                      trip.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      trip.status === 'full' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {trip.status}
                    </span>
                    {trip.isTentative && (
                      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        Tentative
                      </span>
                    )}
                  </div>

                  <Link href={`/trips/${trip.id}`}>
                    <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                      {trip.title}
                    </h3>
                  </Link>

                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {trip.destination}
                    </div>
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {trip.currentGroupSize}/{trip.requiredGroupSize} people
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-2">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      View
                    </Link>
                    {trip.isOrganizer ? (
                      <>
                        <Link
                          href={`/trips/${trip.id}/edit`}
                          className="rounded-lg border-2 border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteModal(trip.id)}
                          className="rounded-lg border-2 border-gray-200 px-4 py-2 text-sm font-semibold text-red-600 hover:border-red-500 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    ) : trip.attendeeStatus === 'rejected' && trip.attendeeId ? (
                      <button
                        onClick={() => setRemoveModal({ tripId: trip.id, attendeeId: trip.attendeeId!, tripTitle: trip.title })}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
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
          <EmptyState
            icon="✈️"
            title={`No ${filter !== 'all' ? filter : ''} Trips Yet`}
            description={
              filter === 'all' 
                ? "You haven't created any trips yet. Start planning your next adventure!"
                : `You don't have any ${filter} trips. Try changing the filter or create a new trip.`
            }
            actionLabel="Create Your First Trip"
            actionHref="/trips/create"
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md w-full rounded-2xl bg-white p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900">Delete Trip?</h3>
            <p className="mt-3 text-gray-600">
              Are you sure you want to delete this trip? This action cannot be undone.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
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

