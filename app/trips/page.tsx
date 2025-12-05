'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import BookmarkButton from '@/components/BookmarkButton';
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
  description: string | null;
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

export default function BrowseTripsPage() {
  const { data: session, status } = useSession();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState('');
  const [descriptionKeyword, setDescriptionKeyword] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTrips();
    }
  }, [status, search, destination, startDate, endDate, duration, descriptionKeyword, sortBy]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (destination) params.append('destination', destination);
      params.append('status', 'open');
      
      const response = await fetch(`/api/trips?${params.toString()}`);
      if (response.ok) {
        let data = await response.json();
        
        // Client-side filters
        data = data.filter((trip: Trip) => {
          // Date range filter
          if (startDate) {
            const tripStart = new Date(trip.startDate);
            const filterStart = new Date(startDate);
            if (tripStart < filterStart) return false;
          }
          if (endDate) {
            const tripEnd = new Date(trip.endDate);
            const filterEnd = new Date(endDate);
            if (tripEnd > filterEnd) return false;
          }
          
          // Duration filter (in days)
          if (duration) {
            const tripStart = new Date(trip.startDate);
            const tripEnd = new Date(trip.endDate);
            const tripDuration = Math.ceil((tripEnd.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24));
            const filterDuration = parseInt(duration);
            // Allow +/- 2 days tolerance
            if (Math.abs(tripDuration - filterDuration) > 2) return false;
          }
          
          // Description keyword filter
          if (descriptionKeyword && trip.description) {
            const keyword = descriptionKeyword.toLowerCase();
            const description = trip.description.toLowerCase();
            if (!description.includes(keyword)) return false;
          }
          
          return true;
        });
        
        // Client-side sorting
        if (sortBy === 'latest') {
          data.sort((a: Trip, b: Trip) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        } else if (sortBy === 'soonest') {
          data.sort((a: Trip, b: Trip) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        } else if (sortBy === 'budget-low') {
          data.sort((a: Trip, b: Trip) => (a.budgetMin || 0) - (b.budgetMin || 0));
        } else if (sortBy === 'budget-high') {
          data.sort((a: Trip, b: Trip) => (b.budgetMax || 0) - (a.budgetMax || 0));
        }
        
        setTrips(data);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'unauthenticated') {
    redirect('/auth/login');
  }

  if (status === 'loading') {
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
              Discover Trips
            </span>
            <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Find your next adventure and perfect travel companions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search trips by title, description, or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-2xl border-2 border-gray-200 bg-white pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-lg"
            />
          </div>

          {/* Filters Section */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filters
              </h3>
              {(destination || startDate || endDate || duration || descriptionKeyword) && (
                <button
                  onClick={() => {
                    setDestination('');
                    setStartDate('');
                    setEndDate('');
                    setDuration('');
                    setDescriptionKeyword('');
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Destination Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📍 Destination
                </label>
                <input
                  type="text"
                  placeholder="e.g., Bali, Paris, Tokyo"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Start Date Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Trip Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* End Date Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Trip End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Duration Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ⏱️ Duration (Days)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 7, 14, 21"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Description Keyword Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💬 Vibe/Keyword
                </label>
                <input
                  type="text"
                  placeholder="e.g., adventure, chill, luxury"
                  value={descriptionKeyword}
                  onChange={(e) => setDescriptionKeyword(e.target.value)}
                  className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Sort Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔄 Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 font-medium focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option value="latest">Latest First</option>
                  <option value="soonest">Soonest Departure</option>
                  <option value="budget-low">Budget: Low to High</option>
                  <option value="budget-high">Budget: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Link
              href="/trips/create"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              + Create New Trip
            </Link>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-600">
            {loading ? 'Searching...' : `Found ${trips.length} ${trips.length === 1 ? 'trip' : 'trips'}`}
          </p>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white p-6 shadow-lg">
                <div className="aspect-video bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : trips.length > 0 ? (
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
                    <BookmarkButton tripId={trip.id} size="md" />
                  </div>
                </div>

                {/* Trip Info */}
                <Link href={`/trips/${trip.id}`} className="block p-6">
                  {/* Badges */}
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      Open
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
                    <div className="text-right">
                      <span className="inline-flex items-center text-xs font-medium text-gray-500">
                        <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        {trip._count.bookmarks}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-16 text-center shadow-lg">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6">
              <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">No Trips Found</h2>
            <p className="mt-3 text-gray-600 max-w-md mx-auto">
              {search || destination || startDate || endDate || duration || descriptionKeyword
                ? "No trips match your filters. Try adjusting your search criteria."
                : "No trips available yet. Be the first to create one!"}
            </p>
            <Link
              href="/trips/create"
              className="mt-8 inline-block rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Create a Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

