import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlanCard } from '@/components/Pricing/PlanCard';
import { useStripe } from '@/hooks/useStripe';
import { useAuth } from '@/hooks/useAuth';
import { products } from '@/stripe-config';

const faqs = [
  {
    question: 'How does the AI design generation work?',
    answer: 'Our AI analyzes your uploaded images and applies professional design principles to generate realistic interior renderings. You can guide the process with annotations and style preferences.',
  },
  {
    question: 'Can I use my own style preferences?',
    answer: 'Yes! Pro and Business plans include custom style training, allowing you to create personalized design presets based on your unique aesthetic preferences.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'We support all common image formats including JPEG, PNG, and WebP. For best results, we recommend high-resolution images with good lighting.',
  },
  {
    question: 'Is there a mobile app?',
    answer: 'Currently, Roomify is a web-based application optimized for all devices. We\'re working on dedicated mobile apps for iOS and Android.',
  },
];

export function PricingPage() {
  const { user } = useAuth();
  const { createCheckoutSession, getSubscription, loading } = useStripe();
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        try {
          const subscription = await getSubscription();
          setCurrentSubscription(subscription);
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      }
      setLoadingSubscription(false);
    };

    fetchSubscription();
  }, [user, getSubscription]);

  const handleSubscribe = async (priceId: string, mode: 'payment' | 'subscription') => {
    await createCheckoutSession(priceId, mode);
  };

  const isCurrentPlan = (priceId: string) => {
    return currentSubscription?.price_id === priceId;
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade as your design needs grow. All plans include our core features.
          </p>
        </motion.div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <PlanCard
                product={product}
                isPopular={product.name === 'Pro'}
                isCurrentPlan={!loadingSubscription && isCurrentPlan(product.priceId)}
                onSubscribe={handleSubscribe}
                loading={loading}
              />
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}