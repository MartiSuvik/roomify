import { motion } from 'framer-motion';
import { User, Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ApiKeyManager } from '@/components/Auth/ApiKeyManager';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function SettingsPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      // Add loading state for better UX
      const button = document.activeElement as HTMLButtonElement;
      if (button) button.disabled = true;
      
    const { error } = await signOut();
      
    if (error) {
        toast.error(`Failed to sign out: ${error.message || 'Unknown error'}`);
        console.error('Settings sign out error:', error);
    } else {
      toast.success('Signed out successfully');
    }
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast.error('Unexpected error during sign out');
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and API keys for AI features
            </p>
          </div>

          <div className="grid gap-6">
            {/* Account Info */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account ID</label>
                  <p className="text-sm font-mono text-muted-foreground">{user?.id}</p>
                </div>
                <Separator />
                <Button variant="destructive" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* API Key Management */}
            <ApiKeyManager />

            {/* Usage Information */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                <CardTitle>Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your API usage is tracked to help you monitor costs. All usage is logged securely
                  and only visible to you.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}