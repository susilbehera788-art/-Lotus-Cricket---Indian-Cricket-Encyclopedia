import { GoogleGenAI } from "@google/genai";

// Safely access API key to prevent crashes in environments where process is undefined
// This handles cases where vite/webpack might not replace process.env correctly in some configs
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error if process is not defined
  }
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const getGeminiContent = async (prompt: string, useSearch: boolean = false): Promise<string> => {
  try {
    if (!apiKey) {
      console.warn("API Key is missing. AI features will not work.");
      return "AI content unavailable. Please configure API Key.";
    }

    const config: any = {
      model: useSearch ? 'gemini-2.5-flash' : 'gemini-2.5-flash',
    };

    if (useSearch) {
      config.config = {
        tools: [{ googleSearch: {} }]
      };
    }

    const response = await ai.models.generateContent({
      model: config.model,
      contents: prompt,
      config: config.config
    });

    return response.text || "No content generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to fetch content at this moment. Please try again later.";
  }
};

export const parseMarkdown = (text: string) => {
  // Simple clean up for display since we don't have a markdown library
  return text.split('\n').filter(line => line.trim() !== '');
};