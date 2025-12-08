'use client';

import { useState } from 'react';

interface UploadedImage {
  id?: string;
  url: string;
  file?: File;
  uploading?: boolean;
}

interface ImageUploaderProps {
  tripId?: string;
  maxImages?: number;
  onImagesChange?: (images: UploadedImage[]) => void;
  existingImages?: UploadedImage[];
}

export default function ImageUploader({ 
  tripId, 
  maxImages = 5, 
  onImagesChange,
  existingImages = [] 
}: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    setError('');

    // Check max images
    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Validate files
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Images must be less than 10MB');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // If tripId exists, upload immediately
    if (tripId) {
      await uploadImages(validFiles);
    } else {
      // Just preview for now (will upload when trip is created)
      const newImages: UploadedImage[] = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange?.(updatedImages);
    }
  };

  const uploadImages = async (files: File[]) => {
    setUploading(true);
    const uploadedImages: UploadedImage[] = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('orderIndex', String(images.length + uploadedImages.length));

        const response = await fetch(`/api/trips/${tripId}/upload-images`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedImages.push({
            id: data.id,
            url: data.imageUrl,
          });
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to upload image');
        }
      } catch (err) {
        console.error('Upload error:', err);
        setError('Failed to upload image');
      }
    }

    const updatedImages = [...images, ...uploadedImages];
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
    setUploading(false);
  };

  const removeImage = async (index: number) => {
    const image = images[index];

    // If image is already uploaded to server, delete it
    if (tripId && image.id) {
      try {
        await fetch(`/api/trips/${tripId}/upload-images?imageId=${image.id}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Delete error:', err);
        setError('Failed to delete image');
        return;
      }
    }

    // Remove from local state
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative"
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            className="sr-only"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-12 transition-all hover:opacity-90"
            style={{ borderRadius: '2px', borderColor: 'rgba(51, 53, 59, 0.3)', backgroundColor: '#F5EFE3' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#DAAA63'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(51, 53, 59, 0.3)'}
          >
            <svg
              className="h-12 w-12"
              style={{ color: 'rgba(51, 53, 59, 0.4)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-4 text-sm font-semibold" style={{ color: 'rgba(51, 53, 59, 0.9)' }}>
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="mt-2 text-xs" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
              PNG, JPG, GIF up to 10MB ({images.length}/{maxImages} images)
            </p>
          </label>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="border-2 p-4" style={{ borderRadius: '2px', backgroundColor: 'rgba(199, 109, 69, 0.1)', borderColor: '#C76D45' }}>
          <p className="text-sm font-medium" style={{ color: '#C76D45' }}>{error}</p>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-video overflow-hidden border-2"
              style={{ borderRadius: '2px', borderColor: '#d4c7ad', backgroundColor: 'rgba(51, 53, 59, 0.1)' }}
            >
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              {image.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent" style={{ borderColor: 'white', borderRightColor: 'transparent' }}></div>
                </div>
              )}
              <button
                onClick={() => removeImage(index)}
                disabled={uploading}
                className="absolute top-2 right-2 rounded-full p-2 text-white opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100 disabled:opacity-50"
                style={{ backgroundColor: '#C76D45' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => {
                  if (!uploading) e.currentTarget.style.opacity = '0';
                }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="absolute bottom-2 left-2 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                Image {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
