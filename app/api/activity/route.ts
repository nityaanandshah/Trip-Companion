import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/activity - Get user's recent activity
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get recent trips created by user
    const recentTrips = await prisma.trip.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        destination: true,
        createdAt: true,
      },
    });

    // Get recent bookmarks
    const recentBookmarks = await prisma.tripBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        trip: {
          select: {
            id: true,
            title: true,
            destination: true,
          },
        },
      },
    });

    // Get recent approved join requests (trips user joined)
    const recentJoined = await prisma.tripAttendee.findMany({
      where: {
        userId,
        status: 'approved',
      },
      orderBy: { respondedAt: 'desc' },
      take: 5,
      include: {
        trip: {
          select: {
            id: true,
            title: true,
            destination: true,
          },
        },
      },
    });

    // Get recent join requests on user's trips
    const recentRequests = await prisma.tripAttendee.findMany({
      where: {
        trip: {
          ownerId: userId,
        },
        status: 'pending',
      },
      orderBy: { requestedAt: 'desc' },
      take: 5,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        trip: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Combine all activities and sort by date
    const activities = [
      ...recentTrips.map((trip) => ({
        type: 'trip_created',
        date: trip.createdAt,
        tripId: trip.id,
        tripTitle: trip.title,
        tripDestination: trip.destination,
      })),
      ...recentBookmarks.map((bookmark) => ({
        type: 'bookmarked',
        date: bookmark.createdAt,
        tripId: bookmark.trip.id,
        tripTitle: bookmark.trip.title,
        tripDestination: bookmark.trip.destination,
      })),
      ...recentJoined
        .filter((attendee) => attendee.respondedAt !== null)
        .map((attendee) => ({
          type: 'joined_trip',
          date: attendee.respondedAt!,
          tripId: attendee.trip.id,
          tripTitle: attendee.trip.title,
          tripDestination: attendee.trip.destination,
        })),
      ...recentRequests.map((request) => ({
        type: 'join_request_received',
        date: request.requestedAt,
        tripId: request.trip.id,
        tripTitle: request.trip.title,
        userName: request.user.name,
        userId: request.user.id,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10); // Take most recent 10 activities

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}

