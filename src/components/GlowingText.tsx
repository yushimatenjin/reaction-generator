import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowingTextProps {
  children: string;
  className?: string;
  glowColor?: string;
}

export function GlowingText({ 
  children, 
  className = '',
  glowColor = '#3b82f6'
}: GlowingTextProps): ReactNode {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        textShadow: [
          `0 0 5px ${glowColor}`,
          `0 0 10px ${glowColor}`,
          `0 0 15px ${glowColor}`,
          `0 0 5px ${glowColor}`
        ]
      }}
      transition={{
        duration: 2,
        textShadow: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}