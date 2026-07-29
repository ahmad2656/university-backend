const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    const isPdf = ext === "pdf";
    return {
      folder: "university-portal/assignments",
      resource_type: isPdf ? "raw" : "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
    };
  },
});

const uploadAssignment = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = uploadAssignment;
