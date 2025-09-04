import { motion } from 'framer-motion';
import { UpdateCard } from './UpdateCard';
import { updates } from '@/data/updates';

export function Updates() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Updates</h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with the latest features and improvements
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-6">
          {updates.map((update, index) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <UpdateCard update={update} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}