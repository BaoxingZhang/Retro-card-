
const apiKey = process.env.OPENAI_API_KEY || '';

export const enhanceTextToVintage = async (inputText: string): Promise<string> => {
  // Fallback text matching the existing service
  const defaultFallback = inputText 
    ? inputText 
    : "见花欢喜，见你更甚。"; 

  if (!apiKey) {
    console.warn("OpenAI API Key missing, returning default fallback");
    return defaultFallback;
  }

  try {
    const isInputEmpty = !inputText || !inputText.trim();

    // Same persona and task for consistent behavior
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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Can be swapped for gpt-3.5-turbo if needed
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt }
        ],
        temperature: 1.1, // Higher temperature for creative variety
        max_tokens: 100,
      })
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || defaultFallback;

  } catch (error) {
    console.error("Error enhancing text with OpenAI:", error);
    return defaultFallback;
  }
};
