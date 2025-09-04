import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production';

export const encryptApiKey = (apiKey: string): string => {
  try {
    return CryptoJS.AES.encrypt(apiKey, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt API key');
  }
};

export const decryptApiKey = (encryptedApiKey: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedApiKey, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt API key');
  }
};

export const validateApiKeyFormat = (apiKey: string, type: 'openai' | 'anthropic'): boolean => {
  if (!apiKey || typeof apiKey !== 'string') return false;
  
  switch (type) {
    case 'openai':
      // OpenAI API keys: old format 'sk-' + 48 chars, new format 'sk-proj-' + variable length
      return /^sk-[a-zA-Z0-9]{48}$/.test(apiKey) || /^sk-proj-[a-zA-Z0-9_-]{95,}$/.test(apiKey);
    case 'anthropic':
      // Anthropic API keys start with 'sk-ant-' 
      return /^sk-ant-[a-zA-Z0-9\-_]{95,}$/.test(apiKey);
    default:
      return false;
  }
};