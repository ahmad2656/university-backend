const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path");

const RAW_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
];

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isRaw = RAW_EXTENSIONS.includes(ext);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, "_");

    return {
      folder: "university-portal/assignments",
      resource_type: isRaw ? "raw" : "image",
      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp",
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
      ],
      public_id: `${Date.now()}-${safeName}${isRaw ? ext : ""}`,
    };
  },
});

const uploadAssignment = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = uploadAssignment;
