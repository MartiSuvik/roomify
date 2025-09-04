export interface UpdateItem {
  id: string;
  title: string;
  type: 'feature' | 'improvement' | 'bugfix';
  date: string;
  body: string;
  images?: { src: string; alt: string }[];
  hasChatDemo?: boolean;
  hasActionDemo?: boolean;
}

export interface Annotation {
  id: string;
  x: number;
  y: number;
  note: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  image: string;
}