const fs = require("fs");

const { uploadImage } = require("../services/cloudinaryService");

const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const result = await uploadImage(req.file.path);

    // Delete temporary local file after successful upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      image: result,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    // Try to remove temporary file if it exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

module.exports = {
  uploadProductImage,
};