import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UpdateItem } from '@/types';
import 'react-photo-view/dist/react-photo-view.css';

interface UpdateCardProps {
  update: UpdateItem;
}

export function UpdateCard({ update }: UpdateCardProps) {
  const getBadgeVariant = (type: UpdateItem['type']) => {
    switch (type) {
      case 'feature':
        return 'default';
      case 'improvement':
        return 'secondary';
      case 'bugfix':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={getBadgeVariant(update.type)} className="capitalize">
                  {update.type}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(update.date), 'MMM dd, yyyy')}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{update.title}</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {update.body}
          </p>

          {/* Image Gallery */}
          {update.images && update.images.length > 0 && (
            <PhotoProvider>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {update.images.map((img, index) => (
                  <PhotoView key={index} src={img.src}>
                    <motion.img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  </PhotoView>
                ))}
              </div>
            </PhotoProvider>
          )}

          {/* Chat Demo */}
          {update.hasChatDemo && (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Chat Demo</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  "I love this living room layout! Can you suggest some color options for the walls?"
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Demo */}
          {update.hasActionDemo && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                  Generate image based on annotations
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Demo Action</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground">
                  This is a demo action. In the full application, this would generate a new image based on your annotations.
                </p>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}