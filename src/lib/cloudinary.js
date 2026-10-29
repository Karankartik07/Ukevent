import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'o31b8mid',
  api_key: process.env.CLOUDINARY_API_KEY || '265763766552385',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'spandgbeXSySclw0HNPxRdHlrSs',
  secure: true,
});

/**
 * Upload an image (base64 string or file buffer) to Cloudinary
 * @param {string} fileStr Base64 data URI or image URL
 * @param {string} folder Destination folder on Cloudinary
 * @returns {Promise<{url: string, public_id: string}>}
 */
export async function uploadToCloudinary(fileStr, folder = 'meraindia_events') {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, crop: 'limit' }
      ]
    });

    return {
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error.message || 'Failed to upload image to Cloudinary');
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId
 */
export async function deleteFromCloudinary(publicId) {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
}

export default cloudinary;
