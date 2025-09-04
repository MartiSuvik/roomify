import { motion } from 'framer-motion';
import { FeatureCard } from './FeatureCard';

const features = [
    {
    title: 'Stylize',
    description: 'Brainstorm multiple spaces with personalized design styles tailored to your taste.',
    image: 'https://res.cloudinary.com/effichat/image/upload/v1755764596/dkfvjuu8vn4iskrdmn01.png',
    ctaText: 'Open Stylize',
    ctaHref: '/stylize',
  },
  {
    title: 'HomeGPT',
    description: 'Snap, chat, and transform—converse with knowledgeable interior design AI to get actionable advice.',
    image: 'https://res.cloudinary.com/effichat/image/upload/v1755764457/bikp2m75ia6tzw1k62et.png',
    badge: 'Coming soon',
    ctaText: 'Coming Soon',
    ctaHref: '#',
    disabled: true,
  },
  {
    title: 'Plan to render',
    description: 'Magically generate perspective views of your interior designs from a floor plan.',
    image: 'https://res.cloudinary.com/effichat/image/upload/v1755764457/jlwxezhdy1sgavm1gbhg.png',
    badge: 'Coming soon',
    ctaText: 'Coming Soon',
    ctaHref: '#',
    disabled: true,
  },
  {
    title: 'Aerial view',
    description: 'Generate stunning aerial views of your interior designs, perfect for visualizing layouts.',
    image: 'https://res.cloudinary.com/effichat/image/upload/v1755764457/fn2wye9of4j7d0oe5tud.png',
    badge: 'Coming soon',
    ctaText: 'Coming Soon',
    ctaHref: '#',
    disabled: true,
  },
];

export function FeatureGrid() {
  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to design your perfect space
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            From AI-powered conversations to professional rendering, our tools help you create beautiful interiors.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}