import { Hero } from '@/components/Home/Hero';
import { FeatureGrid } from '@/components/Home/FeatureGrid';
import { Updates } from '@/components/Home/Updates';

export function HomePage() {
  return (
    <div>
      <Hero />
      <FeatureGrid />
      <Updates />
    </div>
  );
}