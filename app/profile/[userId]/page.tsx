import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { format } from 'date-fns';

interface ProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;

  // Fetch user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      age: true,
      email: true,
      avatarUrl: true,
      bio: true,
      createdAt: true,
      tripsOwned: {
        where: {
          status: {
            not: 'draft',
          },
        },
        select: {
          id: true,
          title: true,
          destination: true,
          startDate: true,
          endDate: true,
          status: true,
          currentGroupSize: true,
          requiredGroupSize: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 6,
      },
      tripAttendees: {
        where: {
          status: 'approved',
        },
        select: {
          trip: {
            select: {
              id: true,
              title: true,
              destination: true,
              startDate: true,
              endDate: true,
              status: true,
              currentGroupSize: true,
              requiredGroupSize: true,
            },
          },
        },
        orderBy: {
          respondedAt: 'desc',
        },
        take: 6,
      },
    },
  });

  if (!user) {
    redirect('/');
  }

  const tripsAttended = user.tripAttendees.map((attendee) => attendee.trip);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/trips"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Trips
          </Link>
        </div>

        {/* Profile Header */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || 'User'}
                className="h-32 w-32 rounded-full object-cover ring-4 ring-gray-100"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ring-4 ring-gray-100">
                <span className="text-5xl font-bold text-white">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            )}

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-gray-900">{user.name || 'Anonymous User'}</h1>
                {user.age && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                    {user.age} years old
                  </span>
                )}
              </div>
              <p className="mt-2 text-lg text-gray-600">{user.email}</p>
              
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Member since {format(new Date(user.createdAt), 'MMM yyyy')}
                </div>
                <div className="flex items-center">
                  <svg className="mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {user.tripsOwned.length} trips organized
                </div>
                <div className="flex items-center">
                  <svg className="mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {tripsAttended.length} trips joined
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trips Organized */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">
                ✈️
              </span>
              Trips Organized
            </h2>
            {user.tripsOwned.length > 0 ? (
              <div className="space-y-4">
                {user.tripsOwned.map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/trips/${trip.id}`}
                    className="block p-4 rounded-xl bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{trip.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">📍 {trip.destination}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{format(new Date(trip.startDate), 'MMM d, yyyy')}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        trip.status === 'open' ? 'bg-green-100 text-green-800' :
                        trip.status === 'full' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No trips organized yet</p>
            )}
          </div>

          {/* Trips Joined */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 mr-3">
                🎒
              </span>
              Trips Joined
            </h2>
            {tripsAttended.length > 0 ? (
              <div className="space-y-4">
                {tripsAttended.map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/trips/${trip.id}`}
                    className="block p-4 rounded-xl bg-gray-50 border-2 border-gray-200 hover:border-purple-300 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{trip.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">📍 {trip.destination}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{format(new Date(trip.startDate), 'MMM d, yyyy')}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        trip.status === 'open' ? 'bg-green-100 text-green-800' :
                        trip.status === 'full' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No trips joined yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

