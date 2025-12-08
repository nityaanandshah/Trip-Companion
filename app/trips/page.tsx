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
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTrips();
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [status, search, destination, startDate, endDate, duration, sortBy]);

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
            Discover Trips
            <svg className="h-10 w-10" style={{ color: '#C76D45' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </h1>
          <p className="mt-3 text-lg" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
            Find your next adventure and perfect travel companions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="h-5 w-5" style={{ color: 'rgba(51, 53, 59, 0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search trips by title, description, or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full bg-white pl-12 pr-4 py-4 border-2 focus:outline-none focus:ring-4 transition-all"
              style={{ 
                borderRadius: '2px',
                borderColor: '#d4c7ad',
                color: '#33353B'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#DAAA63';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(218, 170, 99, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d4c7ad';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Filters Section */}
          <div className="bg-white p-8 border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center" style={{ color: '#33353B' }}>
                <svg className="h-5 w-5 mr-2" style={{ color: '#C76D45' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filters
              </h3>
              {(destination || startDate || endDate || duration) && (
                <button
                  onClick={() => {
                    setDestination('');
                    setStartDate('');
                    setEndDate('');
                    setDuration('');
                  }}
                  className="text-sm font-medium transition-colors"
                  style={{ color: '#C76D45' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#a85937'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#C76D45'}
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Destination Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center" style={{ color: 'rgba(51, 53, 59, 0.8)' }}>
                  <svg className="h-4 w-4 mr-1.5" style={{ color: '#DAAA63' }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd"/>
                  </svg>
                  Destination
                </label>
                <input
                  type="text"
                  placeholder="e.g., Bali, Paris, Tokyo"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="block w-full px-4 py-2.5 border-2 focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderRadius: '2px',
                    borderColor: '#d4c7ad',
                    backgroundColor: '#F5EFE3',
                    color: '#33353B'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#DAAA63';
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d4c7ad';
                    e.currentTarget.style.backgroundColor = '#F5EFE3';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Start Date Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center" style={{ color: 'rgba(51, 53, 59, 0.8)' }}>
                  <svg className="h-4 w-4 mr-1.5" style={{ color: '#C76D45' }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd"/>
                  </svg>
                  Trip Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full px-4 py-2.5 border-2 focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderRadius: '2px',
                    borderColor: '#d4c7ad',
                    backgroundColor: '#F5EFE3',
                    color: '#33353B'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#DAAA63';
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d4c7ad';
                    e.currentTarget.style.backgroundColor = '#F5EFE3';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* End Date Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center" style={{ color: 'rgba(51, 53, 59, 0.8)' }}>
                  <svg className="h-4 w-4 mr-1.5" style={{ color: '#C76D45' }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd"/>
                  </svg>
                  Trip End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full px-4 py-2.5 border-2 focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderRadius: '2px',
                    borderColor: '#d4c7ad',
                    backgroundColor: '#F5EFE3',
                    color: '#33353B'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#DAAA63';
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d4c7ad';
                    e.currentTarget.style.backgroundColor = '#F5EFE3';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Duration Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center" style={{ color: 'rgba(51, 53, 59, 0.8)' }}>
                  <svg className="h-4 w-4 mr-1.5" style={{ color: '#C76D45' }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd"/>
                  </svg>
                  Duration (Days)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 7, 14, 21"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="block w-full px-4 py-2.5 border-2 focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderRadius: '2px',
                    borderColor: '#d4c7ad',
                    backgroundColor: '#F5EFE3',
                    color: '#33353B'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#DAAA63';
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d4c7ad';
                    e.currentTarget.style.backgroundColor = '#F5EFE3';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Sort Dropdown */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center" style={{ color: 'rgba(51, 53, 59, 0.8)' }}>
                  <svg className="h-4 w-4 mr-1.5" style={{ color: '#DAAA63' }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.24 6.8a.75.75 0 001.06-.04l1.95-2.1v8.59a.75.75 0 001.5 0V4.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L2.2 5.74a.75.75 0 00.04 1.06zm8 6.4a.75.75 0 00-.04 1.06l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75a.75.75 0 00-1.5 0v8.59l-1.95-2.1a.75.75 0 00-1.06-.04z" clipRule="evenodd"/>
                  </svg>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full px-4 py-2.5 border-2 font-medium focus:outline-none focus:ring-2 transition-all cursor-pointer"
                  style={{ 
                    borderRadius: '2px',
                    borderColor: '#d4c7ad',
                    backgroundColor: '#F5EFE3',
                    color: '#33353B'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#DAAA63';
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d4c7ad';
                    e.currentTarget.style.backgroundColor = '#F5EFE3';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
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
              className="px-8 py-3 text-sm font-semibold border transition-all"
              style={{ 
                borderRadius: '2px',
                backgroundColor: '#DAAA63',
                color: '#33353B',
                borderColor: 'rgba(43, 95, 94, 0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#c99547';
                e.currentTarget.style.borderColor = 'rgba(43, 95, 94, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#DAAA63';
                e.currentTarget.style.borderColor = 'rgba(43, 95, 94, 0.15)';
              }}
            >
              + Create New Trip
            </Link>
          </div>
        </div>

        {/* Results Count */}
        {/* Results and Pagination Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
            {loading ? 'Searching...' : `Found ${trips.length} ${trips.length === 1 ? 'trip' : 'trips'}`}
          </p>
          {!loading && trips.length > ITEMS_PER_PAGE && (
            <p className="text-sm font-medium" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
              Page {currentPage} of {Math.ceil(trips.length / ITEMS_PER_PAGE)}
            </p>
          )}
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white p-6" style={{ borderRadius: '2px' }}>
                <div className="aspect-video rounded mb-4" style={{ backgroundColor: '#EBDCC4', borderRadius: '2px' }}></div>
                <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: '#EBDCC4' }}></div>
                <div className="h-4 rounded w-1/2" style={{ backgroundColor: '#EBDCC4' }}></div>
              </div>
            ))}
          </div>
        ) : trips.length > 0 ? (
          <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips
              .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
              .map((trip) => (
              <div
                key={trip.id}
                className="group overflow-hidden bg-white border transition-all"
                style={{ borderRadius: '2px', borderColor: '#EBDCC4' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(43, 95, 94, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#EBDCC4'}
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
                        <svg className="h-16 w-16" style={{ color: 'rgba(51, 53, 59, 0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <span className="inline-flex rounded-md px-3 py-1 text-xs font-semibold text-white border" style={{ backgroundColor: '#2B5F5E', borderColor: '#2B5F5E' }}>
                      Open
                    </span>
                    {trip.isTentative && (
                      <span className="inline-flex rounded-md bg-white px-3 py-1 text-xs font-semibold border" style={{ color: '#C76D45', borderColor: '#C76D45' }}>
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
                      <svg className="mr-2 h-4 w-4 flex-shrink-0" style={{ color: '#DAAA63' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {trip.destination}
                    </div>
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4 flex-shrink-0" style={{ color: '#C76D45' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                    </div>
                    {(trip.budgetMin || trip.budgetMax) && (
                      <div className="flex items-center">
                        <svg className="mr-2 h-4 w-4 flex-shrink-0" style={{ color: '#2B5F5E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${trip.budgetMin || '?'} - ${trip.budgetMax || '?'}
                      </div>
                    )}
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4 flex-shrink-0" style={{ color: '#33353B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <span className="text-sm font-bold text-white">
                          {trip.owner.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#33353B' }}>
                        {trip.owner.name}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Organizer</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center text-xs font-medium" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
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

          {/* Pagination Controls */}
          {trips.length > ITEMS_PER_PAGE && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {/* First Page Button */}
              <button
                onClick={() => {
                  setCurrentPage(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="p-2 border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                style={{ 
                  borderRadius: '2px',
                  borderColor: currentPage === 1 ? '#d4c7ad' : '#C76D45',
                  backgroundColor: 'white',
                  color: '#C76D45'
                }}
                title="First page"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>

              {/* Previous Page Button */}
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="p-2 border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                style={{ 
                  borderRadius: '2px',
                  borderColor: currentPage === 1 ? '#d4c7ad' : '#C76D45',
                  backgroundColor: 'white',
                  color: '#C76D45'
                }}
                title="Previous page"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.ceil(trips.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => {
                  const totalPages = Math.ceil(trips.length / ITEMS_PER_PAGE);
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="min-w-[40px] px-3 py-2 border-2 font-semibold transition-all hover:scale-110"
                        style={{
                          borderRadius: '2px',
                          borderColor: page === currentPage ? '#C76D45' : '#d4c7ad',
                          backgroundColor: page === currentPage ? '#C76D45' : 'white',
                          color: page === currentPage ? 'white' : '#C76D45'
                        }}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page} style={{ color: '#C76D45' }}>...</span>;
                  }
                  return null;
                })}
              </div>

              {/* Next Page Button */}
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.min(Math.ceil(trips.length / ITEMS_PER_PAGE), prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === Math.ceil(trips.length / ITEMS_PER_PAGE)}
                className="p-2 border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                style={{ 
                  borderRadius: '2px',
                  borderColor: currentPage === Math.ceil(trips.length / ITEMS_PER_PAGE) ? '#d4c7ad' : '#C76D45',
                  backgroundColor: 'white',
                  color: '#C76D45'
                }}
                title="Next page"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Last Page Button */}
              <button
                onClick={() => {
                  setCurrentPage(Math.ceil(trips.length / ITEMS_PER_PAGE));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === Math.ceil(trips.length / ITEMS_PER_PAGE)}
                className="p-2 border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                style={{ 
                  borderRadius: '2px',
                  borderColor: currentPage === Math.ceil(trips.length / ITEMS_PER_PAGE) ? '#d4c7ad' : '#C76D45',
                  backgroundColor: 'white',
                  color: '#C76D45'
                }}
                title="Last page"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
          </>
        ) : (
          <div className="bg-white p-16 text-center border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
            <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#F5EFE3' }}>
              <svg className="h-12 w-12" style={{ color: '#DAAA63' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold" style={{ color: '#33353B' }}>No Trips Found</h2>
            <p className="mt-3 max-w-md mx-auto" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
              {search || destination || startDate || endDate || duration
                ? "No trips match your filters. Try adjusting your search criteria."
                : "No trips available yet. Be the first to create one!"}
            </p>
            <Link
              href="/trips/create"
              className="mt-8 inline-block px-8 py-3 text-white font-semibold hover:scale-105 transition-all"
              style={{ borderRadius: '2px', backgroundColor: '#C76D45' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a85937'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C76D45'}
            >
              Create a Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
