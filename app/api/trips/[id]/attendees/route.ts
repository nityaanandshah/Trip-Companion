import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get all attendees for a trip (pending + approved)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;

    // Get all attendees
    const attendees = await prisma.tripAttendee.findMany({
      where: {
        tripId: tripId,
        status: {
          in: ['pending', 'approved'],
        },
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
      orderBy: {
        requestedAt: 'desc',
      },
    });

    // Separate pending and approved
    const pending = attendees.filter(a => a.status === 'pending');
    const approved = attendees.filter(a => a.status === 'approved');

    return NextResponse.json({
      pending,
      approved,
      total: attendees.length,
    });
  } catch (error) {
    console.error('Error fetching attendees:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

