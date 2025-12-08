import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE3' }}>
      {/* Navigation */}
      <nav style={{ backgroundColor: '#2B5F5E', borderBottom: '1px solid #3a7675' }}>
        <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              {/* Suitcase Icon */}
              <svg 
                className="h-10 w-10" 
                style={{ color: '#F5EFE3' }}
                viewBox="0 0 64 64" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5"
              >
                <rect x="12" y="20" width="40" height="28" rx="2" />
                <path d="M20 20V16a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v4" />
                <path d="M12 28h40M12 36h40" />
                <circle cx="32" cy="32" r="3" fill="currentColor" />
                <path d="M32 20v8M32 36v12" strokeLinecap="round"/>
              </svg>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider font-sans font-medium" style={{ color: 'rgba(245, 239, 227, 0.8)' }}>Finding</span>
                <span className="text-xl font-display font-bold -mt-1 leading-none" style={{ color: '#F5EFE3' }}>Travel Buddies</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                href="/auth/login" 
                className="font-sans font-medium transition-colors hover:opacity-80"
                style={{ color: '#F5EFE3' }}
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="px-5 py-2 rounded-sm font-sans font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#DAAA63', color: '#33353B' }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-6xl font-display font-bold mb-6 leading-tight" style={{ color: '#2B5F5E' }}>
              Finding<br />
              Travel Buddies
            </h1>
            <p className="text-xl font-sans mb-8 leading-relaxed" style={{ color: '#33353B' }}>
              Connect with fellow travelers around the world and discover your next adventure together.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/auth/register" 
                className="px-8 py-4 rounded-sm font-sans font-bold text-lg transition-opacity hover:opacity-90 inline-flex items-center gap-2"
                style={{ backgroundColor: '#DAAA63', color: '#33353B' }}
              >
                Start Your Journey
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/auth/login" 
                className="bg-white px-8 py-4 rounded-sm font-sans font-bold text-lg border transition-opacity hover:opacity-80"
                style={{ color: '#2B5F5E', borderColor: 'rgba(43, 95, 94, 0.15)' }}
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="overflow-hidden border aspect-[4/3] flex items-center justify-center" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)', backgroundColor: '#C76D45' }}>
              <svg 
                className="h-48 w-48 text-white opacity-20" 
                viewBox="0 0 64 64" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <rect x="8" y="16" width="48" height="32" rx="2" />
                <path d="M16 16V12a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v4" />
                <path d="M8 24h48M8 32h48" />
                <circle cx="32" cy="28" r="4" fill="currentColor" />
                <path d="M32 16v8M32 32v16" strokeLinecap="round"/>
                <circle cx="20" cy="54" r="3" />
                <circle cx="44" cy="54" r="3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-4xl font-display font-bold text-center mb-16" style={{ color: '#2B5F5E' }}>
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 text-center border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: 'rgba(218, 170, 99, 0.1)' }}>
                <svg className="h-8 w-8" style={{ color: '#DAAA63' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold mb-3" style={{ color: '#33353B' }}>Find Compatible Travelers</h3>
              <p className="font-sans" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
                Match with travelers who share your interests, budget, and travel style.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 text-center border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: 'rgba(199, 109, 69, 0.1)' }}>
                <svg className="h-8 w-8" style={{ color: '#C76D45' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold mb-3" style={{ color: '#33353B' }}>Real-time Communication</h3>
              <p className="font-sans" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
                Chat instantly with potential travel companions and plan together.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 text-center border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: 'rgba(43, 95, 94, 0.1)' }}>
                <svg className="h-8 w-8" style={{ color: '#2B5F5E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold mb-3" style={{ color: '#33353B' }}>Safe & Verified</h3>
              <p className="font-sans" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
                Travel with confidence using our verified user profiles and reviews.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 p-12 text-center border" style={{ borderRadius: '2px', backgroundColor: '#2B5F5E', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
          <h2 className="text-4xl font-display font-bold mb-4" style={{ color: '#F5EFE3' }}>
            Ready to Find Your Travel Buddy?
          </h2>
          <p className="text-xl font-sans mb-8 max-w-2xl mx-auto" style={{ color: '#EBDCC4' }}>
            Join thousands of travelers discovering new destinations together.
          </p>
          <Link 
            href="/auth/register" 
            className="px-10 py-4 rounded-sm font-sans font-bold text-lg transition-opacity hover:opacity-90 inline-flex items-center gap-2"
            style={{ backgroundColor: '#DAAA63', color: '#33353B' }}
          >
            Join Now - It's Free
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t bg-white" style={{ borderColor: 'rgba(43, 95, 94, 0.1)' }}>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg 
                className="h-8 w-8" 
                style={{ color: '#2B5F5E' }}
                viewBox="0 0 64 64" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5"
              >
                <rect x="12" y="20" width="40" height="28" rx="2" />
                <path d="M20 20V16a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v4" />
                <path d="M12 28h40M12 36h40" />
                <circle cx="32" cy="32" r="3" fill="currentColor" />
                <path d="M32 20v8M32 36v12" strokeLinecap="round"/>
              </svg>
              <span className="font-display font-bold text-lg" style={{ color: '#2B5F5E' }}>Finding Travel Buddies</span>
            </div>
            <p className="font-sans text-sm" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
              © 2025 Finding Travel Buddies. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
