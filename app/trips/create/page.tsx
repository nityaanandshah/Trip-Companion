'use client';

import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/Navbar';

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
  status: z.enum(['draft', 'open']),
});

type TripFormData = z.infer<typeof tripFormSchema>;

export default function CreateTripPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      isTentative: false,
      status: 'open',
      requiredGroupSize: '4',
    },
  });

  const description = watch('description') || '';
  const isTentative = watch('isTentative');

  if (status === 'unauthenticated') {
    redirect('/auth/login');
  }

  if (status === 'loading') {
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

  const onSubmit = async (data: TripFormData) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          budgetMin: data.budgetMin ? parseInt(data.budgetMin) : null,
          budgetMax: data.budgetMax ? parseInt(data.budgetMax) : null,
          requiredGroupSize: parseInt(data.requiredGroupSize),
        }),
      });

      if (response.ok) {
        const trip = await response.json();
        setSuccess('Trip created successfully!');
        setTimeout(() => {
          router.push(`/trips/${trip.id}`);
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create trip');
      }
    } catch (err) {
      setError('Failed to create trip. Please try again.');
      console.error('Create trip error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Create Your Trip ✈️
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Share your travel plans and find the perfect companions
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
              Publish Options
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
                    Publish Now
                  </label>
                  <p className="text-sm text-gray-500">
                    Make your trip visible to everyone and start finding companions
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
                    Save as Draft
                  </label>
                  <p className="text-sm text-gray-500">
                    Keep your trip private and finish it later
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  Creating...
                </>
              ) : (
                'Create Trip'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
