import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInContainerProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeInContainer({ 
  children, 
  delay = 0, 
  className = '' 
}: FadeInContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}