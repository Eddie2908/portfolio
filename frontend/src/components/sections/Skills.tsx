import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { Sparkles } from 'lucide-react';
import { useSkills } from '@/hooks/usePortfolio';

export default function Skills() {
  const { ref: inViewRef, inView } = useReveal({ threshold: 0.1 });
  const { skills: skillGroups } = useSkills();

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const blob1Y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  const setRefs = (el) => {
    sectionRef.current = el;
    inViewRef(el);
  };

  return (
    <section ref={setRefs} className="relative py-24 dark:bg-dark-900 bg-white overflow-hidden">
      {/* Decorative blobs (scroll-driven parallax) */}
      <motion.div
        style={{ y: blob1Y }}
        className="absolute top-1/3 -left-32 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
      >
        <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, #5865f5, transparent 70%)' }} />
      </motion.div>
      <motion.div
        style={{ y: blob2Y }}
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
      >
        <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, #c344f0, transparent 70%)' }} />
      </motion.div>

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="tag mb-4 inline-block">Technologies</span>
          <h2 className="section-title">
            Mes <span className="gradient-text">compétences</span>
          </h2>
          <p className="dark:text-white/50 text-gray-500 max-w-xl mx-auto mt-4">
            Un aperçu des technologies que j&apos;utilise au quotidien pour construire des produits robustes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {skillGroups.map(({ category, category_color: color, skills }, gi) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: gi * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="glass-card-hover p-6 group relative"
            >
              {/* Glow tint */}
              <div
                className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
              />

              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: `linear-gradient(135deg, ${color}33, ${color}11)`,
                    border: `1px solid ${color}44`,
                    boxShadow: `0 8px 24px -12px ${color}66`,
                  }}
                >
                  <Sparkles size={18} style={{ color }} />
                </div>
                <h3 className="font-display font-semibold dark:text-white text-gray-900 text-lg">{category}</h3>
              </div>

              <div className="space-y-4">
                {skills.map(({ name, level }, si) => (
                  <div key={name}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-sm dark:text-white/75 text-gray-700 font-medium">{name}</span>
                      <span className="text-xs font-semibold tabular-nums" style={{ color }}>{level}%</span>
                    </div>
                    <div className="relative h-1.5 dark:bg-white/8 bg-black/8 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${level}%` } : {}}
                        transition={{ duration: 1.4, delay: gi * 0.12 + si * 0.08 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-y-0 left-0 rounded-full shimmer"
                        style={{
                          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                          boxShadow: `0 0 10px ${color}66`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 wave-divider">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,20 C320,80 1120,0 1440,50 L1440,80 L0,80 Z" fill="var(--color-bg)" />
        </svg>
      </div>
    </section>
  );
}
