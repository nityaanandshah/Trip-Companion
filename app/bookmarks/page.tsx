'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import BookmarkButton from '@/components/BookmarkButton';
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
  owner: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  images: { imageUrl: string }[];
  _count: {
    bookmarks: number;
  };
}

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBookmarks();
    }
  }, [status]);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch bookmarks when a bookmark is removed
  const handleBookmarkChange = () => {
    fetchBookmarks();
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
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Bookmarked Trips
            </span>
            <svg className="h-10 w-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Trips you've saved for later
          </p>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} bookmarked
          </p>
          <Link
            href="/trips"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Browse more trips →
          </Link>
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
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                  <Link href={`/trips/${trip.id}`}>
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
                  </Link>
                  {/* Bookmark Button */}
                  <div className="absolute top-3 right-3 z-10">
                    <BookmarkButton 
                      tripId={trip.id} 
                      size="md"
                      initialBookmarked={true}
                    />
                  </div>
                </div>

                {/* Trip Info */}
                <Link href={`/trips/${trip.id}`} className="block p-6">
                  {/* Badges */}
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </span>
                    {trip.isTentative && (
                      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        Flexible Dates
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3">
                    {trip.title}
                  </h3>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
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
                    {(trip.budgetMin || trip.budgetMax) && (
                      <div className="flex items-center">
                        <svg className="mr-2 h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${trip.budgetMin || '?'} - ${trip.budgetMax || '?'}
                      </div>
                    )}
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {trip.requiredGroupSize - trip.currentGroupSize} spots left
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    {trip.owner.avatarUrl ? (
                      <img
                        src={trip.owner.avatarUrl}
                        alt={trip.owner.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ring-2 ring-gray-100">
                        <span className="text-sm font-bold text-white">
                          {trip.owner.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {trip.owner.name}
                      </p>
                      <p className="text-xs text-gray-500">Organizer</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="❤️"
            title="No Bookmarks Yet"
            description="You haven't bookmarked any trips yet. Browse trips and click the heart icon to save ones you're interested in!"
            actionLabel="Browse Trips"
            actionHref="/trips"
          />
        )}
      </div>
    </div>
  );
}
