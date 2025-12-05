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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                Welcome back, {session.user.name || 'User'}! 👋
              </h1>
              <p className="mt-3 text-lg text-blue-100">
                Ready to plan your next adventure?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-blue-200">Member since</p>
                <p className="text-lg font-semibold">December 2025</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* My Trips Card */}
          <Link href="/trips/my-trips">
            <div className="group cursor-pointer overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 shadow-lg">
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
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5">
                  <h2 className="text-xl font-bold text-gray-900">My Trips</h2>
                  <p className="text-3xl font-extrabold text-blue-600 mt-1">{tripCount}</p>
                </div>
              </div>
              <div className="mt-6">
                <span className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 group-hover:underline">
                  Create your first trip 
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Bookmarked Trips Card */}
          <Link href="/bookmarks">
            <div className="group cursor-pointer overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-4 shadow-lg">
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
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </div>
                <div className="ml-5">
                  <h2 className="text-xl font-bold text-gray-900">Bookmarks</h2>
                  <p className="text-3xl font-extrabold text-amber-600 mt-1">{bookmarkCount}</p>
                </div>
              </div>
              <div className="mt-6">
                <span className="inline-flex items-center text-sm font-semibold text-amber-600 hover:text-amber-700 group-hover:underline">
                  Browse trips
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Profile Card */}
          <Link href="/profile/edit">
            <div className="group cursor-pointer overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 shadow-lg">
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
                  <h2 className="text-xl font-bold text-gray-900">Profile</h2>
                  <p className="text-sm text-gray-600 mt-1">{session.user.email}</p>
                </div>
              </div>
              <div className="mt-6">
                <span className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 group-hover:underline">
                  Edit profile
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="h-6 w-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="/trips/create"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Trip
            </a>
            <a
              href="/trips"
              className="group flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Trips
            </a>
            <a
              href="/notifications"
              className="group relative flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:border-purple-500 hover:text-purple-600 hover:shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              View Notifications
              {unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </span>
              )}
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 rounded-xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="h-6 w-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activity
          </h2>
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-600">No recent activity</p>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
              Start by creating your first trip or browsing available trips to see your activity here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

