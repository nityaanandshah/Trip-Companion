'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      // Redirect to login after successful registration
      router.push('/auth/login?registered=true');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5EFE3' }}>
      <div className="w-full max-w-md">
        <div className="bg-white p-8 space-y-8 border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
          {/* Logo and Branding */}
          <div className="flex flex-col items-center">
            <svg 
              className="h-16 w-16 mb-4" 
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
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-wider font-sans font-medium block" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>Finding</span>
              <span className="text-3xl font-display font-bold leading-none" style={{ color: '#2B5F5E' }}>Travel Buddies</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-center" style={{ color: '#33353B' }}>
              Create Your Account
            </h2>
            <p className="mt-2 text-center text-sm font-sans" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
              Already have an account?{' '}
              <a
                href="/auth/login"
                className="font-medium transition-colors"
                style={{ color: '#DAAA63' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#c99547'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#DAAA63'}
              >
                Sign in
              </a>
            </p>
          </div>
          {/* Register Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-sm border p-4" style={{ backgroundColor: 'rgba(199, 109, 69, 0.1)', borderColor: 'rgba(199, 109, 69, 0.2)' }}>
                <p className="text-sm font-sans" style={{ color: '#C76D45' }}>{error}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-sans font-medium mb-2" style={{ color: '#33353B' }}>
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-sm border px-4 py-3 font-sans focus:outline-none focus:ring-2 transition-colors"
                  style={{ 
                    borderColor: '#d4c7ad',
                    color: '#33353B'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#DAAA63';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d4c7ad';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-sans font-medium mb-2" style={{ color: '#33353B' }}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-sm border px-4 py-3 font-sans focus:outline-none focus:ring-2 transition-colors"
                  style={{ 
                    borderColor: '#d4c7ad',
                    color: '#33353B'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#DAAA63';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d4c7ad';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-sans font-medium mb-2" style={{ color: '#33353B' }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-sm border px-4 py-3 font-sans focus:outline-none focus:ring-2 transition-colors"
                  style={{ 
                    borderColor: '#d4c7ad',
                    color: '#33353B'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#DAAA63';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d4c7ad';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-sans font-medium mb-2" style={{ color: '#33353B' }}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full rounded-sm border px-4 py-3 font-sans focus:outline-none focus:ring-2 transition-colors"
                  style={{ 
                    borderColor: '#d4c7ad',
                    color: '#33353B'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#DAAA63';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d4c7ad';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 rounded-sm font-sans font-bold focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors"
                style={{
                  backgroundColor: '#DAAA63',
                  color: '#33353B',
                  outlineColor: '#DAAA63'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#c99547';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#DAAA63';
                }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
