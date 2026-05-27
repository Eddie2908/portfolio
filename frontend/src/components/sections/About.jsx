import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, Coffee, Code2 } from 'lucide-react';
import { useProfile } from '@/hooks/usePortfolio';

function Counter({ to, inView, suffix = '' }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString() + suffix);
  const [val, setVal] = useState('0' + suffix);
  useEffect(() => {
    if (!inView) return;
    const n = parseFloat(to);
    if (isNaN(n)) { setVal(to); return; }
    const controls = animate(mv, n, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    const unsub = rounded.on('change', setVal);
    return () => { controls.stop(); unsub(); };
  }, [inView, to]);
  return <span>{val}</span>;
}

export default function About() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { profile } = useProfile();

  const stats = [
    { icon: Code2,    value: profile.projects_count,   label: 'Projets livrés', numeric: true },
    { icon: Calendar, value: profile.years_experience, label: 'Années d\'exp.', numeric: true },
    { icon: Coffee,   value: profile.fun_stat,         label: profile.fun_stat_label, numeric: false },
    { icon: MapPin,   value: profile.location?.split(',')[0] || '', label: 'Localisation', numeric: false },
  ];

  return (
    <section id="about" ref={ref} className="relative py-24 dark:bg-dark-950 bg-gray-50 overflow-hidden">
      {/* Wave top */}
      <div className="absolute top-0 left-0 right-0 wave-divider rotate-180">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" fill="var(--color-surface)" />
        </svg>
      </div>

      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Qui suis-je ?</span>
          <h2 className="section-title">
            À <span className="gradient-text">propos</span> de moi
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-5"
          >
            <p className="dark:text-white/70 text-gray-600 text-lg leading-relaxed text-justify">{profile.bio_1}</p>
            <p className="dark:text-white/60 text-gray-600 leading-relaxed text-justify">{profile.bio_2}</p>
            <p className="dark:text-white/60 text-gray-600 leading-relaxed text-justify">{profile.bio_3}</p>

            <div className="flex flex-wrap gap-2 pt-2">
              {(profile.tech_tags || []).map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map(({ icon: Icon, value, label, numeric }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="glass-card-hover p-6 text-center group"
              >
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/25 to-accent-500/15 border border-primary-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-500">
                  <Icon size={22} className="text-primary-400" />
                  <div className="absolute inset-0 rounded-2xl bg-primary-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="font-display font-bold text-3xl dark:text-white text-gray-900 mb-1 tabular-nums">
                  {numeric ? <Counter to={value} inView={inView} suffix={String(value).includes('+') ? '+' : ''} /> : value}
                </div>
                <div className="dark:text-white/50 text-gray-500 text-sm">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 wave-divider">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C480,0 960,80 1440,30 L1440,80 L0,80 Z" fill="var(--color-surface)" />
        </svg>
      </div>
    </section>
  );
}
