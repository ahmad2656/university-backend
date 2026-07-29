const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    const isPdf = ext === "pdf";
    const nameWithoutExt = path.basename(
      file.originalname,
      path.extname(file.originalname),
    );

    return {
      folder: "university-portal/assignments",
      resource_type: isPdf ? "raw" : "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
      public_id: `${Date.now()}-${nameWithoutExt}`,
      format: isPdf ? "pdf" : undefined,
    };
  },
});

const uploadAssignment = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = uploadAssignment;
