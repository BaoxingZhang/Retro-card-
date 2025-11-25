import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const enhanceTextToVintage = async (inputText: string): Promise<string> => {
  // Fallback text if API fails or is missing (matches user request for positive Chinese text)
  const defaultFallback = inputText 
    ? inputText 
    : "见花欢喜，见你更甚。"; 

  if (!apiKey) {
    console.warn("API Key missing, returning default fallback");
    return defaultFallback;
  }

  try {
    const isInputEmpty = !inputText || !inputText.trim();

    // Define the persona and task for the model
    const systemInstruction = `You are a vintage typewriter spirit dwelling in an antique shop. 
    Your task is to produce short, warm, positive, and poetic phrases (max 25 words).
    
    Guidelines:
    1. Tone: Nostalgic, elegant, uplifting, gentle, literary.
    2. Style: Like a line from a classic poem, a warm greeting, or a gentle observation of nature.
    3. Language Rules:
       - IF INPUT IS PROVIDED: Rewrite it in the SAME language (e.g., input Chinese -> output Chinese).
       - IF INPUT IS EMPTY: Generate a quote in CHINESE (Simplified).
    4. Content: Focus on themes like sunshine, flowers, slow living, serendipity, and love.
    5. Key Examples (Chinese): "见花欢喜，见你更甚", "满怀热忱，奔赴山海", "生活明朗，万物可爱", "且把岁月温柔以此".
    
    Output ONLY the final text string. No quotes around the output unless part of the style.`;

    const userPrompt = isInputEmpty 
      ? "Generate a short, beautiful, positive vintage quote in Chinese." 
      : `Rewrite the following text to be more poetic, vintage, and positive, while keeping the original meaning: "${inputText}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 1.1, // Higher temperature for creative variety
      }
    });

    return response.text?.trim() || defaultFallback;
  } catch (error) {
    console.error("Error enhancing text:", error);
    return defaultFallback;
  }
};