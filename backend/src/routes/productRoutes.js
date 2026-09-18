const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();
// public routes
router.get("/:id", getProductById);
router.get("/", getProducts);

// protected routes
// router.post("/", protect, createProduct);
router.post("/", protect, upload.single("image"), createProduct);
// router.put("/:id", protect, updateProduct);
router.put("/:id", protect, upload.single("image"), updateProduct);

router.delete("/:id", protect, deleteProduct);

module.exports = router;