'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface BookmarkButtonProps {
  tripId: string;
  initialBookmarked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function BookmarkButton({ 
  tripId, 
  initialBookmarked = false,
  size = 'md',
  showLabel = false,
  className = ''
}: BookmarkButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  // Fetch bookmark status on mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchBookmarkStatus();
    }
  }, [status, tripId]);

  const fetchBookmarkStatus = async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}/bookmark`);
      if (response.ok) {
        const data = await response.json();
        setBookmarked(data.bookmarked);
      }
    } catch (error) {
      console.error('Error fetching bookmark status:', error);
    }
  };

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation(); // Stop event bubbling

    // Redirect to login if not authenticated
    if (status !== 'authenticated') {
      router.push('/auth/login');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/trips/${tripId}/bookmark`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarked(data.bookmarked);
      } else {
        console.error('Failed to toggle bookmark');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
        bookmarked 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
      } ${showLabel ? 'px-6 py-3' : buttonSizeClasses[size]} ${className}`}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this trip'}
    >
      {loading ? (
        <div className={`animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[size]}`}></div>
      ) : (
        <>
          {bookmarked ? (
            // Filled heart
            <svg className={sizeClasses[size]} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            // Outline heart
            <svg className={sizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
          {showLabel && (
            <span className="ml-1.5 text-sm font-medium">
              {bookmarked ? 'Saved' : 'Save'}
            </span>
          )}
        </>
      )}
    </button>
  );
}

