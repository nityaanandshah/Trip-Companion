import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const tripSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string(),
  endDate: z.string(),
  isTentative: z.boolean().optional().default(false),
  budgetMin: z.number().min(0).optional().nullable(),
  budgetMax: z.number().min(0).optional().nullable(),
  requiredGroupSize: z.number().min(1).max(50),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  status: z.enum(['draft', 'open']).default('open'),
});

// POST - Create new trip
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate input
    const validation = tripSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Validate dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    if (endDate < startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Validate budget
    if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
      return NextResponse.json(
        { error: 'Maximum budget must be greater than minimum budget' },
        { status: 400 }
      );
    }

    // Create trip
    const trip = await prisma.trip.create({
      data: {
        ownerId: session.user.id,
        title: data.title,
        destination: data.destination,
        startDate,
        endDate,
        isTentative: data.isTentative,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        requiredGroupSize: data.requiredGroupSize,
        currentGroupSize: 1, // Owner is first member
        description: data.description || '',
        status: data.status,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get all trips (with filters)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const destination = searchParams.get('destination');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const budgetMin = searchParams.get('budgetMin');
    const budgetMax = searchParams.get('budgetMax');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'open';

    // Build where clause
    const where: any = {
      status: status,
    };

    if (destination) {
      where.destination = {
        contains: destination,
        mode: 'insensitive',
      };
    }

    if (startDate) {
      where.startDate = {
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      where.endDate = {
        lte: new Date(endDate),
      };
    }

    if (budgetMin) {
      where.budgetMin = {
        gte: parseInt(budgetMin),
      };
    }

    if (budgetMax) {
      where.budgetMax = {
        lte: parseInt(budgetMax),
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { destination: { contains: search, mode: 'insensitive' } },
      ];
    }

    const trips = await prisma.trip.findMany({
      where,
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
          take: 1, // Just get the first image for listing
        },
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit for now
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

