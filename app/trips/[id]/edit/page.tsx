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

  if (error || !trip) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5EFE3' }}>
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-4xl font-display font-bold" style={{ color: '#33353B' }}>Error</h1>
          <p className="mt-4" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>{error || 'Trip not found'}</p>
          <Link
            href="/trips/my-trips"
            className="mt-8 inline-block px-6 py-3 font-semibold transition-opacity hover:opacity-90"
            style={{ borderRadius: '2px', backgroundColor: '#DAAA63', color: '#33353B' }}
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
      <div className="min-h-screen" style={{ backgroundColor: '#F5EFE3' }}>
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-4xl font-display font-bold" style={{ color: '#33353B' }}>Access Denied</h1>
          <p className="mt-4" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>You can only edit your own trips</p>
          <Link
            href={`/trips/${id}`}
            className="mt-8 inline-block px-6 py-3 font-semibold transition-opacity hover:opacity-90"
            style={{ borderRadius: '2px', backgroundColor: '#DAAA63', color: '#33353B' }}
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
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE3' }}>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/trips/${id}`}
            className="inline-flex items-center text-sm font-medium mb-4 hover:opacity-80"
            style={{ color: 'rgba(51, 53, 59, 0.7)' }}
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Trip
          </Link>
          <h1 className="text-5xl font-display font-bold flex items-center gap-3" style={{ color: '#33353B' }}>
            Edit Trip
            <svg className="h-10 w-10" style={{ color: '#C76D45' }} viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"/>
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"/>
            </svg>
          </h1>
          <p className="mt-3 text-lg" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
            Update your trip details and manage mood board images
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 border-2" style={{ borderRadius: '2px', backgroundColor: 'rgba(199, 109, 69, 0.1)', borderColor: '#C76D45' }}>
            <p className="text-sm font-medium" style={{ color: '#C76D45' }}>{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 border-2" style={{ borderRadius: '2px', backgroundColor: 'rgba(43, 95, 94, 0.1)', borderColor: '#2B5F5E' }}>
            <p className="text-sm font-medium" style={{ color: '#2B5F5E' }}>{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-10 border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center" style={{ color: '#33353B' }}>
              <span className="flex items-center justify-center w-10 h-10 rounded-full mr-3" style={{ backgroundColor: '#F5EFE3', color: '#DAAA63' }}>
                <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd"/>
                </svg>
              </span>
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Trip Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold mb-2" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
                  Trip Title *
                </label>
                <input
                  type="text"
                  id="title"
                  {...register('title')}
                  className="block w-full border-2 px-4 py-3 transition-all sm:text-sm focus:outline-none focus:ring-4"
                  style={{ borderRadius: '2px', borderColor: '#d4c7ad', backgroundColor: 'white' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#DAAA63';
                    e.target.style.boxShadow = '0 0 0 4px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d4c7ad';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="e.g., Backpacking through Southeast Asia"
                />
                {errors.title && (
                  <p className="mt-2 text-sm" style={{ color: '#C76D45' }}>{errors.title.message}</p>
                )}
              </div>

              {/* Destination */}
              <div>
                <label htmlFor="destination" className="block text-sm font-semibold mb-2" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
                  Destination *
                </label>
                <input
                  type="text"
                  id="destination"
                  {...register('destination')}
                  className="block w-full border-2 px-4 py-3 transition-all sm:text-sm focus:outline-none focus:ring-4"
                  style={{ borderRadius: '2px', borderColor: '#d4c7ad', backgroundColor: 'white' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#DAAA63';
                    e.target.style.boxShadow = '0 0 0 4px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d4c7ad';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="e.g., Thailand, Vietnam, Cambodia"
                />
                {errors.destination && (
                  <p className="mt-2 text-sm" style={{ color: '#C76D45' }}>{errors.destination.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold mb-2" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
                  Description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  {...register('description')}
                  className="block w-full border-2 px-4 py-3 transition-all sm:text-sm focus:outline-none focus:ring-4"
                  style={{ borderRadius: '2px', borderColor: '#d4c7ad', backgroundColor: 'white' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#DAAA63';
                    e.target.style.boxShadow = '0 0 0 4px rgba(218, 170, 99, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d4c7ad';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Tell us about your trip! What activities do you have in mind? What kind of travel companions are you looking for?"
                />
                <div className="mt-2 flex justify-between text-xs" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
                  <span>{errors.description?.message || 'Share your trip details and expectations'}</span>
                  <span>{description.length}/2000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dates & Flexibility */}
          <div className="bg-white p-10 border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center" style={{ color: '#33353B' }}>
              <span className="flex items-center justify-center w-10 h-10 rounded-full mr-3" style={{ backgroundColor: '#EBDCC4', color: '#C76D45' }}>
                <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd"/>
                </svg>
              </span>
              Dates & Flexibility
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Start Date */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-semibold mb-2" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    {...register('startDate')}
                    className="block w-full border-2 px-4 py-3 transition-all sm:text-sm focus:outline-none focus:ring-4"
                    style={{ borderRadius: '2px', borderColor: '#d4c7ad', backgroundColor: 'white' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C76D45';
                      e.target.style.boxShadow = '0 0 0 4px rgba(199, 109, 69, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d4c7ad';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {errors.startDate && (
                    <p className="mt-2 text-sm" style={{ color: '#C76D45' }}>{errors.startDate.message}</p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label htmlFor="endDate" className="block text-sm font-semibold mb-2" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    {...register('endDate')}
                    className="block w-full border-2 px-4 py-3 transition-all sm:text-sm focus:outline-none focus:ring-4"
                    style={{ borderRadius: '2px', borderColor: '#d4c7ad', backgroundColor: 'white' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C76D45';
                      e.target.style.boxShadow = '0 0 0 4px rgba(199, 109, 69, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d4c7ad';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {errors.endDate && (
                    <p className="mt-2 text-sm" style={{ color: '#C76D45' }}>{errors.endDate.message}</p>
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
                    className="h-5 w-5 rounded-lg focus:ring-4"
                    style={{ borderColor: 'rgba(51, 53, 59, 0.3)', accentColor: '#C76D45' }}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="isTentative" className="font-medium" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
                    Dates are tentative
                  </label>
                  <p className="text-sm" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>Check this if your dates are flexible</p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Group Size */}
          <div className="bg-white p-10 border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center" style={{ color: '#33353B' }}>
              <span className="flex items-center justify-center w-10 h-10 rounded-full mr-3" style={{ backgroundColor: 'rgba(43, 95, 94, 0.1)', color: '#2B5F5E' }}>
                <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.798 7.45c.512-.67 1.135-.95 1.702-.95s1.19.28 1.702.95a.75.75 0 001.192-.91C12.637 5.55 11.596 5 10.5 5s-2.137.55-2.894 1.54A5.205 5.205 0 006.83 8H5.75a.75.75 0 000 1.5h.77a6.333 6.333 0 000 1h-.77a.75.75 0 000 1.5h1.08c.183.528.442 1.023.776 1.46.757.99 1.798 1.54 2.894 1.54s2.137-.55 2.894-1.54a.75.75 0 00-1.192-.91c-.512.67-1.135.95-1.702.95s-1.19-.28-1.702-.95a3.505 3.505 0 01-.343-.55h1.795a.75.75 0 000-1.5H8.026a4.835 4.835 0 010-1h2.224a.75.75 0 000-1.5H8.455c.098-.195.212-.38.343-.55z" clipRule="evenodd"/>
                </svg>
              </span>
              Budget & Group
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Budget Min */}
                <div>
                  <label htmlFor="budgetMin" className="block text-sm font-semibold mb-2" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
                    Budget (Min) $
                  </label>
                  <input
                    type="number"
                    id="budgetMin"
                    {...register('budgetMin')}
                    min="0"
                    step="50"
                    className="block w-full border-2 px-4 py-3 transition-all sm:text-sm focus:outline-none focus:ring-4"
                    style={{ borderRadius: '2px', borderColor: '#d4c7ad', backgroundColor: 'white' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2B5F5E';
                      e.target.style.boxShadow = '0 0 0 4px rgba(43, 95, 94, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d4c7ad';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="500"
                  />
                </div>

                {/* Budget Max */}
                <div>
                  <label htmlFor="budgetMax" className="block text-sm font-semibold mb-2" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
                    Budget (Max) $
                  </label>
                  <input
                    type="number"
                    id="budgetMax"
                    {...register('budgetMax')}
                    min="0"
                    step="50"
                    className="block w-full border-2 px-4 py-3 transition-all sm:text-sm focus:outline-none focus:ring-4"
                    style={{ borderRadius: '2px', borderColor: '#d4c7ad', backgroundColor: 'white' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2B5F5E';
                      e.target.style.boxShadow = '0 0 0 4px rgba(43, 95, 94, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d4c7ad';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="2000"
                  />
                </div>
              </div>

              {/* Group Size */}
              <div>
                <label htmlFor="requiredGroupSize" className="block text-sm font-semibold mb-2" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
                  Looking for how many travel companions? *
                </label>
                <input
                  type="number"
                  id="requiredGroupSize"
                  {...register('requiredGroupSize')}
                  min="1"
                  max="50"
                  className="block w-full border-2 px-4 py-3 transition-all sm:text-sm focus:outline-none focus:ring-4"
                  style={{ borderRadius: '2px', borderColor: '#d4c7ad', backgroundColor: 'white' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2B5F5E';
                    e.target.style.boxShadow = '0 0 0 4px rgba(43, 95, 94, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d4c7ad';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="4"
                />
                {errors.requiredGroupSize && (
                  <p className="mt-2 text-sm" style={{ color: '#C76D45' }}>{errors.requiredGroupSize.message}</p>
                )}
                <p className="mt-2 text-sm" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
                  Total number of people you'd like on this trip (including you)
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white p-10 border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center" style={{ color: '#33353B' }}>
              <span className="flex items-center justify-center w-10 h-10 rounded-full mr-3" style={{ backgroundColor: '#F5EFE3', color: '#DAAA63' }}>
                <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
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
                    className="h-5 w-5 focus:ring-4"
                    style={{ borderColor: 'rgba(51, 53, 59, 0.3)', accentColor: '#DAAA63' }}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="status-open" className="font-medium" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
                    Open
                  </label>
                  <p className="text-sm" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
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
                    className="h-5 w-5 focus:ring-4"
                    style={{ borderColor: 'rgba(51, 53, 59, 0.3)', accentColor: 'rgba(51, 53, 59, 0.6)' }}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="status-draft" className="font-medium" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
                    Draft
                  </label>
                  <p className="text-sm" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
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
                    className="h-5 w-5 focus:ring-4"
                    style={{ borderColor: 'rgba(51, 53, 59, 0.3)', accentColor: '#DAAA63' }}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="status-full" className="font-medium" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
                    full
                  </label>
                  <p className="text-sm" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
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
                    className="h-5 w-5 focus:ring-4"
                    style={{ borderColor: 'rgba(51, 53, 59, 0.3)', accentColor: '#C76D45' }}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="status-completed" className="font-medium" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
                    Completed
                  </label>
                  <p className="text-sm" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
                    Trip has finished
                  </p>
                </div>
              </div>
            </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-white p-10 border" style={{ borderRadius: '2px', borderColor: 'rgba(43, 95, 94, 0.15)' }}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 flex items-center" style={{ color: '#33353B' }}>
              <span className="flex items-center justify-center w-10 h-10 rounded-full mr-3" style={{ backgroundColor: '#EBDCC4', color: '#C76D45' }}>
                <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909.47.47a.75.75 0 11-1.06 1.06L6.53 8.091a.75.75 0 00-1.06 0l-2.97 2.97zM12 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd"/>
                </svg>
              </span>
              Mood Board Images
            </h2>
            <p className="text-sm" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>
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
              className="border-2 px-6 py-3 text-sm font-semibold focus:outline-none focus:ring-4 transition-opacity hover:opacity-80"
              style={{ borderRadius: '2px', borderColor: 'rgba(51, 53, 59, 0.3)', backgroundColor: 'white', color: 'rgba(51, 53, 59, 0.9)' }}
          >
              Cancel
          </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="border px-8 py-3 text-sm font-semibold focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
              style={{ borderRadius: '2px', backgroundColor: '#DAAA63', color: '#33353B', borderColor: 'rgba(43, 95, 94, 0.15)' }}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-r-transparent" style={{ borderColor: 'white', borderRightColor: 'transparent' }}></div>
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
