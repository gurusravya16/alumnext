import { Router } from "express";
import multer from "multer";
import cloudinary from "../../utils/cloudinary.js";
import authenticateJWT from "../../middleware/auth.js";
import AppError from "../../utils/AppError.js";

const router = Router();

// Use memory storage — no temp files left on disk (stateless, Render-safe)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Only JPEG, PNG, WebP, and GIF images are allowed", 400));
    }
  },
});

// POST /api/upload — authenticated users upload a single image
router.post("/", authenticateJWT, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("No image file provided", 400);
    }

    if (!process.env.CLOUDINARY_URL) {
      throw new AppError("Image upload service is not configured", 503);
    }

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "alumnext",
          resource_type: "image",
          transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.status(200).json({
      success: true,
      data: { url: result.secure_url },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
