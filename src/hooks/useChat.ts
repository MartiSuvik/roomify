import { useState } from 'react';
import { ChatMessage } from '@/types';

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your HomeGPT assistant. I can help you with interior design questions and analyze any annotations you add to the image. What would you like to know?',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    role: 'user',
    content: 'I love this living room layout! Can you suggest some color options for the walls?',
    timestamp: new Date().toISOString(),
  },
  {
    id: '3',
    role: 'assistant',
    content: 'Great choice! For this modern living room, I\'d recommend warm neutrals like soft beige or light gray as a base. You could add accent colors through furniture and decor. Consider a feature wall in deep navy or forest green behind the sofa for visual interest.',
    timestamp: new Date().toISOString(),
  },
];

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const sendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Thanks for your question! This is a demo response. In the full application, I would provide detailed interior design advice based on your input and any annotations you\'ve added.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return {
    messages,
    sendMessage,
  };
}