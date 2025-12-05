import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import TripSidebar from '@/components/TripSidebar';
import TripStatusBadges from '@/components/TripStatusBadges';
import TripActions from '@/components/TripActions';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      images: {
        orderBy: {
          orderIndex: 'asc',
        },
      },
    },
  });

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Trip Not Found</h1>
          <p className="mt-4 text-gray-600">The trip you're looking for doesn't exist.</p>
          <Link
            href="/trips"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
          >
            Browse Trips
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = trip.ownerId === session.user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with Status Badge */}
        <div className="mb-6">
          <Link
            href="/trips/my-trips"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Trips
          </Link>
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{trip.title}</h1>
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  trip.status === 'open' ? 'bg-green-100 text-green-800' :
                  trip.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  trip.status === 'full' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </span>
                {trip.isTentative && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    Dates Tentative
                  </span>
                )}
                <TripStatusBadges tripId={trip.id} isOwner={isOwner} />
              </div>
            </div>
            <TripActions
              tripId={trip.id}
              tripStatus={trip.status}
              isOwner={isOwner}
              currentGroupSize={trip.currentGroupSize}
              requiredGroupSize={trip.requiredGroupSize}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Details Card */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Details</h2>
              
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Destination</dt>
                  <dd className="mt-2 text-lg font-medium text-gray-900 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {trip.destination}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Duration</dt>
                  <dd className="mt-2 text-lg font-medium text-gray-900">
                    {format(new Date(trip.startDate), 'MMM d, yyyy')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                  </dd>
                </div>

                {(trip.budgetMin || trip.budgetMax) && (
                  <div>
                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Budget</dt>
                    <dd className="mt-2 text-lg font-medium text-gray-900 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ${trip.budgetMin || '?'} - ${trip.budgetMax || '?'}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Group Size</dt>
                  <dd className="mt-2 text-lg font-medium text-gray-900 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {trip.currentGroupSize} / {trip.requiredGroupSize} people
                  </dd>
                </div>
              </dl>
            </div>

            {/* Description */}
            {trip.description && (
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Trip</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{trip.description}</p>
              </div>
            )}

            {/* Image Gallery */}
            {trip.images.length > 0 ? (
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Mood Board</h2>
                
                {/* Main Image */}
                <div className="mb-4 aspect-video overflow-hidden rounded-xl">
                  <img
                    src={trip.images[0].imageUrl}
                    alt={trip.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Thumbnail Grid */}
                {trip.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {trip.images.slice(1, 5).map((image: any, index: number) => (
                      <div key={image.id} className="aspect-video overflow-hidden rounded-lg">
                        <img
                          src={image.imageUrl}
                          alt={`${trip.title} ${index + 2}`}
                          className="h-full w-full object-cover hover:scale-110 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-12 text-center shadow-lg">
                <div className="mx-auto w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4">
                  <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No images yet</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {isOwner ? 'Click "Edit Trip" to add mood board images!' : 'The organizer hasn\'t added images yet'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TripSidebar trip={trip} isOwner={isOwner} />
          </div>
        </div>
      </div>
    </div>
  );
}

