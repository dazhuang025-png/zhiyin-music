import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SongData, SongVariant } from "../types";

// Helper to get a random image for the song
const getRandomCover = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`;

// Shared System Instruction
const SYSTEM_INSTRUCTION = `
Role: You are 'ZhiYin', a world-class lyricist (comparable to Fang Wenshan or Lin Xi) and an expert AI Music Prompt Engineer.

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

// Define the Schema rigidly to prevent parsing errors
const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The song title" },
    mood: { type: Type.STRING, description: "Mood keywords" },
    style: { type: Type.STRING, description: "Genre/Style keywords" },
    versionA: {
      type: Type.OBJECT,
      properties: {
        label: { type: Type.STRING, description: "e.g. 经典叙事版" },
        lyrics: { type: Type.STRING, description: "Lyrics with \\n for line breaks" },
        sunoPrompt: { type: Type.STRING, description: "English prompt for music AI" },
      },
      required: ["label", "lyrics", "sunoPrompt"]
    },
    versionB: {
      type: Type.OBJECT,
      properties: {
        label: { type: Type.STRING, description: "e.g. 情感进阶版" },
        lyrics: { type: Type.STRING, description: "Lyrics with \\n for line breaks" },
        sunoPrompt: { type: Type.STRING, description: "English prompt for music AI" },
      },
      required: ["label", "lyrics", "sunoPrompt"]
    }
  },
  required: ["title", "mood", "style", "versionA", "versionB"]
};

export const generateInstantSong = async (userHint?: string): Promise<SongData> => {
  // 1. Try to retrieve API Key from Client Environment (Vite style)
  // Note: In Vercel Production, this is usually undefined, which is GOOD. 
  // We want to force the use of the server proxy /api/generate.
  let apiKey: string | undefined;
  try {
    // @ts-ignore
    apiKey = import.meta.env.VITE_API_KEY;
  } catch (e) {
    // ignore
  }

  try {
    let data;

    if (apiKey) {
      // --- LOCAL DEV MODE: Direct Client SDK Call ---
      console.log("⚠️ Client Mode: Using Direct API Key.");
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `User Input: "${userHint || 'A random hit song'}"`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      });

      data = JSON.parse(response.text || "{}");

    } else {
      // --- PRODUCTION MODE: Server Proxy ---
      console.log("🔒 Server Mode: Calling /api/generate...");
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userHint }),
      });

      // CRITICAL: Improved Error Parsing
      if (!response.ok) {
        let errorDetail = response.statusText;
        try {
            const errJson = await response.json();
            if (errJson.error) errorDetail = errJson.error;
            if (errJson.details) errorDetail += ` (${errJson.details})`;
        } catch (e) {
            // raw text fallback
        }
        throw new Error(`Server Error (${response.status}): ${errorDetail}`);
      }

      data = await response.json();
    }

    // Standardize Output with Variants
    const variantA: SongVariant = {
      type: 'A',
      label: data.versionA?.label || "版本 A (经典)",
      lyrics: data.versionA?.lyrics || "生成失败...",
      sunoPrompt: data.versionA?.sunoPrompt || "Pop music"
    };

    const variantB: SongVariant = {
      type: 'B',
      label: data.versionB?.label || "版本 B (进阶)",
      lyrics: data.versionB?.lyrics || "生成失败...",
      sunoPrompt: data.versionB?.sunoPrompt || "Alternative pop"
    };

    return {
      id: Date.now().toString(),
      title: data.title || "无题",
      style: data.style || "流行",
      mood: data.mood || "平静",
      coverImage: getRandomCover(data.title || "music"),
      createdAt: new Date(),
      variants: [variantA, variantB]
    };

  } catch (error) {
    console.error("Generate Error:", error);
    throw error; // Rethrow to allow UI to display the message
  }
};

export const createProChat = (): any => {
  console.warn("Pro Chat is currently disabled in Guest Mode.");
  return null;
};

export const sendProMessage = async (chat: any, message: string): Promise<string> => {
  return "Chat feature is under maintenance.";
};