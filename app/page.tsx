'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentSet, setCurrentSet] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSet((prev) => (prev === 0 ? 1 : 0));
        setIsTransitioning(false);
      }, 500); // Half second for fade out, then switch and fade in
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval);
  }, []);

  const featureSets = [
    [
      {
        icon: (
          <svg className="h-8 w-8" style={{ color: '#DAAA63' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        title: 'Find Trips That Match Your Style',
        description: 'Discover trips that fit your vibe — destination, dates, budget & more.'
      },
      {
        icon: (
          <svg className="h-8 w-8" style={{ color: '#C76D45' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        title: 'Join Trips or Start Your Own',
        description: 'Jump into an existing plan or create your own adventure from scratch.'
      },
      {
        icon: (
          <svg className="h-8 w-8" style={{ color: '#2B5F5E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
        title: 'Connect & Chat in Real Time',
        description: 'Plan together instantly with fast, real-time group chat.'
      }
    ],
    [
      {
        icon: (
          <svg className="h-8 w-8" style={{ color: '#DAAA63' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        ),
        title: 'Smart Notifications',
        description: 'Stay updated — approvals, messages, and trip changes, all in one place.'
      },
      {
        icon: (
          <svg className="h-8 w-8" style={{ color: '#C76D45' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        ),
        title: 'Save Trips You Love',
        description: 'Bookmark favorite trips and revisit them anytime.'
      },
      {
        icon: (
          <svg className="h-8 w-8" style={{ color: '#2B5F5E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
        title: 'Meet Like-Minded Travelers',
        description: 'Connect with people who share your travel pace, interests & energy.'
      }
    ]
  ];

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
                <span className="text-xl font-display font-bold leading-none" style={{ color: '#F5EFE3' }}>TerraMates</span>
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
            <h1 className="text-5xl font-display font-bold mb-6 leading-tight" style={{ color: '#2B5F5E' }}>
              Travel Better,<br />
              Together
            </h1>
            <p className="text-xl font-sans mb-8 leading-relaxed" style={{ color: '#33353B' }}>
              Find your perfect travel companions and explore the world with like-minded adventurers by your side.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/auth/register" 
                className="px-8 py-3 rounded-sm font-sans font-bold transition-opacity hover:opacity-90 inline-flex items-center justify-center gap-2"
                style={{ backgroundColor: '#DAAA63', color: '#33353B' }}
              >
                Explore Trips
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-white px-8 py-3 rounded-sm font-sans font-bold border transition-opacity hover:opacity-80 inline-flex items-center justify-center"
                style={{ color: '#2B5F5E', borderColor: '#2B5F5E' }}
              >
                Create a Trip
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="overflow-hidden border aspect-[4/3] flex items-center justify-center" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
              <Image 
                src="/final ing.png" 
                alt="TerraMates travel companions" 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-4xl font-display font-bold text-center mb-16" style={{ color: '#2B5F5E' }}>
            What You Can Do on TerraMates
          </h2>
          
          {/* Animated Feature Cards */}
          <div className="relative min-h-[400px]">
            <div 
              className={`grid md:grid-cols-3 gap-8 transition-opacity duration-500 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {featureSets[currentSet].map((feature, index) => (
                <div key={index} className="bg-white p-10 text-center border min-h-[320px] flex flex-col justify-center" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 mx-auto" style={{ 
                    backgroundColor: index === 0 ? 'rgba(218, 170, 99, 0.1)' : index === 1 ? 'rgba(199, 109, 69, 0.1)' : 'rgba(43, 95, 94, 0.1)' 
                  }}>
                    <div className="scale-125">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-5" style={{ color: '#33353B' }}>{feature.title}</h3>
                  <p className="font-sans text-base leading-relaxed" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentSet(0);
                  setIsTransitioning(false);
                }, 500);
              }}
              className="transition-all"
              style={{
                width: currentSet === 0 ? '32px' : '12px',
                height: '12px',
                borderRadius: '6px',
                backgroundColor: currentSet === 0 ? '#DAAA63' : 'rgba(43, 95, 94, 0.3)',
              }}
              aria-label="Show first set of features"
            />
            <button
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentSet(1);
                  setIsTransitioning(false);
                }, 500);
              }}
              className="transition-all"
              style={{
                width: currentSet === 1 ? '32px' : '12px',
                height: '12px',
                borderRadius: '6px',
                backgroundColor: currentSet === 1 ? '#DAAA63' : 'rgba(43, 95, 94, 0.3)',
              }}
              aria-label="Show second set of features"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t" style={{ backgroundColor: '#2B5F5E', borderColor: '#3a7675' }}>
        <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg 
                className="h-6 w-6" 
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
              <span className="font-display font-bold" style={{ color: '#F5EFE3' }}>TerraMates</span>
            </div>
            <p className="font-sans text-sm flex items-center gap-2" style={{ color: 'rgba(245, 239, 227, 0.7)' }}>
              Made with 
              <svg className="h-4 w-4" style={{ color: '#C76D45' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              by Nitya • © 2025 • All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
