import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users/[userId] - Get public user profile
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        age: true,
        email: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        tripsOwned: {
          select: {
            id: true,
            title: true,
            destination: true,
            startDate: true,
            endDate: true,
            status: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        tripAttendees: {
          where: {
            status: 'approved',
          },
          select: {
            trip: {
              select: {
                id: true,
                title: true,
                destination: true,
                startDate: true,
                endDate: true,
                status: true,
              },
            },
          },
          orderBy: {
            approvedAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Format the response
    const profile = {
      id: user.id,
      name: user.name,
      age: user.age,
      email: user.email,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      memberSince: user.createdAt,
      tripsOrganized: user.tripsOwned,
      tripsAttended: user.tripAttendees.map(attendee => attendee.trip),
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

