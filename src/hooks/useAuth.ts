import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthState({
        user: session?.user || null,
        session: session,
        loading: false,
      });
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user || null,
          session: session,
          loading: false,
        });

        // Log auth events (without sensitive data)
        console.log('Auth event:', event, session?.user?.id ? 'User authenticated' : 'User not authenticated');
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear storage after successful sign out and handle mobile Safari differently
      localStorage.clear();
      sessionStorage.clear();
      
      // For mobile Safari, use a more reliable redirect approach
      const isMobileSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      if (isMobileSafari) {
        setTimeout(() => {
          window.location.replace('/');
        }, 50);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      console.error('User agent:', navigator.userAgent);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // If it's a session missing error on mobile Safari, try force clearing everything
      if (error instanceof Error && error.message.includes('session missing')) {
        try {
          localStorage.clear();
          sessionStorage.clear();
          
          // Force reload to clear any cached auth state
          window.location.replace('/');
          return { error: null };
        } catch (clearError) {
          console.error('Force clear failed:', clearError);
        }
      }
      
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
      
      // If it's a session-related error on Safari, treat as successful
      if (error instanceof Error && error.message.includes('session') && /iPhone|iPad|iPod|Safari/i.test(navigator.userAgent)) {
        console.warn('Safari session error, forcing local cleanup:', error.message);
        setAuthState({
          user: null,
          session: null,
          loading: false,
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
        return { error: null };
      }
      
      return { error: error as AuthError };
  }

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
}