import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiContent = async (prompt: string, useSearch: boolean = false): Promise<string> => {
  try {
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