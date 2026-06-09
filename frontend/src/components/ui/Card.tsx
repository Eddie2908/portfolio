import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export default function Card({
  children,
  className,
  hover = true,
  glow = false,
  gradient = false,
  padding = 'md',
  as: Tag = 'div',
  ...props
}) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: '',
  };

  const Component = hover ? motion.div : Tag;
  const motionProps = hover
    ? { whileHover: { y: -4, transition: { duration: 0.25 } } }
    : {};

  return (
    <Component
      {...motionProps}
      className={clsx(
        'glass-card',
        paddings[padding],
        hover && 'cursor-default',
        glow && 'hover:shadow-card-hover hover:border-primary-500/30',
        gradient &&
          'bg-gradient-to-br from-primary-500/8 to-accent-500/5',
        'transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
