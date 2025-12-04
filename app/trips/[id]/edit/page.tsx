'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import ImageUploader from '@/components/ImageUploader';
import Link from 'next/link';

export default function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTrip();
    }
  }, [status, id]);

  const fetchTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTrip(data);
      } else {
        setError('Failed to load trip');
      }
    } catch (err) {
      setError('Failed to load trip');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Error</h1>
          <p className="mt-4 text-gray-600">{error || 'Trip not found'}</p>
          <Link
            href="/trips/my-trips"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
          >
            Back to My Trips
          </Link>
        </div>
      </div>
    );
  }

  // Check if user is owner
  if (trip.ownerId !== session?.user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-4 text-gray-600">You can only edit your own trips</p>
          <Link
            href={`/trips/${id}`}
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
          >
            View Trip
          </Link>
        </div>
      </div>
    );
  }

  const existingImages = trip.images?.map((img: any) => ({
    id: img.id,
    url: img.imageUrl,
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/trips/${id}`}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Trip
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Edit Trip 📝
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Update your trip details and add mood board images
          </p>
        </div>

        {/* Trip Info */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{trip.title}</h2>
          <p className="text-gray-600">{trip.destination}</p>
        </div>

        {/* Image Upload Section */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 mr-3">
                🖼️
              </span>
              Mood Board Images
            </h2>
            <p className="text-sm text-gray-600">
              Add up to 5 images to showcase your trip destination and vibe
            </p>
          </div>

          <ImageUploader
            tripId={id}
            maxImages={5}
            existingImages={existingImages}
            onImagesChange={(images) => {
              console.log('Images updated:', images);
              // Optionally refresh trip data
              fetchTrip();
            }}
          />
        </div>

        {/* Note about trip details */}
        <div className="mt-6 rounded-xl bg-blue-50 border-2 border-blue-200 p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> To edit trip details like title, dates, and description, that feature is coming soon!
            For now, you can add and manage mood board images.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <Link
            href={`/trips/${id}`}
            className="rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
          >
            Done
          </Link>
        </div>
      </div>
    </div>
  );
}

