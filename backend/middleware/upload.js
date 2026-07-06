import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  }
});

// File filter to accept all image types (JPEG, JPG, PNG, GIF, WebP, BMP, TIFF, SVG, etc.)
const fileFilter = (req, file, cb) => {
  // Get file extension
  const ext = path.extname(file.originalname).toLowerCase();
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.tif', '.svg', '.ico', '.heic', '.heif'];
  
  // Accept if MIME type is image/* OR extension is an image extension
  if (file.mimetype.startsWith('image/') || imageExtensions.includes(ext)) {
    console.log(`Accepting file: ${file.originalname}, MIME: ${file.mimetype}, Extension: ${ext}`);
    cb(null, true);
  } else {
    // Reject non-image files
    console.log(`Rejecting file: ${file.originalname}, MIME: ${file.mimetype}, Extension: ${ext}`);
    cb(new Error(`Only image files are allowed! Received: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter: fileFilter,
  // No file size limit - users can upload images of any size
});

// Middleware that allows optional file uploads
export const optionalUpload = upload.array("images", 10);

export default upload;
