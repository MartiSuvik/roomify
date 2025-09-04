import { useState } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface SubscriptionData {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export function useStripe() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = async (
    priceId: string,
    mode: 'payment' | 'subscription' = 'subscription'
  ) => {
    if (!user) {
      toast.error('Please sign in to continue');
      return null;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          mode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
      
      return url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSubscription = async (): Promise<SubscriptionData | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  };

  return {
    createCheckoutSession,
    getSubscription,
    loading,
  };
}

// Import supabase client
import { supabase } from '@/lib/supabase';