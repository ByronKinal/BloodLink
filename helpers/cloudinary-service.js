import { v2 as cloudinary } from 'cloudinary';
import { config } from '../configs/config.js';
import fs from 'fs/promises';

if (process.env.ALLOW_INSECURE_TLS === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const uploadImage = async (filePath, fileName) => {
  try {
    const options = {
      public_id: fileName,
      folder: config.cloudinary.folder,
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    };

    const result = await cloudinary.uploader.upload(filePath, options);

    try {
      await fs.unlink(filePath);
    } catch {
      console.warn('Warning: Could not delete local file:', filePath);
    }

    if (result?.error) {
      throw new Error(`Error uploading image: ${result.error.message}`);
    }

    // Store final delivery URL to avoid mismatches in URL reconstruction.
    return result.secure_url || result.url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error?.message || error);

    try {
      await fs.unlink(filePath);
    } catch {
      console.warn('Warning: Could not delete local file after upload error');
    }

    throw new Error(
      `Failed to upload image to Cloudinary: ${error?.message || ''}`
    );
  }
};

export const deleteImage = async (imagePath) => {
  try {
    if (!imagePath || imagePath === config.cloudinary.defaultAvatarPath) {
      return true;
    }

    let publicId;

    if (typeof imagePath === 'string' && /^https?:\/\//i.test(imagePath)) {
      const url = new URL(imagePath);
      const uploadMarker = '/image/upload/';
      const uploadIndex = url.pathname.indexOf(uploadMarker);

      if (uploadIndex >= 0) {
        publicId = url.pathname
          .slice(uploadIndex + uploadMarker.length)
          .replace(/^v\d+\//, '')
          .replace(/^\/+/, '');
      }
    }

    if (!publicId) {
      const folder = config.cloudinary.folder;
      publicId = imagePath.includes('/') ? imagePath : `${folder}/${imagePath}`;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

export const getFullImageUrl = (imagePath) => {
  if (!imagePath) {
    return getDefaultAvatarUrl();
  }

  if (typeof imagePath === 'string' && /^https?:\/\//i.test(imagePath)) {
    try {
      const url = new URL(imagePath);

      if (url.hostname.includes('res.cloudinary.com')) {
        const uploadMarker = '/image/upload/';
        const uploadIndex = url.pathname.indexOf(uploadMarker);

        if (uploadIndex >= 0) {
          let tail = url.pathname.slice(uploadIndex + uploadMarker.length);

          // Remove optional version segment like v1741623000/ if present.
          tail = tail.replace(/^v\d+\//, '');

          const publicId = decodeURIComponent(tail).replace(/^\/+/, '');

          if (publicId) {
            return cloudinary.url(publicId, {
              secure: true,
              resource_type: 'image',
              type: 'upload',
            });
          }
        }
      }

      return imagePath;
    } catch {
      return imagePath;
    }
  }

  const folder = config.cloudinary.folder;
  const publicId = imagePath.includes('/')
    ? imagePath
    : `${folder}/${imagePath}`;

  return cloudinary.url(publicId, {
    secure: true,
    resource_type: 'image',
    type: 'upload',
  });
};

export const getDefaultAvatarUrl = () => {
  const defaultPath = getDefaultAvatarPath();
  return getFullImageUrl(defaultPath);
};

export const getDefaultAvatarPath = () => {
  const defaultPath = config.cloudinary.defaultAvatarPath;

  if (defaultPath && defaultPath.includes('${')) {
    const folder = process.env.CLOUDINARY_FOLDER;
    const filename = process.env.CLOUDINARY_DEFAULT_AVATAR_FILENAME;
    if (folder || filename) {
      return [folder, filename].filter(Boolean).join('/');
    }
  }

  return defaultPath;
};

export default {
  uploadImage,
  deleteImage,
  getFullImageUrl,
  getDefaultAvatarUrl,
  getDefaultAvatarPath,
};
