'use client';

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'avatar' | 'trip';
  count?: number;
}

export default function LoadingSkeleton({ type = 'text', count = 1 }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="space-y-6">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white shadow-md border-2 border-gray-200 p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'trip') {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white shadow-md border-2 border-gray-200 overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200" />
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="flex gap-2 mb-3">
                <div className="h-6 bg-gray-200 rounded-full w-20" />
                <div className="h-6 bg-gray-200 rounded-full w-24" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'avatar') {
    return (
      <div className="flex gap-2">
        {skeletons.map((_, i) => (
          <div key={i} className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
    );
  }

  // Default: text lines
  return (
    <div className="space-y-3">
      {skeletons.map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-full" />
      ))}
    </div>
  );
}

