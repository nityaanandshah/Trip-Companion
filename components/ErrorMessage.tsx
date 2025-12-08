'use client';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="border-2 p-6" style={{ borderRadius: '2px', backgroundColor: 'rgba(199, 109, 69, 0.1)', borderColor: '#C76D45' }}>
      <div className="flex items-start gap-4">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <div className="rounded-full p-3" style={{ backgroundColor: 'rgba(199, 109, 69, 0.2)' }}>
            <svg
              className="h-6 w-6"
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

        {/* Error Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#C76D45' }}>{title}</h3>
          <p className="text-sm mb-4" style={{ color: 'rgba(199, 109, 69, 0.9)' }}>{message}</p>

          {/* Retry Button */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C76D45' }}
            >
              <svg
                className="h-4 w-4"
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
          )}
        </div>
      </div>
    </div>
  );
}
