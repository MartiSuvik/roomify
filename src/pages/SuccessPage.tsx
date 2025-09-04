import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStripe } from '@/hooks/useStripe';
import { getProductByPriceId } from '@/stripe-config';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { getSubscription } = useStripe();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getSubscription();
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      // Add a small delay to ensure webhook has processed
      setTimeout(fetchSubscription, 2000);
    } else {
      setLoading(false);
    }
  }, [sessionId, getSubscription]);

  const product = subscription?.price_id ? getProductByPriceId(subscription.price_id) : null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-16">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="text-center">
            <CardHeader className="pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-4"
              >
                <CheckCircle className="h-16 w-16 text-green-500" />
              </motion.div>
              <CardTitle className="text-3xl mb-2">Payment Successful!</CardTitle>
              <p className="text-muted-foreground">
                Thank you for your purchase. Your payment has been processed successfully.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : subscription && product ? (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Plan Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Plan:</span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium capitalize">
                        {subscription.subscription_status?.replace('_', ' ')}
                      </span>
                    </div>
                    {subscription.current_period_end && (
                      <div className="flex justify-between">
                        <span>Next billing:</span>
                        <span className="font-medium">
                          {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : sessionId ? (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Your purchase is being processed. You should receive a confirmation email shortly.
                  </p>
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/stylize">
                    Start Creating
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>

              {sessionId && (
                <div className="text-xs text-muted-foreground">
                  Session ID: {sessionId}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}