import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Request to join a trip
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: tripId } = await params;

    // Check if trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Check if user is the owner
    if (trip.ownerId === session.user.id) {
      return NextResponse.json({ error: 'You cannot request to join your own trip' }, { status: 400 });
    }

    // Check if trip is open
    if (trip.status !== 'open') {
      return NextResponse.json({ error: 'This trip is not accepting requests' }, { status: 400 });
    }

    // Check if trip has available spots
    if (trip.currentGroupSize >= trip.requiredGroupSize) {
      return NextResponse.json({ error: 'This trip is full' }, { status: 400 });
    }

    // Check if user already has a request/attendance
    const existingAttendee = await prisma.tripAttendee.findUnique({
      where: {
        tripId_userId: {
          tripId: tripId,
          userId: session.user.id,
        },
      },
    });

    if (existingAttendee) {
      if (existingAttendee.status === 'pending') {
        return NextResponse.json({ error: 'You already have a pending request' }, { status: 400 });
      } else if (existingAttendee.status === 'approved') {
        return NextResponse.json({ error: 'You are already a member of this trip' }, { status: 400 });
      } else if (existingAttendee.status === 'rejected') {
        // Allow re-requesting if previously rejected
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { name: true },
        });

        const updatedAttendee = await prisma.tripAttendee.update({
          where: { id: existingAttendee.id },
          data: {
            status: 'pending',
            requestedAt: new Date(),
            respondedAt: null,
          },
        });

        // Create notification for trip owner
        await prisma.notification.create({
          data: {
            userId: trip.ownerId,
            type: 'join_request',
            referenceId: updatedAttendee.id,
            message: `${user?.name || 'Someone'} requested to join your trip "${trip.title}"`,
            read: false,
          },
        });

        return NextResponse.json(updatedAttendee);
      }
    }

    // Get user info for notification
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });

    // Create join request
    const attendee = await prisma.tripAttendee.create({
      data: {
        tripId: tripId,
        userId: session.user.id,
        status: 'pending',
        role: 'attendee',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Create notification for trip owner
    await prisma.notification.create({
      data: {
        userId: trip.ownerId,
        type: 'join_request',
        referenceId: attendee.id, // Store attendee ID so owner can approve/reject
        message: `${user?.name || 'Someone'} requested to join your trip "${trip.title}"`,
        read: false,
      },
    });

    return NextResponse.json(attendee, { status: 201 });
  } catch (error) {
    console.error('Error creating join request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Get current user's join request status for a trip
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ status: null });
    }

    const { id: tripId } = await params;

    const attendee = await prisma.tripAttendee.findUnique({
      where: {
        tripId_userId: {
          tripId: tripId,
          userId: session.user.id,
        },
      },
    });

    if (!attendee) {
      return NextResponse.json({ status: null });
    }

    return NextResponse.json({ 
      status: attendee.status,
      requestedAt: attendee.requestedAt,
      respondedAt: attendee.respondedAt,
    });
  } catch (error) {
    console.error('Error fetching join request status:', error);
    return NextResponse.json({ status: null });
  }
}

