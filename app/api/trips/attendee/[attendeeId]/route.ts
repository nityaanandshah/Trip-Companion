import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get attendee info (used for notifications)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ attendeeId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { attendeeId } = await params;

    const attendee = await prisma.tripAttendee.findUnique({
      where: { id: attendeeId },
      select: {
        id: true,
        tripId: true,
        userId: true,
        status: true,
        user: {
          select: {
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        trip: {
          select: {
            title: true,
            ownerId: true,
          },
        },
      },
    });

    if (!attendee) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
    }

    // Only allow trip owner or the attendee themselves to see this
    if (attendee.trip.ownerId !== session.user.id && attendee.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(attendee);
  } catch (error) {
    console.error('Error fetching attendee:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendee' },
      { status: 500 }
    );
  }
}

