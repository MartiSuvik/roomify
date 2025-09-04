import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ 
          opacity: 0,
          clipPath: "polygon(0% 0%, 0% 0%, 0% 0%)"
        }}
        transition={{ 
          duration: 0.0,
          exit: { duration: 0.8, ease: "easeInOut" }
        }}
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        }}
      >
        <motion.div
          className="loading-cube-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ 
            duration: 0.4,
            exit: { duration: 0.6, delay: 0.1 }
          }}
        >
          <div className="cube-wrapper">
            <div className="cube"></div>
          </div>
        </motion.div>

        <style>{`
          .loading-cube-container {
  --color: #3b82f6;
}

.cube-wrapper {
  width: 25vmin;          /* was 50vmin */
  height: 25vmin;         /* was 50vmin */
  perspective: 50vmin;    /* was 100vmin */
  animation: spin-all 4s ease-in-out infinite;
}

.cube {
  background: var(--color);
  width: 10vmin;          /* was 20vmin */
  height: 10vmin;         /* was 20vmin */
  border-radius: 1vmin;   /* was 2vmin */
  transform: rotate(48deg) rotateX(22.5deg) rotateY(-22.5deg);
  left: 7.25vmin;         /* was 14.5vmin */
  position: absolute;
  top: 2.5vmin;           /* was 5vmin */
  transition: all 1s ease 0s;
  transform-style: preserve-3d;
  animation: spin-cube 2s ease-in-out -3s infinite alternate;
}

.cube::before {
  position: absolute;
  content: "";
  background: var(--color);
  width: calc(100% - 1vmin);   /* was - 2vmin */
  height: calc(100% - 1vmin);  /* was - 2vmin */
  border-radius: 1vmin;        /* was 2vmin */
  transform: rotateY(-90deg);
  transform-origin: right bottom;
  top: 1.25vmin;               /* was 2.5vmin */
  left: 2vmin;                 /* was 4vmin */
  transition: all 1s ease 0s;
  animation: spin-cube-before 2s ease-in-out -3s infinite alternate;
}

.cube::after {
  position: absolute;
  content: "";
  background: var(--color);
  width: calc(100% - 1vmin);   /* was - 2vmin */
  height: calc(100% - 1vmin);  /* was - 2vmin */
  border-radius: 1vmin;        /* was 2vmin */
  transform: rotateY(-90deg);
  transform-origin: right bottom;
  top: 2vmin;                  /* was 4vmin */
  left: 1.25vmin;              /* was 2.5vmin */
  transform: rotateX(90deg);
  transition: all 1s ease 0s;
  animation: spin-cube-after 2s ease-in-out -3s infinite alternate;
}

@keyframes spin-all {
  50%, 100% {
    transform: rotate(720deg);
  }
}

@keyframes spin-cube {
  0%, 50% {
    border-radius: 100%;
    transform: rotate(39deg) rotateX(0deg) rotateY(0deg);
    left: 10vmin;     /* was 20vmin */
    top: 5vmin;       /* was 10vmin */
    width: 5vmin;     /* was 10vmin */
    height: 5vmin;    /* was 10vmin */
  }
  50%, 100% {
    border-radius: 1vmin;  /* was 2vmin */
    transform: rotate(48deg) rotateX(22.5deg) rotateY(-22.5deg);
    left: 7.25vmin;        /* was 14.5vmin */
    top: 2.5vmin;          /* was 5vmin */
    width: 10vmin;         /* was 20vmin */
    height: 10vmin;        /* was 20vmin */
  }
}

@keyframes spin-cube-before {
  0%, 50% {
    border-radius: 100%;
    transform: rotateY(-180deg) rotateX(0deg);
    left: 5.5vmin;   /* was 11vmin */
    top: 4.5vmin;    /* was 9vmin */
    width: 100%;
    height: 100%;
  }
  50%, 100% {
    border-radius: 1vmin;  /* was 2vmin */
    transform: rotateY(-90deg);
    left: 2vmin;           /* was 4vmin */
    top: 1.25vmin;         /* was 2.5vmin */
    width: calc(100% - 1vmin);  /* was - 2vmin */
    height: calc(100% - 1vmin); /* was - 2vmin */
  }
}

@keyframes spin-cube-after {
  0%, 50% {
    border-radius: 100%;
    transform: rotateY(0deg) rotateX(180deg);
    left: 2.5vmin;   /* was 5vmin */
    top: 6vmin;      /* was 12vmin */
    width: 100%;
    height: 100%;
  }
  50%, 100% {
    border-radius: 1vmin;  /* was 2vmin */
    transform: rotateX(90deg);
    left: 1.25vmin;        /* was 2.5vmin */
    top: 2vmin;            /* was 4vmin */
    width: calc(100% - 1vmin);  /* was - 2vmin */
    height: calc(100% - 1vmin); /* was - 2vmin */
  }
}

        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}