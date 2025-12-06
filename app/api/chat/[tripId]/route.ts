import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/chat/[tripId] - Get chat history
export async function GET(
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

    // Verify user has access to this trip's chat
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        attendees: {
          where: {
            userId: userId,
            status: 'approved',
          },
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const isOwner = trip.ownerId === userId;
    const isApprovedAttendee = trip.attendees.length > 0;

    if (!isOwner && !isApprovedAttendee) {
      return NextResponse.json(
        { error: 'Access denied. You must be approved to view this chat.' },
        { status: 403 }
      );
    }

    // Get chat messages with pagination
    const limit = 50; // Last 50 messages
    const messages = await prisma.chatMessage.findMany({
      where: { tripId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Reverse to get chronological order (oldest first)
    const orderedMessages = messages.reverse();

    return NextResponse.json(orderedMessages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/chat/[tripId] - Send message (HTTP fallback)
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
    const { content } = await request.json();

    // Validate content
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Message too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    // Verify user has access to this trip's chat
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        attendees: {
          where: {
            userId: userId,
            status: 'approved',
          },
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const isOwner = trip.ownerId === userId;
    const isApprovedAttendee = trip.attendees.length > 0;

    if (!isOwner && !isApprovedAttendee) {
      return NextResponse.json(
        { error: 'Access denied. You must be approved to chat.' },
        { status: 403 }
      );
    }

    // Create message
    const message = await prisma.chatMessage.create({
      data: {
        tripId,
        userId,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


