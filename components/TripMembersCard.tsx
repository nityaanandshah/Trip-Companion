'use client';

import { useState } from 'react';
import { format } from 'date-fns';

interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  isOwner?: boolean;
}

interface TripMembersCardProps {
  members: Member[];
  currentGroupSize: number;
  requiredGroupSize: number;
}

export default function TripMembersCard({ 
  members, 
  currentGroupSize, 
  requiredGroupSize 
}: TripMembersCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Compact Card */}
      <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Trip Members</h3>
          <span className="text-sm font-medium text-gray-600">
            {currentGroupSize} / {requiredGroupSize}
          </span>
        </div>
        
        {/* Avatar Row */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {members.slice(0, 4).map((member, index) => (
              <div key={member.id} className="relative">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white hover:z-10 transition-all cursor-pointer hover:scale-110"
                    title={member.name}
                  />
                ) : (
                  <div 
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ring-2 ring-white hover:z-10 transition-all cursor-pointer hover:scale-110"
                    title={member.name}
                  >
                    <span className="text-sm font-bold text-white">
                      {member.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {members.length > 4 && (
              <div 
                className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-white text-xs font-semibold text-gray-600 cursor-pointer hover:scale-110 transition-all"
                title={`${members.length - 4} more`}
              >
                +{members.length - 4}
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All →
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div 
            className="max-w-2xl w-full rounded-2xl bg-white p-8 shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 mr-3">
                  👥
                </span>
                Trip Members
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Members Count */}
            <div className="mb-6 p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
              <p className="text-center text-sm font-semibold text-purple-900">
                {currentGroupSize} of {requiredGroupSize} spots filled
              </p>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                    member.isOwner 
                      ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className={`h-12 w-12 rounded-full object-cover ring-2 ${
                        member.isOwner ? 'ring-blue-300' : 'ring-gray-200'
                      }`}
                    />
                  ) : (
                    <div className={`h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ring-2 ${
                      member.isOwner ? 'ring-blue-300' : 'ring-gray-200'
                    }`}>
                      <span className="text-lg font-bold text-white">
                        {member.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                      {member.isOwner && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 flex-shrink-0">
                          Organizer
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-2">{member.email}</p>
                    <a
                      href={`/profile/${member.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      View Profile
                      <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

