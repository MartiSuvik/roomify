import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { encryptApiKey, decryptApiKey, validateApiKeyFormat } from '@/lib/encryption';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ApiKey {
  id: string;
  keyType: 'openai' | 'anthropic';
  maskedKey: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useApiKeys() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    } else {
      setApiKeys([]);
    }
  }, [user]);

  const fetchApiKeys = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedKeys: ApiKey[] = data.map((key) => ({
        id: key.id,
        keyType: key.key_type,
        maskedKey: maskApiKey(key.key_type),
        isActive: key.is_active,
        createdAt: key.created_at,
        updatedAt: key.updated_at,
      }));

      setApiKeys(formattedKeys);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const addApiKey = async (apiKey: string, keyType: 'openai' | 'anthropic') => {
    if (!user) {
      toast.error('Please sign in to add API keys');
      return { success: false, error: 'Not authenticated' };
    }

    // Validate API key format
    if (!validateApiKeyFormat(apiKey, keyType)) {
      toast.error('Invalid API key format');
      return { success: false, error: 'Invalid API key format' };
    }

    try {
      setLoading(true);

      // Check if user already has an active key of this type
      const { data: existingKeys } = await supabase
        .from('user_api_keys')
        .select('id')
        .eq('user_id', user.id)
        .eq('key_type', keyType)
        .eq('is_active', true);

      // Deactivate existing keys of the same type
      if (existingKeys && existingKeys.length > 0) {
        await supabase
          .from('user_api_keys')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('key_type', keyType);
      }

      // Encrypt and store the new API key
      const encryptedKey = encryptApiKey(apiKey);
      const { error } = await supabase
        .from('user_api_keys')
        .insert({
          user_id: user.id,
          encrypted_api_key: encryptedKey,
          key_type: keyType,
          is_active: true,
        });

      if (error) throw error;

      await fetchApiKeys();
      toast.success(`${keyType.toUpperCase()} API key added successfully`);
      return { success: true, error: null };
    } catch (error) {
      console.error('Error adding API key:', error);
      toast.error('Failed to add API key');
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setLoading(false);
    }
  };

  const removeApiKey = async (keyId: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('id', keyId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchApiKeys();
      toast.success('API key removed successfully');
      return { success: true, error: null };
    } catch (error) {
      console.error('Error removing API key:', error);
      toast.error('Failed to remove API key');
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setLoading(false);
    }
  };

  const getActiveApiKey = async (keyType: 'openai' | 'anthropic'): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('encrypted_api_key')
        .eq('user_id', user.id)
        .eq('key_type', keyType)
        .eq('is_active', true)
        .single();

      if (error || !data) return null;

      return decryptApiKey(data.encrypted_api_key);
    } catch (error) {
      console.error('Error getting active API key:', error);
      return null;
    }
  };

  const logUsage = async (feature: string, tokensUsed?: number) => {
    if (!user) return;

    try {
      await supabase
        .from('usage_logs')
        .insert({
          user_id: user.id,
          feature_used: feature,
          tokens_used: tokensUsed,
        });
    } catch (error) {
      console.error('Error logging usage:', error);
    }
  };

  return {
    apiKeys,
    loading,
    addApiKey,
    removeApiKey,
    getActiveApiKey,
    logUsage,
    refetch: fetchApiKeys,
  };
}

function maskApiKey(keyType: 'openai' | 'anthropic'): string {
  switch (keyType) {
    case 'openai':
      return 'sk-...••••';
    case 'anthropic':
      return 'sk-ant-...••••';
    default:
      return '...••••';
  }
}