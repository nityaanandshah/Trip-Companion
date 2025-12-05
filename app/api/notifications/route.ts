import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get all notifications for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // For join_request notifications, fetch attendee details
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        if (notification.type === 'join_request' && notification.referenceId) {
          try {
            const attendee = await prisma.tripAttendee.findUnique({
              where: { id: notification.referenceId },
              select: {
                tripId: true,
                userId: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            });
            
            if (attendee) {
              return {
                ...notification,
                tripId: attendee.tripId,
                userId: attendee.userId,
                userName: attendee.user.name,
              };
            }
          } catch (error) {
            console.error('Error fetching attendee for notification:', error);
          }
        }
        return notification;
      })
    );

    return NextResponse.json(enrichedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// PUT - Mark all notifications as read
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

