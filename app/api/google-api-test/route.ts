import { GoogleGenAI } from "@google/genai";
// If using CommonJS (require), you would use:
// const { GoogleGenAI } = require("@google/genai");

// The SDK automatically uses the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({});

async function listAllModels() {
  console.log("Fetching available models...");
  try {
    // The ai.models.list() method returns an asynchronous iterator.
    const models = await ai.models.list();

    console.log("Available models:");
    for await (const model of models) {
      console.log(`- ${model.name}`);
    }
  } catch (error) {
    console.error("An error occurred while fetching models:", error);
  }
}

listAllModels();
