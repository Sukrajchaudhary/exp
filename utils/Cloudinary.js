const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

exports.uploadOnCloudinary = async (LocalFilePath) => {
  try {
    if (!LocalFilePath) return null;
    const response = cloudinary.uploader.upload(LocalFilePath, {
      resource_type: "auto",
    });
    return response;
  } catch (error) {
    fs.unlinkSync(LocalFilePath);
    return null;
  }
};
