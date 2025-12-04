import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get current user's trips
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {
      ownerId: session.user.id,
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    const trips = await prisma.trip.findMany({
      where,
      include: {
        images: {
          orderBy: {
            orderIndex: 'asc',
          },
          take: 1, // Just get the first image for preview
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

    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching user trips:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

