import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = false }: CardProps) => {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover ? {
    whileHover: { scale: 1.03, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' },
    transition: { duration: 0.3 }
  } : {};

  return (
    <Component
      className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}
      {...hoverProps}
    >
      {children}
    </Component>
  );
};
