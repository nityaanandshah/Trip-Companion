'use client';

import { useState, useEffect } from 'react';

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  return (
    <>
      {/* Compact Card */}
      <div className="bg-white p-6 border-2" style={{ borderRadius: '2px', borderColor: '#d4c7ad' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: '#33353B' }}>Trip Members</h3>
          <span className="text-sm font-medium" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
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
                    className="h-10 w-10 rounded-full flex items-center justify-center ring-2 ring-white hover:z-10 transition-all cursor-pointer hover:scale-110"
                    title={member.name}
                    style={{ backgroundColor: '#DAAA63' }}
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
                className="h-10 w-10 rounded-full flex items-center justify-center ring-2 ring-white text-xs font-semibold cursor-pointer hover:scale-110 transition-all"
                style={{ backgroundColor: 'rgba(51, 53, 59, 0.2)', color: 'rgba(51, 53, 59, 0.7)' }}
                title={`${members.length - 4} more`}
              >
                +{members.length - 4}
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: '#DAAA63' }}
          >
            View All →
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4" 
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            className="max-w-2xl w-full bg-white p-8 shadow-2xl max-h-[80vh] overflow-y-auto"
            style={{ borderRadius: '2px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center" style={{ color: '#33353B' }}>
                <span className="flex items-center justify-center w-10 h-10 rounded-full mr-3" style={{ backgroundColor: '#EBDCC4', color: '#C76D45' }}>
                  <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z"/>
                  </svg>
                </span>
                Trip Members
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#F5EFE3' }}
              >
                <svg className="h-6 w-6" style={{ color: 'rgba(51, 53, 59, 0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Members Count */}
            <div className="mb-6 p-4 border-2" style={{ borderRadius: '2px', backgroundColor: 'rgba(43, 95, 94, 0.1)', borderColor: '#2B5F5E' }}>
              <p className="text-center text-sm font-semibold" style={{ color: '#2B5F5E' }}>
                {currentGroupSize} of {requiredGroupSize} spots filled
              </p>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-4 border-2"
                  style={{
                    borderRadius: '2px',
                    backgroundColor: member.isOwner ? 'rgba(43, 95, 94, 0.05)' : '#F5EFE3',
                    borderColor: member.isOwner ? '#2B5F5E' : '#d4c7ad'
                  }}
                >
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className={`h-12 w-12 rounded-full object-cover ring-2 ${member.isOwner ? 'ring-[#2B5F5E]' : 'ring-[rgba(51,53,59,0.2)]'}`}
                    />
                  ) : (
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ring-2 ${member.isOwner ? 'ring-[#2B5F5E]' : 'ring-[rgba(51,53,59,0.2)]'}`} style={{ 
                      backgroundColor: '#DAAA63'
                    }}>
                      <span className="text-lg font-bold text-white">
                        {member.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold truncate" style={{ color: '#33353B' }}>{member.name}</p>
                      {member.isOwner && (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold flex-shrink-0" style={{ backgroundColor: '#F5EFE3', color: '#2B5F5E' }}>
                          Organizer
                        </span>
                      )}
                    </div>
                    <p className="text-sm truncate mb-2" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>{member.email}</p>
                    <a
                      href={`/profile/${member.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center text-xs font-semibold hover:underline"
                      style={{ color: '#DAAA63' }}
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
                className="px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ borderRadius: '2px', backgroundColor: 'rgba(51, 53, 59, 0.1)', color: 'rgba(51, 53, 59, 0.9)' }}
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
