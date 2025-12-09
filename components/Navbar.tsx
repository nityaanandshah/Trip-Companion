'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import SocketStatus from './SocketStatus';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    if (path === '/trips') {
      return pathname === '/trips';
    }
    if (path === '/trips/my-trips') {
      return pathname === '/trips/my-trips';
    }
    if (path === '/bookmarks') {
      return pathname === '/bookmarks';
    }
    if (path === '/notifications') {
      return pathname === '/notifications';
    }
    return false;
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <nav style={{ backgroundColor: '#2B5F5E', borderBottom: '1px solid #3a7675' }}>
      <div className="px-8 sm:px-12 lg:px-16">
        <div className="flex h-16 justify-between">
          {/* Logo and primary navigation */}
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                {/* Suitcase Icon */}
                <svg 
                  className="h-10 w-10 transition-colors" 
                  style={{ color: '#F5EFE3' }}
                  viewBox="0 0 64 64" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                  onMouseEnter={(e) => e.currentTarget.style.color = '#DAAA63'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#F5EFE3'}
                >
                  <rect x="12" y="20" width="40" height="28" rx="2" />
                  <path d="M20 20V16a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v4" />
                  <path d="M12 28h40M12 36h40" />
                  <circle cx="32" cy="32" r="3" fill="currentColor" />
                  <path d="M32 20v8M32 36v12" strokeLinecap="round"/>
                </svg>
              <div className="flex flex-col">
                <span className="text-xl font-display font-bold leading-none" style={{ color: '#F5EFE3' }}>TerraMates</span>
              </div>
              </Link>
            </div>
            <div className="hidden sm:ml-2 sm:flex sm:space-x-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors"
                style={{
                  borderColor: isActive('/dashboard') ? '#DAAA63' : 'transparent',
                  color: isActive('/dashboard') ? '#F5EFE3' : '#EBDCC4'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/dashboard')) {
                    e.currentTarget.style.borderColor = '#EBDCC4';
                    e.currentTarget.style.color = '#F5EFE3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/dashboard')) {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.color = '#EBDCC4';
                  }
                }}
              >
                Dashboard
              </Link>
              <Link
                href="/trips"
                className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors"
                style={{
                  borderColor: isActive('/trips') ? '#DAAA63' : 'transparent',
                  color: isActive('/trips') ? '#F5EFE3' : '#EBDCC4'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/trips')) {
                    e.currentTarget.style.borderColor = '#EBDCC4';
                    e.currentTarget.style.color = '#F5EFE3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/trips')) {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.color = '#EBDCC4';
                  }
                }}
              >
                Browse Trips
              </Link>
              <Link
                href="/trips/my-trips"
                className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors"
                style={{
                  borderColor: isActive('/trips/my-trips') ? '#DAAA63' : 'transparent',
                  color: isActive('/trips/my-trips') ? '#F5EFE3' : '#EBDCC4'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/trips/my-trips')) {
                    e.currentTarget.style.borderColor = '#EBDCC4';
                    e.currentTarget.style.color = '#F5EFE3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/trips/my-trips')) {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.color = '#EBDCC4';
                  }
                }}
              >
                My Trips
              </Link>
              <Link
                href="/bookmarks"
                className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors"
                style={{
                  borderColor: isActive('/bookmarks') ? '#DAAA63' : 'transparent',
                  color: isActive('/bookmarks') ? '#F5EFE3' : '#EBDCC4'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/bookmarks')) {
                    e.currentTarget.style.borderColor = '#EBDCC4';
                    e.currentTarget.style.color = '#F5EFE3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/bookmarks')) {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.color = '#EBDCC4';
                  }
                }}
              >
                Bookmarks
              </Link>
            </div>
          </div>

          {/* User menu */}
          <div className="hidden sm:ml-auto sm:flex sm:items-center">
            <Link
              href="/trips/create"
              className="mr-4 rounded-sm px-3 py-2 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: '#DAAA63',
                color: '#33353B'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c99547'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DAAA63'}
            >
              Create Trip
            </Link>

            {/* Socket connection status */}
            <div className="mr-3">
              <SocketStatus position="inline" showLabel={false} />
            </div>

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="flex rounded-full text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#3a7675',
                    outlineColor: '#DAAA63'
                  }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: '#C76D45' }}>
                      {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </button>
              </div>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  
                  {/* Menu items */}
                  <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right bg-white py-1 border focus:outline-none" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
                    <div className="px-4 py-2 border-b" style={{ borderColor: 'rgba(43, 95, 94, 0.2)' }}>
                      <p className="text-sm font-medium" style={{ color: '#33353B' }}>
                        {session?.user?.name || 'User'}
                      </p>
                      <p className="text-sm truncate" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
                        {session?.user?.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm transition-colors"
                      style={{ color: '#33353B' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5EFE3'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/trips/my-trips"
                      className="block px-4 py-2 text-sm transition-colors"
                      style={{ color: '#33353B' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5EFE3'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Trips
                    </Link>
                    <Link
                      href="/notifications"
                      className="block px-4 py-2 text-sm transition-colors"
                      style={{ color: '#33353B' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5EFE3'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Notifications
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm transition-colors"
                      style={{ color: '#C76D45' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5EFE3'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-sm p-2 focus:outline-none focus:ring-2 focus:ring-inset transition-colors"
              style={{ 
                color: '#EBDCC4',
                outlineColor: '#DAAA63'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3a7675';
                e.currentTarget.style.color = '#F5EFE3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#EBDCC4';
              }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden" style={{ backgroundColor: '#3a7675' }}>
          <div className="space-y-1 pb-3 pt-2">
            <Link
              href="/dashboard"
              className="block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors"
              style={{
                borderColor: isActive('/dashboard') ? '#DAAA63' : 'transparent',
                backgroundColor: isActive('/dashboard') ? '#2B5F5E' : 'transparent',
                color: isActive('/dashboard') ? '#F5EFE3' : '#EBDCC4'
              }}
              onMouseEnter={(e) => {
                if (!isActive('/dashboard')) {
                  e.currentTarget.style.borderColor = '#EBDCC4';
                  e.currentTarget.style.backgroundColor = '#2B5F5E';
                  e.currentTarget.style.color = '#F5EFE3';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/dashboard')) {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#EBDCC4';
                }
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/trips"
              className="block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors"
              style={{
                borderColor: isActive('/trips') ? '#DAAA63' : 'transparent',
                backgroundColor: isActive('/trips') ? '#2B5F5E' : 'transparent',
                color: isActive('/trips') ? '#F5EFE3' : '#EBDCC4'
              }}
              onMouseEnter={(e) => {
                if (!isActive('/trips')) {
                  e.currentTarget.style.borderColor = '#EBDCC4';
                  e.currentTarget.style.backgroundColor = '#2B5F5E';
                  e.currentTarget.style.color = '#F5EFE3';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/trips')) {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#EBDCC4';
                }
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Trips
            </Link>
            <Link
              href="/trips/my-trips"
              className="block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors"
              style={{
                borderColor: isActive('/trips/my-trips') ? '#DAAA63' : 'transparent',
                backgroundColor: isActive('/trips/my-trips') ? '#2B5F5E' : 'transparent',
                color: isActive('/trips/my-trips') ? '#F5EFE3' : '#EBDCC4'
              }}
              onMouseEnter={(e) => {
                if (!isActive('/trips/my-trips')) {
                  e.currentTarget.style.borderColor = '#EBDCC4';
                  e.currentTarget.style.backgroundColor = '#2B5F5E';
                  e.currentTarget.style.color = '#F5EFE3';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/trips/my-trips')) {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#EBDCC4';
                }
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              My Trips
            </Link>
            <Link
              href="/bookmarks"
              className="block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors"
              style={{
                borderColor: isActive('/bookmarks') ? '#DAAA63' : 'transparent',
                backgroundColor: isActive('/bookmarks') ? '#2B5F5E' : 'transparent',
                color: isActive('/bookmarks') ? '#F5EFE3' : '#EBDCC4'
              }}
              onMouseEnter={(e) => {
                if (!isActive('/bookmarks')) {
                  e.currentTarget.style.borderColor = '#EBDCC4';
                  e.currentTarget.style.backgroundColor = '#2B5F5E';
                  e.currentTarget.style.color = '#F5EFE3';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/bookmarks')) {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#EBDCC4';
                }
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              Bookmarks
            </Link>
          </div>
          <div className="border-t pb-3 pt-4" style={{ borderColor: '#2B5F5E' }}>
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: '#C76D45' }}>
                    {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium" style={{ color: '#F5EFE3' }}>
                  {session?.user?.name || 'User'}
                </div>
                <div className="text-sm font-medium" style={{ color: '#EBDCC4' }}>
                  {session?.user?.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/profile"
                className="block px-4 py-2 text-base font-medium transition-colors"
                style={{ color: '#EBDCC4' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2B5F5E';
                  e.currentTarget.style.color = '#F5EFE3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#EBDCC4';
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Your Profile
              </Link>
              <Link
                href="/notifications"
                className="block px-4 py-2 text-base font-medium transition-colors"
                style={{ color: '#EBDCC4' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2B5F5E';
                  e.currentTarget.style.color = '#F5EFE3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#EBDCC4';
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Notifications
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-base font-medium transition-colors"
                style={{ color: '#C76D45' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2B5F5E'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
