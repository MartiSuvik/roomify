import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/stripe-config';

interface PlanCardProps {
  product: Product;
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  onSubscribe: (priceId: string, mode: 'payment' | 'subscription') => void;
  loading?: boolean;
}

const planFeatures: Record<string, string[]> = {
  Free: [
    'Connect your own API key',
    'Basic style generation',
    'Standard image quality',
    'Community support',
  ],
  Pro: [
    'All-Done-For You Plan',
    'Unlimited style generations',
    'High-resolution exports',
    'Priority support',
    'Advanced style presets',
  ],
  Business: [
    'Everything in Pro',
    'Dedicated support',
    'All new upcoming features',
    'Team collaboration tools',
    'Custom integrations',
    'Priority feature requests',
  ],
};

export function PlanCard({ product, isPopular, isCurrentPlan, onSubscribe, loading }: PlanCardProps) {
  const features = planFeatures[product.name] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative h-full"
    >
      <Card className={`h-full ${
        isPopular 
          ? 'ring-2 ring-primary shadow-lg' 
          : 'hover:shadow-md transition-shadow'
      }`}>
        {isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground px-3 py-1">
              Most Popular
            </Badge>
          </div>
        )}
        
        {isCurrentPlan && (
          <div className="absolute -top-3 right-4">
            <Badge variant="secondary" className="px-3 py-1">
              Current Plan
            </Badge>
          </div>
        )}

        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl">{product.name}</CardTitle>
          <div className="mt-4">
            <span className="text-4xl font-bold">
              ${product.price}
            </span>
            <span className="text-muted-foreground ml-2">
              {product.mode === 'subscription' ? '/month' : product.price === 0 ? '' : ' one-time'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {product.description}
          </p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <ul className="space-y-3 mb-6">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button
            className="w-full h-11"
            variant={isPopular ? 'default' : 'outline'}
            onClick={() => onSubscribe(product.priceId, product.mode)}
            disabled={loading || isCurrentPlan}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : isCurrentPlan ? (
              'Current Plan'
            ) : product.price === 0 ? (
              'Get Started Free'
            ) : product.mode === 'subscription' ? (
              'Start Subscription'
            ) : (
              'Purchase Now'
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}