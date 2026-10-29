import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { getAuthAdmin } from '@/lib/auth';

export async function POST(request) {
  try {
    // Protected: verify admin
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin login required to upload images' },
        { status: 401 }
      );
    }

    const contentType = request.headers.get('content-type') || '';

    let fileToUpload = null;

    if (contentType.includes('application/json')) {
      const body = await request.json();
      fileToUpload = body.image || body.data;
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') || formData.get('image');
      if (file && typeof file === 'object') {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        fileToUpload = `data:${file.type};base64,${buffer.toString('base64')}`;
      }
    }

    if (!fileToUpload) {
      return NextResponse.json(
        { success: false, error: 'No image file provided for upload' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary using user's configured Cloudinary credentials
    const result = await uploadToCloudinary(fileToUpload, 'meraindia_events');

    return NextResponse.json({
      success: true,
      url: result.url,
      public_id: result.public_id,
      message: 'Image uploaded successfully to Cloudinary',
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
