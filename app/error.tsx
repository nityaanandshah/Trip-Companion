'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE3' }}>
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl">
          {/* Error Illustration */}
          <div className="mb-8">
            <div className="inline-flex rounded-full p-8" style={{ backgroundColor: 'rgba(199, 109, 69, 0.1)' }}>
              <svg
                className="h-24 w-24"
                style={{ color: '#C76D45' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#33353B' }}>Something Went Wrong</h1>
          <p className="text-lg mb-8" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
            We encountered an unexpected error. Don't worry, your data is safe. Please try again or return to the dashboard.
          </p>

          {/* Error Details (Dev Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 rounded-lg p-4 text-left" style={{ backgroundColor: '#EBDCC4' }}>
              <p className="text-sm font-mono break-all" style={{ color: '#C76D45' }}>
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold hover:scale-105 transition-all"
              style={{ borderRadius: '2px', backgroundColor: '#C76D45' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a85937'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C76D45'}
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 border-2 bg-white px-6 py-3 font-semibold transition-all"
              style={{ borderRadius: '2px', borderColor: '#EBDCC4', color: 'rgba(51, 53, 59, 0.8)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#DAAA63'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#EBDCC4'}
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
          </div>
        </div>
      </div>
    </div>
  );
}
