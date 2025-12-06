import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/chat/unread-counts - Get unread message counts for all trips
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all trips where user is owner or approved attendee
    const ownedTrips = await prisma.trip.findMany({
      where: { ownerId: userId },
      select: { id: true, title: true },
    });

    const attendingTrips = await prisma.tripAttendee.findMany({
      where: {
        userId,
        status: 'approved',
      },
      include: {
        trip: {
          select: { id: true, title: true },
        },
      },
    });

    const allTripIds = [
      ...ownedTrips.map(t => t.id),
      ...attendingTrips.map(a => a.trip.id),
    ];

    const uniqueTripIds = [...new Set(allTripIds)];

    // Get last read timestamps for all trips
    const chatReads = await prisma.chatRead.findMany({
      where: {
        userId,
        tripId: { in: uniqueTripIds },
      },
    });

    const chatReadMap = new Map(
      chatReads.map(cr => [cr.tripId, cr.lastReadAt])
    );

    // Count unread messages for each trip
    const unreadCounts = await Promise.all(
      uniqueTripIds.map(async (tripId) => {
        const lastReadAt = chatReadMap.get(tripId);

        const unreadCount = await prisma.chatMessage.count({
          where: {
            tripId,
            userId: { not: userId }, // Don't count own messages
            createdAt: {
              gt: lastReadAt || new Date(0), // Messages after last read, or all if never read
            },
          },
        });

        // Get trip details
        const trip =
          ownedTrips.find(t => t.id === tripId) ||
          attendingTrips.find(a => a.trip.id === tripId)?.trip;

        return {
          tripId,
          tripTitle: trip?.title || 'Unknown Trip',
          unreadCount,
        };
      })
    );

    // Filter to only trips with unread messages
    const tripsWithUnread = unreadCounts.filter(t => t.unreadCount > 0);

    return NextResponse.json({
      unreadCounts,
      totalUnread: tripsWithUnread.reduce((sum, t) => sum + t.unreadCount, 0),
      tripsWithUnread: tripsWithUnread.length,
    });
  } catch (error) {
    console.error('Error getting unread counts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

