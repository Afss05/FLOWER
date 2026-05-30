import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';

interface HeroProps {
  backgroundImage?: string;
  headline?: string;
  subheadline?: string;
  onExploreClick?: () => void;
  onBuildGiftBoxClick?: () => void;
}

// Floating Petals Component
const FloatingPetal: React.FC<{ delay: number; duration: number }> = ({ delay, duration }) => {
  const randomX = Math.random() * 100 - 50;
  const randomY = Math.random() * 100 + 50;

  return (
    <motion.div
      initial={{ opacity: 0, x: 0, y: -100, rotate: 0 }}
      animate={{
        opacity: [0, 1, 0],
        x: randomX,
        y: randomY,
        rotate: 360,
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
      className="absolute text-3xl pointer-events-none"
    >
      🌸
    </motion.div>
  );
};

export const HeroSection: React.FC<HeroProps> = ({
  backgroundImage = 'https://images.unsplash.com/photo-1518997807107-0e5b0e0b3a4e?w=1200&h=600&fit=crop',
  headline = 'Deliver Moments That Bloom Forever',
  subheadline = 'Luxury flowers, curated gifts, and unforgettable experiences delivered with care.',
  onExploreClick,
  onBuildGiftBoxClick,
}) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-primary-950 pt-16">
      {/* Background Image with Parallax */}
      <motion.div
        initial={{ scale: 1 }}
        whileInView={{ scale: 1.05 }}
        transition={{ duration: 20, ease: 'linear' }}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/40 to-primary-950/20" />
      </motion.div>

      {/* Floating Petals */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <FloatingPetal key={i} delay={i * 0.5} duration={3 + i} />
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center container-fluid z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-3xl"
        >
          <h1 className="heading-1 text-white mb-6 leading-tight">
            {headline}
          </h1>
          <p className="text-xl text-secondary-100 mb-12 font-light">
            {subheadline}
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={onExploreClick}
              className="bg-white text-primary-950 hover:bg-secondary-100"
            >
              Explore Collection
            </Button>
            <Button
              variant="accent"
              size="lg"
              onClick={onBuildGiftBoxClick}
              className="border-2 border-white bg-transparent text-white hover:bg-white/10"
            >
              Build Your Gift Box
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
