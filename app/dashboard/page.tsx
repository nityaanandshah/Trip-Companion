import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  // Get user's trip count
  const tripCount = await prisma.trip.count({
    where: { ownerId: session.user.id },
  });

  // Get user's bookmark count
  const bookmarkCount = await prisma.tripBookmark.count({
    where: { userId: session.user.id },
  });

  // Get unread notification count
  const unreadNotifications = await prisma.notification.count({
    where: {
      userId: session.user.id,
      read: false,
    },
  });

  // Get recent activities
  const recentTrips = await prisma.trip.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      title: true,
      destination: true,
      createdAt: true,
    },
  });

  const recentBookmarks = await prisma.tripBookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      trip: {
        select: {
          id: true,
          title: true,
          destination: true,
        },
      },
    },
  });

  const recentJoined = await prisma.tripAttendee.findMany({
    where: {
      userId: session.user.id,
      status: 'approved',
    },
    orderBy: { respondedAt: 'desc' },
    take: 3,
    include: {
      trip: {
        select: {
          id: true,
          title: true,
          destination: true,
        },
      },
    },
  });

  // Combine and sort activities
  const activities = [
    ...recentTrips.map((trip) => ({
      type: 'trip_created' as const,
      date: trip.createdAt,
      tripId: trip.id,
      tripTitle: trip.title,
      tripDestination: trip.destination,
    })),
    ...recentBookmarks.map((bookmark) => ({
      type: 'bookmarked' as const,
      date: bookmark.createdAt,
      tripId: bookmark.trip.id,
      tripTitle: bookmark.trip.title,
      tripDestination: bookmark.trip.destination,
    })),
    ...recentJoined.map((attendee) => ({
      type: 'joined_trip' as const,
      date: attendee.respondedAt!,
      tripId: attendee.trip.id,
      tripTitle: attendee.trip.title,
      tripDestination: attendee.trip.destination,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE3' }}>
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        {/* Hero Section */}
        <div className="mb-12 p-10 text-white border" style={{ borderRadius: '2px', backgroundColor: '#2B5F5E', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-display font-bold flex items-center gap-3">
                Welcome back, {session.user.name || 'User'}!
                <svg className="h-10 w-10 inline-block" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd"/>
                </svg>
              </h1>
              <p className="mt-4 text-lg font-sans" style={{ color: '#F5EFE3' }}>
                Ready to plan your next adventure?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm" style={{ color: '#F5EFE3' }}>Member since</p>
                <p className="text-lg font-semibold">December 2025</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* My Trips Card */}
          <Link href="/trips/my-trips" className="group cursor-pointer overflow-hidden bg-white p-8 border transition-all" style={{ borderRadius: '2px', borderColor: '#EBDCC4' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0 p-4 border" style={{ borderRadius: '2px', backgroundColor: '#DAAA63', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
                <svg
                  className="h-7 w-7"
                  style={{ color: '#33353B' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <h2 className="text-xl font-display font-bold" style={{ color: '#33353B' }}>My Trips</h2>
                <p className="text-3xl font-display font-extrabold mt-1" style={{ color: '#DAAA63' }}>{tripCount}</p>
              </div>
            </div>
            <div className="mt-6">
              <span className="inline-flex items-center text-sm font-semibold transition-colors group-hover:underline" style={{ color: '#DAAA63' }}>
                Create your first trip 
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Bookmarked Trips Card */}
          <Link href="/bookmarks" className="group cursor-pointer overflow-hidden bg-white p-8 border transition-all" style={{ borderRadius: '2px', borderColor: '#EBDCC4' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0 p-4 border" style={{ borderRadius: '2px', backgroundColor: '#DAAA63', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
                <svg
                  className="h-7 w-7"
                  style={{ color: '#33353B' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <h2 className="text-xl font-display font-bold" style={{ color: '#33353B' }}>Bookmarks</h2>
                <p className="text-3xl font-display font-extrabold mt-1" style={{ color: '#DAAA63' }}>{bookmarkCount}</p>
              </div>
            </div>
            <div className="mt-6">
              <span className="inline-flex items-center text-sm font-semibold transition-colors group-hover:underline" style={{ color: '#DAAA63' }}>
                Browse trips
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Profile Card */}
          <Link href="/profile/edit" className="group cursor-pointer overflow-hidden bg-white p-8 border transition-all" style={{ borderRadius: '2px', borderColor: '#EBDCC4' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0 p-4 border" style={{ borderRadius: '2px', backgroundColor: '#C76D45', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <h2 className="text-xl font-display font-bold" style={{ color: '#33353B' }}>Profile</h2>
                <p className="text-sm font-sans mt-1" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>{session.user.email}</p>
              </div>
            </div>
            <div className="mt-6">
              <span className="inline-flex items-center text-sm font-semibold transition-colors group-hover:underline" style={{ color: '#C76D45' }}>
                Edit profile
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-10 bg-white p-10 border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
          <h2 className="text-2xl font-display font-bold mb-8 flex items-center" style={{ color: '#33353B' }}>
            <svg className="h-6 w-6 mr-2" style={{ color: '#C76D45' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/trips/create"
              className="group flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold transition-all border"
              style={{ borderRadius: '2px', borderColor: '#EBDCC4', color: 'rgba(51, 53, 59, 0.8)' }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Trip
            </Link>
            <Link
              href="/trips"
              className="group flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold transition-all border"
              style={{ borderRadius: '2px', borderColor: '#EBDCC4', color: 'rgba(51, 53, 59, 0.8)' }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Trips
            </Link>
            <Link
              href="/notifications"
              className="group relative flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold transition-all border"
              style={{ borderRadius: '2px', borderColor: '#EBDCC4', color: 'rgba(51, 53, 59, 0.8)' }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              View Notifications
              {unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full" style={{ backgroundColor: '#C76D45' }}>
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-10 bg-white p-10 border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
          <h2 className="text-2xl font-display font-bold mb-8 flex items-center" style={{ color: '#33353B' }}>
            <svg className="h-6 w-6 mr-2" style={{ color: '#DAAA63' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activity
          </h2>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const activityIcons = {
                  trip_created: (
                    <div className="flex-shrink-0 rounded-full p-2" style={{ backgroundColor: '#F5EFE3' }}>
                      <svg className="h-5 w-5" style={{ color: '#DAAA63' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  ),
                  bookmarked: (
                    <div className="flex-shrink-0 rounded-full p-2" style={{ backgroundColor: '#F5EFE3' }}>
                      <svg className="h-5 w-5" style={{ color: '#DAAA63' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                  ),
                  joined_trip: (
                    <div className="flex-shrink-0 rounded-full p-2" style={{ backgroundColor: 'rgba(43, 95, 94, 0.1)' }}>
                      <svg className="h-5 w-5" style={{ color: '#2B5F5E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ),
                };

                const activityText = {
                  trip_created: `Created trip to ${activity.tripDestination}`,
                  bookmarked: `Bookmarked ${activity.tripTitle}`,
                  joined_trip: `Joined ${activity.tripTitle}`,
                };

                const timeAgo = new Date(activity.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: new Date(activity.date).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
                });

                return (
                  <Link
                    key={`${activity.type}-${activity.tripId}-${index}`}
                    href={`/trips/${activity.tripId}`}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-opacity-50 transition-colors border"
                    style={{ borderColor: '#EBDCC4' }}
                  >
                    {activityIcons[activity.type]}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: '#33353B' }}>
                        {activityText[activity.type]}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
                        {timeAgo}
                      </p>
                    </div>
                    <svg className="h-5 w-5 flex-shrink-0" style={{ color: 'rgba(51, 53, 59, 0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#EBDCC4' }}>
                <svg className="h-10 w-10" style={{ color: 'rgba(51, 53, 59, 0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-lg font-medium" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>No recent activity</p>
              <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: 'rgba(51, 53, 59, 0.4)' }}>
                Start by creating your first trip or browsing available trips to see your activity here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
