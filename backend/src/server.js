const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/upload", uploadRoutes);

// Always return JSON to the frontend, including errors thrown by Multer before
// a route controller can handle them.
app.use((error, req, res, next) => {
  if (error) {
    console.error("Request error:", error);

    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5 MB or smaller"
        : error.message || "Unable to process the request";

    return res.status(400).json({
      success: false,
      message,
    });
  }

  next();
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Handmade Art API is running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
