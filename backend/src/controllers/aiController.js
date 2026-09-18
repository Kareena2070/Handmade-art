const {
  generateProductDescription,
} = require("../services/aiService");

const generateDescription = async (req, res) => {
  try {
    const {
      name,
      category,
      material,
      artStyle,
      keyDetails,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const result = await generateProductDescription({
      name,
      category,
      material,
      artStyle,
      keyDetails,
    });

    return res.status(200).json({
      success: true,
      description: result.description,
      provider: result.provider,
    });

  } catch (error) {
    console.error(
      "AI description generation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "All Hugging Face AI models failed",
    });
  }
};

module.exports = {
  generateDescription,
};