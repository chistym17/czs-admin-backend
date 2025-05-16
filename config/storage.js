const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fixtures",
    allowed_formats: ["jpg", "jpeg"],
  },
});

module.exports = storage;
