import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  // Fetch full user data from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      bio: true,
      age: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch activity stats
  const tripsCreated = await prisma.trip.count({
    where: { ownerId: session.user.id },
  });

  const tripsJoined = await prisma.tripAttendee.count({
    where: {
      userId: session.user.id,
      status: 'approved',
    },
  });

  const bookmarksCount = await prisma.tripBookmark.count({
    where: { userId: session.user.id },
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE3' }}>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold" style={{ color: '#33353B' }}>Your Profile</h1>
          <Link
            href="/profile/edit"
            className="px-6 py-3 text-sm font-semibold border transition-opacity hover:opacity-90"
            style={{ borderRadius: '2px', backgroundColor: '#DAAA63', color: '#33353B', borderColor: 'rgba(43, 95, 94, 0.15)' }}
          >
            Edit Profile
          </Link>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden bg-white border" style={{ borderColor: 'rgba(43, 95, 94, 0.15)', borderRadius: '2px' }}>
          {/* Avatar Section */}
          <div className="border-b px-4 py-8 sm:px-6" style={{ borderColor: '#1f4847', backgroundColor: '#2B5F5E' }}>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || 'User avatar'}
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-white/30"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full ring-4 ring-white/30" style={{ backgroundColor: '#DAAA63' }}>
                    <span className="text-3xl font-display font-bold" style={{ color: '#33353B' }}>
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white">{user.name}</h2>
                <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Member since {formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-4 py-5 sm:px-6">
            <dl className="space-y-6">
              {/* Name, Age, Email in one line */}
              <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-3">
                {/* Name */}
                <div>
                  <dt className="text-sm font-medium" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Full name</dt>
                  <dd className="mt-1 text-sm" style={{ color: '#33353B' }}>{user.name || 'Not set'}</dd>
                </div>

                {/* Age */}
                <div>
                  <dt className="text-sm font-medium" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Age</dt>
                  <dd className="mt-1 text-sm" style={{ color: '#33353B' }}>{user.age || 'Not set'}</dd>
                </div>

                {/* Email */}
                <div>
                  <dt className="text-sm font-medium" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Email address</dt>
                  <dd className="mt-1 text-sm" style={{ color: '#33353B' }}>{user.email}</dd>
                </div>
              </div>

              {/* Bio */}
              <div>
                <dt className="text-sm font-medium" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Bio</dt>
                <dd className="mt-1 text-sm" style={{ color: '#33353B' }}>
                  {user.bio || (
                    <span className="italic" style={{ color: 'rgba(51, 53, 59, 0.4)' }}>
                      No bio added yet. Tell others about yourself!
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Stats Section */}
          <div className="border-t px-4 py-5 sm:px-6" style={{ borderColor: '#d4c7ad', backgroundColor: '#F5EFE3' }}>
            <h3 className="text-lg font-medium leading-6 mb-4" style={{ color: '#33353B' }}>
              Your Activity
            </h3>
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="overflow-hidden bg-white px-6 py-6 border transition-opacity hover:opacity-80" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
                <dt className="truncate text-sm font-semibold uppercase tracking-wide" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Trips Created</dt>
                <dd className="mt-3 text-4xl font-display font-bold tracking-tight" style={{ color: '#33353B' }}>{tripsCreated}</dd>
              </div>
              <div className="overflow-hidden bg-white px-6 py-6 border transition-opacity hover:opacity-80" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
                <dt className="truncate text-sm font-semibold uppercase tracking-wide" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Trips Joined</dt>
                <dd className="mt-3 text-4xl font-display font-bold tracking-tight" style={{ color: '#2B5F5E' }}>{tripsJoined}</dd>
              </div>
              <div className="overflow-hidden bg-white px-6 py-6 border transition-opacity hover:opacity-80" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
                <dt className="truncate text-sm font-semibold uppercase tracking-wide" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Bookmarks</dt>
                <dd className="mt-3 text-4xl font-display font-bold tracking-tight" style={{ color: '#DAAA63' }}>{bookmarksCount}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <Link
            href="/dashboard"
            className="border-2 bg-white px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ borderRadius: '2px', borderColor: '#EBDCC4', color: 'rgba(51, 53, 59, 0.8)' }}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
