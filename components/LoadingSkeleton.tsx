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
            className="bg-white shadow-md border-2 p-6 animate-pulse"
            style={{ borderRadius: '2px', borderColor: '#d4c7ad' }}
          >
            <div className="h-6 rounded-lg w-3/4 mb-4" style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)' }} />
            <div className="h-4 rounded w-1/2 mb-4" style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)' }} />
            <div className="h-4 rounded w-full mb-2" style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)' }} />
            <div className="h-4 rounded w-5/6" style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)' }} />
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
            className="bg-white shadow-md border-2 overflow-hidden animate-pulse"
            style={{ borderRadius: '2px', borderColor: '#d4c7ad' }}
          >
            <div className="h-48" style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)' }} />
            <div className="p-6">
              <div className="h-6 rounded-lg w-3/4 mb-3" style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)' }} />
              <div className="h-4 rounded w-1/2 mb-4" style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)' }} />
              <div className="flex gap-2 mb-3">
                <div className="h-6 rounded-full w-20" style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)' }} />
                <div className="h-6 rounded-full w-24" style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)' }} />
              </div>
              <div className="h-4 rounded w-full mb-2" style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)' }} />
              <div className="h-4 rounded w-4/5" style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)' }} />
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
          <div key={i} className="h-10 w-10 rounded-full animate-pulse" style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)' }} />
        ))}
      </div>
    );
  }

  // Default: text lines
  return (
    <div className="space-y-3">
      {skeletons.map((_, i) => (
        <div key={i} className="h-4 rounded animate-pulse w-full" style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)' }} />
      ))}
    </div>
  );
}
