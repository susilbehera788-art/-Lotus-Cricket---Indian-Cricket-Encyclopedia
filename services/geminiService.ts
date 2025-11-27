
import { GoogleGenAI } from "@google/genai";

// Initialize AI client directly with process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiContent = async (prompt: string, useSearch: boolean = false): Promise<string> => {
  try {
    // Model selection based on guidelines: gemini-2.5-flash for basic text/search
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: useSearch ? { tools: [{ googleSearch: {} }] } : undefined
    });

    let text = response.text || "No content generated.";
    
    // Extract grounding chunks if search was used
    if (useSearch && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const chunks = response.candidates[0].groundingMetadata.groundingChunks;
        const links: string[] = [];
        chunks.forEach((chunk: any) => {
             if (chunk.web?.uri && chunk.web?.title) {
                 links.push(`[${chunk.web.title}](${chunk.web.uri})`);
             }
        });

        if (links.length > 0) {
            text += "\n\n**Sources:**\n" + links.map(l => `- ${l}`).join("\n");
        }
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to fetch content at this moment. Please try again later.";
  }
};

export const parseMarkdown = (text: string) => {
  // Simple clean up for display since we don't have a markdown library
  return text.split('\n').filter(line => line.trim() !== '');
};
