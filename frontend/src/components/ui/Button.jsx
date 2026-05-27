import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  className,
  disabled,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const variants = {
    primary: 'text-white',
    outline: 'dark:text-white text-gray-800 dark:border-white/20 border-gray-300 hover:border-primary-500/60 hover:bg-primary-500/10',
    ghost: 'dark:text-white/70 dark:hover:text-white dark:hover:bg-white/8 text-gray-600 hover:text-gray-900 hover:bg-black/5',
    danger: 'text-white',
  };

  const sizes = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4',
  };

  const gradientStyle =
    variant === 'primary'
      ? { background: 'linear-gradient(135deg, #5865f5, #c344f0)', boxShadow: '0 0 20px rgba(88,101,245,0.3)' }
      : variant === 'danger'
      ? { background: 'linear-gradient(135deg, #ef4444, #dc2626)' }
      : {};

  const hoverClass =
    variant === 'primary'
      ? 'hover:-translate-y-0.5 hover:shadow-glow-primary'
      : variant === 'danger'
      ? 'hover:-translate-y-0.5'
      : '';

  return (
    <button
      disabled={disabled || loading}
      className={clsx(base, variants[variant], sizes[size], hoverClass, className)}
      style={gradientStyle}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
      {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
}
