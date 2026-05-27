import { motion } from 'framer-motion';

export default function Loader({ size = 'md', text }) {
  const sizes = { sm: 32, md: 48, lg: 64 };
  const s = sizes[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        style={{
          width: s,
          height: s,
          borderRadius: '50%',
          border: `3px solid rgba(88,101,245,0.2)`,
          borderTopColor: '#5865f5',
          borderRightColor: '#c344f0',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="dark:text-white/40 text-gray-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 dark:bg-dark-950 bg-gray-50 flex items-center justify-center z-[200]">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-primary"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="dark:text-white/50 text-gray-500 text-sm font-medium"
        >
          Chargement…
        </motion.p>
      </div>
    </div>
  );
}
