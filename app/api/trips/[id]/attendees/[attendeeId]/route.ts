import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT - Approve or reject a join request
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; attendeeId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: tripId, attendeeId } = await params;
    const body = await request.json();
    const { action } = body; // 'approve' or 'reject'

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Check if trip exists and user is owner
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    if (trip.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Only the trip owner can manage requests' }, { status: 403 });
    }

    // Check if attendee exists and is pending
    const attendee = await prisma.tripAttendee.findUnique({
      where: { id: attendeeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!attendee) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (attendee.tripId !== tripId) {
      return NextResponse.json({ error: 'Request does not belong to this trip' }, { status: 400 });
    }

    if (attendee.status !== 'pending') {
      return NextResponse.json({ error: 'Request has already been processed' }, { status: 400 });
    }

    // Check if trip has available spots (for approval)
    if (action === 'approve' && trip.currentGroupSize >= trip.requiredGroupSize) {
      return NextResponse.json({ error: 'Trip is already full' }, { status: 400 });
    }

    // Update attendee status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    // Use transaction to update both attendee and trip
    const result = await prisma.$transaction(async (tx) => {
      // Update attendee
      const updatedAttendee = await tx.tripAttendee.update({
        where: { id: attendeeId },
        data: {
          status: newStatus,
          respondedAt: new Date(),
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

      // If approved, increment current group size
      if (action === 'approve') {
        const newGroupSize = trip.currentGroupSize + 1;
        const newStatus = newGroupSize >= trip.requiredGroupSize ? 'full' : trip.status;

        await tx.trip.update({
          where: { id: tripId },
          data: {
            currentGroupSize: newGroupSize,
            status: newStatus,
          },
        });
      }

      return updatedAttendee;
    });

    // Create notification for requester
    if (action === 'approve') {
      await prisma.notification.create({
        data: {
          userId: attendee.user.id,
          type: 'request_approved',
          referenceId: tripId,
          message: `Your request to join "${trip.title}" has been approved! 🎉`,
          read: false,
        },
      });

      // Check if trip is now full and notify owner
      if (trip.currentGroupSize + 1 >= trip.requiredGroupSize) {
        await prisma.notification.create({
          data: {
            userId: trip.ownerId,
            type: 'trip_full',
            referenceId: tripId,
            message: `Your trip "${trip.title}" is now full! Consider closing it.`,
            read: false,
          },
        });
      }
    } else {
      await prisma.notification.create({
        data: {
          userId: attendee.user.id,
          type: 'request_rejected',
          referenceId: tripId,
          message: `Your request to join "${trip.title}" was not approved.`,
          read: false,
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating join request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Cancel join request or remove attendee
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; attendeeId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: tripId, attendeeId } = await params;

    // Check attendee exists
    const attendee = await prisma.tripAttendee.findUnique({
      where: { id: attendeeId },
    });

    if (!attendee) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Check if trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // User can delete their own request, or trip owner can remove anyone
    const isOwner = trip.ownerId === session.user.id;
    const isOwnRequest = attendee.userId === session.user.id;

    if (!isOwner && !isOwnRequest) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Use transaction to delete attendee and update trip if needed
    await prisma.$transaction(async (tx) => {
      // Delete attendee
      await tx.tripAttendee.delete({
        where: { id: attendeeId },
      });

      // If attendee was approved, decrement group size
      if (attendee.status === 'approved') {
        const newGroupSize = Math.max(1, trip.currentGroupSize - 1);
        
        await tx.trip.update({
          where: { id: tripId },
          data: {
            currentGroupSize: newGroupSize,
            status: newGroupSize < trip.requiredGroupSize ? 'open' : trip.status,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting attendee:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

