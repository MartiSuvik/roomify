import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database Types
export interface Database {
  public: {
    Tables: {
      user_api_keys: {
        Row: {
          id: string;
          user_id: string;
          encrypted_api_key: string;
          key_type: 'openai' | 'anthropic';
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: {
          user_id: string;
          encrypted_api_key: string;
          key_type: 'openai' | 'anthropic';
          is_active?: boolean;
        };
        Update: {
          encrypted_api_key?: string;
          key_type?: 'openai' | 'anthropic';
          updated_at?: string;
          is_active?: boolean;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          feature_used: string;
          tokens_used?: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          feature_used: string;
          tokens_used?: number;
        };
        Update: never;
      };
    };
  };
}