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
          <h1 className="text-5xl font-display font-bold flex items-center gap-3" style={{ color: '#33353B' }}>
            Bookmarked Trips
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#C76D45' }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </h1>
          <p className="mt-3 text-lg" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
            Trips you've saved for later
          </p>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} bookmarked
          </p>
          <Link
            href="/trips"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold transition-all"
            style={{ 
              backgroundColor: '#DAAA63',
              color: '#33353B',
              borderRadius: '2px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c99547'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DAAA63'}
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
                className="group overflow-hidden bg-white border transition-all"
                style={{ 
                  borderRadius: '2px',
                  borderColor: '#EBDCC4'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(43, 95, 94, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#EBDCC4';
                }}
              >
                {/* Trip Image */}
                <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: '#EBDCC4' }}>
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
                    <span className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${
                      trip.status === 'open' 
                        ? 'text-white border' 
                        : 'text-white border'
                    }`}
                    style={{
                      backgroundColor: trip.status === 'open' ? '#2B5F5E' : '#33353B',
                      borderColor: trip.status === 'open' ? '#2B5F5E' : '#33353B'
                    }}>
                      {trip.status === 'full' ? 'full' : trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </span>
                    {trip.isTentative && (
                      <span 
                        className="inline-flex rounded-md px-3 py-1 text-xs font-semibold border"
                        style={{
                          backgroundColor: 'rgba(199, 109, 69, 0.1)',
                          color: '#C76D45',
                          borderColor: '#C76D45'
                        }}
                      >
                        Flexible Dates
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold transition-colors line-clamp-2 mb-3" style={{ color: '#33353B' }}>
                    {trip.title}
                  </h3>

                  {/* Details */}
                  <div className="space-y-2 text-sm mb-4" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#DAAA63' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {trip.destination}
                    </div>
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#C76D45' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                    </div>
                    {(trip.budgetMin || trip.budgetMax) && (
                      <div className="flex items-center">
                        <svg className="mr-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#2B5F5E' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${trip.budgetMin || '?'} - ${trip.budgetMax || '?'}
                      </div>
                    )}
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#33353B' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {trip.requiredGroupSize - trip.currentGroupSize} spots left
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: '#EBDCC4' }}>
                    {trip.owner.avatarUrl ? (
                      <img
                        src={trip.owner.avatarUrl}
                        alt={trip.owner.name}
                        className="h-10 w-10 rounded-full object-cover"
                        style={{ border: '2px solid #EBDCC4' }}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DAAA63', border: '2px solid #EBDCC4' }}>
                        <span className="text-sm font-bold" style={{ color: '#33353B' }}>
                          {trip.owner.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#33353B' }}>
                        {trip.owner.name}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(51, 53, 59, 0.6)' }}>Organizer</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
              <div className="mb-6 mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(199, 109, 69, 0.1)' }}>
                <svg className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor" style={{ color: '#C76D45' }}>
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#33353B' }}>No Bookmarks Yet</h3>
              <p className="mb-8" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>You haven't bookmarked any trips yet. Browse trips and click the heart icon to save ones you're interested in!</p>
              <Link
                href="/trips"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white hover:scale-105 transition-all"
                style={{ 
                  borderRadius: '2px',
                  backgroundColor: '#C76D45'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#a85937';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#C76D45';
                }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                Browse Trips
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
