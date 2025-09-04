import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AnnotationCanvas } from '@/components/Chat/AnnotationCanvas';
import { ChatPanel } from '@/components/Chat/ChatPanel';
import { AnnotationSidebar } from '@/components/Chat/AnnotationSidebar';
import { useAnnotations } from '@/hooks/useAnnotations';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { useApiKeys } from '@/hooks/useApiKeys';
import { Annotation } from '@/types';

export function ChatPage() {
  const { user } = useAuth();
  const { apiKeys } = useApiKeys();
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const { annotations, addAnnotation, deleteAnnotation, clearAnnotations } = useAnnotations();
  const { messages, sendMessage } = useChat();
  const [hasApiKey, setHasApiKey] = useState(false);

  const sampleImage = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200';

  useEffect(() => {
    const hasActiveKey = apiKeys.some(key => key.isActive && (key.keyType === 'openai' || key.keyType === 'anthropic'));
    setHasApiKey(hasActiveKey);
  }, [apiKeys]);

  const handleReplaceImage = () => {
    toast.info('Replace image feature coming soon!');
  };

  const handleClearAnnotations = () => {
    clearAnnotations();
    setSelectedAnnotation(null);
    toast.success('All annotations cleared');
  };

  const handleGenerateBasedOnAnnotations = () => {
    if (!hasApiKey) {
      toast.error('Please add an API key in Settings to use AI features');
      return;
    }
    toast.info('Generate feature is a demo - would create new design based on annotations');
  };

  const handleSelectAnnotation = (annotation: Annotation) => {
    setSelectedAnnotation(annotation);
  };

  const handleDeleteAnnotation = (id: string) => {
    deleteAnnotation(id);
    if (selectedAnnotation?.id === id) {
      setSelectedAnnotation(null);
    }
    toast.success('Annotation deleted');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Action Bar */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-sm border-b">
        <div className="container py-4">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Button variant="outline" size="sm" onClick={handleReplaceImage}>
              <Upload className="h-4 w-4 mr-2" />
              Replace image
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearAnnotations}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear annotations
            </Button>
            <Button variant="outline" size="sm" onClick={handleGenerateBasedOnAnnotations}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate based on annotations
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {user && !hasApiKey && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert>
              <AlertDescription>
                To use AI features, please add your API key in{' '}
                <a href="/settings" className="underline hover:text-primary">
                  Settings
                </a>
                . Your keys are encrypted and stored securely.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        <motion.div
          className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Image Canvas */}
          <div className="relative">
            <AnnotationCanvas
              image={sampleImage}
              annotations={annotations}
              onAddAnnotation={addAnnotation}
              onDeleteAnnotation={handleDeleteAnnotation}
              onSelectAnnotation={handleSelectAnnotation}
            />
          </div>

          {/* Chat Panel */}
          <div className="relative">
            <ChatPanel messages={messages} onSendMessage={sendMessage} />
          </div>
        </motion.div>
      </div>

      {/* Annotation Sidebar */}
      <AnnotationSidebar
        annotation={selectedAnnotation}
        onClose={() => setSelectedAnnotation(null)}
        onDelete={handleDeleteAnnotation}
      />
    </div>
  );
}