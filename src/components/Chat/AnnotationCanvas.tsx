import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Annotation } from '@/types';

interface AnnotationCanvasProps {
  image: string;
  annotations: Annotation[];
  onAddAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  onDeleteAnnotation: (id: string) => void;
  onSelectAnnotation: (annotation: Annotation) => void;
}

export function AnnotationCanvas({
  image,
  annotations,
  onAddAnnotation,
  onDeleteAnnotation,
  onSelectAnnotation,
}: AnnotationCanvasProps) {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempPosition, setTempPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTempPosition({ x, y });
    setIsAdding(true);
  };

  const handleSaveAnnotation = () => {
    if (!tempPosition || !newNote.trim()) return;

    onAddAnnotation({
      x: tempPosition.x,
      y: tempPosition.y,
      note: newNote.trim(),
      createdAt: new Date().toISOString(),
    });

    setNewNote('');
    setTempPosition(null);
    setIsAdding(false);
  };

  const handleCancelAnnotation = () => {
    setNewNote('');
    setTempPosition(null);
    setIsAdding(false);
  };

  return (
    <TooltipProvider>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div
            ref={containerRef}
            className="relative cursor-crosshair"
            onClick={handleCanvasClick}
          >
            <img
              src={image}
              alt="Interior design for annotation"
              className="w-full h-auto"
            />

            {/* Existing Annotations */}
            {annotations.map((annotation, index) => (
              <Tooltip key={annotation.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium shadow-lg hover:scale-110 transition-transform"
                    style={{
                      left: `${annotation.x}%`,
                      top: `${annotation.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAnnotation(annotation);
                    }}
                  >
                    {index + 1}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[200px]">{annotation.note}</p>
                </TooltipContent>
              </Tooltip>
            ))}

            {/* Temporary Annotation */}
            <AnimatePresence>
              {tempPosition && (
                <Popover open={isAdding} onOpenChange={setIsAdding}>
                  <PopoverTrigger asChild>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium shadow-lg"
                      style={{
                        left: `${tempPosition.x}%`,
                        top: `${tempPosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {annotations.length + 1}
                    </motion.div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Add annotation</h4>
                      <Textarea
                        placeholder="Add your note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveAnnotation} size="sm">
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCancelAnnotation}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}