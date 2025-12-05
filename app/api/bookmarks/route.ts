import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get all bookmarked trips for current user
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all bookmarks with trip details
    const bookmarks = await prisma.tripBookmark.findMany({
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
              take: 1, // Just get the first image for card display
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
        createdAt: 'desc', // Most recently bookmarked first
      },
    });

    // Extract just the trips from bookmarks
    const trips = bookmarks.map(bookmark => bookmark.trip);

    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

