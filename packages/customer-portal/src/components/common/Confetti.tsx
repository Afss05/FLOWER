import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPieceProps {
  delay: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ delay }) => {
  const x = Math.random() * 600 - 300;
  const y = Math.random() * 400 + 50;
  const rotation = Math.random() * 720;

  return (
    <motion.div
      initial={{
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        x,
        y,
        rotate: rotation,
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration: 2 + Math.random() * 1,
        delay,
        ease: 'easeOut',
      }}
      className="fixed pointer-events-none text-2xl"
      style={{
        left: '50%',
        top: '50%',
      }}
    >
      {['🌸', '🎀', '✨', '🎁'][Math.floor(Math.random() * 4)]}
    </motion.div>
  );
};

interface ConfettiProps {
  count?: number;
  duration?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ count = 30, duration = 2 }) => {
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    setPieces(Array.from({ length: count }).map((_, i) => i));

    const timer = setTimeout(() => {
      setPieces([]);
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [count, duration]);

  return (
    <>
      {pieces.map((i) => (
        <ConfettiPiece key={i} delay={Math.random() * 0.1} />
      ))}
    </>
  );
};
