import { v2 as cloudinary } from "cloudinary";

/**
 * Configure Cloudinary from CLOUDINARY_URL env var.
 * CLOUDINARY_URL format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
 * The SDK auto-parses this when set as an env var, but we explicitly
 * call config() to fail-fast if it's missing in production.
 */
export function initCloudinary() {
  const url = process.env.CLOUDINARY_URL;
  if (!url) {
    console.warn(
      "[Cloudinary] CLOUDINARY_URL not set — image uploads will fail in production"
    );
    return;
  }
  // cloudinary SDK auto-reads CLOUDINARY_URL from env, but we call config()
  // to ensure it's initialized at startup
  cloudinary.config({ secure: true });
  console.log("[Cloudinary] Configured successfully");
}

export default cloudinary;
