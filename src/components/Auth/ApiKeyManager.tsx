import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Plus, Trash2, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApiKeys } from '@/hooks/useApiKeys';
import { format } from 'date-fns';

export function ApiKeyManager() {
  const { apiKeys, loading, addApiKey, removeApiKey } = useApiKeys();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [keyType, setKeyType] = useState<'openai' | 'anthropic'>('openai');
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddApiKey = async () => {
    if (!newApiKey.trim()) return;

    setIsSubmitting(true);
    const result = await addApiKey(newApiKey.trim(), keyType);
    
    if (result.success) {
      setNewApiKey('');
      setKeyType('openai');
      setShowAddDialog(false);
    }
    setIsSubmitting(false);
  };

  const handleRemoveKey = async (keyId: string) => {
    await removeApiKey(keyId);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Keys
        </CardTitle>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Your API keys are encrypted and stored securely. They're used to access AI features and are never shared.
                </AlertDescription>
              </Alert>
              
              <div>
                <Label htmlFor="keyType">API Provider</Label>
                <Select value={keyType} onValueChange={(value: 'openai' | 'anthropic') => setKeyType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showKey ? 'text' : 'password'}
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    placeholder={keyType === 'openai' ? 'sk-...' : 'sk-ant-...'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddApiKey} disabled={!newApiKey.trim() || isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add API Key'}
                </Button>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No API keys configured</p>
            <p className="text-sm">Add an API key to use AI features</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {apiKeys.map((key) => (
                <motion.div
                  key={key.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Key className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{key.keyType}</span>
                        {key.isActive && <Badge variant="secondary" className="text-xs">Active</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {key.maskedKey} • Added {format(new Date(key.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveKey(key.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}