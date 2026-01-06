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
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE3' }}>
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/trips"
            className="inline-flex items-center text-sm font-medium hover:opacity-80"
            style={{ color: 'rgba(51, 53, 59, 0.7)' }}
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Trips
          </Link>
        </div>

        {/* Profile Header */}
        <div className="mb-8 p-8 border" style={{ borderRadius: '2px', borderColor: '#1f4847', backgroundColor: '#2B5F5E' }}>
          <div className="flex items-start gap-6">
            {/* Avatar */}
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || 'User'}
                className="h-32 w-32 rounded-full object-cover ring-4 ring-white/30"
              />
            ) : (
              <div className="h-32 w-32 rounded-full flex items-center justify-center ring-4 ring-white/30" style={{ backgroundColor: '#DAAA63' }}>
                <span className="text-5xl font-display font-bold" style={{ color: '#33353B' }}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            )}

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-display font-bold text-white">{user.name || 'Anonymous User'}</h1>
                {user.age && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                    {user.age} years old
                  </span>
                )}
              </div>
              <p className="mt-2 text-lg" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{user.email}</p>
              
              <div className="mt-4 flex items-center gap-4 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
                  <h3 className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>About</h3>
                  <p className="leading-relaxed whitespace-pre-wrap text-white">{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trips Organized */}
          <div className="bg-white p-8 border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center" style={{ color: '#33353B' }}>
              <span className="flex items-center justify-center w-10 h-10 rounded-full mr-3" style={{ backgroundColor: '#F5EFE3', color: '#DAAA63' }}>
                <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </span>
              Trips Organized
            </h2>
            {user.tripsOwned.length > 0 ? (
              <div className="space-y-4">
                {user.tripsOwned.map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/trips/${trip.id}`}
                    className="block p-4 border-2 hover:opacity-80 transition-opacity"
                    style={{ borderRadius: '2px', backgroundColor: '#F5EFE3', borderColor: '#d4c7ad' }}
                  >
                    <h3 className="font-semibold mb-1" style={{ color: '#33353B' }}>{trip.title}</h3>
                    <p className="text-sm mb-2 flex items-center" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
                      <svg className="h-4 w-4 mr-1.5" style={{ color: '#DAAA63' }} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd"/>
                      </svg>
                      {trip.destination}
                    </p>
                    <div className="flex items-center justify-between text-xs" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
                      <span>{format(new Date(trip.startDate), 'MMM d, yyyy')}</span>
                      <span className="px-2 py-1 rounded-md border text-white" style={{ 
                        backgroundColor: trip.status === 'open' ? '#2B5F5E' : '#33353B',
                        borderColor: trip.status === 'open' ? '#2B5F5E' : '#33353B'
                      }}>
                        {trip.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center py-8" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>No trips organized yet</p>
            )}
          </div>

          {/* Trips Joined */}
          <div className="bg-white p-8 border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center" style={{ color: '#33353B' }}>
              <span className="flex items-center justify-center w-10 h-10 rounded-full mr-3" style={{ backgroundColor: '#EBDCC4', color: '#C76D45' }}>
                <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd"/>
                  <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z"/>
                </svg>
              </span>
              Trips Joined
            </h2>
            {tripsAttended.length > 0 ? (
              <div className="space-y-4">
                {tripsAttended.map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/trips/${trip.id}`}
                    className="block p-4 border-2 hover:opacity-80 transition-opacity"
                    style={{ borderRadius: '2px', backgroundColor: '#F5EFE3', borderColor: '#d4c7ad' }}
                  >
                    <h3 className="font-semibold mb-1" style={{ color: '#33353B' }}>{trip.title}</h3>
                    <p className="text-sm mb-2 flex items-center" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
                      <svg className="h-4 w-4 mr-1.5" style={{ color: '#DAAA63' }} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd"/>
                      </svg>
                      {trip.destination}
                    </p>
                    <div className="flex items-center justify-between text-xs" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
                      <span>{format(new Date(trip.startDate), 'MMM d, yyyy')}</span>
                      <span className="px-2 py-1 rounded-md border text-white" style={{ 
                        backgroundColor: trip.status === 'open' ? '#2B5F5E' : '#33353B',
                        borderColor: trip.status === 'open' ? '#2B5F5E' : '#33353B'
                      }}>
                        {trip.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center py-8" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>No trips joined yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
