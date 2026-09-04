const multer = require("multer");
const fs = require("fs");
// Store files temporarily on local disk before uploading to Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/"); // temp folder — create this folder in your project root
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // limit file size to 5MB

module.exports = upload;