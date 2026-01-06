'use client';

import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function EditProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bio: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/login');
    }

    if (status === 'authenticated' && session?.user) {
      // Fetch user data
      fetchUserData();
    }
  }, [status, session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || '',
          age: data.age?.toString() || '',
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || '',
        });
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const response = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
        // Update the session with new avatar
        await update({
          user: {
            image: data.avatarUrl,
          },
        });
        setSuccess('Avatar uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to upload avatar');
      }
    } catch (err) {
      setError('Failed to upload avatar. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Update the session with new data
        await update({
          user: {
            name: formData.name,
            image: formData.avatarUrl,
          },
        });
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Update error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5EFE3' }}>
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent" style={{ borderColor: '#DAAA63', borderRightColor: 'transparent' }}></div>
            <p className="mt-2" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE3' }}>
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold" style={{ color: '#33353B' }}>Edit Profile</h1>
          <p className="mt-2 text-sm" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
            Update your profile information and avatar
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 rounded-md p-4" style={{ backgroundColor: 'rgba(199, 109, 69, 0.1)', border: '1px solid rgba(199, 109, 69, 0.2)' }}>
            <p className="text-sm" style={{ color: '#C76D45' }}>{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md p-4" style={{ backgroundColor: 'rgba(43, 95, 94, 0.1)', border: '1px solid rgba(43, 95, 94, 0.2)' }}>
            <p className="text-sm" style={{ color: '#2B5F5E' }}>{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="bg-white px-4 py-6 sm:rounded-lg sm:p-6" style={{ boxShadow: '0 1px 3px 0 rgba(43, 95, 94, 0.1)' }}>
            <div>
              <h3 className="text-lg font-medium leading-6" style={{ color: '#33353B' }}>Profile Picture</h3>
              <p className="mt-1 text-sm" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
                Upload a profile picture (max 5MB)
              </p>
            </div>
            <div className="mt-6 flex items-center space-x-6">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt="Avatar preview"
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-[#EBDCC4]"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full ring-4 ring-[#EBDCC4]" style={{ backgroundColor: '#DAAA63' }}>
                  <span className="text-3xl font-display font-bold" style={{ color: '#33353B' }}>
                    {formData.name?.[0]?.toUpperCase() || session?.user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div>
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <span className="inline-flex items-center rounded-md border bg-white px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80 focus:outline-none focus:ring-2"
                    style={{ borderColor: '#EBDCC4', color: 'rgba(51, 53, 59, 0.8)', outlineColor: '#DAAA63' }}
                  >
                    {isUploading ? (
                      <>
                        <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-r-transparent" style={{ borderColor: '#33353B', borderRightColor: 'transparent' }}></div>
                        Uploading...
                      </>
                    ) : (
                      'Change Avatar'
                    )}
                  </span>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="sr-only"
                  />
                </label>
                {formData.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: '' }))}
                    className="ml-3 text-sm font-medium hover:opacity-80"
                    style={{ color: '#C76D45' }}
                  >
                    Remove
                  </button>
                )}
                <p className="mt-2 text-xs" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
                  JPG, PNG or GIF (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white px-4 py-6 sm:rounded-lg sm:p-6" style={{ boxShadow: '0 1px 3px 0 rgba(43, 95, 94, 0.1)' }}>
            <div>
              <h3 className="text-lg font-medium leading-6" style={{ color: '#33353B' }}>
                Personal Information
              </h3>
              <p className="mt-1 text-sm" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
                This information will be displayed on your profile
              </p>
            </div>
            <div className="mt-6 space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium" style={{ color: 'rgba(51, 53, 59, 0.8)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 sm:text-sm"
                  style={{ borderColor: '#EBDCC4', color: '#33353B' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#DAAA63';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#EBDCC4';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Your name"
                />
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium" style={{ color: 'rgba(51, 53, 59, 0.8)' }}>
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  min="13"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 sm:text-sm"
                  style={{ borderColor: '#EBDCC4', color: '#33353B' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#DAAA63';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#EBDCC4';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Your age"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium" style={{ color: 'rgba(51, 53, 59, 0.8)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={session?.user?.email || ''}
                  disabled
                  className="mt-1 block w-full rounded-md border px-3 py-2 sm:text-sm"
                  style={{ borderColor: '#EBDCC4', backgroundColor: '#F5EFE3', color: 'rgba(51, 53, 59, 0.5)' }}
                />
                <p className="mt-1 text-xs" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Email cannot be changed</p>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium" style={{ color: 'rgba(51, 53, 59, 0.8)' }}>
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 sm:text-sm"
                  style={{ borderColor: '#EBDCC4', color: '#33353B' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#DAAA63';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#EBDCC4';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Tell others about yourself, your travel interests, and what makes you a great travel companion..."
                  maxLength={500}
                />
                <p className="mt-1 text-xs" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/profile"
              className="rounded-md border bg-white px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80 focus:outline-none focus:ring-2"
              style={{ borderColor: '#EBDCC4', color: 'rgba(51, 53, 59, 0.8)', outlineColor: '#DAAA63' }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#DAAA63', color: '#33353B', outlineColor: '#DAAA63' }}
            >
              {isSaving ? (
                <>
                  <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-r-transparent" style={{ borderColor: 'white', borderRightColor: 'transparent' }}></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
