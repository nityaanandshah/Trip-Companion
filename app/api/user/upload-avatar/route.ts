import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// For now, we'll use a placeholder implementation
// This will be replaced with actual Cloudinary integration
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // TODO: Integrate with Cloudinary
    // For now, return a placeholder URL
    // In production, this would upload to Cloudinary and return the URL
    
    // Check if CLOUDINARY environment variables are set
    const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
    const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret) {
      // Cloudinary is configured, upload the file
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: cloudinaryCloudName,
          api_key: cloudinaryApiKey,
          api_secret: cloudinaryApiSecret,
        });

        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: 'trip-companion/avatars',
                public_id: `user-${session.user.id}-${Date.now()}`,
                transformation: [
                  { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                  { quality: 'auto' },
                ],
              },
              (error: any, result: any) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(buffer);
        });

        const avatarUrl = (uploadResponse as any).secure_url;

        // Update user's avatar in database
        await prisma.user.update({
          where: { id: session.user.id },
          data: { avatarUrl },
        });

        return NextResponse.json({ avatarUrl });
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json(
          { error: 'Failed to upload to Cloudinary' },
          { status: 500 }
        );
      }
    } else {
      // Cloudinary not configured, return placeholder
      // In a real app, you would either require Cloudinary or use another storage solution
      return NextResponse.json(
        {
          error: 'Image upload not configured. Please set up Cloudinary environment variables.',
          hint: 'Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file',
        },
        { status: 501 }
      );
    }
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

