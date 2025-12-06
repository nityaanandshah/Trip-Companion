import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/chat/[tripId]/mark-read - Mark chat as read
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tripId } = await params;
    const userId = session.user.id;

    // Upsert (create or update) the chat read record
    await prisma.chatRead.upsert({
      where: {
        tripId_userId: {
          tripId,
          userId,
        },
      },
      update: {
        lastReadAt: new Date(),
      },
      create: {
        tripId,
        userId,
        lastReadAt: new Date(),
      },
    });

    // Delete any unread chat message notifications for this trip
    // This ensures the notification list stays clean after reading messages
    await prisma.notification.deleteMany({
      where: {
        userId,
        type: 'new_chat_message',
        referenceId: tripId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking chat as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

