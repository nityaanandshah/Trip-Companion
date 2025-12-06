import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl">
          {/* 404 Illustration */}
          <div className="mb-8">
            <span className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              404
            </span>
          </div>

          {/* Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go to Dashboard
            </Link>

            <Link
              href="/trips"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-gray-700 font-semibold shadow-md hover:shadow-lg hover:border-blue-400 transition-all"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Browse Trips
            </Link>
          </div>

          {/* Suggestions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-4">You might be looking for:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/trips/my-trips"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                My Trips
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/bookmarks"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Bookmarks
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/notifications"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Notifications
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/profile/edit"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

