import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Toggle bookmark (add or remove)
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

    // Check if bookmark already exists
    const existingBookmark = await prisma.tripBookmark.findUnique({
      where: {
        tripId_userId: {
          tripId: tripId,
          userId: session.user.id,
        },
      },
    });

    if (existingBookmark) {
      // Remove bookmark
      await prisma.tripBookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      });

      return NextResponse.json({ bookmarked: false, message: 'Bookmark removed' });
    } else {
      // Add bookmark
      await prisma.tripBookmark.create({
        data: {
          userId: session.user.id,
          tripId: tripId,
        },
      });

      return NextResponse.json({ bookmarked: true, message: 'Trip bookmarked' });
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Check if trip is bookmarked by current user
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ bookmarked: false });
    }

    const { id: tripId } = await params;

    const bookmark = await prisma.tripBookmark.findUnique({
      where: {
        tripId_userId: {
          tripId: tripId,
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({ bookmarked: !!bookmark });
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return NextResponse.json({ bookmarked: false });
  }
}

