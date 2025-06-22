import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function SplitText({ 
  children, 
  className = '', 
  delay = 0.05, 
  duration = 0.5 
}: SplitTextProps): ReactNode {
  const chars = children.split('');

  return (
    <span className={className}>
      {chars.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration,
            delay: index * delay,
            ease: 'easeOut'
          }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}