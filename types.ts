

export interface User {
  id: string;
  name: string;
  isLoggedIn: boolean;
  credits: number;
  tier: 'FREE' | 'PRO' | 'STUDIO';
}

export interface SongVariant {
  type: 'A' | 'B';
  label: string; // e.g. "经典版" or "情感版"
  lyrics: string;
  sunoPrompt: string;
}

export interface SongData {
  id: string;
  title: string;
  style: string;
  mood: string;
  coverImage: string;
  createdAt: Date;
  variants: SongVariant[]; // Array containing Version A and Version B
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface Inspiration {
  id: string;
  lyrics: string; // Short snippet for card
  fullLyrics: string; // Complete song for modal
  sunoPrompt: string;
  template: string; // Text to put in input box
  tags: string[];
  image: string;
}
