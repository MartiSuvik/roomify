import { motion } from 'framer-motion';

interface CubeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CubeLogo({ size = 'md', className = '' }: CubeLogoProps) {
  const sizeConfig = {
    sm: {
      wrapper: 'w-6 h-6',
      cube: 'w-3 h-3',
      perspective: '6rem',
    },
    md: {
      wrapper: 'w-8 h-8',
      cube: 'w-4 h-4',
      perspective: '8rem',
    },
    lg: {
      wrapper: 'w-12 h-12',
      cube: 'w-6 h-6',
      perspective: '12rem',
    },
  };

  const config = sizeConfig[size];

  return (
    <div className={`${config.wrapper} ${className}`}>
      <motion.div
        className="cube-logo-wrapper"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="cube-logo"></div>
      </motion.div>

      <style>{`
        .cube-logo-wrapper {
          width: 100%;
          height: 100%;
          perspective: ${config.perspective};
          position: relative;
        }

        .cube-logo {
          background: hsl(var(--primary));
          width: ${config.cube.split(' ')[1]};
          height: ${config.cube.split(' ')[1]};
          border-radius: 0.2rem;
          transform: rotate(48deg) rotateX(22.5deg) rotateY(-22.5deg);
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: calc(-${config.cube.split(' ')[1]} / 2);
          margin-top: calc(-${config.cube.split(' ')[1]} / 2);
          transform-style: preserve-3d;
        }

        .cube-logo::before {
          position: absolute;
          content: "";
          background: hsl(var(--primary));
          width: calc(100% - 0.4rem);
          height: calc(100% - 0.4rem);
          border-radius: 0.2rem;
          transform: rotateY(-90deg);
          transform-origin: right bottom;
          top: 0.2rem;
          left: 0.8rem;
          opacity: 0.8;
        }

        .cube-logo::after {
          position: absolute;
          content: "";
          background: hsl(var(--primary));
          width: calc(100% - 0.4rem);
          height: calc(100% - 0.4rem);
          border-radius: 0.2rem;
          top: 0.8rem;
          left: 0.2rem;
          transform: rotateX(90deg);
          transform-origin: center bottom;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}