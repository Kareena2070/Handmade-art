const express = require("express");

const {
  generateDescription,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/generate-description",
  protect,
  generateDescription
);

module.exports = router;