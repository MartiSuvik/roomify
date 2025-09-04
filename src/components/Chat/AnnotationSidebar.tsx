import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Annotation } from '@/types';
import { format } from 'date-fns';

interface AnnotationSidebarProps {
  annotation: Annotation | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function AnnotationSidebar({ annotation, onClose, onDelete }: AnnotationSidebarProps) {
  return (
    <AnimatePresence>
      {annotation && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] bg-background border-l z-40"
        >
          <Card className="h-full rounded-none border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg">Annotation Details</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(annotation.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Note</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {annotation.note}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Created</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(annotation.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Position</h4>
                    <p className="text-sm text-muted-foreground">
                      X: {annotation.x.toFixed(1)}%, Y: {annotation.y.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}