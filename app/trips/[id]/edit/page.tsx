'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
import ImageUploader from '@/components/ImageUploader';
import Link from 'next/link';

// Validation schema
const tripFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isTentative: z.boolean().optional(),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  requiredGroupSize: z.string().min(1, 'Group size is required'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  status: z.enum(['draft', 'open', 'full', 'completed']),
});

type TripFormData = z.infer<typeof tripFormSchema>;

export default function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripFormSchema),
  });

  const description = watch('description') || '';

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
        
        // Format dates for input fields (YYYY-MM-DD)
        const startDate = new Date(data.startDate).toISOString().split('T')[0];
        const endDate = new Date(data.endDate).toISOString().split('T')[0];
        
        // Populate form with existing data
        reset({
          title: data.title,
          destination: data.destination,
          startDate: startDate,
          endDate: endDate,
          isTentative: data.isTentative,
          budgetMin: data.budgetMin?.toString() || '',
          budgetMax: data.budgetMax?.toString() || '',
          requiredGroupSize: data.requiredGroupSize.toString(),
          description: data.description || '',
          status: data.status,
        });
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

  const onSubmit = async (data: TripFormData) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/trips/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          destination: data.destination,
          startDate: data.startDate,
          endDate: data.endDate,
          isTentative: data.isTentative,
          budgetMin: data.budgetMin ? parseInt(data.budgetMin) : null,
          budgetMax: data.budgetMax ? parseInt(data.budgetMax) : null,
          requiredGroupSize: parseInt(data.requiredGroupSize),
          description: data.description,
          status: data.status,
        }),
      });

      if (response.ok) {
        const updatedTrip = await response.json();
        setTrip(updatedTrip);
        setSuccess('Trip updated successfully!');
        setTimeout(() => {
          router.push(`/trips/${id}`);
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update trip');
      }
    } catch (err) {
      setError('Failed to update trip. Please try again.');
      console.error('Update trip error:', err);
    } finally {
      setIsSubmitting(false);
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
            Edit Trip ✏️
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Update your trip details and manage mood board images
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border-2 border-red-200 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-xl bg-green-50 border-2 border-green-200 p-4">
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">
                📝
              </span>
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Trip Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Trip Title *
                </label>
                <input
                  type="text"
                  id="title"
                  {...register('title')}
                  className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all sm:text-sm"
                  placeholder="e.g., Backpacking through Southeast Asia"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Destination */}
              <div>
                <label htmlFor="destination" className="block text-sm font-semibold text-gray-700 mb-2">
                  Destination *
                </label>
                <input
                  type="text"
                  id="destination"
                  {...register('destination')}
                  className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all sm:text-sm"
                  placeholder="e.g., Thailand, Vietnam, Cambodia"
                />
                {errors.destination && (
                  <p className="mt-2 text-sm text-red-600">{errors.destination.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  {...register('description')}
                  className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all sm:text-sm"
                  placeholder="Tell us about your trip! What activities do you have in mind? What kind of travel companions are you looking for?"
                />
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>{errors.description?.message || 'Share your trip details and expectations'}</span>
                  <span>{description.length}/2000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dates & Flexibility */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 mr-3">
                📅
              </span>
              Dates & Flexibility
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Start Date */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    {...register('startDate')}
                    className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all sm:text-sm"
                  />
                  {errors.startDate && (
                    <p className="mt-2 text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    {...register('endDate')}
                    className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all sm:text-sm"
                  />
                  {errors.endDate && (
                    <p className="mt-2 text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                </div>
              </div>

              {/* Tentative Dates */}
              <div className="flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="isTentative"
                    type="checkbox"
                    {...register('isTentative')}
                    className="h-5 w-5 rounded-lg border-gray-300 text-purple-600 focus:ring-4 focus:ring-purple-100"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="isTentative" className="font-medium text-gray-700">
                    Dates are tentative
                  </label>
                  <p className="text-sm text-gray-500">Check this if your dates are flexible</p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Group Size */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mr-3">
                💰
              </span>
              Budget & Group
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Budget Min */}
                <div>
                  <label htmlFor="budgetMin" className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget (Min) $
                  </label>
                  <input
                    type="number"
                    id="budgetMin"
                    {...register('budgetMin')}
                    min="0"
                    step="50"
                    className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all sm:text-sm"
                    placeholder="500"
                  />
                </div>

                {/* Budget Max */}
                <div>
                  <label htmlFor="budgetMax" className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget (Max) $
                  </label>
                  <input
                    type="number"
                    id="budgetMax"
                    {...register('budgetMax')}
                    min="0"
                    step="50"
                    className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all sm:text-sm"
                    placeholder="2000"
                  />
                </div>
              </div>

              {/* Group Size */}
              <div>
                <label htmlFor="requiredGroupSize" className="block text-sm font-semibold text-gray-700 mb-2">
                  Looking for how many travel companions? *
                </label>
                <input
                  type="number"
                  id="requiredGroupSize"
                  {...register('requiredGroupSize')}
                  min="1"
                  max="50"
                  className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all sm:text-sm"
                  placeholder="4"
                />
                {errors.requiredGroupSize && (
                  <p className="mt-2 text-sm text-red-600">{errors.requiredGroupSize.message}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Total number of people you'd like on this trip (including you)
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600 mr-3">
                🚀
              </span>
              Trip Status
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="status-open"
                    type="radio"
                    {...register('status')}
                    value="open"
                    className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="status-open" className="font-medium text-gray-700">
                    Open
                  </label>
                  <p className="text-sm text-gray-500">
                    Trip is visible and accepting join requests
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="status-draft"
                    type="radio"
                    {...register('status')}
                    value="draft"
                    className="h-5 w-5 border-gray-300 text-gray-600 focus:ring-4 focus:ring-gray-100"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="status-draft" className="font-medium text-gray-700">
                    Draft
                  </label>
                  <p className="text-sm text-gray-500">
                    Keep your trip private
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="status-full"
                    type="radio"
                    {...register('status')}
                    value="full"
                    className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="status-full" className="font-medium text-gray-700">
                    Full
                  </label>
                  <p className="text-sm text-gray-500">
                    All spots are filled
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="status-completed"
                    type="radio"
                    {...register('status')}
                    value="completed"
                    className="h-5 w-5 border-gray-300 text-purple-600 focus:ring-4 focus:ring-purple-100"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="status-completed" className="font-medium text-gray-700">
                    Completed
                  </label>
                  <p className="text-sm text-gray-500">
                    Trip has finished
                  </p>
                </div>
              </div>
            </div>
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

        {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
          <Link
            href={`/trips/${id}`}
              className="rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all"
          >
              Cancel
          </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  Saving Changes...
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

