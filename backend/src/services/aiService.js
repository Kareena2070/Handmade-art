const OpenAI = require("openai");

const hf = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

const buildPrompt = ({
  name,
  category,
  material,
  artStyle,
  keyDetails,
}) => {
  return `
You write product descriptions for a small handmade Indian art business.

Write a product description that is:

- warm and authentic
- simple and easy to understand
- suitable for an online product catalogue
- focused on the handmade nature and artistic details
- not overly promotional
- around 60 to 90 words

Do not invent facts that were not provided.
Do not mention discounts, shipping, stock, guarantees, or unsupported claims.

Product information:

Product name: ${name}
Category: ${category || "Not provided"}
Material: ${material || "Not provided"}
Art style: ${artStyle || "Not provided"}
Key details: ${keyDetails || "Not provided"}
`;
};

const generateWithGemma = async (prompt) => {
  const response = await hf.responses.create({
    model: "google/gemma-2-2b-it",
    input: prompt,
  });

  return response.output_text;
};

const generateWithGptOss = async (prompt) => {
  const response = await hf.responses.create({
    model: "openai/gpt-oss-120b:groq",
    input: prompt,
  });

  return response.output_text;
};

const generateWithKimi = async (prompt) => {
  const response = await hf.responses.create({
    model: "moonshotai/Kimi-K2-Instruct-0905:groq",
    input: prompt,
  });

  return response.output_text;
};

const generateProductDescription = async (productData) => {
  const prompt = buildPrompt(productData);

  const providers = [
    {
      name: "Gemma",
      generate: generateWithGemma,
    },
    {
      name: "GPT-OSS",
      generate: generateWithGptOss,
    },
    {
      name: "Kimi",
      generate: generateWithKimi,
    },
  ];

  for (const provider of providers) {
    try {
      console.log(
        `Trying Hugging Face model: ${provider.name}`
      );

      const description = await provider.generate(prompt);

      if (description && description.trim()) {
        console.log(
          `AI model succeeded: ${provider.name}`
        );

        return {
          description: description.trim(),
          provider: provider.name,
        };
      }

    } catch (error) {
      console.error(
        `${provider.name} failed:`,
        error.message
      );

      console.log(
        `Moving to next Hugging Face model...`
      );
    }
  }

  throw new Error(
    "All Hugging Face AI models failed"
  );
};

module.exports = {
  generateProductDescription,
};