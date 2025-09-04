import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { Tiles } from '@/components/ui/tiles';

export function Hero() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0">
        <Tiles 
          rows={20} 
          cols={30}
          tileSize="md"
          className="absolute inset-0 opacity-100"
        />
      </div>
      <div className="absolute inset-0 bg-dotted-grid dark:bg-dotted-grid-dark bg-dot-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-background/80" />
      
      <div className="container relative">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Personalized Interior Design in{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Minutes
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </span>{' '}
            🔥
          </motion.h1>
          
          <motion.p 
            className="text-body text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Magically generate perspective views of your interior designs from a floor plan.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <ShimmerButton asChild className="text-white dark:text-white">
              <Link to="#">HomeGPT Coming Soon</Link>
            </ShimmerButton>
            <ShimmerButton 
              asChild
              background="rgba(255, 255, 255, 1)"
              className="scale-90 text-black dark:text-black border-black dark:border-white dark:bg-white [&>*]:shadow-none hover:[&>*]:shadow-none active:[&>*]:shadow-none [&>div:first-child]:hidden hover:scale-95 transition-transform duration-200"
            >
              <Link to="/stylize">Stylize a Room</Link>
            </ShimmerButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}