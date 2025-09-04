import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  badge?: string;
  ctaText: string;
  ctaHref: string;
  disabled?: boolean;
  isNew?: boolean;
}

export function FeatureCard({
  title,
  description,
  image,
  badge,
  ctaText,
  ctaHref,
  disabled = false,
  isNew = false,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={disabled ? {} : { y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      {disabled ? (
        <Card className="h-full overflow-hidden transition-all duration-200 opacity-60 cursor-not-allowed">
          <CardHeader className="p-0">
            <div className="relative">
              <img
                src={image}
                alt={title}
                className="w-full h-32 object-cover"
              />
              {badge && (
                <Badge 
                  variant={badge === 'Coming soon' ? 'secondary' : isNew ? 'default' : 'outline'} 
                  className="absolute top-2 left-2 text-xs"
                >
                  {badge}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Link to={ctaHref}>
          <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-32 object-cover"
                />
                {badge && (
                  <Badge 
                    variant={badge === 'Coming soon' ? 'secondary' : isNew ? 'default' : 'outline'} 
                    className="absolute top-2 left-2 text-xs"
                  >
                    {badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </CardContent>
          </Card>
        </Link>
      )}
    </motion.div>
  );
}