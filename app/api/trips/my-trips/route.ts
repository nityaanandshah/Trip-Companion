import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/trips/my-trips - Get all user's trips (owned + attending)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filterType = searchParams.get('filter'); // 'organized', 'attending', or null (all)

    // Fetch trips organized by the user
    const ownedTrips = await prisma.trip.findMany({
      where: {
        ownerId: session.user.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        images: {
          orderBy: {
            orderIndex: 'asc',
          },
          take: 1,
        },
        _count: {
          select: {
            bookmarks: true,
            attendees: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Fetch trips where user is an attendee (any status)
    const attendingTripsData = await prisma.tripAttendee.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        trip: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            images: {
              orderBy: {
                orderIndex: 'asc',
              },
              take: 1,
            },
            _count: {
              select: {
                bookmarks: true,
                attendees: true,
              },
            },
          },
        },
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });

    // Transform attending trips to include attendee status
    const attendingTrips = attendingTripsData.map((attendee) => ({
      ...attendee.trip,
      attendeeStatus: attendee.status,
      attendeeId: attendee.id,
    }));

    // Add isOrganizer flag to owned trips
    const ownedTripsWithFlag = ownedTrips.map((trip) => ({
      ...trip,
      isOrganizer: true,
    }));

    // Add isOrganizer flag to attending trips
    const attendingTripsWithFlag = attendingTrips.map((trip) => ({
      ...trip,
      isOrganizer: false,
    }));

    // Apply filter
    let allTrips;
    if (filterType === 'organized') {
      allTrips = ownedTripsWithFlag;
    } else if (filterType === 'attending') {
      allTrips = attendingTripsWithFlag;
    } else {
      // Combine both and sort by most recent
      allTrips = [...ownedTripsWithFlag, ...attendingTripsWithFlag].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return NextResponse.json(allTrips);
  } catch (error) {
    console.error('Error fetching my trips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}
