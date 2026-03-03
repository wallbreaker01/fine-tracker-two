const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const isCloudinaryConfigured =
  typeof cloudinaryCloudName === "string" &&
  cloudinaryCloudName.length > 0 &&
  typeof cloudinaryUploadPreset === "string" &&
  cloudinaryUploadPreset.length > 0;

export const cloudinaryConfig = {
  cloudName: cloudinaryCloudName ?? "",
  uploadPreset: cloudinaryUploadPreset ?? "",
};
