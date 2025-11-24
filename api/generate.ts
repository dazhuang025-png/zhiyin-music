import { GoogleGenAI, Type, Schema } from "@google/genai";

// Shared System Instruction (Must match client for consistency if possible, or be better)
const SYSTEM_INSTRUCTION = `
Role: You are 'ZhiYin', a world-class lyricist and AI Music Prompt Engineer.

Task: Based on the user's input, generate a creative output containing TWO distinct versions (Twin Mode).

Requirements:
1. Title: A creative, poetic Chinese title (shared by both versions).
2. Mood & Style: Shared descriptions.
3. Version A (Classic/Standard): High-quality, balanced structure, standard interpretation of the user's request.
4. Version B (Alternative/Bold): A slightly different take. Maybe more emotional, a different perspective, or a more experimental genre/flow.

For EACH version, provide:
- Lyrics: Complete [Verse][Chorus] structure.
- SunoPrompt: Optimized English tags for Suno/Udio.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    mood: { type: Type.STRING },
    style: { type: Type.STRING },
    versionA: {
      type: Type.OBJECT,
      properties: {
        label: { type: Type.STRING },
        lyrics: { type: Type.STRING },
        sunoPrompt: { type: Type.STRING },
      },
      required: ["label", "lyrics", "sunoPrompt"]
    },
    versionB: {
      type: Type.OBJECT,
      properties: {
        label: { type: Type.STRING },
        lyrics: { type: Type.STRING },
        sunoPrompt: { type: Type.STRING },
      },
      required: ["label", "lyrics", "sunoPrompt"]
    }
  },
  required: ["title", "mood", "style", "versionA", "versionB"]
};

export default async function handler(req: any, res: any) {
  // 1. Method check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Security: Get API Key from server-side environment variables
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("Server API_KEY is missing");
      // Explicit error message for Vercel logs/client
      return res.status(500).json({ error: 'CRITICAL: 请在 Vercel Settings -> Environment Variables 中添加 API_KEY' });
    }

    // 3. Parse Request
    const { prompt: userHint } = req.body;

    // 4. Initialize Gemini
    const ai = new GoogleGenAI({ apiKey });

    // 5. Call the Model with Strict Config
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userHint || 'A random hit song',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    // 6. Parse and Return
    // With Schema, we can trust the text is valid JSON.
    const text = response.text || "{}";
    const data = JSON.parse(text);

    return res.status(200).json(data);

  } catch (error: any) {
    console.error("API Route Error:", error);
    return res.status(500).json({ 
      error: 'Gemini API Call Failed',
      details: error.message 
    });
  }
}