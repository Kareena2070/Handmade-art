const express = require("express");

const {
  uploadProductImage,
} = require("../controllers/uploadController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/product-image",
  protect,
  upload.single("image"),
  uploadProductImage
);

module.exports = router;