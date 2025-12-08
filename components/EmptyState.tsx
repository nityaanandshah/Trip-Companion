'use client';

import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon = (
    <svg className="h-12 w-12" style={{ color: 'rgba(51, 53, 59, 0.4)' }} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"/>
    </svg>
  ),
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-6 mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5EFE3' }}>
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-3" style={{ color: '#33353B' }}>{title}</h3>

        {/* Description */}
        <p className="mb-8" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>{description}</p>

        {/* Action Button */}
        {actionLabel && actionHref && (
              <Link
                href={actionHref}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold border transition-opacity hover:opacity-90"
                style={{ borderRadius: '2px', backgroundColor: '#DAAA63', color: '#33353B', borderColor: 'rgba(43, 95, 94, 0.15)' }}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
